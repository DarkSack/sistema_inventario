/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_PROJECT_URL: process.env.NEXT_PUBLIC_PROJECT_URL,
    NEXT_PUBLIC_APIKEY: process.env.NEXT_PUBLIC_APIKEY,
  },
};

export default nextConfig;
