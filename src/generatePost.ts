import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export interface GeneratedPostResult {
  topic: string;
  text: string;
}

export async function generatePost(category: string = "Software Development"): Promise<GeneratedPostResult> {
  const topicPrompt = `Generate an intermediate-level (not too easy, not too hard) technical topic within the "${category}" domain that would be interesting for mid-level developers to learn about. 

Requirements:
- Should be specific enough to write a detailed post about
- Should be at intermediate difficulty level
- Should be current/relevant to 2024
- Should be something developers actually struggle with
- Return ONLY the topic title, nothing else

Examples of good intermediate topics:
- "Implementing JWT authentication with refresh tokens"
- "Designing a scalable caching strategy for microservices"
- "Optimizing database queries for high-traffic applications"`;

  const topicResult = await model.generateContent(topicPrompt);
  const generatedTopic = topicResult.response.text().trim();

  const postPrompt = `Create an engaging LinkedIn post about "${generatedTopic}" that sounds like it's written by a real person, not AI. 

Requirements:
- Use a conversational, talkative tone like you're chatting with a friend
- Include relevant emojis throughout the post
- Use bullet points or numbered lists for key insights & keep proper spacing and line breaks
- Make it feel personal and authentic
- Include a hook at the beginning to grab attention
- End with a question or call-to-action to encourage engagement
- Keep it between 800-1200 characters, with proper spacing and line breaks
- Use casual language, contractions, and real examples
- Avoid corporate jargon or overly formal language
- Focus on practical insights and real-world applications

CRITICAL: DO NOT include:
- Any links, URLs, or references to external resources
- Placeholder text like "[link to article]" or "[relevant resource]"
- Citations or references
- "Here are some resources" or similar filler content
- Hashtags (LinkedIn doesn't use them effectively)
- Avoid any starting reply like for example - ' Okay, here's my attempt at a super-personal, conversational LinkedIn post about Terraform and AWS: ---' or anything like that

The post should be completely self-contained with your own insights and experiences. Make it sound like someone who's genuinely excited to share insights and wants to start a conversation!`;

  const result = await model.generateContent(postPrompt);
  return { topic: generatedTopic, text: result.response.text() };
}
