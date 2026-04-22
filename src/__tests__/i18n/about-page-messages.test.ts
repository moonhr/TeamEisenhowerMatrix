import deMessages from '../../../messages/de.json'
import enGbMessages from '../../../messages/en-GB.json'
import enMessages from '../../../messages/en.json'
import frMessages from '../../../messages/fr.json'
import jaMessages from '../../../messages/ja.json'
import koMessages from '../../../messages/ko.json'
import { APP_LOCALES } from '@/types'

const localeMessages = {
  ko: koMessages,
  en: enMessages,
  'en-GB': enGbMessages,
  ja: jaMessages,
  fr: frMessages,
  de: deMessages,
} as const

const requiredPaths = [
  'HomeFooter.title',
  'HomeFooter.links.about',
  'AboutPage.title',
  'AboutPage.originCard.title',
  'AboutPage.storyTitle',
  'AboutPage.stories.meeting.title',
  'AboutPage.principlesTitle',
  'AboutPage.invitationFooter',
]

function readPath(source: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((current, segment) => {
    if (current && typeof current === 'object' && segment in (current as Record<string, unknown>)) {
      return (current as Record<string, unknown>)[segment]
    }

    return undefined
  }, source)
}

describe('about page locale messages', () => {
  it.each(APP_LOCALES)('%s locale has the required about page and footer keys', (locale) => {
    const messages = localeMessages[locale] as Record<string, unknown>

    requiredPaths.forEach((path) => {
      expect(readPath(messages, path)).toEqual(expect.any(String))
    })
  })
})
