import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "images.unsplash.com",
      "assets.aceternity.com",
    ],
    // Alternatively, you can use remotePatterns for more specific control
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'res.cloudinary.com',
    //     pathname: '/dsyrwclfs/image/upload/**',
    //   },
    // ],
  },
};

export default nextConfig;
