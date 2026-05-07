import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en.json";
import zh from "./locales/zh.json";
import id from "./locales/id.json";
import fa from "./locales/fa.json";

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "id", label: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "fa", label: "فارسی", flag: "🇮🇷" },
] as const;

export const RTL_LANGS = ["fa"];

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        zh: { translation: zh },
        id: { translation: id },
        fa: { translation: fa },
      },
      fallbackLng: "en",
      supportedLngs: ["en", "zh", "id", "fa"],
      interpolation: { escapeValue: false },
      detection: {
        order: ["localStorage", "navigator"],
        caches: ["localStorage"],
        lookupLocalStorage: "iv-lang",
      },
    });
}

if (typeof document !== "undefined") {
  const apply = (lng: string) => {
    document.documentElement.lang = lng;
    document.documentElement.dir = RTL_LANGS.includes(lng) ? "rtl" : "ltr";
  };
  apply(i18n.language || "en");
  i18n.on("languageChanged", apply);
}

export default i18n;
