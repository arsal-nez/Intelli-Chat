"use client";
import React from "react";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) return <div className="container" style={{ paddingTop: 40 }}>Loading...</div>;
  if (!user) return (
    <div className="container" style={{ paddingTop: 60, textAlign: "center" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Sign in to view your profile</h2>
      <Link href="/login" className="btn btn-primary">Sign In</Link>
    </div>
  );

  return (
    <div className="container" style={{ paddingTop: 32, maxWidth: 600 }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 32 }}>Profile</h1>
      <div style={{ background: "white", borderRadius: 16, padding: 32, border: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%", background: "var(--accent-light)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, fontWeight: 700, color: "var(--accent)",
          }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700 }}>{user.name}</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>{user.email}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/dashboard/rsvps" className="btn btn-secondary">My Events</Link>
          <Link href="/chat" className="btn btn-secondary">AI Chat</Link>
        </div>
      </div>
    </div>
  );
}
