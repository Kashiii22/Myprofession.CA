/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i.pravatar.cc'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // <-- ADDED THIS
      },
    ]
  },
  "paths": {
  "@magiclabs/ui/*": ["libs/ui/src/*"]
}
};
export default nextConfig;