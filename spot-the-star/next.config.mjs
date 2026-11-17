/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true },
  // content/*.json is read at runtime (fs) so packs can be added without code changes
  outputFileTracingIncludes: { "/**": ["./content/**/*"] },
};
export default nextConfig;
