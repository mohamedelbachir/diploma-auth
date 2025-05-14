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
        console.log(requestBody)                 
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

        // Transform AI data for the verification/certification API
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

        // Assuming the same endpoint for verify and certify, differentiated by 'action' in payload
        const externalApiEndpoint = `${backendApiUrl}/diplomas/verify/`;

        const externalApiResponse = await fetch(
            externalApiEndpoint,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(externalApiPayload),
            }
        );

        const resultData = await externalApiResponse.json();

        if (!externalApiResponse.ok) {
            return NextResponse.json(resultData, { status: externalApiResponse.status });
        }

        // For certification, we assume resultData might contain a pdfUrl or similar
        // The frontend will handle the download based on this.
        return NextResponse.json(resultData, { status: 200 });

    } catch (error: any) {
        console.error("[API_DIPLOMA_ACTION_POST_ERROR]", error);
        if (error instanceof SyntaxError) { // Error parsing requestBody
            return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
        }
        return NextResponse.json(
            { error: error.message || "An unexpected error occurred." },
            { status: 500 }
        );
    }
} 