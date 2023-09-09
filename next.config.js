/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "avatars.githubusercontent.com",
      "vercel.com",
      "gcloud-1303456836.cos.ap-chengdu.myqcloud.com",
    ],
  },
  async redirects() {
    return [
      {
        source: "/github",
        destination: "https://github.com/yesmore/chooose",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
