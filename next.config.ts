import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 외부 이미지(언스플래시·Vercel Blob)를 next/image로 최적화 허용
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
