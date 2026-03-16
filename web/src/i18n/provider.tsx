import {
  startTransition,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { I18nContext, type I18nContextValue } from './context'
import { messages } from './messages'
import type { Locale } from './types'
import { resolveLocalizedText } from './utils'

const STORAGE_KEY = 'deepvalue-lab.locale'

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === 'undefined') {
      return 'en'
    }

    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored === 'zh-TW' ? 'zh-TW' : 'en'
  })

  useEffect(() => {
    document.documentElement.lang = locale === 'zh-TW' ? 'zh-Hant-TW' : 'en'
    document.documentElement.dataset.locale = locale
    window.localStorage.setItem(STORAGE_KEY, locale)
  }, [locale])

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale: (nextLocale) => {
        startTransition(() => {
          setLocaleState(nextLocale)
        })
      },
      m: messages[locale],
      text: (value) => resolveLocalizedText(value, locale),
    }),
    [locale],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
