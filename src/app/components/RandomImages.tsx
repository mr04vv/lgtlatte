"use client";

import { useState } from "react";
import { LgtmImage } from "./LgtmImage";

interface ImageData {
  url: string;
  title: string;
  width: number;
}

interface RandomImagesProps {
  initialImages: ImageData[];
}

export const RandomImages = ({ initialImages }: RandomImagesProps) => {
  const [images, setImages] = useState<ImageData[]>(initialImages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const regenerateImages = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api?skip=0&limit=15", {
        headers: {
          token: process.env.NEXT_PUBLIC_API_TOKEN || "",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setImages(data.images || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load images");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-8 max-xl:grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 max-md:gap-4 mt-4 mb-8 w-full">
        {images.map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            className="h-auto max-h-96 w-auto relative"
          >
            <LgtmImage url={item.url} />
          </div>
        ))}
      </div>

      {/* Regenerate Button */}
      <div className="flex justify-center mb-16 max-md:mb-8">
        <button
          type="button"
          onClick={regenerateImages}
          disabled={isLoading}
          className={`rounded-md text-[#FCF0DE] text-xl px-8 py-4 flex items-center justify-center transition-opacity duration-300 ease-in-out ${
            isLoading
              ? "bg-[#51381f4d] opacity-50 cursor-not-allowed"
              : "bg-[#59370F] hover:opacity-70"
          }`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#FCF0DE] border-t-transparent mr-2" />
              読み込み中...
            </>
          ) : (
            "再生成"
          )}
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex flex-col items-center py-8">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            type="button"
            onClick={regenerateImages}
            className="px-6 py-3 bg-[#59370F] text-[#FCF0DE] rounded-md hover:opacity-70 transition-opacity duration-300"
          >
            再試行
          </button>
        </div>
      )}
    </div>
  );
};
