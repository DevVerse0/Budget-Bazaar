/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: '**.supabase.co' }],
    unoptimized: true, // Cloudflare Pages - no Vercel image optimization
  },
};
export default nextConfig;
