import { GoogleGenAI } from "@google/genai";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/aws/S3";
import type { AIAnalysisResult, AIResolutionResult, IncidentCategory } from "@/types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// ══════════════════════════════════════════
// PROMPTS
// ══════════════════════════════════════════

const VALIDATION_PROMPT = `You are an AI assistant for Nagrik, a smart city infrastructure platform.
Analyze the image and return ONLY a JSON object — no markdown, no explanation.

JSON structure:
{
  "category": "pothole" | "garbage" | "streetlight" | "road_damage" | "waterlogging" | "encroachment" | "other",
  "severity": <integer 1-10>,
  "isSpam": <boolean>,
  "spamReason": "stock_photo" | "indoor_image" | "unrelated" | "low_quality" | null,
  "confidence": <integer 0-100>,
  "description": "<1-2 sentence description of the issue>"
}

Severity guide:
1-3: Minor issue
4-6: Moderate issue  
7-9: Serious hazard
10: Critical emergency

isSpam = true if: stock photo, indoor image, no civic issue visible, or completely unrelated.
Always return valid JSON only.`;

const RESOLUTION_PROMPT = `You are a resolution verifier for Nagrik.
You will receive TWO images: BEFORE (the problem) and AFTER (claimed fix).
Determine if the problem has been genuinely resolved.

Return ONLY this JSON:
{
  "resolved": <boolean>,
  "confidence": <integer 0-100>,
  "notes": "<1-2 sentence explanation>"
}

Be strict: dirt thrown in pothole = NOT resolved. Proper asphalt fill = resolved.
Different location in after image = NOT resolved.`;

// ══════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════

async function fetchImageFromS3(
    s3Key: string
): Promise<{ data: string; mimeType: string }> {
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: s3Key,
    });
    const res = await s3.send(command);
    const chunks: Uint8Array[] = [];
    for await (const chunk of res.Body as AsyncIterable<Uint8Array>) {
        chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    const mimeType = res.ContentType ?? "image/jpeg";
    return { data: buffer.toString("base64"), mimeType };
}

function parseJSON<T>(text: string): T {
    const cleaned = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
    return JSON.parse(cleaned) as T;
}

// ══════════════════════════════════════════
// VALIDATE INCIDENT IMAGE
// ══════════════════════════════════════════

export async function validateImage(
    s3Key: string,
    categoryHint: IncidentCategory
): Promise<AIAnalysisResult> {
    const image = await fetchImageFromS3(s3Key);

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
            {
                role: "user",
                parts: [
                    {
                        text: `${VALIDATION_PROMPT}\n\nUser category hint: "${categoryHint}"`,
                    },
                    {
                        inlineData: {
                            data: image.data,
                            mimeType: image.mimeType,
                        },
                    },
                ],
            },
        ],
    });

    const text = response.text ?? "";
    const parsed = parseJSON<AIAnalysisResult>(text);

    if (typeof parsed.category !== "string" || typeof parsed.severity !== "number") {
        throw new Error("Invalid AI response structure");
    }

    return parsed;
}

// ══════════════════════════════════════════
// VERIFY RESOLUTION (BEFORE/AFTER)
// ══════════════════════════════════════════

export async function verifyResolution(
    beforeS3Key: string,
    afterS3Key: string
): Promise<AIResolutionResult> {
    const [before, after] = await Promise.all([
        fetchImageFromS3(beforeS3Key),
        fetchImageFromS3(afterS3Key),
    ]);

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
            {
                role: "user",
                parts: [
                    {
                        text: `${RESOLUTION_PROMPT}\n\nFirst image = BEFORE. Second image = AFTER.`,
                    },
                    {
                        inlineData: {
                            data: before.data,
                            mimeType: before.mimeType,
                        },
                    },
                    {
                        inlineData: {
                            data: after.data,
                            mimeType: after.mimeType,
                        },
                    },
                ],
            },
        ],
    });

    const text = response.text ?? "";
    const parsed = parseJSON<Omit<AIResolutionResult, "verifiedAt">>(text);

    return {
        ...parsed,
        verifiedAt: new Date(),
    };
}