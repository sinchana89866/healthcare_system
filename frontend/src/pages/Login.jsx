import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useLang } from "../i18n/LanguageContext";

export default function Register() {
  const { t, te } = useLang();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      setMsg({ type: "success", text: t("reg_success") });
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      setMsg({ type: "error", text: te(err.response?.data?.error) || t("reg_failed") });
    }
  };

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={handleRegister}>
        <h2>{t("create_title")}</h2>
        <p className="page-sub">{t("register_sub")}</p>

        {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

        <div className="field">
          <label>{t("full_name")}</label>
          <input name="name" placeholder={t("name_ph")} value={form.name} onChange={handleChange} required />
        </div>
        <div className="field">
          <label>{t("email")}</label>
          <input name="email" type="email" placeholder={t("email_ph")} value={form.email} onChange={handleChange} required />
        </div>
        <div className="field">
          <label>{t("password")}</label>
          <input name="password" type="password" placeholder={t("password_new_ph")} value={form.password} onChange={handleChange} minLength={6} required />
        </div>

        <button className="btn btn-primary btn-block">{t("register_btn")}</button>

        <p className="auth-foot">
          {t("have_account")} <Link to="/login">{t("login_link")}</Link>
        </p>
      </form>
    </div>
  );
}