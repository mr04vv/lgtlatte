import {
  AssetCollectionApiDocument,
  type AssetCollectionApiQuery,
} from "@/generated/schema";
import { apolloClient } from "@/lib/apolloClient";

/**
 * Get a random LGTM image from the collection
 * @returns Random image URL or null if no images available
 */
export async function getRandomLgtmImage(): Promise<string | null> {
  try {
    const res = await apolloClient.query<AssetCollectionApiQuery>({
      query: AssetCollectionApiDocument,
      fetchPolicy: "no-cache",
    });

    const items = res.data.assetCollection?.items ?? [];

    if (items.length === 0) {
      return null;
    }

    // Get random image
    const randomIndex = Math.floor(Math.random() * items.length);
    const randomItem = items[randomIndex];

    return randomItem?.url ?? null;
  } catch (error) {
    console.error("Failed to fetch random LGTM image:", error);
    return null;
  }
}
