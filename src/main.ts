import dotenv from "dotenv";
import cron from "node-cron";
import { generatePost } from "./generatePost.js";
import { postToLinkedIn } from "./postToLinkedIn.js";

dotenv.config();

console.log("🚀 LinkedIn Post Bot started successfully!");

async function runJob(): Promise<void> {
  const topic = "how AI is transforming the future of coding";
  const post = await generatePost(topic);
  console.log("Generated Post:\n", post);
  await postToLinkedIn(post);
}

cron.schedule("0 9,17 * * *", () => {
  console.log("⏰ Running LinkedIn poster job...");
  runJob();
});

runJob();
