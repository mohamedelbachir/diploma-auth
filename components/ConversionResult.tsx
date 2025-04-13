
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConversionFormat } from "./ConversionOptions";

interface ConversionResultProps {
  fileName: string;
  format: ConversionFormat;
  onDownload: () => void;
  onNewConversion: () => void;
}

const ConversionResult = ({
  fileName,
  format,
  onDownload,
  onNewConversion,
}: ConversionResultProps) => {
  const formatInfo = {
    word: {
      name: "Word Document",
      extension: ".docx",
      icon: "📄",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    excel: {
      name: "Excel Spreadsheet",
      extension: ".xlsx",
      icon: "📊",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    powerpoint: {
      name: "PowerPoint Presentation",
      extension: ".pptx",
      icon: "📑",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    text: {
      name: "Text File",
      extension: ".txt",
      icon: "📝",
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    },
    html: {
      name: "HTML Document",
      extension: ".html",
      icon: "🌐",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  };

  const info = formatInfo[format];
  const newFileName = fileName.replace(".pdf", info.extension);

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8 animate-fade-in">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className="mx-auto rounded-full w-16 h-16 flex items-center justify-center bg-green-100 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-green-600"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-1">Conversion Complete!</h3>
          <p className="text-muted-foreground">
            Your file has been successfully converted
          </p>
        </div>

        <div className={`p-4 rounded-lg ${info.bgColor} mb-6`}>
          <div className="flex items-center gap-3">
            <div className="text-3xl">{info.icon}</div>
            <div>
              <p className="font-medium">{newFileName}</p>
              <p className={`text-sm ${info.color}`}>{info.name}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Button onClick={onDownload} className="gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            Download File
          </Button>
          <Button variant="outline" onClick={onNewConversion}>
            Convert Another File
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversionResult;
