import i18n from 'i18next';
import vi from './locales/vi/translation.json';
import en from './locales/en/translation.json';
import {initReactI18next} from 'react-i18next';

export const resources = {
  vi: {
    translation: vi,
  },
  en: {
    translation: en,
  },
} as const;

i18n.use(initReactI18next).init({
  lng: 'vi',
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
  resources,
});

export default i18n