/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/.well-known/farcaster.json',
        destination: 'https://api.farcaster.xyz/miniapps/hosted-manifest/https://api.farcaster.xyz/miniapps/hosted-manifest/0198f2fb-df63-03fe-8a9a-1e9e45728e4fD',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
