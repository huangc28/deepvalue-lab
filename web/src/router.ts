import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'

import { AppShell } from './components/app-shell'
import { DashboardPage } from './pages/dashboard-page'
import { StockDetailRoutePage } from './pages/stock-detail-route-page'

const rootRoute = createRootRoute({
  component: AppShell,
})

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
})

const stockDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/stocks/$ticker',
  component: StockDetailRoutePage,
})

const routeTree = rootRoute.addChildren([dashboardRoute, stockDetailRoute])

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
