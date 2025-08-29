/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/.well-known/farcaster.json',
        destination: 'https://api.farcaster.xyz/miniapps/hosted-manifest/0198f30c-2098-b590-4320-fa990ff1a919',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
