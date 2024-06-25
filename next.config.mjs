/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    loader: "custom",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
      },
    ],
  },
};

export default nextConfig;
