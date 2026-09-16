/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_PILOT_NAME: process.env.NEXT_PUBLIC_PILOT_NAME,
  },
}

module.exports = nextConfig
