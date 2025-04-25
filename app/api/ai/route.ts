import OpenAI from "openai";
import { NextRequest, NextResponse } from 'next/server';

//const token = process.env["GITHUB_TOKEN"];
const token = process.env.OPENAI_API_KEY
const endpoint = "https://models.inference.ai.azure.com"; // Ensure this endpoint supports the desired model and tool calling
const modelName = "gpt-4o"; // Or another model capable of tool calling

// Define the schema for the diploma information based on the provided type
const diplomaSchema: OpenAI.Chat.Completions.ChatCompletionTool = {
    type: "function",
    function: {
        name: "extract_diploma_info",
        description: "Extracts diploma information from the provided text.",
        parameters: {
            type: "object",
            properties: {
                diplomaNumber: { type: "string", description: "The unique number of the diploma." },
                name: { type: "string", description: "The full name of the diploma holder." },
                birthDate: { type: "string", description: "The birth date of the diploma holder (e.g., YYYY-MM-DD)." },
                birthPlace: { type: "string", description: "The place of birth of the diploma holder." },
                gender: { type: "string", description: "The gender of the diploma holder." },
                registrationNumber: { type: "string", description: "The registration number associated with the diploma." },
                specialization: { type: "string", description: "The field of specialization." },
                series: { type: "string", description: "The series identifier of the diploma." },
                grade: { type: "string", description: "The grade or honors received (e.g., 'Good', 'Very Good')." },
                issueDate: { type: "string", description: "The date the diploma was issued (e.g., YYYY-MM-DD)." },
                sessionDate: { type: "string", description: "The date of the examination session (e.g., YYYY-MM-DD)." },
                certificateType: {
                    type: "object",
                    properties: {
                        french: { type: "string", description: "The type of certificate in French." },
                        english: { type: "string", description: "The type of certificate in English." },
                    },
                    required: ["french", "english"],
                },
                institution: {
                    type: "object",
                    properties: {
                        name: {
                            type: "object",
                            properties: {
                                french: { type: "string", description: "The name of the institution in French." },
                                english: { type: "string", description: "The name of the institution in English." },
                            },
                            required: ["french", "english"],
                        },
                        school: {
                            type: "object",
                            properties: {
                                french: { type: "string", description: "The name of the school/faculty in French." },
                                english: { type: "string", description: "The name of the school/faculty in English." },
                            },
                            required: ["french", "english"],
                        },
                        ministry: {
                            type: "object",
                            properties: {
                                french: { type: "string", description: "The supervising ministry in French." },
                                english: { type: "string", description: "The supervising ministry in English." },
                            },
                            required: ["french", "english"],
                        },
                    },
                    required: ["name", "school", "ministry"],
                },
            },
            // Mark all properties as required to ensure the AI attempts to fill them,
            // defaulting to empty strings if information is missing.
            required: [
                "diplomaNumber", "name", "birthDate", "birthPlace", "gender",
                "registrationNumber", "specialization", "series", "grade",
                "issueDate", "sessionDate", "certificateType", "institution"
            ],
        },
    }
};


export async function extractDiplomaInfoFromText(rawText: string): Promise<any> { // Changed function name and added input parameter

    if (!token) {
        throw new Error("OPENAI_API_KEY is not set in environment variables.");
    }
    if (!rawText || rawText.trim() === "") {
        throw new Error("Input text cannot be empty.");
    }

    const client = new OpenAI({ baseURL: endpoint, apiKey: token });

    try {
        const completion = await client.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are an expert assistant specialized in extracting information from text and structuring it into a JSON object according to the provided schema. Analyze the user's text and extract the diploma details. If a specific piece of information is not found in the text, use an empty string "" as the value for the corresponding field. Ensure the output strictly adheres to the 'extract_diploma_info' tool schema.`,
                },
                { role: "user", content: rawText },
            ],
            model: modelName,
            tools: [diplomaSchema],
            tool_choice: { type: "function", function: { name: "extract_diploma_info" } }, // Force the model to use the tool
        });

        // Extract the arguments generated by the model for the tool call
        const toolCalls = completion.choices[0]?.message?.tool_calls;
        if (toolCalls && toolCalls[0]?.function?.arguments) {
            // Parse the JSON string arguments into an object
            const extractedData = JSON.parse(toolCalls[0].function.arguments);
            return extractedData;
        } else {
            // Handle cases where the model didn't call the tool as expected
            console.error("Model did not return the expected tool call.", completion.choices[0]?.message);
            throw new Error("Failed to extract information using the specified tool.");
        }
    } catch (error) {
        console.error("Error calling OpenAI API:", error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

// Define the POST handler for the API route
export async function POST(req: NextRequest) {
    try {
        // Get the text from the request body
        const body = await req.json();
        const rawText = body.text;

        if (!rawText) {
            return NextResponse.json({ error: 'Missing \'text\' property in request body' }, { status: 400 });
        }

        // Call the internal extraction function
        const extractedData = await extractDiplomaInfoFromText(rawText);

        // Return the successful response
        return NextResponse.json(extractedData, { status: 200 });

    } catch (error: any) {
        console.error("[API_AI_POST_ERROR]", error);

        // Handle JSON parsing errors
        if (error instanceof SyntaxError) {
            return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
        }

        // Handle errors from the extraction function or OpenAI API
        return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
    }
}

// Remove the example main() call as this function will likely be imported and used elsewhere
// main().catch((err) => {
//   console.error("The sample encountered an error:", err);
// });
