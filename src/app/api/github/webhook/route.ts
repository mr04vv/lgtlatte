import { Webhooks } from "@octokit/webhooks";
import type { PullRequestReviewEvent } from "@octokit/webhooks-types";
import { NextResponse } from "next/server";
import { handlePullRequestReview } from "@/lib/github/webhooks";

if (!process.env.GITHUB_WEBHOOK_SECRET) {
  throw new Error("GITHUB_WEBHOOK_SECRET is not set");
}

const webhooks = new Webhooks({
  secret: process.env.GITHUB_WEBHOOK_SECRET,
});

// Register event handlers
webhooks.on("pull_request_review", async ({ payload }) => {
  await handlePullRequestReview(payload as PullRequestReviewEvent);
});

/**
 * GitHub Webhook endpoint
 */
export async function POST(request: Request) {
  try {
    // Get webhook signature from headers
    const signature = request.headers.get("x-hub-signature-256");
    const id = request.headers.get("x-github-delivery");
    const event = request.headers.get("x-github-event");

    if (!signature || !id || !event) {
      console.error("Missing required webhook headers");
      return NextResponse.json(
        { error: "Missing required headers" },
        { status: 400 }
      );
    }

    // Get raw body
    const body = await request.text();

    // Verify webhook signature and process event
    await webhooks.verifyAndReceive({
      id,
      name: event as any,
      signature,
      payload: body,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook processing error:", error);

    if (error instanceof Error && error.message.includes("signature")) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
