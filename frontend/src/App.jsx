import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Doctors from "./pages/Doctors";
import MyAppointments from "./pages/MyAppointments";
import NotificationBell from "./components/NotificationBell";
import { useLang } from "./i18n/LanguageContext";

export default function App() {
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");
  const { lang, setLang, t } = useLang();

  const logout = () => {
    ["token", "role", "name"].forEach((k) => localStorage.removeItem(k));
    sessionStorage.clear();
    window.location.href = "/login";
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          <div className="brand">
            <span className="brand-logo">+</span>
            {t("app_name")}
          </div>
          {!role && <NavLink to="/login" className="nav-link">{t("login")}</NavLink>}
          {!role && <NavLink to="/register" className="nav-link">{t("register")}</NavLink>}
          {role === "PATIENT" && <NavLink to="/doctors" className="nav-link">{t("doctors")}</NavLink>}
          {role === "PATIENT" && <NavLink to="/my-appointments" className="nav-link">{t("my_appointments")}</NavLink>}

          <select
            className="lang-select"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            aria-label={t("language")}
          >
            <option value="en">English</option>
            <option value="kn">ಕನ್ನಡ</option>
            <option value="hi">हिन्दी</option>
          </select>

          {role === "PATIENT" && <NotificationBell />}
          {role && <span className="user-name">{t("hi", { name })}</span>}
          {role && <button className="btn btn-light" onClick={logout}>{t("logout")}</button>}
        </div>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to={role ? "/doctors" : "/login"} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/my-appointments" element={<MyAppointments />} />
        </Routes>
      </main>
    </>
  );
}