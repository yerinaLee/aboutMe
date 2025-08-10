import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites(){
    return[
      {
        source : '/api/:path*', //프론트엔드로 들어온 요청 주소가 /api/로 시작하면 Next.js가 요청 가로챔
        destination : 'http://localhost:8080/:path*', // 가로챈 요청을 백엔드로 보냄 - CORS 보안정책 우회 위해서
      },
    ];
  },
};

export default nextConfig;
