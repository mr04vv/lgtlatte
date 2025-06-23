export const dynamic = "force-static";

import { LgtmImage } from "@/app/components/LgtmImage";
import {
  AssetCollectionDocument,
  type AssetCollectionQuery,
  type QueryAssetCollectionArgs,
} from "@/generated/schema";
import { apolloClient } from "@/lib/apolloClient";
import { Pagination } from "./components/Pagination";
import { Snackbar } from "./components/Snackbar";
import { SIZE_PER_PAGE } from "./constants/sizePerPage";

export default async function Home() {
  const res = await apolloClient.query<
    AssetCollectionQuery,
    QueryAssetCollectionArgs
  >({
    query: AssetCollectionDocument,
    variables: {
      skip: 0,
      limit: SIZE_PER_PAGE,
    },
  });

  const items = res.data.assetCollection?.items ?? [];
  const totalCount = res.data.assetCollection?.total ?? 1;
  const totalPage = Math.ceil(totalCount / SIZE_PER_PAGE);

  return (
    <main className="flex items-center m-auto flex-col max-w-[1240px] my-4  max-xl:mx-4 relative">
      <header className="my-4">
        <img src="/title.svg" alt="Vercel Logo" width={360} height={100} />
      </header>
      <h2 className="text-xl max-md:text-base">
        愛猫「らて」のLGTM画像を集めました。LGTMする際にお使いください。
      </h2>

      <div className="grid grid-cols-3 gap-8 max-xl:grid-cols-3 max-md:grid-cols-1 mt-6 mb-16">
        {items.map((item) => (
          <div key={item?.title} className="h-auto max-h-96 w-auto relative">
            <LgtmImage url={item?.url ?? ""} />
          </div>
        ))}
      </div>
      <Snackbar />
      <Pagination currentPage={1} totalPages={totalPage} />
    </main>
  );
}
