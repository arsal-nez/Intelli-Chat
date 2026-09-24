import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "EventFlow - AI Event Discovery",
  description: "Discover events, RSVP, invite friends, and explore with AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main style={{ paddingTop: 72, minHeight: "100vh", paddingBottom: 80 }}>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
