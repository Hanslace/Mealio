import type { NextConfig } from "next";

const nextConfig = {
  env: {
    JWT_SECRET: process.env.JWT_SECRET, // ensure this is set in your hosting environment
  },
};

export default nextConfig;
