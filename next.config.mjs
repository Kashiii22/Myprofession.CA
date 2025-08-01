/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i.pravatar.cc'],
  },
  "paths": {
  "@magiclabs/ui/*": ["libs/ui/src/*"]
}
};
export default nextConfig;
