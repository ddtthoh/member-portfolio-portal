import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en.json";
import zh from "./locales/zh.json";
import id from "./locales/id.json";
import fa from "./locales/fa.json";
import ar from "./locales/ar.json";
import es from "./locales/es.json";
import de from "./locales/de.json";
import tr from "./locales/tr.json";
import th from "./locales/th.json";
import vi from "./locales/vi.json";
import ko from "./locales/ko.json";
import ja from "./locales/ja.json";
import hi from "./locales/hi.json";
import it from "./locales/it.json";

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "th", label: "ไทย", flag: "🇹🇭" },
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "id", label: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "fa", label: "فارسی", flag: "🇮🇷" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
] as const;

export const RTL_LANGS = ["fa", "ar"];

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        zh: { translation: zh },
        ja: { translation: ja },
        ko: { translation: ko },
        th: { translation: th },
        vi: { translation: vi },
        id: { translation: id },
        hi: { translation: hi },
        fa: { translation: fa },
        ar: { translation: ar },
        tr: { translation: tr },
        es: { translation: es },
        it: { translation: it },
        de: { translation: de },
      },
      fallbackLng: "en",
      supportedLngs: ["en", "zh", "ja", "ko", "th", "vi", "id", "hi", "fa", "ar", "tr", "es", "it", "de"],
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
