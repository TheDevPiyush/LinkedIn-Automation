import { GoogleGenAI, type Part } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

function buildPrompt(topic: string): string {
  return `Create a single 1200x1200 PNG image in an abstract illustration style for a topic: ${topic} LinkedIn post.
    Style: minimal, geometric shapes, soft gradients, 2-3 accent colors, tech feel.
    No text or logos. High contrast, clean composition.
    Return the image in base64 format.`;
}

async function tryGenerate(ai: GoogleGenAI, modelName: string, prompt: string): Promise<Buffer | null> {
  const response = await ai.models.generateContent({ model: modelName, contents: prompt });
  const parts: Part[] = (response?.candidates?.[0]?.content?.parts ?? []) as Part[];
  for (const part of parts) {
    const maybeAny: any = part as any;
    if (maybeAny.inlineData) {
      const imageData = maybeAny.inlineData?.data as string | undefined;
      if (imageData) return Buffer.from(imageData, "base64");
    }
  }
  return null;
}

export async function generatePostImage(topic: string): Promise<Buffer | null> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = buildPrompt(topic);

  const modelsToTry = [
    "gemini-1.5-flash",
    "gemini-2.5-flash-image",
  ];

  for (const modelName of modelsToTry) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const buffer = await tryGenerate(ai, modelName, prompt);
        if (buffer) return buffer;
      } catch (err: any) {
        const message = err?.message ?? String(err);
        const isQuota = message.includes("RESOURCE_EXHAUSTED") || message.includes("429");
        if (isQuota) break;
        await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
      }
    }
  }

  return null;
}