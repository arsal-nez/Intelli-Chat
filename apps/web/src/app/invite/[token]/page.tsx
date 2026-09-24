"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";

export default function InvitePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [event, setEvent] = useState<any>(null);
  const [invite, setInvite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rsvpDone, setRsvpDone] = useState(false);
  const [error, setError] = useState("");

  const token = params.token as string;

  useEffect(() => {
    api.invites.resolve(token)
      .then((res) => { setEvent(res.data.event); setInvite(res.data.invite); setLoading(false); })
      .catch(() => { setError("Invite link not found or expired."); setLoading(false); });
  }, [token]);

  const handleAccept = async () => {
    if (!user) { router.push(`/login?redirect=/invite/${token}`); return; }
    try {
      await api.invites.acceptRsvp(token);
      setRsvpDone(true);
    } catch (err: any) {
      setError(err?.error?.message || "Failed to RSVP");
    }
  };

  if (loading) return <div className="container" style={{ paddingTop: 60, textAlign: "center" }}>Loading invite...</div>;
  if (error && !event) return <div className="container" style={{ paddingTop: 60, textAlign: "center", color: "var(--danger)" }}>{error}</div>;

  return (
    <div className="container" style={{ paddingTop: 40, maxWidth: 600, textAlign: "center" }}>
      <p style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600, marginBottom: 8 }}>You&apos;re Invited!</p>
      {event?.imageUrl && (
        <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 24, height: 240 }}>
          <img src={event.imageUrl} alt={event.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      )}
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>{event?.title}</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: 4 }}>
        {event?.venue?.name} &middot; {event?.venue?.city}
      </p>
      <p style={{ color: "var(--accent)", fontWeight: 600, marginBottom: 24 }}>
        {event?.startTime && new Date(event.startTime).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
      </p>
      {event?.description && <p style={{ color: "var(--text-secondary)", marginBottom: 32, lineHeight: 1.7 }}>{event.description}</p>}
      {error && <div style={{ color: "var(--danger)", marginBottom: 16 }}>{error}</div>}
      {rsvpDone ? (
        <div>
          <p style={{ fontSize: 20, fontWeight: 700, color: "var(--success)", marginBottom: 16 }}>You&apos;re going! See you there!</p>
          <Link href={`/events/${event?._id}`} className="btn btn-primary">View Event Details</Link>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          {user ? (
            <button className="btn btn-primary" onClick={handleAccept} style={{ padding: "14px 40px", fontSize: 16 }}>
              Accept & RSVP
            </button>
          ) : (
            <div>
              <p style={{ color: "var(--text-secondary)", marginBottom: 16 }}>Sign in to accept this invite</p>
              <Link href={`/login?redirect=/invite/${token}`} className="btn btn-primary" style={{ padding: "14px 40px", fontSize: 16 }}>
                Sign In to RSVP
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
