"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LgtmImage } from "./LgtmImage";

interface ImageData {
  url: string;
  title: string;
  width: number;
}

interface ApiResponse {
  total: number;
  images: ImageData[];
}

interface InfiniteScrollImagesProps {
  initialImages: ImageData[];
  initialTotal: number;
  apiEndpoint: string;
  loadingThreshold?: number;
}

export const InfiniteScrollImages = ({
  initialImages,
  initialTotal,
  apiEndpoint,
  loadingThreshold = 500,
}: InfiniteScrollImagesProps) => {
  const [images, setImages] = useState<ImageData[]>(initialImages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(initialImages.length < initialTotal);
  const [skip, setSkip] = useState(initialImages.length);

  const loaderRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);

  const loadMoreImages = useCallback(async () => {
    if (isLoadingRef.current || !hasMore) return;

    isLoadingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiEndpoint}?skip=${skip}&limit=15`, {
        headers: {
          token: process.env.API_TOKEN || "",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      if (data.images.length > 0) {
        setImages((prev) => [...prev, ...data.images]);
        setSkip((prev) => prev + data.images.length);
        setHasMore(skip + data.images.length < data.total);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load images");
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  }, [apiEndpoint, skip, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoadingRef.current) {
          loadMoreImages();
        }
      },
      {
        rootMargin: `${loadingThreshold}px`,
        threshold: 0.1,
      }
    );

    const currentLoaderRef = loaderRef.current;
    if (currentLoaderRef) {
      observer.observe(currentLoaderRef);
    }

    return () => {
      if (currentLoaderRef) {
        observer.unobserve(currentLoaderRef);
      }
    };
  }, [loadMoreImages, hasMore, loadingThreshold]);

  const retryLoad = () => {
    setError(null);
    loadMoreImages();
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-8 max-xl:grid-cols-3 max-md:grid-cols-1 mt-6 mb-16">
        {images.map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            className="h-auto max-h-96 w-auto relative"
          >
            <LgtmImage url={item.url} />
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#59370F]" />
          <span className="ml-3 text-[#59370F] text-lg">Loading...</span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex flex-col items-center py-8">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            type="button"
            onClick={retryLoad}
            className="px-6 py-3 bg-[#59370F] text-[#FCF0DE] rounded-md hover:opacity-70 transition-opacity duration-300"
          >
            Retry
          </button>
        </div>
      )}

      {/* End of list indicator */}
      {!hasMore && !isLoading && (
        <div className="text-center py-8">
          <p className="text-[#59370F] text-lg">No more images to load</p>
        </div>
      )}

      {/* Intersection observer target */}
      <div ref={loaderRef} className="h-4" />
    </div>
  );
};
