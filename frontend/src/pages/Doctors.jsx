import { useEffect, useState } from "react";
import api from "../api";
import { useLang } from "../i18n/LanguageContext";

const initials = (name) =>
  name
    .replace(/^Dr\.?\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const formatDate = (d, locale) =>
  new Date(d + "T00:00:00").toLocaleDateString(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const formatTime = (t) => t.slice(0, 5);

export default function Doctors() {
  const { t, te, tSpec, locale } = useLang();
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selected, setSelected] = useState(null);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    api.get("/doctors").then((r) => setDoctors(r.data));
  }, []);

  const showSlots = async (doctor) => {
    setSelected(doctor);
    const r = await api.get(`/doctors/${doctor.id}/slots`);
    setSlots(r.data);
  };

  const selectDoctor = (doctor) => {
    setMsg(null);
    showSlots(doctor);
  };

  const book = async (slotId) => {
    try {
      await api.post("/appointments", { slotId });
      window.dispatchEvent(new Event("appointments-changed"));
      setMsg({ type: "success", text: t("booked_msg") });
      showSlots(selected);
    } catch (e) {
      setMsg({ type: "error", text: te(e.response?.data?.error) || t("booking_failed") });
    }
  };

  return (
    <div>
      <h1 className="page-title">{t("our_doctors")}</h1>
      <p className="page-sub">{t("doctors_sub")}</p>

      <div className="grid">
        {doctors.map((d) => (
          <div key={d.id} className={`doctor-card ${selected?.id === d.id ? "selected" : ""}`}>
            <div className="doctor-top">
              <div className="avatar">{initials(d.name)}</div>
              <div>
                <div className="doctor-name">{d.name}</div>
                <span className="badge">{tSpec(d.specialization)}</span>
              </div>
            </div>
            <button className="btn btn-outline" onClick={() => selectDoctor(d)}>
              {t("view_slots")}
            </button>
          </div>
        ))}
      </div>

      {selected && (
        <div className="card">
          <h3 className="slots-title">{t("slots_for", { name: selected.name })}</h3>

          {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

          {slots.length === 0 && <p className="appt-meta">{t("no_slots")}</p>}

          <div className="slot-list">
            {slots.map((s) => (
              <div key={s.id} className="slot">
                <span className="slot-date">{formatDate(s.date, locale)}</span>
                <span className="slot-time">{formatTime(s.startTime)}</span>
                <button className="btn btn-primary" onClick={() => book(s.id)}>
                  {t("book")}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}