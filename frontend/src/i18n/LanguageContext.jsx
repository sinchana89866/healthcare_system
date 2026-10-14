import { createContext, useContext, useState } from "react";
import translations from "./translations";

const LOCALES = { en: "en-IN", kn: "kn-IN", hi: "hi-IN" };

const SERVER_ERRORS = {
  "Email already registered": "err_email_exists",
  "Invalid email or password": "err_invalid_login",
  "Slot already booked": "err_slot_booked",
  "Not your appointment": "err_not_yours",
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(localStorage.getItem("lang") || "en");

  const setLang = (l) => {
    localStorage.setItem("lang", l);
    setLangState(l);
  };

  const t = (key, vars = {}) => {
    let text = translations[lang]?.[key] ?? translations.en[key] ?? key;
    Object.keys(vars).forEach((k) => {
      text = text.split(`{${k}}`).join(vars[k]);
    });
    return text;
  };

  const te = (msg) => {
    if (!msg) return undefined;
    return SERVER_ERRORS[msg] ? t(SERVER_ERRORS[msg]) : msg;
  };

  const tSpec = (s) => translations[lang]?.[`spec.${s}`] ?? s;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, te, tSpec, locale: LOCALES[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);