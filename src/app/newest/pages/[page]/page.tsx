export const dynamic = "force-static";

import { LgtmImage } from "@/app/components/LgtmImage";
import { Pagination } from "@/app/components/Pagination";
import { Snackbar } from "@/app/components/Snackbar";
import { TabNavigation } from "@/app/components/TabNavigation";
import { SIZE_PER_PAGE } from "@/app/constants/sizePerPage";
import {
  AssetCollectionDocument,
  AssetCollectionTotalDocument,
  type AssetCollectionTotalQuery,
  type Query,
  type QueryAssetCollectionArgs,
} from "@/generated/schema";
import { apolloClient } from "@/lib/apolloClient";

export const generateStaticParams = async () => {
  const res = await apolloClient.query<
    AssetCollectionTotalQuery,
    QueryAssetCollectionArgs
  >({
    query: AssetCollectionTotalDocument,
  });

  const totalCount = res.data.assetCollection?.total ?? 0;

  const totalPage = Math.ceil(totalCount / SIZE_PER_PAGE);
  const paths = Array.from({ length: totalPage }).map((_, i) => ({
    page: (i + 1).toString(),
  }));
  return paths;
};

export default async function NewestPaginatedPage({
  params,
}: {
  params: { page: string; totalPage: string };
}) {
  const res = await apolloClient.query<Query, QueryAssetCollectionArgs>({
    query: AssetCollectionDocument,
    variables: {
      skip: SIZE_PER_PAGE * (Number.parseInt(params.page, 10) - 1),
      limit: SIZE_PER_PAGE,
    },
  });

  const items = res.data.assetCollection?.items ?? [];
  const totalCount = res.data.assetCollection?.total ?? 0;
  const totalPage = Math.ceil(totalCount / SIZE_PER_PAGE);
  const page = Number(params.page);

  return (
    <main className="flex items-center m-auto flex-col max-w-[1240px] my-6 max-xl:mx-4 max-md:mx-2 relative">
      <header className="my-4">
        <img src="/title.svg" alt="Vercel Logo" width={360} height={100} />
      </header>
      <h2 className="text-xl max-md:text-base">
        愛猫「らて」のLGTM画像を集めました。LGTMする際にお使いください。
      </h2>

      <TabNavigation />

      <div className="grid grid-cols-3 gap-8 max-xl:grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 max-md:gap-4 mt-4 mb-16 max-md:mb-8 w-full">
        {items.map((item) => (
          <div key={item?.title} className="h-auto max-h-96 w-auto relative">
            <LgtmImage url={item?.url ?? ""} />
          </div>
        ))}
      </div>
      <Snackbar />
      <Pagination
        currentPage={page}
        totalPages={totalPage}
        basePath="/newest/pages"
      />
    </main>
  );
}
