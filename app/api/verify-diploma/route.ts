import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const aiData = await req.json();

        // Transform AI data for the verification API
        const verificationPayload = {
            action: "authenticate",
            extracted: {
                diploma_number: aiData.diplomaNumber || "",
                student_name: aiData.name || "",
                birth_date: aiData.birthDate || "",
                birth_place: aiData.birthPlace || "",
                registration_number: aiData.registrationNumber || "",
                gender: aiData.gender || "",
                domain: aiData.specialization || "", // Mapping specialization to domain
                series: aiData.series || "",
                mention: aiData.grade || "", // Mapping grade to mention
                exam_session: aiData.sessionDate || "", // Mapping sessionDate to exam_session
                issued_date: aiData.issueDate || "", // Mapping issueDate to issued_date
                // qrcode data can be included if your backend expects it
                // qrcode: aiData.qrcode || "",
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

        const verificationResponse = await fetch(
            `${backendApiUrl}/diplomas/verify/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Add any other necessary headers for your backend, like an API key if required
                },
                body: JSON.stringify(verificationPayload),
            }
        );

        const verificationResult = await verificationResponse.json();

        if (!verificationResponse.ok) {
            // Forward the error status and message from the external API
            return NextResponse.json(verificationResult, { status: verificationResponse.status });
        }

        return NextResponse.json(verificationResult, { status: 200 });

    } catch (error: any) {
        console.error("[API_VERIFY_DIPLOMA_POST_ERROR]", error);
        // Handle JSON parsing errors from the request
        if (error instanceof SyntaxError) {
            return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
        }
        return NextResponse.json(
            { error: error.message || "An unexpected error occurred during verification." },
            { status: 500 }
        );
    }
} 