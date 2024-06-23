"use client";

import imageLoader from "@/lib/imageLoader";
import Image from "next/image";

export const LgtmImage = ({ url }: { url: string }) => {
  return (
    <Image
      loader={imageLoader}
      src={url}
      alt="post"
      width={1080}
      height={900}
      className="object-contain w-full h-full"
    />
  );
};
