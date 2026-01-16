/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // For development, can be optimized later
  },
  // Handle the dynamic nature of pages that use client-side hooks
  trailingSlash: false,
  basePath: "",
  // Prevents issues with static generation
  swcMinify: true,
};

module.exports = nextConfig;