"use client";
import React from "react";
import Link from "next/link";

interface Props {
  event: any;
  rsvpStatus?: string;
  friendCount?: number;
}

const cardStyle: React.CSSProperties = {
  background: "white", borderRadius: 16, overflow: "hidden",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
  transition: "box-shadow 0.2s, transform 0.2s",
};

export default function EventCard({ event, rsvpStatus, friendCount }: Props) {
  const date = new Date(event.startTime);
  const dateStr = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const timeStr = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  return (
    <Link href={`/events/${event._id}`} style={{ textDecoration: "none" }}>
      <div style={cardStyle} className="card">
        <div style={{ position: "relative", height: 180, background: "#f1f5f9" }}>
          {event.imageUrl && (
            <img
              src={event.imageUrl}
              alt={event.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
          {event.category && (
            <span className="badge badge-accent" style={{
              position: "absolute", top: 12, left: 12,
            }}>
              {event.category}
            </span>
          )}
          {rsvpStatus === "confirmed" && (
            <span className="badge badge-success" style={{
              position: "absolute", top: 12, right: 12,
            }}>
              Going
            </span>
          )}
        </div>
        <div style={{ padding: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, lineHeight: 1.3 }}>
            {event.title}
          </h3>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>
            {event.venue?.name} &middot; {event.venue?.city}
          </p>
          <p style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600 }}>
            {dateStr} &middot; {timeStr}
          </p>
          {typeof friendCount === "number" && friendCount > 0 && (
            <p style={{ fontSize: 12, color: "var(--success)", fontWeight: 600, marginTop: 8 }}>
              {friendCount} friend{friendCount > 1 ? "s" : ""} attending
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
