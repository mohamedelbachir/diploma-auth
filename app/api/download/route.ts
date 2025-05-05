import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/app/actions";

export async function POST(request: NextRequest) {
    // Get form data
    const formData = await request.formData();
    const diplomaId = formData.get("diplomaId") as string;

    if (!diplomaId) {
        return NextResponse.json(
            { error: "Diploma ID is required" },
            { status: 400 }
        );
    }

    try {
        // Get user session to access token
        const session = await getSession();

        if (!session.user || !session.user.token) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        // Construct API URL
        const apiUrl = `${process.env.BACKEND_API_URL}/diplomas/${diplomaId}/`;

        // Fetch the PDF from the API
        const response = await fetch(apiUrl, {
            headers: {
                Authorization: `Bearer ${session.user.token}`,
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to download diploma" },
                { status: response.status }
            );
        }

        // Get PDF content
        const pdfBuffer = await response.arrayBuffer();

        // Return the PDF with appropriate headers
        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="diploma-${diplomaId}.pdf"`,
            },
        });
    } catch (error) {
        console.error("Download error:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred" },
            { status: 500 }
        );
    }
} 