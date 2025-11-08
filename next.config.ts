import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // React Compiler (stable in Next.js 16)
  // reactCompiler: true,
  
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  allowedDevOrigins: [
    'localhost',
    '10.5.0.2',
    'rumahjajanrara.dev',
    '*.rumahjajanrara.dev',
  ],
};

export default nextConfig;
