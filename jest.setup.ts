import '@testing-library/jest-dom'

import mockMessages from './messages/ko.json'

jest.mock('next-intl', () => {
  const messages = mockMessages

  function resolveMessage(namespace: string | undefined, key: string) {
    const path = namespace ? `${namespace}.${key}` : key

    return path.split('.').reduce<unknown>((current, segment) => {
      if (current && typeof current === 'object' && segment in (current as Record<string, unknown>)) {
        return (current as Record<string, unknown>)[segment]
      }

      return undefined
    }, messages)
  }

  function formatMessage(template: string, values?: Record<string, unknown>) {
    if (!values) return template

    return template.replace(/\{(\w+)\}/g, (_, token) => String(values[token] ?? `{${token}}`))
  }

  return {
    useTranslations: (namespace?: string) => {
      const t = (key: string, values?: Record<string, unknown>) => {
        const message = resolveMessage(namespace, key)
        if (typeof message !== 'string') {
          return namespace ? `${namespace}.${key}` : key
        }
        return formatMessage(message, values)
      }

      t.rich = (key: string, values?: Record<string, unknown>) => t(key, values)

      return t
    },
    useLocale: () => 'ko',
    NextIntlClientProvider: ({ children }: { children: unknown }) => children,
  }
})
