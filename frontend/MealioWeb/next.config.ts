import type { NextConfig } from "next";

const nextConfig = {
  env: {
    JWT_SECRET: process.env.JWT_SECRET, // ensure this is set in your hosting environment
  },
  images: {
    domains: ['picsum.photos','i.pravatar.cc'],
   
  },
};

export default nextConfig;
