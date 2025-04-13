import { DocumentScanner } from "@/components/document-scanner"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-3xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Document Scanner</h1>
          <p className="text-gray-600 mt-2">
            Upload, preview, and scan documents with ease
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-medium mb-4">Upload & Scan</h2>
          <p className="text-gray-600 mb-6">
            Drag and drop an image or PDF file, or click to select a file to
            scan. The first page will be automatically previewed.
          </p>

          <DocumentScanner
            width="100%"
            height={500}
            scanDuration={2.5}
            scanColor="rgba(0, 180, 0, 0.3)"
          />

          <div className="mt-4 text-sm text-gray-500">
            <p>
              <strong>Note:</strong> This component simulates a document
              scanning process. In a real application, you would send the file
              to your backend for processing after scanning.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-medium mb-4">Features</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Drag and drop file upload</li>
            <li>Support for images (JPEG, PNG, GIF) and PDF files</li>
            <li>Automatic preview of the first page of PDF files</li>
            <li>Visual scanning animation on demand</li>
            <li>Simulated backend processing</li>
            <li>File validation (type and size)</li>
            <li>Responsive design</li>
            <li>Customizable scanning effect</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
