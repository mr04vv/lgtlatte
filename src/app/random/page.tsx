export const dynamic = "force-dynamic";

import { InfiniteScrollImages } from "@/app/components/InfiniteScrollImages";
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
  const apiUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  
  try {
    const response = await fetch(`${apiUrl}/api?skip=0&limit=15`, {
      headers: {
        'token': process.env.API_TOKEN || '',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch initial images:', error);
    return {
      total: 0,
      images: [],
    };
  }
}

export default async function RandomPage() {
  const data = await getInitialImages();

  return (
    <main className="max-w-6xl flex flex-col items-center min-h-screen relative">
      <header className="my-4">
        <img src="/title.svg" alt="Vercel Logo" width={360} height={100} />
      </header>
      <h2 className="text-xl max-md:text-base">
        愛猫「らて」のLGTM画像を集めました。LGTMする際にお使いください。
      </h2>
      
      <TabNavigation />
      
      <InfiniteScrollImages
        initialImages={data.images}
        initialTotal={data.total}
        apiEndpoint="/api"
      />
      
      <Snackbar />
    </main>
  );
}