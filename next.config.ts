import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  i18n: {
    locales: ['en', 'vi'],
    defaultLocale: 'vi',
    localeDetection: false
  }
  /* config options here */
};

export default nextConfig;
