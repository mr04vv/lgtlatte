import {
  AssetCollectionApiDocument,
  type AssetCollectionApiQuery,
} from "@/generated/schema";
import { apolloClient } from "@/lib/apolloClient";

export const dynamic = "force-dynamic"; // defaults to auto
export const revalidate = 0;

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

  const { searchParams } = new URL(request.url);
  const skip = Number.parseInt(searchParams.get("skip") ?? "0", 10);
  const limit = Number.parseInt(searchParams.get("limit") ?? "15", 10);

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
    .slice(skip, skip + limit);

  return Response.json({
    total: res.data.assetCollection?.total ?? 0,
    images: shuffledArray,
  });
}
