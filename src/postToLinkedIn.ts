import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;
const PERSON_URN = process.env.LINKEDIN_PERSON_URN;

export async function postToLinkedIn(content: string): Promise<void> {
  const url = "https://api.linkedin.com/v2/ugcPosts";

  try {
    const response = await axios.post(
      url,
      {
        author: PERSON_URN,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: { text: content },
            shareMediaCategory: "NONE",
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0",
        },
      }
    );

    if (response.status === 201) {
      console.log("✅ Posted successfully to LinkedIn!");
    }
  } catch (err: any) {
    console.error("❌ LinkedIn Post Error:", err.response?.data || err.message);
  }
}
