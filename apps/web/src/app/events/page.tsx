"use client";
import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import EventCard from "@/components/events/EventCard";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (keyword) params.keyword = keyword;
      if (city) params.city = city;
      if (category) params.category = category;
      const res = await api.events.list(params);
      setEvents(res.data.events);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchEvents(); }, []);

  return (
    <div className="container" style={{ paddingTop: 32 }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 24 }}>Discover Events</h1>
      <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
        <input className="input" placeholder="Keyword" value={keyword} onChange={(e) => setKeyword(e.target.value)} style={{ maxWidth: 200 }} />
        <input className="input" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} style={{ maxWidth: 200 }} />
        <select className="input" value={category} onChange={(e) => setCategory(e.target.value)} style={{ maxWidth: 180 }}>
          <option value="">All Categories</option>
          <option value="Music">Music</option>
          <option value="Sports">Sports</option>
          <option value="Comedy">Comedy</option>
          <option value="Conference">Conference</option>
          <option value="Festival">Festival</option>
          <option value="Food">Food</option>
          <option value="Wellness">Wellness</option>
        </select>
        <button className="btn btn-primary" onClick={fetchEvents}>Filter</button>
      </div>
      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>Loading events...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
          {events.map((event) => <EventCard key={event._id} event={event} />)}
        </div>
      )}
      {!loading && events.length === 0 && (
        <p style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>No events match your filters.</p>
      )}
    </div>
  );
}
