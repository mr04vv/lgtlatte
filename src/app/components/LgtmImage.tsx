"use client";

import imageLoader from "@/lib/imageLoader";
import Image from "next/image";

export const LgtmImage = ({ url }: { url: string }) => {
  return (
    <Image
      draggable={false}
      loader={imageLoader}
      src={url}
      alt="post"
      width={1080}
      height={600}
      onClick={() => {
        navigator.clipboard.writeText(
          `![LGTM](${url}?w=540&h=540&q=80&fm=webp)`
        );
        const snackbar = document.getElementById("snackbar");
        snackbar?.classList.remove("opacity-0");
        setTimeout(() => {
          snackbar?.classList.add("opacity-0");
        }, 1500);
      }}
      className="object-contain w-full h-full hover:cursor-pointer hover:opacity-80"
    />
  );
};
