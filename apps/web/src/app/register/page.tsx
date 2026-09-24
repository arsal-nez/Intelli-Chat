"use client";
import React, { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(name, email, password);
      router.push("/");
    } catch (err: any) {
      setError(err?.error?.message || "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: 400, margin: "60px auto", padding: "0 16px" }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Create account</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: 32 }}>Join EventFlow and discover amazing events</p>
      {error && <div style={{ background: "#fef2f2", color: "var(--danger)", padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 14 }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <input className="input" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="input" type="password" placeholder="Password (min 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        <button className="btn btn-primary" type="submit" disabled={loading} style={{ padding: "12px", fontSize: 16 }}>
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>
      <p style={{ marginTop: 24, textAlign: "center", color: "var(--text-secondary)", fontSize: 14 }}>
        Already have an account? <Link href="/login" style={{ color: "var(--accent)", fontWeight: 600 }}>Sign in</Link>
      </p>
    </div>
  );
}
