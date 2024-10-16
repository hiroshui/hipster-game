import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from "../locales/en.json"
import de from '../locales/de.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    de: { translation: de }
  },
  lng: 'en', // Standard-Sprache
  fallbackLng: 'en', // Fallback auf Englisch, falls eine Übersetzung fehlt
  interpolation: { escapeValue: false } // keine Sonderzeichen-Escape nötig
});

export default i18n;
