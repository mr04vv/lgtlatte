import { apolloClient } from "@/lib/apolloClient";
import {
  AssetCollectionDocument,
  AssetCollectionTotalDocument,
  AssetCollectionTotalQuery,
  Query,
  QueryAssetCollectionArgs,
} from "@/generated/schema";
import { LgtmImage } from "@/app/components/LgtmImage";
import { SIZE_PER_PAGE } from "@/app/constants/sizePerPage";
import { Snackbar } from "@/app/components/Snackbar";
import Image from "next/image";

export const generateStaticParams = async () => {
  const res = await apolloClient.query<
    AssetCollectionTotalQuery,
    QueryAssetCollectionArgs
  >({
    query: AssetCollectionTotalDocument,
  });

  const totalCount = res.data.assetCollection?.total ?? 0;

  const range = (start: number, end: number) =>
    [...Array(end - start + 1)].map((_, i) => start + i);

  const paths = range(1, Math.ceil(totalCount / SIZE_PER_PAGE)).map((num) => ({
    page: `${num}`,
  }));

  return paths;
};

export default async function Home({ params }: { params: { page: string } }) {
  const res = await apolloClient.query<Query, QueryAssetCollectionArgs>({
    query: AssetCollectionDocument,
    variables: {
      skip: SIZE_PER_PAGE * (parseInt(params.page) - 1),
      limit: SIZE_PER_PAGE,
    },
  });

  const items = res.data.assetCollection?.items ?? [];

  return (
    <main className="flex items-center m-auto flex-col max-w-[1240px] my-6 max-xl:mx-4">
      <header className="my-4">
        <img src="/title.svg" alt="Vercel Logo" width={360} height={100} />
      </header>
      <h2 className="text-xl max-md:text-base">
        愛猫「らて」のLGTM画像を集めました。LGTMする際にお使いください。
      </h2>
      <div className="grid grid-cols-3 gap-8 max-xl:grid-cols-3 max-md:grid-cols-1 my-10">
        {items.map((item) => (
          <div className="h-auto max-h-96 w-auto relative">
            <LgtmImage url={item?.url ?? ""} />
          </div>
        ))}
      </div>
      <Snackbar />
    </main>
  );
}
