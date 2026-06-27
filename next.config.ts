import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 백오피스에서 임의 이미지 URL을 넣을 수 있어 모든 https 호스트 허용
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
