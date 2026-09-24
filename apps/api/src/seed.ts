import { Event } from "./database/models/event.model";

const mockEvents = [
  {
    source: "mock", sourceId: "mock-1", title: "Summer Jazz Festival",
    description: "An evening of smooth jazz under the stars with top performers from around the world.",
    category: "Music", imageUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800",
    ticketUrl: "https://example.com/tickets/jazz", venue: { name: "Central Park Amphitheater", address: "Central Park West", city: "New York", country: "US", latitude: 40.785091, longitude: -73.968285 },
    startTime: new Date(Date.now() + 2 * 86400000), endTime: new Date(Date.now() + 2 * 86400000 + 14400000), timezone: "America/New_York", status: "active",
  },
  {
    source: "mock", sourceId: "mock-2", title: "Tech Innovators Conference 2026",
    description: "Join industry leaders for talks on AI, cloud computing, and the future of technology.",
    category: "Conference", imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
    ticketUrl: "https://example.com/tickets/tech", venue: { name: "Moscone Center", address: "747 Howard St", city: "San Francisco", country: "US", latitude: 37.7849, longitude: -122.4004 },
    startTime: new Date(Date.now() + 5 * 86400000), endTime: new Date(Date.now() + 6 * 86400000), timezone: "America/Los_Angeles", status: "active",
  },
  {
    source: "mock", sourceId: "mock-3", title: "Stand-Up Comedy Night",
    description: "Laugh out loud with the funniest comedians in the city. Featuring surprise guest performers.",
    category: "Comedy", imageUrl: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800",
    ticketUrl: "https://example.com/tickets/comedy", venue: { name: "The Laugh Factory", address: "8001 Sunset Blvd", city: "Los Angeles", country: "US", latitude: 34.0984, longitude: -118.3643 },
    startTime: new Date(Date.now() + 1 * 86400000), endTime: new Date(Date.now() + 1 * 86400000 + 10800000), timezone: "America/Los_Angeles", status: "active",
  },
  {
    source: "mock", sourceId: "mock-4", title: "NBA Finals Watch Party",
    description: "Watch the NBA Finals on the big screen with fellow fans. Food trucks and giveaways!",
    category: "Sports", imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800",
    ticketUrl: "https://example.com/tickets/nba", venue: { name: "Barclays Center Plaza", address: "620 Atlantic Ave", city: "Brooklyn", country: "US", latitude: 40.6826, longitude: -73.9754 },
    startTime: new Date(Date.now() + 3 * 86400000), endTime: new Date(Date.now() + 3 * 86400000 + 14400000), timezone: "America/New_York", status: "active",
  },
  {
    source: "mock", sourceId: "mock-5", title: "Indie Art & Music Festival",
    description: "A celebration of independent artists and musicians across multiple stages and galleries.",
    category: "Festival", imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800",
    ticketUrl: "https://example.com/tickets/indie", venue: { name: "Austin Convention Center", address: "500 E Cesar Chavez St", city: "Austin", country: "US", latitude: 30.2635, longitude: -97.7399 },
    startTime: new Date(Date.now() + 7 * 86400000), endTime: new Date(Date.now() + 9 * 86400000), timezone: "America/Chicago", status: "active",
  },
  {
    source: "mock", sourceId: "mock-6", title: "Food & Wine Tasting Gala",
    description: "Sample exquisite dishes from top chefs paired with fine wines from around the world.",
    category: "Food", imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
    ticketUrl: "https://example.com/tickets/food", venue: { name: "The Grand Ballroom", address: "1 E Wacker Dr", city: "Chicago", country: "US", latitude: 41.8868, longitude: -87.6251 },
    startTime: new Date(Date.now() + 4 * 86400000), endTime: new Date(Date.now() + 4 * 86400000 + 18000000), timezone: "America/Chicago", status: "active",
  },
  {
    source: "mock", sourceId: "mock-7", title: "Electronic Dance Music Night",
    description: "Experience the best DJs spinning tracks all night long. Light shows and immersive visuals.",
    category: "Music", imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800",
    ticketUrl: "https://example.com/tickets/edm", venue: { name: "Warehouse District", address: "200 Main St", city: "Miami", country: "US", latitude: 25.7617, longitude: -80.1918 },
    startTime: new Date(Date.now() + 6 * 86400000), endTime: new Date(Date.now() + 6 * 86400000 + 21600000), timezone: "America/New_York", status: "active",
  },
  {
    source: "mock", sourceId: "mock-8", title: "Yoga & Wellness Retreat",
    description: "A full day of yoga sessions, meditation, and wellness workshops led by certified instructors.",
    category: "Wellness", imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
    ticketUrl: "https://example.com/tickets/yoga", venue: { name: "Serenity Gardens", address: "1234 Pacific Coast Hwy", city: "Malibu", country: "US", latitude: 34.0259, longitude: -118.7798 },
    startTime: new Date(Date.now() + 10 * 86400000), endTime: new Date(Date.now() + 10 * 86400000 + 28800000), timezone: "America/Los_Angeles", status: "active",
  },
];

export async function seedEvents() {
  for (const evt of mockEvents) {
    await Event.updateOne(
      { source: evt.source, sourceId: evt.sourceId },
      { $set: evt },
      { upsert: true }
    );
  }
  console.log(`Seeded ${mockEvents.length} mock events`);
}
