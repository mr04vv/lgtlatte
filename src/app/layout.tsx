import type { Metadata } from "next";
import "./globals.css";
import {
  LgtlatteOgpDocument,
  type LgtlatteOgpQuery,
  type LgtlatteOgpQueryVariables,
} from "@/generated/schema";
import { apolloClient } from "@/lib/apolloClient";

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
      card: og.twitterCardSize as "summary" | "summary_large_image",
      site: og.twitterAccountId as string,
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
