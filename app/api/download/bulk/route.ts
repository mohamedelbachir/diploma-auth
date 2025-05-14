import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/app/actions";
import JSZip from "jszip";

export async function POST(request: NextRequest) {
    try {
        // Get form data with selected diplomas
        const formData = await request.formData();
        const selectedDiplomas = formData.getAll("selectedDiplomas") as string[];

        console.log(formData)
        console.log(selectedDiplomas)
        if (!selectedDiplomas || selectedDiplomas.length === 0) {
            return NextResponse.json(
                { error: "No diplomas selected" },
                { status: 400 }
            );
        }

        // Get user session to access token
        const session = await getSession();

        if (!session.user || !session.user.token) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        // Create a new ZIP file
        const zip = new JSZip();

        // Download each diploma and add to ZIP
        for (const diplomaId of selectedDiplomas) {
            // Construct API URL for this diploma
            const apiUrl = `${process.env.BACKEND_API_URL}/diplomas/${diplomaId}/?generate_pdf=true`;

            // Fetch the PDF from the API
            const response = await fetch(apiUrl, {
                headers: {
                    Authorization: `Bearer ${session.user.token}`,
                },
            });

            if (!response.ok) {
                console.error(`Failed to download diploma ${diplomaId}: ${response.status}`);
                continue; // Skip this diploma but continue with others
            }

            // Get PDF content as array buffer
            const pdfBuffer = await response.arrayBuffer();

            // Add to ZIP file with a filename based on the diploma ID
            zip.file(`diploma-${diplomaId}.pdf`, pdfBuffer);
        }

        // Generate the ZIP file
        const zipBuffer = await zip.generateAsync({ type: "arraybuffer" });

        // Return the ZIP with appropriate headers
        return new NextResponse(zipBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/zip",
                "Content-Disposition": "attachment; filename=diplomas.zip",
            },
        });
    } catch (error) {
        console.error("Bulk download error:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred" },
            { status: 500 }
        );
    }
} 