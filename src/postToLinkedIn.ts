import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;
const PERSON_URN = process.env.LINKEDIN_PERSON_URN;

async function registerImageUpload(): Promise<{ uploadUrl: string; asset: string; }> {
  const url = "https://api.linkedin.com/v2/assets?action=registerUpload";
  const body = {
    registerUploadRequest: {
      owner: PERSON_URN,
      recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
      serviceRelationships: [
        {
          relationshipType: "OWNER",
          identifier: "urn:li:userGeneratedContent",
        },
      ],
      supportedUploadMechanism: ["SYNCHRONOUS_UPLOAD"],
    },
  };
  const { data } = await axios.post(url, body, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
  });
  const mech: any = (data?.value?.uploadMechanism ?? {}) as any;
  const uploadUrl = mech["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"]?.uploadUrl as string;
  const asset = data?.value?.asset as string;
  if (!uploadUrl || !asset) throw new Error("LinkedIn register upload did not return uploadUrl/asset");
  return { uploadUrl, asset };
}

async function uploadImageToLinkedIn(uploadUrl: string, imageBuffer: Buffer): Promise<void> {
  await axios.put(uploadUrl, imageBuffer, {
    headers: {
      "Content-Type": "image/png",
      "Content-Length": imageBuffer.length,
    },
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
  });
}

export async function postToLinkedIn(content: string, image?: { buffer: Buffer; altText?: string }): Promise<void> {
  const ugcUrl = "https://api.linkedin.com/v2/ugcPosts";

  try {
    if (image?.buffer) {
      const { uploadUrl, asset } = await registerImageUpload();
      await uploadImageToLinkedIn(uploadUrl, image.buffer);

      const bodyWithImage = {
        author: PERSON_URN,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: { text: content },
            shareMediaCategory: "IMAGE",
            media: [
              {
                status: "READY",
                description: { text: image.altText ?? "Post image" },
                media: asset,
                title: { text: "" },
              },
            ],
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      };

      const response = await axios.post(ugcUrl, bodyWithImage, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0",
        },
      });
      if (response.status === 201) {
        console.log("✅ Posted to LinkedIn with image!");
      }
      return;
    }

    // Fallback: text-only post
    const response = await axios.post(
      ugcUrl,
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
