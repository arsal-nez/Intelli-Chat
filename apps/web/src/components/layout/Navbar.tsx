"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";

const navStyle: React.CSSProperties = {
  position: "fixed", top: 0, left: 0, right: 0, height: 64,
  background: "white", borderBottom: "1px solid var(--border)", zIndex: 100,
  display: "flex", alignItems: "center", padding: "0 24px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
};

const logoStyle: React.CSSProperties = {
  fontSize: 22, fontWeight: 800, color: "var(--accent)",
  letterSpacing: "-0.5px",
};

const linksStyle: React.CSSProperties = {
  display: "flex", gap: 24, marginLeft: 48, alignItems: "center",
};

const linkStyle: React.CSSProperties = {
  fontSize: 14, fontWeight: 500, color: "var(--text-secondary)",
  transition: "color 0.2s",
};

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={navStyle}>
      <Link href="/" style={logoStyle}>EventFlow</Link>
      <div style={linksStyle}>
        <Link href="/events" style={linkStyle}>Discover</Link>
        <Link href="/calendar" style={linkStyle}>Calendar</Link>
        {user && <Link href="/dashboard/rsvps" style={linkStyle}>My Events</Link>}
        {user && <Link href="/chat" style={linkStyle}>AI Chat</Link>}
      </div>
      <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
        {user ? (
          <>
            <Link href="/profile" style={{ ...linkStyle, fontWeight: 600, color: "var(--text)" }}>
              {user.name}
            </Link>
            <button onClick={logout} className="btn btn-outline" style={{ padding: "6px 14px", fontSize: 13 }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="btn btn-outline" style={{ padding: "6px 14px", fontSize: 13 }}>Login</Link>
            <Link href="/register" className="btn btn-primary" style={{ padding: "6px 14px", fontSize: 13 }}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
