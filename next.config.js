/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/all/phones?page=1',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
