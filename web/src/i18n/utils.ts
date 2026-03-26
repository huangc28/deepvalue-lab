import type { LocalizedText, Locale } from './types'

export function resolveLocalizedText(value: LocalizedText, locale: Locale) {
  if (!value) {
    return ''
  }
  if (typeof value === 'string') {
    return value
  }

  return value[locale] ?? value.en
}

export function flattenLocalizedText(value: LocalizedText) {
  if (!value) {
    return ''
  }
  if (typeof value === 'string') {
    return value
  }

  return Object.values(value).join(' ')
}
