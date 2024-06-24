import { apolloClient } from "@/lib/apolloClient";
import {
  AssetCollectionDocument,
  AssetCollectionQuery,
  QueryAssetCollectionArgs,
} from "@/generated/schema";
import { LgtmImage } from "@/app/components/LgtmImage";
import { SIZE_PER_PAGE } from "./constants/sizePerPage";
import { Snackbar } from "./components/Snackbar";

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

  //   const items = [
  //     "https://blog.mooriii.com/ogps/bruno-cognito-auth.png",
  //     "https://blog.mooriii.com/ogps/bruno-cognito-auth.png",
  //     "https://blog.mooriii.com/ogps/bruno-cognito-auth.png",
  //     "https://latte-images.mooriii.com/baa515b9-3958-4693-b1a1-f56351a6e21c.webp",
  //     "https://blog.mooriii.com/ogps/bruno-cognito-auth.png",
  //     "https://blog.mooriii.com/ogps/bruno-cognito-auth.png",
  //     "https://blog.mooriii.com/ogps/bruno-cognito-auth.png",
  //     "https://blog.mooriii.com/ogps/bruno-cognito-auth.png",
  //     "https://blog.mooriii.com/ogps/bruno-cognito-auth.png",
  //     "https://latte-images.mooriii.com/baa515b9-3958-4693-b1a1-f56351a6e21c.webp",
  //     "https://latte-images.mooriii.com/baa515b9-3958-4693-b1a1-f56351a6e21c.webp",
  //     "https://blog.mooriii.com/ogps/bruno-cognito-auth.png",
  //     "https://blog.mooriii.com/ogps/bruno-cognito-auth.png",
  //   ];

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
