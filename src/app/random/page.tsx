export const dynamic = "force-dynamic";

import { RandomImages } from "@/app/components/RandomImages";
import { Snackbar } from "@/app/components/Snackbar";
import { TabNavigation } from "@/app/components/TabNavigation";

interface ImageData {
  url: string;
  title: string;
  width: number;
}

interface ApiResponse {
  total: number;
  images: ImageData[];
}

async function getInitialImages(): Promise<ApiResponse> {
  const apiUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${apiUrl}/api?skip=0&limit=15`, {
      headers: {
        token: process.env.API_TOKEN || "",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch initial images:", error);
    return {
      total: 0,
      images: [],
    };
  }
}

export default async function RandomPage() {
  const data = await getInitialImages();

  return (
    <main className="flex items-center m-auto flex-col max-w-[1240px] my-6 max-xl:mx-4 max-md:mx-2 relative">
      <header className="my-4">
        <img src="/title.svg" alt="Vercel Logo" width={360} height={100} />
      </header>
      <h2 className="text-xl max-md:text-base">
        愛猫「らて」のLGTM画像を集めました。LGTMする際にお使いください。
      </h2>

      <TabNavigation />

      <RandomImages initialImages={data.images} />

      <Snackbar />
    </main>
  );
}
