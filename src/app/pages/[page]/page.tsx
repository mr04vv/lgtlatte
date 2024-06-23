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
    <main>
      <div>
        {items.map((item) => (
          <div
            style={{
              display: "block",
              position: "relative",
              width: "500px",
              height: "300px",
            }}
          >
            <LgtmImage url={item?.url ?? ""} />
          </div>
        ))}
      </div>
    </main>
  );
}
