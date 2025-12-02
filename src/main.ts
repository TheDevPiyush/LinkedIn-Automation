import dotenv from "dotenv";
import cron from "node-cron";
import { generatePost } from "./generatePost.js";
import { postToLinkedIn } from "./postToLinkedIn.js";
import { generatePostImage } from "./generatePostImage.js";

dotenv.config();

console.log("🚀 LinkedIn Post Bot started successfully! - Text + Image Posts");

const techCategories = [
  "Backend Development",
  "DevOps & Infrastructure",
  "Data Science & AI",
  "Machine Learning Engineering",
  "Database Design",
  "API Development",
  "Cloud Computing",
  "System Design",
  "Mobile Development",
  "Testing & Quality Assurance",
  "Frontend Development",
  "Performance Optimization",
  "Microservices Architecture",
];

function getRandomCategory(): string {
  return techCategories[Math.floor(Math.random() * techCategories.length)];
}

async function runJob(): Promise<void> {
  const category = getRandomCategory();
  const { topic, text } = await generatePost(category);
  console.log("Generated Topic:\n", topic);
  console.log("Generated Post:\n", text);

  let imageBuffer: Buffer | null = null;
  try {
    imageBuffer = await generatePostImage(`${topic} (abstract illustration style)`);
  } catch (err: any) {
    console.warn("Image generation failed:", err?.message || String(err));
  }

  await postToLinkedIn(text, imageBuffer ? { buffer: imageBuffer, altText: topic } : undefined);
}

cron.schedule("0 13 * * *", () => {
  console.log("⏰ Running LinkedIn poster job (1 PM IST)...");
  runJob();
}, {
  timezone: "Asia/Kolkata"
});

// runJob();