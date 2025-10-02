/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i.pravatar.cc'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ]
  },
  "paths": {
  "@magiclabs/ui/*": ["libs/ui/src/*"]
}
};
export default nextConfig;
