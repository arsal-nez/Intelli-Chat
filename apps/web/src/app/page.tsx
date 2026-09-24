"use client";
import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import EventCard from "@/components/events/EventCard";
import Link from "next/link";

export default function HomePage() {
  const [events, setEvents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.events.list().then((res) => { setEvents(res.data.events); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.events.list(search ? { keyword: search } : {});
      setEvents(res.data.events);
    } catch {} finally { setLoading(false); }
  };

  return (
    <div className="container" style={{ paddingTop: 40 }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h1 style={{ fontSize: 48, fontWeight: 800, marginBottom: 12, letterSpacing: "-1px" }}>
          Discover Amazing Events
        </h1>
        <p style={{ fontSize: 18, color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto 32px" }}>
          Find events, RSVP with friends, and never miss out on what matters.
        </p>
        <form onSubmit={handleSearch} style={{ display: "flex", gap: 8, maxWidth: 520, margin: "0 auto" }}>
          <input
            className="input"
            placeholder="Search events... try &quot;music&quot; or &quot;comedy&quot;"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, padding: "14px 20px", fontSize: 16, borderRadius: 12 }}
          />
          <button type="submit" className="btn btn-primary" style={{ borderRadius: 12, padding: "14px 28px" }}>
            Search
          </button>
        </form>
        <div style={{ marginTop: 16, display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          {["Music", "Sports", "Comedy", "Festival", "Food"].map((cat) => (
            <button key={cat} className="btn btn-secondary" style={{ padding: "6px 16px", fontSize: 13 }}
              onClick={() => { setSearch(cat); api.events.list({ category: cat }).then((res) => setEvents(res.data.events)); }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Upcoming Events</h2>
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
          {[1,2,3,4].map((i) => (
            <div key={i} style={{ background: "#f1f5f9", borderRadius: 16, height: 300, animation: "pulse 1.5s infinite" }} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "var(--text-muted)" }}>
          <p style={{ fontSize: 48, marginBottom: 16 }}>No events found</p>
          <p>Try a different search or check back later.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
          {events.map((event) => <EventCard key={event._id} event={event} />)}
        </div>
      )}
    </div>
  );
}
