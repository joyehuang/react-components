import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'Vibe Components',
    },
    links: [
      {
        text: '首页',
        url: '/',
      },
      {
        text: '组件',
        url: '/docs/components',
        active: 'nested-url',
      },
      {
        text: '快速开始',
        url: '/docs/quick-start',
        active: 'nested-url',
      },
      {
        text: 'CLI 安装',
        url: '/docs/cli-installation',
        active: 'nested-url',
      },
      {
        text: '关于项目',
        url: '/docs/about',
        active: 'nested-url',
      },
    ],
  }
}
