import dotenv from "dotenv";
import cron from "node-cron";
import { generatePost } from "./generatePost.js";
import { postToLinkedIn } from "./postToLinkedIn.js";

dotenv.config();

console.log("🚀 LinkedIn Post Bot started successfully!");

const techCategories = [
  "Backend Development",
  "Frontend Development", 
  "DevOps & Infrastructure",
  "Blockchain & Web3",
  "Mobile Development",
  "Data Science & AI",
  "Cybersecurity",
  "Cloud Computing",
  "System Design",
  "Database Design",
  "API Development",
  "Testing & Quality Assurance",
  "Performance Optimization",
  "Microservices Architecture",
  "Machine Learning Engineering"
];

function getRandomCategory(): string {
  return techCategories[Math.floor(Math.random() * techCategories.length)];
}

async function runJob(): Promise<void> {
  const category = getRandomCategory();
  const post = await generatePost(category);
  console.log("Generated Post:\n", post);  
  await postToLinkedIn(post);
}

cron.schedule("0 9,17 * * *", () => {
  console.log("⏰ Running LinkedIn poster job...");
  runJob();
});

runJob();
