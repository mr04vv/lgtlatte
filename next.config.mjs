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
  output: "export",
};

export default nextConfig;
