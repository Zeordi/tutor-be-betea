/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@tutor/ui", "@tutor/utils", "@tutor/types", "@tutor/validators"],
};

module.exports = nextConfig;