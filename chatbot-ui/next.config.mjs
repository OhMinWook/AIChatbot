/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '192.168.100.100',
        port: '50080',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
