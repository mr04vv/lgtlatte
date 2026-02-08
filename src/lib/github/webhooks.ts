import type { PullRequestReviewEvent } from "@octokit/webhooks-types";
import { getRandomLgtmImage } from "../queries/randomImage";
import { postLgtmComment } from "./comments";

/**
 * Handle pull request review event
 */
export async function handlePullRequestReview(
  payload: PullRequestReviewEvent
): Promise<void> {
  // Only process approved reviews
  if (payload.action !== "submitted" || payload.review.state !== "approved") {
    console.log(
      `Skipping non-approved review: action=${payload.action}, state=${payload.review.state}`
    );
    return;
  }

  console.log(
    `Processing approved review from ${payload.review.user.login} on PR #${payload.pull_request.number}`
  );

  try {
    // Get random LGTM image
    const imageUrl = await getRandomLgtmImage();

    if (!imageUrl) {
      console.error("No LGTM images available");
      return;
    }

    // Post comment to PR
    await postLgtmComment({
      installationId: payload.installation?.id ?? 0,
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      issueNumber: payload.pull_request.number,
      imageUrl,
    });

    console.log(
      `Successfully posted LGTM image to ${payload.repository.full_name}#${payload.pull_request.number}`
    );
  } catch (error) {
    console.error("Failed to handle pull request review:", error);
    throw error;
  }
}
