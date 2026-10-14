import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useLang } from "../i18n/LanguageContext";

const formatDate = (d, locale) =>
  new Date(d + "T00:00:00").toLocaleDateString(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const formatTime = (t) => t.slice(0, 5);

export default function MyAppointments() {
  const { t, tSpec, locale } = useLang();
  const [list, setList] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const load = () =>
    api.get("/appointments/my").then((r) => {
      setList(r.data);
      setLoaded(true);
    });

  useEffect(() => {
    load();
  }, []);

  const cancel = async (id) => {
    if (!window.confirm(t("confirm_cancel"))) return;
    await api.put(`/appointments/${id}/cancel`);
    window.dispatchEvent(new Event("appointments-changed"));
    load();
  };

  return (
    <div>
      <h1 className="page-title">{t("my_appointments")}</h1>
      <p className="page-sub">{t("appts_sub")}</p>

      {loaded && list.length === 0 && (
        <div className="card empty">
          {t("no_appts")} <Link to="/doctors">{t("find_doctor")}</Link>
        </div>
      )}

      {[...list].reverse().map((a) => (
        <div key={a.id} className="appt-card">
          <div>
            <div className="appt-doctor">{a.slot.doctor.name}</div>
            <div className="appt-meta">
              {tSpec(a.slot.doctor.specialization)} · {formatDate(a.slot.date, locale)} · {formatTime(a.slot.startTime)}
            </div>
          </div>
          <div className="appt-right">
            <span className={`status status-${a.status}`}>{t(`status.${a.status}`)}</span>
            {a.status === "BOOKED" && (
              <button className="btn btn-danger" onClick={() => cancel(a.id)}>
                {t("cancel")}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}