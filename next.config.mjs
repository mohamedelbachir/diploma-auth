/** @type {import('next').NextConfig} */
const nextConfig = {
  future: { webpack5: true },
  webpack: (config, {}) => {
    config.resolve.alias.canvas = false
    config.resolve.alias.encoding = false
    return config
  },
  experimental: {
    serverComponentsExternalPackages: ['pdf-qr','pdf2json'],
  },
}

export default nextConfig
