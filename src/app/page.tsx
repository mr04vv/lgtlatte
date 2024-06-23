import { apolloClient } from "@/lib/apolloClient";
import {
  AssetCollectionDocument,
  AssetCollectionQuery,
  QueryAssetCollectionArgs,
} from "@/generated/schema";
import { LgtmImage } from "@/app/components/LgtmImage";
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
