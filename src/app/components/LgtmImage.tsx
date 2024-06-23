"use client";

import imageLoader from "@/lib/imageLoader";
import Image from "next/image";

export const LgtmImage = ({ url }: { url: string }) => {
  return (
    <Image
      loader={imageLoader}
      src={url}
      alt="post"
      sizes="100vw"
      fill
      style={{
        width: "100%",
      }}
    />
  );
};
