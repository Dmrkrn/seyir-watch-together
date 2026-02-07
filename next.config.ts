import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'seyir-watch-together.vercel.app',
          },
        ],
        destination: 'https://seyir.cagridemirkiran.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
