import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useLang } from "../i18n/LanguageContext";

export default function Login() {
  const { t, te } = useLang();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);
      window.location.href = "/doctors";
    } catch (err) {
      setMsg({ type: "error", text: te(err.response?.data?.error) || t("err_server") });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={handleLogin}>
        <h2>{t("welcome_back")}</h2>
        <p className="page-sub">{t("login_sub")}</p>

        {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

        <div className="field">
          <label>{t("email")}</label>
          <input
            name="email"
            type="email"
            placeholder={t("email_ph")}
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="field">
          <label>{t("password")}</label>
          <input
            name="password"
            type="password"
            placeholder={t("password_ph")}
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <button className="btn btn-primary btn-block" disabled={loading}>
          {loading ? t("logging_in") : t("login_btn")}
        </button>

        <p className="auth-foot">
          {t("new_patient")} <Link to="/register">{t("create_account")}</Link>
        </p>
      </form>
    </div>
  );
}