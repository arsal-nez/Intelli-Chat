const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function request(path: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: any = { "Content-Type": "application/json", ...options.headers };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw { status: res.status, ...data };
  return data;
}

export const api = {
  auth: {
    register: (body: { name: string; email: string; password: string }) =>
      request("/api/auth/register", { method: "POST", body: JSON.stringify(body) }),
    login: (body: { email: string; password: string }) =>
      request("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),
    me: () => request("/api/auth/me"),
  },
  events: {
    list: (params?: Record<string, string>) => {
      const qs = params ? "?" + new URLSearchParams(params).toString() : "";
      return request(`/api/events${qs}`);
    },
    get: (id: string) => request(`/api/events/${id}`),
    calendar: (month: number, year: number) =>
      request(`/api/events/calendar?month=${month}&year=${year}`),
  },
  rsvp: {
    create: (eventId: string) =>
      request(`/api/events/${eventId}/rsvp`, { method: "POST" }),
    cancel: (eventId: string) =>
      request(`/api/events/${eventId}/rsvp`, { method: "DELETE" }),
    myRsvps: () => request("/api/events/me/rsvps"),
  },
  invites: {
    create: (eventId: string) =>
      request(`/api/events/${eventId}/invites`, { method: "POST" }),
    resolve: (token: string) => request(`/api/invites/${token}`),
    acceptRsvp: (token: string) =>
      request(`/api/invites/${token}/rsvp`, { method: "POST" }),
    stats: (eventId: string) => request(`/api/events/${eventId}/invites/stats`),
  },
  reminders: {
    create: (eventId: string, reminderTime: string) =>
      request(`/api/events/${eventId}/reminders`, { method: "POST", body: JSON.stringify({ reminderTime }) }),
    list: () => request("/api/me/reminders"),
  },
  chat: {
    send: (message: string, conversationId?: string) =>
      request("/api/chat", { method: "POST", body: JSON.stringify({ message, conversationId }) }),
  },
};
