import { apolloClient } from "@/lib/apolloClient";
import { LgtmImage } from "./components/LgtmImage";
import {
  AssetCollectionDocument,
  Query,
  QueryAssetCollectionArgs,
} from "@/generated/schema";

export default async function Home() {
  const res = await apolloClient.query<Query, QueryAssetCollectionArgs>({
    query: AssetCollectionDocument,
    variables: {
      skip: 0,
      limit: 20,
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
