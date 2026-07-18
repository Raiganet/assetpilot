/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Mengabaikan error ESLint saat build production
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Mengabaikan error TypeScript saat build production
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;