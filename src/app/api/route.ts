import {
  AssetCollectionQuery,
  AssetCollectionDocument,
} from "@/generated/schema";
import { apolloClient } from "@/lib/apolloClient";

export const dynamic = "force-dynamic"; // defaults to auto

export const shuffleArray = <T>(array: readonly T[]): T[] => {
  if (array.length <= 1) {
    // 配列が空または要素が1つの場合、そのまま返す
    return [...array];
  }

  const cloneArray = [...array];

  for (let i = cloneArray.length - 1; i >= 0; i--) {
    const randomNum = Math.floor(Math.random() * (i + 1));
    // 要素を一時的に保管する
    const tmpStorage = cloneArray[i];

    // 要素の保管場所を入れ替える
    cloneArray[i] = cloneArray[randomNum];
    cloneArray[randomNum] = tmpStorage;
  }

  return cloneArray;
};

export async function GET() {
  const res = await apolloClient.query<AssetCollectionQuery>({
    query: AssetCollectionDocument,
  });

  const items = res.data.assetCollection?.items ?? [];
  const shuffledArray = shuffleArray(items)
    .map((item) => {
      return {
        url: item?.url ?? "",
        title: item?.title ?? "",
        width: item?.width ?? 0,
      };
    })
    .slice(0, 15);

  return Response.json({ images: shuffledArray });
}
