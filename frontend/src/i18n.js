import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import zh from './locales/zh.json';

const savedLng = localStorage.getItem('language') || 'en';

i18n
.use(initReactI18next)
.init({
  resources: {
    en: {translation: en},
    zh: {translation: zh}
  },
  lng: savedLng, // default language
  fallbackLng: 'en',
  interpolation: {escapeValue: false}
}).then();

export default i18n;