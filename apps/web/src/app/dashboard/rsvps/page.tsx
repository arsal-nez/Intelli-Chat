"use client";
import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import EventCard from "@/components/events/EventCard";
import Link from "next/link";

export default function MyEventsPage() {
  const { user, loading: authLoading } = useAuth();
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    api.rsvp.myRsvps().then((res) => { setRsvps(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, [user]);

  if (authLoading) return <div className="container" style={{ paddingTop: 40 }}>Loading...</div>;
  if (!user) return (
    <div className="container" style={{ paddingTop: 60, textAlign: "center" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Sign in to see your events</h2>
      <Link href="/login" className="btn btn-primary">Sign In</Link>
    </div>
  );

  return (
    <div className="container" style={{ paddingTop: 32 }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 24 }}>My Events</h1>
      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>Loading your events...</p>
      ) : rsvps.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <p style={{ color: "var(--text-muted)", marginBottom: 16 }}>You haven&apos;t RSVPed to any events yet.</p>
          <Link href="/events" className="btn btn-primary">Discover Events</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
          {rsvps.map((rsvp) => {
            const event = rsvp.eventId;
            if (!event) return null;
            return <EventCard key={rsvp._id} event={event} rsvpStatus="confirmed" />;
          })}
        </div>
      )}
    </div>
  );
}
