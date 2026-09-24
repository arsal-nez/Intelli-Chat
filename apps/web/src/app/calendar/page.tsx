"use client";
import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import EventCard from "@/components/events/EventCard";

export default function CalendarPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.events.calendar(month, year).then((res) => { setEvents(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, [month, year]);

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDow = new Date(year, month - 1, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDow }, (_, i) => i);

  const eventDays = new Set(events.map((e) => new Date(e.startTime).getDate()));
  const selectedEvents = selectedDay ? events.filter((e) => new Date(e.startTime).getDate() === selectedDay) : [];

  const prev = () => { if (month === 1) { setMonth(12); setYear(year - 1); } else setMonth(month - 1); setSelectedDay(null); };
  const next = () => { if (month === 12) { setMonth(1); setYear(year + 1); } else setMonth(month + 1); setSelectedDay(null); };
  const monthName = new Date(year, month - 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="container" style={{ paddingTop: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
        <button className="btn btn-outline" onClick={prev} style={{ padding: "8px 16px" }}>Prev</button>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>{monthName}</h1>
        <button className="btn btn-outline" onClick={next} style={{ padding: "8px 16px" }}>Next</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 32 }}>
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
          <div key={d} style={{ textAlign: "center", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", padding: 8 }}>{d}</div>
        ))}
        {blanks.map((b) => <div key={`b-${b}`} />)}
        {days.map((day) => {
          const hasEvent = eventDays.has(day);
          const isSelected = selectedDay === day;
          return (
            <button key={day} onClick={() => setSelectedDay(day)} style={{
              padding: 12, borderRadius: 12, border: "none", fontSize: 14, fontWeight: isSelected ? 700 : 500,
              background: isSelected ? "var(--accent)" : hasEvent ? "var(--accent-light)" : "transparent",
              color: isSelected ? "white" : hasEvent ? "var(--accent)" : "var(--text)",
              cursor: hasEvent ? "pointer" : "default",
              position: "relative",
            }}>
              {day}
              {hasEvent && !isSelected && <span style={{ position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)", width: 5, height: 5, borderRadius: "50%", background: "var(--accent)" }} />}
            </button>
          );
        })}
      </div>
      {selectedDay && (
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
            Events on {monthName.split(" ")[0]} {selectedDay}
          </h2>
          {selectedEvents.length === 0 ? (
            <p style={{ color: "var(--text-muted)" }}>No events on this day.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {selectedEvents.map((e) => <EventCard key={e._id} event={e} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
