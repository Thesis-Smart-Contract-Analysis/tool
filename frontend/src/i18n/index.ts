import i18n from 'i18next';

import { initReactI18next } from 'react-i18next';

import translationEN from '@/locals/en/translation.json';
import translationVI from '@/locals/vi/translation.json';

export const resources = {
  en: {
    translation: translationEN,
  },
  vi: {
    translation: translationVI,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'vi',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
