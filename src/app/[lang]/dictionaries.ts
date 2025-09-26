import 'server-only'
 
const dictionaries = {
  en: () => import('../../common/dictionaries/en.json').then((module) => module.default),
  nl: () => import('../../common/dictionaries/nl.json').then((module) => module.default),
  ar: () => import('../../common/dictionaries/ar.json').then((module) => module.default),
}
 
export const getDictionary = async (locale: 'en' | 'nl' | 'ar') =>
  // dictionaries[locale]()
  // check locale exists in dictionaries
  dictionaries[locale] ? dictionaries[locale]() : null