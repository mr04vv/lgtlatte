import { App } from "@octokit/app";

function createGitHubApp() {
  if (!process.env.GITHUB_APP_ID) {
    throw new Error("GITHUB_APP_ID is not set");
  }

  if (!process.env.GITHUB_APP_PRIVATE_KEY) {
    throw new Error("GITHUB_APP_PRIVATE_KEY is not set");
  }

  return new App({
    appId: process.env.GITHUB_APP_ID,
    privateKey: process.env.GITHUB_APP_PRIVATE_KEY.replace(/\\n/g, "\n"),
  });
}

// Lazy initialization of GitHub App instance
let appInstance: App | null = null;

function getApp(): App {
  if (!appInstance) {
    appInstance = createGitHubApp();
  }
  return appInstance;
}

/**
 * Get Octokit instance for a specific installation
 */
export async function getOctokitForInstallation(installationId: number) {
  const app = getApp();
  return await app.getInstallationOctokit(installationId);
}
