/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    pageDataCollectionTimeout: 10000, // Aumenta el tiempo de espera seg�n sea necesario
  },
};

module.exports = nextConfig;
