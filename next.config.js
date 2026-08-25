/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@browserbasehq/stagehand"],
  },
};

module.exports = nextConfig;
