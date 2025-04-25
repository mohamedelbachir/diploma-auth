import QrScanner from 'qr-scanner'
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file || !(file instanceof File)) {
            return NextResponse.json({ error: 'File is required.' }, { status: 400 });
        }

        //await QrScanner.scanImage(preview.file,{returnDetailedScanResult:true}).then(result=>console.log(result)).catch(e=>console.log(e))

        // Prepare form data to send to the external API
        const externalFormData = new FormData();
        externalFormData.append('file', file);

        // Call the external QR code scanning API
        const apiResponse = await fetch("http://api.qrserver.com/v1/read-qr-code/", {
            method: 'POST',
            body: externalFormData,
        });

        if (!apiResponse.ok) {
            console.error('External API error:', apiResponse.status, apiResponse.statusText);
            return NextResponse.json({ error: 'Failed to scan QR code via external service.' }, { status: apiResponse.status });
        }

        const results = await apiResponse.json();

        // Extract the data according to the API's response structure
        // [{"type":"qrcode","symbol":[{"seq":0,"data":"YOUR_QR_CODE_DATA","error":null}]}]
        const scannedData = results?.[0]?.symbol?.[0]?.data;
        console.log(scannedData)

        if (!scannedData) {
            console.error('Could not extract data from API response:', results);
            return NextResponse.json({ error: "Couldn't scan QR Code or extract data." }, { status: 400 });
        }

        // Return the scanned data
        return NextResponse.json({ data: scannedData });

    } catch (error) {
        console.error('Error processing QR code:', error);
        let errorMessage = 'Internal Server Error';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ error: 'Failed to process QR code.', details: errorMessage }, { status: 500 });
    }
}