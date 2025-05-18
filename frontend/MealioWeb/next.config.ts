import type { NextConfig } from "next";

const nextConfig = {
  experimental: {
    runtime: 'edge',
  },
  env: {
    JWT_SECRET: process.env.JWT_SECRET, // ensure this is set in your hosting environment
  },
};

export default nextConfig;
