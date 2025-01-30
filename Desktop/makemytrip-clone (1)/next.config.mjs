/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  // Add this rewrites configuration
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://platform.edusession.live/easy2trip/api/:path*',
      }
    ]
  }
};

export default nextConfig;