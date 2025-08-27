import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export async function generatePost(topic: string = "AI in software development 2025"): Promise<string> {
  const prompt = `Write a professional LinkedIn post about ${topic}, keep it concise, engaging, and suitable for LinkedIn readers.`;
  const result = await model.generateContent(prompt);
  return result.response.text();
}
