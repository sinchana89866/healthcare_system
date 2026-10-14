import { useEffect, useRef, useState } from "react";
import api from "../api";
import { useLang } from "../i18n/LanguageContext";

const toDate = (a) => new Date(`${a.slot.date}T${a.slot.startTime}`);
const fmtTime = (a) => a.slot.startTime.slice(0, 5);

export default function NotificationBell() {
  const { lang, t, tSpec, locale } = useLang();
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const box = useRef(null);
  const known = useRef(null);

  const fmtDate = (a) =>
    toDate(a).toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" });

  const when = (d) => {
    const now = new Date();
    const mins = Math.max(1, Math.round((d - now) / 60000));
    if (mins < 60) return t("in_min", { n: mins });
    const hours = Math.round(mins / 60);
    if (d.toDateString() === now.toDateString()) return t("today_in_hr", { n: hours });
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    if (d.toDateString() === tomorrow.toDateString()) return t("tomorrow");
    return d.toLocaleDateString(locale, { weekday: "long" });
  };

  const showToast = (text) => {
    setToast(text);
    setTimeout(() => setToast(null), 6000);
  };

  const load = async () => {
    try {
      const r = await api.get("/appointments/my");
      const upcoming = r.data
        .filter((a) => a.status === "BOOKED" && toDate(a) > new Date())
        .sort((a, b) => toDate(a) - toDate(b));
      setItems(upcoming);

      if (known.current === null) {
        if (upcoming.length > 0 && !sessionStorage.getItem("reminderShown")) {
          sessionStorage.setItem("reminderShown", "1");
          const next = upcoming[0];
          showToast(
            t("toast_summary", {
              count: upcoming.length,
              doctor: next.slot.doctor.name,
              date: fmtDate(next),
              time: fmtTime(next),
            })
          );
        }
      } else {
        const fresh = upcoming.filter((a) => !known.current.has(a.id));
        if (fresh.length > 0) {
          const a = fresh[0];
          showToast(
            t("toast_new", { doctor: a.slot.doctor.name, date: fmtDate(a), time: fmtTime(a) })
          );
        }
      }
      known.current = new Set(upcoming.map((a) => a.id));
    } catch {
      // ignore: the bell just stays as it is
    }
  };

  useEffect(() => {
    load();
    const timer = setInterval(load, 30000);
    window.addEventListener("appointments-changed", load);
    const closeOnOutsideClick = (e) => {
      if (box.current && !box.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => {
      clearInterval(timer);
      window.removeEventListener("appointments-changed", load);
      document.removeEventListener("mousedown", closeOnOutsideClick);
    };
  }, [lang]);

  return (
    <div className="bell-wrap" ref={box}>
      <button className="bell-btn" onClick={() => setOpen(!open)} aria-label={t("reminders_title")}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {items.length > 0 && <span className="bell-badge">{items.length}</span>}
      </button>

      {open && (
        <div className="bell-panel">
          <div className="bell-head">{t("reminders_title")}</div>
          {items.length === 0 && <div className="bell-empty">{t("no_upcoming")}</div>}
          <div className="bell-list">
            {items.map((a) => (
              <div
                key={a.id}
                className={`bell-item ${toDate(a) - new Date() < 24 * 3600 * 1000 ? "soon" : ""}`}
              >
                <div className="bell-item-title">{a.slot.doctor.name}</div>
                <div className="bell-item-sub">
                  {tSpec(a.slot.doctor.specialization)} · {fmtDate(a)} · {fmtTime(a)}
                </div>
                <div className="bell-item-when">{when(toDate(a))}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {toast && (
        <div className="toast" onClick={() => setToast(null)}>
          <strong>{t("toast_title")}</strong>
          <div>{toast}</div>
        </div>
      )}
    </div>
  );
}