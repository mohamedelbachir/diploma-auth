
"use client"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname } from "next/navigation";

export type ConversionFormat = "word" | "excel" | "powerpoint" | "text" | "html";

interface ConversionOptionsProps {
  onConvert: (format: ConversionFormat) => void;
  isConverting: boolean;
  isFileSelected: boolean;
}

const ConversionOptions = ({ onConvert, isConverting, isFileSelected }: ConversionOptionsProps) => {
  const [selectedFormat, setSelectedFormat] = useState<ConversionFormat>("word");
  const location = usePathname();

  // Determine service type based on the URL
  const getServiceType = () => {
    const path = location;
    if (path.includes("verification")) return "verification";
    if (path.includes("certification")) return "certification";
    
    // For backward compatibility with old routes
    if (path.includes("pdf-to-word")) return "verification";
    if (path.includes("pdf-to-ppt")) return "certification";
    
    return "verification"; // Default
  };
  
  const serviceType = getServiceType();

  const handleFormatChange = (value: string) => {
    setSelectedFormat(value as ConversionFormat);
  };

  const handleConvert = () => {
    onConvert(selectedFormat);
  };

  // Define options based on service type
  const getOptions = () => {
    if (serviceType === "verification") {
      return [
        { value: "word", label: "Vérification standard", icon: "🔍" },
        { value: "excel", label: "Vérification détaillée", icon: "📊" },
        { value: "text", label: "Vérification rapide", icon: "📝" },
      ];
    } else if (serviceType === "certification") {
      return [
        { value: "powerpoint", label: "Certification Ethereum", icon: "🔗" },
        { value: "html", label: "Certification Solana", icon: "🌐" },
      ];
    } else {
      // Fallback or other services
      return [
        { value: "word", label: "Word Document (.docx)", icon: "📄" },
        { value: "excel", label: "Excel Spreadsheet (.xlsx)", icon: "📊" },
        { value: "powerpoint", label: "PowerPoint (.pptx)", icon: "📑" },
        { value: "text", label: "Text File (.txt)", icon: "📝" },
        { value: "html", label: "HTML Document (.html)", icon: "🌐" },
      ];
    }
  };

  // Get service-specific title
  const getTitle = () => {
    if (serviceType === "verification") {
      return "Choisissez le type de vérification";
    } else if (serviceType === "certification") {
      return "Choisissez le type de certification blockchain";
    } else {
      return "Choisissez le format de sortie";
    }
  };

  // Get service-specific button text
  const getButtonText = () => {
    if (serviceType === "verification") {
      return "Vérifier maintenant";
    } else if (serviceType === "certification") {
      return "Certifier maintenant";
    } else {
      return "Convertir maintenant";
    }
  };

  const formatOptions = getOptions();

  // Set a default value when options change
  useEffect(() => {
    if (formatOptions.length > 0) {
      setSelectedFormat(formatOptions[0].value as ConversionFormat);
    }
  }, [serviceType]);

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">{getTitle()}</h3>
            <Select 
              value={selectedFormat} 
              onValueChange={handleFormatChange}
              disabled={!isFileSelected}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionnez une option" />
              </SelectTrigger>
              <SelectContent>
                {formatOptions.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    <div className="flex items-center gap-2">
                      <span>{format.icon}</span>
                      <span>{format.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            className="w-full"
            onClick={handleConvert}
            disabled={!isFileSelected || isConverting}
          >
            {isConverting ? (
              <>
                <svg
                  className="mr-2 h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                En traitement...
              </>
            ) : (
              getButtonText()
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversionOptions;

