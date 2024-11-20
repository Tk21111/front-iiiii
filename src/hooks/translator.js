import i18n from 'i18next';

/**
 * Switches the language between English (en) and Thai (th).
 */
export const switchLanguage = () => {
  const currentLanguage = i18n.language; // Get current language
  const newLanguage = currentLanguage === 'en' ? 'th' : 'en';
  i18n.changeLanguage(newLanguage); // Change language
};

/**
 * Translates a given key using i18next.
 * @param {string} key - The key to translate.
 * @param {object} options - Optional parameters for translation (e.g., placeholders).
 * @returns {string} - Translated text.
 */
export const translate = (key, options = {}) => {
  return i18n.t(key, options);
};
