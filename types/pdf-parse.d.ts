declare module 'pdf-parse/lib/pdf-parse' {
    function pdf(dataBuffer: Buffer | string): Promise<{
        text: string;
        numpages: number;
        info: any;
        metadata: any;
        version: string;
    }>;
    export = pdf;
} 