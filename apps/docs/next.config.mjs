import path from 'node:path'
import { createMDX } from 'fumadocs-mdx/next'

const withMDX = createMDX()

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  experimental: {
    externalDir: true,
  },
  transpilePackages: ['@rc-lab/registry', '@rc-lab/ui'],
  webpack: (webpackConfig) => {
    webpackConfig.resolve.alias['@rc-lab/registry'] = path.resolve(
      process.cwd(),
      '../../packages/registry/src/index.ts',
    )
    webpackConfig.resolve.alias['@rc-lab/ui'] = path.resolve(process.cwd(), '../../packages/ui/src/index.ts')
    return webpackConfig
  },
}

export default withMDX(config)
