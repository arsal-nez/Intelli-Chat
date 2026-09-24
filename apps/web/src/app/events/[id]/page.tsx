"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";

export default function EventDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState<any>(null);
  const [rsvp, setRsvp] = useState<any>(null);
  const [inviteStats, setInviteStats] = useState<any>(null);
  const [inviteLink, setInviteLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const eventId = params.id as string;

  useEffect(() => {
    api.events.get(eventId).then((res) => { setEvent(res.data); setLoading(false); }).catch(() => setLoading(false));
    if (user) {
      api.rsvp.myRsvps().then((res) => {
        const myRsvp = res.data.find((r: any) => (r.eventId?._id || r.eventId) === eventId);
        if (myRsvp) setRsvp(myRsvp);
      }).catch(() => {});
      api.invites.stats(eventId).then((res) => setInviteStats(res.data)).catch(() => {});
    }
  }, [eventId, user]);

  const handleRsvp = async () => {
    if (!user) { window.location.href = "/login"; return; }
    try {
      const res = await api.rsvp.create(eventId);
      setRsvp(res.data);
    } catch {}
  };

  const handleCancelRsvp = async () => {
    try {
      await api.rsvp.cancel(eventId);
      setRsvp(null);
      setInviteStats(null);
      setInviteLink("");
    } catch {}
  };

  const handleInvite = async () => {
    try {
      const res = await api.invites.create(eventId);
      const token = res.data.token;
      const link = `${window.location.origin}/invite/${token}`;
      setInviteLink(link);
      const stats = await api.invites.stats(eventId);
      setInviteStats(stats.data);
    } catch {}
  };

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="container" style={{ paddingTop: 40, color: "var(--text-muted)" }}>Loading...</div>;
  if (!event) return <div className="container" style={{ paddingTop: 40 }}>Event not found.</div>;

  const date = new Date(event.startTime);

  return (
    <div className="container" style={{ paddingTop: 32, maxWidth: 800 }}>
      {event.imageUrl && (
        <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 24, height: 360 }}>
          <img src={event.imageUrl} alt={event.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      )}
      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        {event.category && <span className="badge badge-accent">{event.category}</span>}
        {rsvp?.status === "confirmed" && <span className="badge badge-success">You&apos;re Going!</span>}
      </div>
      <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8, letterSpacing: "-0.5px" }}>{event.title}</h1>
      <div style={{ display: "flex", gap: 24, marginBottom: 16, color: "var(--text-secondary)", fontSize: 15, flexWrap: "wrap" }}>
        <span>{event.venue?.name}, {event.venue?.city}</span>
        <span>{date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
        <span>{date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</span>
      </div>
      {event.description && <p style={{ marginBottom: 24, lineHeight: 1.7, color: "var(--text-secondary)" }}>{event.description}</p>}

      <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
        {rsvp?.status === "confirmed" ? (
          <>
            <button className="btn btn-danger" onClick={handleCancelRsvp}>Cancel RSVP</button>
            <button className="btn btn-primary" onClick={handleInvite}>Invite Friends</button>
          </>
        ) : (
          <button className="btn btn-primary" onClick={handleRsvp} style={{ padding: "12px 32px", fontSize: 16 }}>
            RSVP Now
          </button>
        )}
        {event.ticketUrl && (
          <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
            Get Tickets
          </a>
        )}
      </div>

      {inviteLink && (
        <div style={{ background: "var(--accent-light)", borderRadius: 12, padding: 20, marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: "var(--accent)" }}>Share with Friends</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <input className="input" value={inviteLink} readOnly style={{ flex: 1, fontSize: 13 }} />
            <button className="btn btn-primary" onClick={copyLink}>{copied ? "Copied!" : "Copy"}</button>
          </div>
        </div>
      )}

      {inviteStats && (inviteStats.clickCount > 0 || inviteStats.friendCount > 0) && (
        <div style={{ display: "flex", gap: 24, marginBottom: 24 }}>
          <div style={{ background: "white", borderRadius: 12, padding: 20, flex: 1, textAlign: "center", border: "1px solid var(--border)" }}>
            <p style={{ fontSize: 32, fontWeight: 800, color: "var(--accent)" }}>{inviteStats.clickCount}</p>
            <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Link Clicks</p>
          </div>
          <div style={{ background: "white", borderRadius: 12, padding: 20, flex: 1, textAlign: "center", border: "1px solid var(--border)" }}>
            <p style={{ fontSize: 32, fontWeight: 800, color: "var(--success)" }}>{inviteStats.friendCount}</p>
            <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Friends Attending</p>
          </div>
        </div>
      )}
    </div>
  );
}
