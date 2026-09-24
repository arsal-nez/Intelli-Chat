



Intelli-Chat — EventFlow
AI-assisted event discovery and social planning platform built as a TypeScript monorepo with Next.js, Express, MongoDB, JWT authentication, RSVP workflows, invite attribution, reminders, and an event assistant interface.








Overview
EventFlow is a full-stack web application for discovering upcoming events, planning attendance, inviting friends, and querying event information through a conversational assistant.

The repository is organized as a pnpm monorepo with independently runnable frontend and backend applications plus a shared package. The current implementation provides an end-to-end MVP workflow:

A user creates an account or signs in.

The frontend receives a JWT access token and uses it for authenticated API calls.

Users discover events through keyword, category, city, date, and calendar views.

Users open an event detail page and RSVP.

Confirmed attendees can create a shareable invite link for friends.

Invite recipients can resolve the event and accept the RSVP after signing in.

The system records invite attribution and basic invite analytics.

Users can create and view event reminders.

The Event Assistant accepts natural-language-style queries, maps supported phrases to database tools, and renders event results directly in the chat UI.

Implementation note: the current chat backend uses deterministic intent classification and internal database tools. An LLM provider is not currently invoked by chat.routes.ts; the LLM_API_KEY environment variable is present as a configuration hook for future integration.

Product Capabilities
🔐 Authentication
User registration with name, email, and password.

Password hashing with bcryptjs.

JWT access and refresh token generation.

Protected API routes through Bearer-token authentication.

Client-side auth state managed with a React context.

🔎 Event Discovery
Keyword search.

Category filtering.

City filtering.

Start/end date filtering through the API.

Paginated event retrieval.

Calendar-based month navigation.

Event detail pages with venue, date, time, description, imagery, and ticket links.

✅ RSVP Management
RSVP to an event.

Cancel an RSVP.

Re-confirm a previously cancelled RSVP.

View the user's confirmed RSVPs.

Duplicate RSVP protection at the database level.

🔗 Social Invites
Generate an event-specific invitation link after RSVP.

Resolve an invitation without authentication.

Invite acceptance requires authentication.

Prevent users from accepting their own invite.

Track invite clicks.

Track confirmed friends attributed to the inviter.

⏰ Reminders
Create event reminders for an authenticated user.

Retrieve pending reminders ordered by reminder time.

The current repository contains reminder persistence and retrieval APIs. It does not yet contain a scheduler/worker that automatically sends or marks reminders as delivered.

💬 Event Assistant
The /chat experience is a conversational interface for event-related queries. Current supported flows include:

Search/find/show events by supported category and city phrases.

Retrieve the signed-in user's upcoming RSVPs.

Persist conversations and messages in MongoDB.

Store tool execution results alongside assistant messages.

Render matching event cards inside the conversation.

The current backend recognizes intent using keyword-based rules rather than an LLM orchestration layer. This makes the feature deterministic and easy to extend while leaving a clear seam for a future LLM/tool-calling implementation.

Architecture
flowchart TD
    U[Browser / User]

    subgraph WEB[apps/web — Next.js + React]
        UI[EventFlow UI]
        AUTH[AuthContext]
        API_CLIENT[Typed API wrapper]
    end

    subgraph API[apps/api — Express + TypeScript]
        ROUTES[HTTP Routes]
        MW[JWT Auth Middleware]
        SERVICES[Domain Modules]
        CHAT[Intent Classifier + Tool Router]
        MODELS[Mongoose Models]
    end

    DB[(MongoDB)]

    U --> UI
    UI --> AUTH
    UI --> API_CLIENT
    API_CLIENT --> ROUTES
    ROUTES --> MW
    ROUTES --> SERVICES
    SERVICES --> MODELS
    CHAT --> MODELS
    MODELS --> DB

    ENV[Environment Configuration] --> WEB
    ENV --> API
Runtime request flow
Browser
  │
  ├── Next.js frontend :3000
  │       │
  │       └── fetch() + Bearer JWT
  │
  └──────────────► Express API :4000
                        │
                        ├── Authentication / authorization
                        ├── Event discovery
                        ├── RSVP + invite workflows
                        ├── Reminder persistence
                        └── Chat intent → database tool execution
                                   │
                                   ▼
                              MongoDB
Repository Structure
Intelli-Chat/
├── apps/
│   ├── web/                       # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/               # App Router pages
│   │   │   │   ├── page.tsx       # Home / event discovery
│   │   │   │   ├── events/        # Event listing + event detail
│   │   │   │   ├── calendar/      # Calendar view
│   │   │   │   ├── chat/          # Event Assistant
│   │   │   │   ├── invite/        # Invite resolution + RSVP
│   │   │   │   ├── dashboard/     # User's events
│   │   │   │   ├── login/         # Authentication UI
│   │   │   │   ├── register/      # Registration UI
│   │   │   │   └── profile/       # User profile
│   │   │   ├── components/        # Reusable React components
│   │   │   └── lib/               # API client + auth context
│   │   └── package.json
│   │
│   └── api/                       # Express backend
│       ├── src/
│       │   ├── config/            # Environment configuration
│       │   ├── database/          # MongoDB connection + Mongoose models
│       │   ├── middleware/        # JWT middleware + error handling
│       │   ├── modules/
│       │   │   ├── auth/          # Registration/login/me
│       │   │   ├── events/        # Event search/detail/calendar
│       │   │   ├── rsvp/          # RSVP operations
│       │   │   ├── invites/       # Invite links + attribution
│       │   │   ├── reminders/     # Reminder persistence
│       │   │   └── chat/          # Chat + intent/tool routing
│       │   └── seed.ts            # Mock event seed data
│       └── package.json
│
├── packages/
│   └── shared/                    # Shared package boundary
│       └── src/
│
├── .env.example                   # Environment variable template
├── package.json                   # Root workspace scripts
├── pnpm-workspace.yaml             # pnpm workspace definition
└── pnpm-lock.yaml                  # Locked dependency graph
Tech Stack
Layer	Technology	Responsibility
Frontend	Next.js 15	Application framework and routing
UI	React 19	Interactive user interface
Language	TypeScript 5.7	Static typing across frontend/backend
Backend	Express 4	REST API and middleware pipeline
Database	MongoDB	Persistent application data
ODM	Mongoose 8	MongoDB schemas, indexes, and queries
Authentication	JWT + bcryptjs	Token-based auth and password hashing
Validation	Zod	Schema validation dependency available in API
Package Manager	pnpm	Monorepo/workspace management
Runtime	Node.js 18+	Local development and server runtime
Data Model
User
Stores authentication and profile information.

User
├── name
├── email (unique)
├── passwordHash
├── avatarUrl?
├── city?
├── timezone?
└── preferences
    ├── categories[]
    └── notificationsEnabled
Event
Represents an event sourced from a provider or mock seed.

Event
├── source
├── sourceId (unique with source)
├── title
├── description?
├── category?
├── imageUrl?
├── ticketUrl?
├── venue
│   ├── name
│   ├── address?
│   ├── city
│   ├── country?
│   ├── latitude?
│   └── longitude?
├── startTime
├── endTime?
├── timezone?
├── status
└── lastSyncedAt?
Indexes currently support source identity, event chronology, and city/time-based discovery.

RSVP
Connects users and events with a status lifecycle.

RSVP
├── userId
├── eventId
├── status: confirmed | cancelled
├── inviteId?
└── referredByUserId?
A unique (userId, eventId) index prevents duplicate RSVP records.

InviteLink
Stores the shareable invite token and referral analytics.

InviteLink
├── token (unique)
├── eventId
├── ownerUserId
├── clickCount
├── uniqueClickCount
└── expiresAt?
Reminder
Stores reminder intent for a user/event pair.

Reminder
├── userId
├── eventId
├── reminderTime
└── status: pending | sent | cancelled
Conversation / Message
Stores chat history and tool execution results.

Conversation
├── userId
├── title
└── timestamps

Message
├── conversationId
├── role: user | assistant | system
├── content
├── toolCalls?
└── timestamp
Authentication Flow
Register / Login
       │
       ▼
Express auth route
       │
       ├── Validate required fields
       ├── bcrypt password verification / hashing
       └── Sign JWT access + refresh tokens
       │
       ▼
Frontend localStorage
       │
       ▼
Authorization: Bearer <accessToken>
       │
       ▼
JWT middleware
       │
       ▼
req.userId
       │
       ▼
Protected route
Authentication endpoints
Method	Endpoint	Auth	Purpose
POST	/api/auth/register	No	Create a user and return tokens
POST	/api/auth/login	No	Authenticate an existing user
GET	/api/auth/me	Yes	Return current user
The backend currently issues a refresh token, but the exposed route set does not include a refresh-token endpoint. The frontend currently stores only the access token and does not implement automatic token refresh.

API Reference
All API responses follow the application's general envelope pattern:

{
  "success": true,
  "data": {}
}
Errors generally follow:

{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  }
}
Health
Method	Endpoint	Description
GET	/api/health	API health/status probe
Events
Method	Endpoint	Description
GET	/api/events	List active events with filters and pagination
GET	/api/events/calendar	Return active events for a month/year
GET	/api/events/:id	Return a single event
Supported /api/events query parameters currently include:

keyword
category
city
startDate
endDate
page
limit
limit is capped at 50 by the backend.

RSVPs
Method	Endpoint	Auth	Description
POST	/api/events/:eventId/rsvp	Yes	Create or restore an RSVP
DELETE	/api/events/:eventId/rsvp	Yes	Cancel an RSVP
GET	/api/events/me/rsvps	Yes	List current user's confirmed RSVPs
Invites
Method	Endpoint	Auth	Description
POST	/api/events/:eventId/invites	Yes	Create or return the attendee's invite link
GET	/api/invites/:token	No	Resolve invite token and event
POST	/api/invites/:token/rsvp	Yes	Accept an invite and RSVP
GET	/api/events/:eventId/invites/stats	Yes	Return invite click/friend counts
Reminders
Method	Endpoint	Auth	Description
POST	/api/events/:eventId/reminders	Yes	Create a reminder
GET	/api/me/reminders	Yes	List pending reminders
Chat
Method	Endpoint	Auth	Description
POST	/api/chat	Yes	Process an assistant message and return tool-backed results
Example request:

curl -X POST http://localhost:4000/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -d '{"message":"Find music events in New York"}'
Event Assistant: Current Tooling
The current backend exposes three internal chat tools:

Tool	Purpose
search_events	Search active events by keyword/category/city
get_event	Fetch an event by MongoDB ID
get_my_rsvps	Retrieve the signed-in user's confirmed RSVPs
The classifier currently recognizes broad phrases such as find, search, show, and what for event search, plus phrases such as my events, my rsvp, and upcoming for personal RSVP retrieval.

Recommended LLM evolution
A future implementation can preserve the current tool contracts while replacing the keyword classifier with an LLM-based router/function-calling layer:

User Message
     │
     ▼
LLM / Intent Router
     │
     ├── search_events(args)
     ├── get_event(eventId)
     ├── get_my_rsvps()
     └── future tools
          ├── create_reminder()
          ├── recommend_events()
          └── invite_friend()
This would make the assistant more robust to natural language while keeping business actions behind explicit tool boundaries.

Local Development
Prerequisites
Node.js 18 or newer

pnpm

MongoDB running locally or a reachable MongoDB deployment

Git

1. Clone the repository
git clone https://github.com/arsal-nez/Intelli-Chat.git
cd Intelli-Chat
2. Install pnpm
Using Corepack:

corepack enable
corepack prepare pnpm@latest --activate
Verify:

node --version
pnpm --version
3. Install dependencies
pnpm install
4. Configure the API
Create:

apps/api/.env
Use .env.example as the starting point:

NODE_ENV=development
PORT=4000
WEB_ORIGIN=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/eventflow
JWT_ACCESS_SECRET=change-me-access-secret
JWT_REFRESH_SECRET=change-me-refresh-secret
TICKETMASTER_API_KEY=
LLM_API_KEY=
For a real environment, replace all development secrets with strong, unique values.

5. Configure the frontend
Create:

apps/web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:4000
6. Start MongoDB
Make sure MongoDB is running and reachable at the configured MONGODB_URI.

7. Start the full application
From the repository root:

pnpm dev
This starts:

Frontend → http://localhost:3000
API      → http://localhost:4000
The API connects to MongoDB and seeds eight mock events on startup.

Run services independently
Frontend only:

pnpm dev:web
API only:

pnpm dev:api
Build and Quality Checks
Production build
pnpm build
Type checking
pnpm typecheck
Lint
pnpm lint
The current package manifests expose lint commands, but the reviewed frontend/backend lint scripts are placeholders rather than full ESLint configurations. This is an area for production hardening.

Environment Variables
Variable	Service	Required	Purpose
NODE_ENV	API	No	Runtime environment
PORT	API	No	Express port; defaults to 4000
WEB_ORIGIN	API	No	Allowed frontend origin for CORS
MONGODB_URI	API	Yes for persistent DB	MongoDB connection string
JWT_ACCESS_SECRET	API	Yes for secure deployment	Access-token signing secret
JWT_REFRESH_SECRET	API	Yes for secure deployment	Refresh-token signing secret
TICKETMASTER_API_KEY	API	Currently optional	Reserved event-provider integration configuration
LLM_API_KEY	API	Currently optional	Reserved/future LLM integration configuration
NEXT_PUBLIC_API_URL	Web	Yes	API base URL used by the browser
Secret management
Do not commit .env or .env.local files to source control. Use the environment/secret-management facilities provided by the deployment platform for production secrets.

Seed Data
The API seeds 8 mock events when the server starts. The seed uses deterministic source/sourceId identities with MongoDB upserts, allowing the seed to be rerun without creating duplicate event records.

The seeded categories include:

Music

Conference

Comedy

Sports

Festival

Food

Wellness

For a production deployment, replace the seed layer with a proper ingestion/synchronization workflow against an event provider or first-party event management system.

Frontend Routes
Route	Purpose
/	Event discovery landing page
/events	Search/filter events
/events/:id	Event detail + RSVP + invites
/calendar	Monthly event calendar
/chat	Event Assistant
/invite/:token	Resolve and accept a friend invite
/dashboard/rsvps	User's confirmed events
/profile	Basic user profile
/login	Sign in
/register	Create account
Core User Journeys
Journey 1 — Discover and RSVP
Home / Discover
      ↓
Search / Filter
      ↓
Event Detail
      ↓
RSVP Now
      ↓
Authenticated API
      ↓
RSVP persisted in MongoDB
      ↓
My Events
Journey 2 — Invite a Friend
Confirmed RSVP
      ↓
Invite Friends
      ↓
Generate random invite token
      ↓
Share /invite/<token>
      ↓
Friend opens invite
      ↓
Optional sign-in / redirect
      ↓
Accept & RSVP
      ↓
RSVP stores referral attribution
      ↓
Inviter sees click + friend metrics
Journey 3 — Ask the Event Assistant
User query
   ↓
POST /api/chat
   ↓
Intent classification
   ↓
Tool execution
   ↓
MongoDB query
   ↓
Assistant response + tool result
   ↓
Event cards rendered in chat UI
Security Considerations
The current implementation includes several useful baseline controls:

Password hashing with bcryptjs.

JWT verification for protected routes.

Unique constraints for user email, RSVP pairs, and invite tokens.

CORS configured around an explicit frontend origin.

Password hashes excluded from the /api/auth/me response.

Production hardening recommended
Before production use, consider:

Move JWT storage out of localStorage and adopt secure, HTTP-only cookie-based sessions where appropriate.

Implement refresh-token rotation/revocation and an actual refresh endpoint.

Add input validation at route boundaries using the available Zod dependency.

Add rate limiting to authentication and high-value API routes.

Add structured logging and request IDs for observability and debugging.

Add security headers and a hardened CORS policy.

Validate and normalize query/date inputs before database operations.

Add authorization checks around resource ownership where business rules require them.

Add automated unit/integration tests for auth, RSVP idempotency, invites, and chat tools.

Add background jobs for reminder delivery, event synchronization, and cleanup/expiry workflows.

Replace development fallback secrets in env.ts with fail-fast production configuration.

Testing Strategy
A production-oriented test suite should cover at least:

Unit tests
Intent classification rules.

Token creation/verification utilities.

RSVP state transitions.

Invite attribution logic.

Event filtering logic.

Integration tests
Registration and login.

Protected route authorization.

Event search and pagination.

RSVP create/cancel/reconfirm.

Invite resolution and invite-based RSVP.

Chat tool execution.

End-to-end tests
Register → discover → RSVP → invite → accept invite.

Login → My Events → event detail.

Login → Chat → search events → open event detail.

Observability and Operational Readiness
The current API logs basic startup/database events. For a production environment, a mature deployment should additionally expose:

Health and readiness checks.

Structured JSON logs.

Request/response timing metrics.

Error tracking.

Database performance monitoring.

Authentication failure monitoring.

Product metrics for search, RSVPs, invite conversion, and assistant usage.

Suggested business/product metrics include:

Event Search Success Rate
Event Detail → RSVP Conversion
Invite Click-through Rate
Invite → RSVP Conversion
Reminder Creation Rate
Assistant Query Success Rate
Assistant Tool Invocation Rate
Daily / Weekly Active Users
Deployment Model
The repository is naturally suited to a split deployment model:

                       ┌─────────────────────┐
                       │     Web Browser     │
                       └──────────┬──────────┘
                                  │
                         HTTPS / Public Web
                                  │
                       ┌──────────▼──────────┐
                       │  Next.js Deployment │
                       │     apps/web        │
                       └──────────┬──────────┘
                                  │
                              REST / HTTPS
                                  │
                       ┌──────────▼──────────┐
                       │ Express API Server  │
                       │      apps/api       │
                       └──────────┬──────────┘
                                  │
                              MongoDB
                                  │
                       ┌──────────▼──────────┐
                       │ Managed MongoDB /   │
                       │      cluster       │
                       └─────────────────────┘
Recommended production separation:

Frontend: Next.js-compatible hosting.

API: Node.js/container/serverless-compatible Express hosting.

Database: Managed MongoDB.

Secrets: Platform secret manager.

Monitoring: centralized logs + error tracking + metrics.

Current Limitations
This section intentionally documents gaps between the current MVP and a production-grade platform.

Chat intelligence is currently rule-based rather than LLM-powered.

LLM_API_KEY is configured but not consumed by the current chat route.

TICKETMASTER_API_KEY is configured but the current startup data source is the local mock seed.

Reminder records are persisted, but no delivery worker/scheduler is implemented.

Refresh tokens are generated but a refresh endpoint is not currently exposed.

Frontend auth currently stores the access token in browser localStorage.

Route validation and automated tests need expansion.

Lint scripts are currently placeholders.

The repository does not currently declare a license file.

Being explicit about these constraints keeps the repository documentation aligned with the implementation and gives a clear roadmap for future iterations.

Roadmap
Phase 1 — Production foundations
Add centralized request validation.

Add robust error taxonomy and structured logging.

Add test coverage and CI.

Harden authentication/token handling.

Add Docker-based local development.

Phase 2 — Real event data
Integrate Ticketmaster or another event provider.

Add scheduled synchronization.

Deduplicate and reconcile changed/cancelled events.

Add provider-specific rate-limit/error handling.

Phase 3 — LLM assistant
Replace keyword intent classification with an LLM/tool-calling layer.

Add model/provider configuration.

Add conversational context and controlled tool permissions.

Add evaluation datasets for intent accuracy and tool-call correctness.

Phase 4 — Intelligent planning
Personalized recommendations.

Reminder scheduling through a background worker.

Calendar export/integration.

Better invite and social-discovery analytics.

Semantic search and recommendation ranking.

Development Conventions
Branching
Use short-lived feature branches:

main
├── feature/<name>
├── fix/<name>
└── chore/<name>
Commit style
Prefer descriptive commits such as:

feat: add invite attribution workflow
fix: prevent duplicate RSVP creation
refactor: isolate event search service
chore: update workspace dependencies
Pull requests
A good pull request should include:

What changed and why.

API or data-model changes.

UI screenshots for visual changes.

Validation/testing performed.

Migration or environment-variable notes when applicable.

Contributing
Fork the repository.

Create a feature branch.

Install dependencies with pnpm install.

Add or update tests for behavior changes.

Run pnpm typecheck and pnpm lint.

Build the project with pnpm build before opening a PR.

Submit a focused pull request with clear context.

Troubleshooting
API cannot connect to MongoDB
Verify MongoDB is running and that MONGODB_URI is correct.

mongosh "mongodb://localhost:27017/eventflow"
Frontend cannot reach the API
Verify:

NEXT_PUBLIC_API_URL=http://localhost:4000
and that the API is listening on port 4000.

CORS errors
Check that the API's WEB_ORIGIN exactly matches the frontend origin:

WEB_ORIGIN=http://localhost:3000
Authentication unexpectedly fails
Check the browser's stored token, verify JWT_ACCESS_SECRET is stable for the running API process, and inspect the API response for UNAUTHORIZED.

Port already in use
Use another API port and update the frontend environment variable accordingly:

PORT=4001
NEXT_PUBLIC_API_URL=http://localhost:4001
License
No license file is currently declared in the repository. Add an explicit license (for example, MIT) before presenting the project as open source or accepting external contributions under defined reuse terms.

Project Metadata
Repository: https://github.com/arsal-nez/Intelli-Chat

Application name: EventFlow

Package/workspace name: eventflow

Frontend: apps/web

Backend: apps/api

Shared package: @eventflow/shared

Minimum Node.js: 18

Author
MD Arsalan

GitHub: https://github.com/arsal-nez

LinkedIn: https://www.linkedin.com/in/md-arsalan-72924a2ab/
