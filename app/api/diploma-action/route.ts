import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const requestBody = await req.json();
        const { actionType, aiData } = requestBody;

        if (!actionType || !aiData) {
            return NextResponse.json(
                { error: "Missing 'actionType' or 'aiData' in request body" },
                { status: 400 }
            );
        }
        console.log("Request Body:", requestBody);
        let apiActionValue;
        if (actionType === "verification") {
            apiActionValue = "authenticate";
        } else if (actionType === "certification") {
            apiActionValue = "certify";
        } else {
            return NextResponse.json(
                { error: `Invalid actionType: ${actionType}` },
                { status: 400 }
            );
        }

        const externalApiPayload = {
            action: apiActionValue,
            extracted: {
                diploma_number: aiData.diplomaNumber || "",
                student_name: aiData.name || "",
                birth_date: aiData.birthDate || "",
                birth_place: aiData.birthPlace || "",
                registration_number: aiData.registrationNumber || "",
                gender: aiData.gender || "",
                domain: aiData.specialization || "",
                series: aiData.series || "",
                mention: aiData.grade || "",
                exam_session: aiData.sessionDate || "",
                issued_date: aiData.issueDate || "",
                // qrcode: aiData.qrcode || "", // Include if your backend expects it for both actions
            },
        };

        const backendApiUrl = process.env.BACKEND_API_URL;
        if (!backendApiUrl) {
            console.error("BACKEND_API_URL is not set");
            return NextResponse.json(
                { error: "Server configuration error: Backend API URL is missing." },
                { status: 500 }
            );
        }

        const externalApiEndpoint = `${backendApiUrl}/diplomas/verify/`;
        console.log("Calling external API:", externalApiEndpoint, "with payload:", externalApiPayload);

        const externalApiResponse = await fetch(
            externalApiEndpoint,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Add any other necessary headers for your external API, like an API key
                    // "Authorization": `Bearer ${process.env.EXTERNAL_API_KEY}`
                },
                body: JSON.stringify(externalApiPayload),
            }
        );

        console.log("External API Response Status:", externalApiResponse.status);
        console.log("External API Response Headers:", Object.fromEntries(externalApiResponse.headers.entries()));


        if (!externalApiResponse.ok) {
            // Even if not ok, it might be JSON (e.g., validation error from external API)
            try {
                const errorData = await externalApiResponse.json();
                console.error("External API Error Response (JSON):", errorData);
                return NextResponse.json(errorData, { status: externalApiResponse.status });
            } catch (e) {
                // If it's not JSON, it might be a plain text error or something else
                const errorText = await externalApiResponse.text();
                console.error("External API Error Response (Non-JSON):", errorText);
                return NextResponse.json({ error: errorText || "An error occurred with the external service." }, { status: externalApiResponse.status });
            }
        }

        const contentType = externalApiResponse.headers.get("content-type");

        if (contentType && contentType.includes("application/pdf") && actionType === "certification") {
            // If it's a PDF and the action was certification, stream it back
            const pdfBuffer = await externalApiResponse.arrayBuffer();
            return new NextResponse(pdfBuffer, {
                status: 200,
                headers: {
                    "Content-Type": "application/pdf",
                    "Content-Disposition": `attachment; filename="certified-diploma.pdf"`, // Suggest a filename
                },
            });
        } else {
            // Otherwise, assume it's JSON (or handle other types if necessary)
            const resultData = await externalApiResponse.json();
            console.log("External API Success Response (JSON):", resultData);
            return NextResponse.json(resultData, { status: 200 });
        }

    } catch (error: any) {
        console.error("[API_DIPLOMA_ACTION_POST_ERROR]", error);
        if (error instanceof SyntaxError) { // Error parsing requestBody
            return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
        }
        // Ensure a more generic error message for unexpected issues
        const errorMessage = error.message || "An unexpected error occurred processing your request.";
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}