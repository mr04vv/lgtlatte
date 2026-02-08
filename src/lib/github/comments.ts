import { getOctokitForInstallation } from "./app";

export interface CommentParams {
  installationId: number;
  owner: string;
  repo: string;
  issueNumber: number;
  imageUrl: string;
}

/**
 * Post a LGTM image comment to a GitHub PR
 */
export async function postLgtmComment({
  installationId,
  owner,
  repo,
  issueNumber,
  imageUrl,
}: CommentParams): Promise<void> {
  try {
    const octokit = await getOctokitForInstallation(installationId);

    // Create comment with image markdown
    await octokit.request(
      "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
      {
        owner,
        repo,
        issue_number: issueNumber,
        body: `![LGTM](${imageUrl})`,
      }
    );

    console.log(
      `Successfully posted LGTM comment to ${owner}/${repo}#${issueNumber}`
    );
  } catch (error) {
    console.error("Failed to post LGTM comment:", error);
    throw error;
  }
}
