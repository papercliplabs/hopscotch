module.exports = {
  // Disbaled because it's not working with the new version of Rainbow Kit
  swcMinify: false,
  // compress: false,
  // productionBrowserSourceMaps: true,
  async redirects() {
    return [
      {
        source: '/request/:path*',
        destination: '/r/:path*',
        permanent: true,
      },
    ]
  },
};
