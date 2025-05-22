import { pdf } from 'pdf-to-img'

export async function getPdfAsImage(id: string): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append("diplomaId", id);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/v-download`, {
      method: "POST",
      body: formData,
      cache: "no-store"
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to fetch diploma: ${response.status}`);
    }

    const pdfBuffer = await response.arrayBuffer();

    // Server-side: use Buffer
    const document = await pdf(Buffer.from(pdfBuffer), { scale: 1.5 });

    const firstPage = await document.getPage(1);
    if (!firstPage) throw new Error("Failed to convert PDF to image");

    return firstPage.toString('base64');
  } catch (error) {
    console.error("Error processing PDF:", error);
    throw error;
  }
}
