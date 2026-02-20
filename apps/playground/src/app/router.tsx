import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { DocsLayout } from './layouts/docs-layout'
import { HomePage } from '../pages/home-page'
import { ComponentDetailPage } from '../pages/docs/component-detail-page'
import { ComponentsIndexPage } from '../pages/docs/components-index-page'
import { GettingStartedPage } from '../pages/docs/getting-started-page'
import { NotFoundPage } from '../pages/not-found-page'

export function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/docs" element={<DocsLayout />}>
          <Route index element={<Navigate to="/docs/components" replace />} />
          <Route path="getting-started" element={<GettingStartedPage />} />
          <Route path="components" element={<ComponentsIndexPage />} />
          <Route path="components/:slug" element={<ComponentDetailPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </HashRouter>
  )
}

