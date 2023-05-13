/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cdn.discordapp.com"],
  },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
