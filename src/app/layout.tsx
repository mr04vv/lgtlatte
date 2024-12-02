import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { apolloClient } from "@/lib/apolloClient";
import {
  LgtlatteOgpDocument,
  LgtlatteOgpQuery,
  LgtlatteOgpQueryVariables,
} from "@/generated/schema";

export async function generateMetadata(): Promise<Metadata> {
  const res = await apolloClient.query<
    LgtlatteOgpQuery,
    LgtlatteOgpQueryVariables
  >({
    query: LgtlatteOgpDocument,
    variables: {
      id: process.env.CONTENTFUL_OGP_ENTRY_ID ?? "",
    },
  });

  const og = res.data.lgtlatteOgp;
  if (!og) return {};
  return {
    icons: {
      icon: og.favicon?.url ?? "",
    },
    title: og.title,
    description: og.description,
    openGraph: {
      url: og.url ?? "",
      title: og.title ?? "",
      description: og.description ?? "",
      siteName: og.title ?? "",
      images: [og.image?.url ?? ""],
    },
    twitter: {
      card: og.twitterCardSize as any,
      site: og.twitterAccountId as any,
      images: [og.image?.url ?? ""],
      title: og.title ?? "",
      description: og.description ?? "",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <meta http-equiv="content-language" content="ja" />
      <meta charSet="utf-8" />
      <body className={"flex flex-col items-center mb-2 bg-[#FCF0DE] mx-2"}>
        {children}
      </body>
    </html>
  );
}
