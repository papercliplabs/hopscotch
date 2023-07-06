module.exports = {
  // Disbaled because it's not working with the new version of Rainbow Kit
  swcMinify: false,
  // compress: false,
  // productionBrowserSourceMaps: true,
  images: {
    domains: ['assets.coingecko.com', "raw.githubusercontent.com", "cloudflare-ipfs.com"],
  },
  async redirects() {
    return [
      {
        source: '/request/:path*',
        destination: '/r/:path*',
        permanent: true,
      },
    ]
  },
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
};
