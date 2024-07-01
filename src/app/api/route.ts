import {
  AssetCollectionApiQuery,
  AssetCollectionApiDocument,
} from "@/generated/schema";
import { apolloClient } from "@/lib/apolloClient";

export const dynamic = "force-dynamic"; // defaults to auto

const shuffleArray = <T>(array: readonly T[]): T[] => {
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

export async function GET(request: Request) {
  const token = request.headers.get("token");
  if (token !== process.env.API_TOKEN)
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  const res = await apolloClient.query<AssetCollectionApiQuery>({
    query: AssetCollectionApiDocument,
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

  return Response.json({
    total: res.data.assetCollection?.total ?? 0,
    images: shuffledArray,
  });
}
