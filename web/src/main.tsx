import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'

import './index.css'
import { I18nProvider } from './i18n/provider'
import { router } from './router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <RouterProvider router={router} />
    </I18nProvider>
  </StrictMode>,
)
