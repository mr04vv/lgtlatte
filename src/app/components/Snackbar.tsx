"use client";
import { useId } from "react";

export const Snackbar = () => {
  const snackbarId = useId();
  return (
    <div
      id={snackbarId}
      className="bg-[#59370F] p-3 rounded-md text-[#FCF0DE] fixed bottom-16 max-md:bottom-10 transition-opacity duration-300 ease-in-out opacity-0"
    >
      クリップボードにコピーしました
    </div>
  );
};
