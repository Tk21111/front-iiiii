import i18n from 'i18next';
import Backend from 'i18next-http-backend'; // Updated name for the backend loader
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

i18n
  .use(Backend) // Load translations from a backend server
  .use(LanguageDetector) // Detect the user's language
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .init({
    fallbackLng: 'en', // Default language
    debug: true, // Enable debugging in development
    ns: ['translations'], // Specify namespaces
    defaultNS: 'translations', // Default namespace
    interpolation: {
      escapeValue: false, // React handles escaping by default
    },
  });

export default i18n;
