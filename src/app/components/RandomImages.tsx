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
  const [isFirstLoad, setIsFirstLoad] = useState(true);

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
      setIsFirstLoad(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load images");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Regenerate Button - Above Grid */}
      <div className="flex justify-center mb-6">
        <button
          type="button"
          onClick={regenerateImages}
          disabled={isLoading}
          className={`rounded-md text-[#FCF0DE] text-xl max-md:text-lg px-8 py-4 max-md:px-6 max-md:py-3 flex items-center justify-center transition-all duration-300 ease-in-out transform ${
            isLoading
              ? "bg-[#51381f4d] opacity-50 cursor-not-allowed scale-95"
              : "bg-[#59370F] hover:opacity-70 hover:scale-105 shadow-lg hover:shadow-xl"
          }`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#FCF0DE] border-t-transparent mr-3" />
              <span className="animate-pulse">読み込み中...</span>
            </>
          ) : (
            <span className="font-medium">
              {isFirstLoad ? "新しい画像を表示" : "再生成"}
            </span>
          )}
        </button>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-20 z-10 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-2xl flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#59370F] border-t-transparent" />
            <span className="text-[#59370F] text-lg font-medium">
              新しい画像を読み込み中...
            </span>
          </div>
        </div>
      )}

      {/* Image Grid with Animation */}
      <div
        className={`grid grid-cols-3 gap-8 max-xl:grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 max-md:gap-4 mb-16 max-md:mb-8 w-full transition-all duration-500 ease-in-out ${
          isLoading ? "opacity-60 scale-95" : "opacity-100 scale-100"
        }`}
      >
        {images.map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            className="h-auto max-h-96 w-auto relative transform transition-all duration-300 ease-in-out hover:scale-105"
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            <LgtmImage url={item.url} />
          </div>
        ))}
      </div>

      {/* Error state */}
      {error && (
        <div className="flex flex-col items-center py-8 animate-fade-in">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full text-center">
            <p className="text-red-700 text-lg mb-4 font-medium">{error}</p>
            <button
              type="button"
              onClick={regenerateImages}
              className="px-6 py-3 bg-[#59370F] text-[#FCF0DE] rounded-md hover:opacity-70 transition-all duration-300 transform hover:scale-105"
            >
              再試行
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
