# Intelli-Chat — EventFlow

<p align="center">

### AI-Assisted Event Discovery, Planning & Social Engagement Platform

A production-oriented full-stack TypeScript application for discovering events, managing RSVPs, inviting friends, tracking referrals, creating reminders, and interacting with events through a conversational assistant.

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Node.js-18+-339933?logo=node.js" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express-4-000000?logo=express" alt="Express"/>
  <img src="https://img.shields.io/badge/MongoDB-8-47A248?logo=mongodb" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/JWT-Authentication-000000?logo=jsonwebtokens" alt="JWT"/>
  <img src="https://img.shields.io/badge/pnpm-Monorepo-F69220?logo=pnpm" alt="pnpm"/>
</p>

---

## 📌 Table of Contents

* [Overview](#-overview)
* [Problem Statement](#-problem-statement)
* [Solution](#-solution)
* [Key Features](#-key-features)
* [System Architecture](#-system-architecture)
* [High-Level Architecture Diagram](#-high-level-architecture-diagram)
* [Frontend Architecture](#-frontend-architecture)
* [Backend Architecture](#-backend-architecture)
* [Database Architecture](#-database-architecture)
* [Authentication Flow](#-authentication-flow)
* [Event Discovery Flow](#-event-discovery-flow)
* [RSVP Flow](#-rsvp-flow)
* [Invite & Referral Flow](#-invite--referral-flow)
* [Reminder Flow](#-reminder-flow)
* [Conversational Assistant Architecture](#-conversational-assistant-architecture)
* [Complete User Journey](#-complete-user-journey)
* [Repository Structure](#-repository-structure)
* [Technology Stack](#-technology-stack)
* [Data Model](#-data-model)
* [API Documentation](#-api-documentation)
* [Environment Variables](#-environment-variables)
* [Local Development](#-local-development)
* [Build & Validation](#-build--validation)
* [Security](#-security)
* [Production Architecture](#-production-architecture)
* [Testing Strategy](#-testing-strategy)
* [Known Limitations](#-known-limitations)
* [Roadmap](#-roadmap)
* [Contributing](#-contributing)
* [Author](#-author)

---

# 🚀 Overview

**EventFlow** is a full-stack event discovery and social planning platform.

The application combines:

* Event discovery
* Search and filtering
* Event details
* RSVP management
* Friend invitations
* Referral attribution
* Reminder management
* Conversational event search
* Persistent chat conversations
* JWT-based authentication

The project is designed as a **TypeScript monorepo**, separating frontend, backend, and shared code for maintainability and scalability.

---

# 🎯 Problem Statement

Finding and attending events often involves several disconnected workflows:

```text
Search Event
     ↓
Open Event Website
     ↓
Check Details
     ↓
Decide Whether to Attend
     ↓
RSVP
     ↓
Invite Friends
     ↓
Remember Event
```

EventFlow consolidates these actions into a single platform.

The goal is to provide a unified workflow:

```text
Discover → Understand → RSVP → Invite → Track → Attend
```

---

# 💡 Solution

EventFlow provides an integrated event lifecycle:

```mermaid
flowchart LR
    A[Discover Events] --> B[Search & Filter]
    B --> C[Event Details]
    C --> D[RSVP]
    D --> E[Invite Friends]
    E --> F[Referral Attribution]
    D --> G[Reminder]
    H[Conversational Assistant] --> B
    H --> C
    H --> D
```

---

# ✨ Key Features

## 🔐 Authentication

* User registration
* User login
* Password hashing using bcrypt
* JWT authentication
* Protected API routes
* Current-user endpoint

## 🔎 Event Discovery

* Keyword search
* Category filtering
* City filtering
* Date filtering
* Pagination
* Calendar-based browsing
* Event detail pages
* External ticket links

## 🎟️ RSVP Management

* RSVP to an event
* Cancel RSVP
* Re-confirm RSVP
* View personal events
* Prevent duplicate RSVPs

## 👥 Social Invites

* Generate event-specific invite links
* Share invite URLs
* Track invite clicks
* Attribute RSVPs to referring users
* View invite statistics
* Prevent self-referral

## ⏰ Reminders

* Create event reminders
* Retrieve pending reminders
* Store reminder metadata

## 🤖 Conversational Event Assistant

The application provides a conversational interface for event-related queries.

Current capabilities include:

* Event search
* Event retrieval
* Personal RSVP lookup
* Conversation persistence
* Tool-oriented event operations
* Event cards in chat responses

> **Current implementation note:** the assistant backend currently uses deterministic intent classification and internal database tools. The repository contains configuration for future LLM integration, but the current implementation does not invoke an external LLM provider.

---

# 🏗️ System Architecture

EventFlow follows a layered architecture:

```text
┌────────────────────────────────────────────────────────────┐
│                        USER / BROWSER                       │
└───────────────────────────┬────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────┐
│                     NEXT.JS FRONTEND                       │
│                                                            │
│  Pages • Components • Auth Context • API Client • Chat UI │
└───────────────────────────┬────────────────────────────────┘
                            │ HTTP / REST
                            ▼
┌────────────────────────────────────────────────────────────┐
│                     EXPRESS API                            │
│                                                            │
│  Routes → Middleware → Modules → Services → Models        │
└───────────────────────────┬────────────────────────────────┘
                            │
              ┌─────────────┴──────────────┐
              ▼                            ▼
┌───────────────────────────┐  ┌────────────────────────────┐
│     BUSINESS MODULES      │  │      CHAT / TOOL LAYER     │
│                           │  │                            │
│ Auth • Events • RSVP      │  │ Intent Classification      │
│ Invites • Reminders       │  │ Tool Execution             │
└──────────────┬────────────┘  └─────────────┬──────────────┘
               │                             │
               └──────────────┬──────────────┘
                              ▼
                 ┌─────────────────────────┐
                 │      MONGODB            │
                 │                         │
                 │ Users • Events • RSVPs │
                 │ Invites • Reminders   │
                 │ Conversations • Chat  │
                 └─────────────────────────┘
```

---

# 🔷 High-Level Architecture Diagram

```mermaid
flowchart TB

    USER[User / Browser]

    subgraph FRONTEND["Frontend — Next.js"]
        PAGES[Application Pages]
        COMPONENTS[Reusable Components]
        AUTHCTX[Authentication Context]
        APICLIENT[API Client]
        CHATUI[Chat Interface]
    end

    subgraph BACKEND["Backend — Express / Node.js"]
        ROUTER[REST API Router]
        AUTHMW[JWT Middleware]

        subgraph MODULES["Domain Modules"]
            AUTH[Auth]
            EVENTS[Events]
            RSVP[RSVP]
            INVITES[Invites]
            REMINDERS[Reminders]
            CHAT[Chat]
        end

        TOOLS[Chat Tools / Intent Router]
        MODELS[Mongoose Models]
    end

    DB[(MongoDB)]

    USER --> PAGES
    USER --> CHATUI

    PAGES --> COMPONENTS
    PAGES --> AUTHCTX
    AUTHCTX --> APICLIENT
    COMPONENTS --> APICLIENT
    CHATUI --> APICLIENT

    APICLIENT --> ROUTER
    ROUTER --> AUTHMW

    AUTHMW --> AUTH
    AUTHMW --> EVENTS
    AUTHMW --> RSVP
    AUTHMW --> INVITES
    AUTHMW --> REMINDERS
    AUTHMW --> CHAT

    CHAT --> TOOLS

    AUTH --> MODELS
    EVENTS --> MODELS
    RSVP --> MODELS
    INVITES --> MODELS
    REMINDERS --> MODELS
    TOOLS --> MODELS

    MODELS --> DB
```

---

# 🎨 Frontend Architecture

The frontend is built using **Next.js + React + TypeScript**.

```text
                  ┌─────────────────────┐
                  │     Next.js App     │
                  └──────────┬──────────┘
                             │
        ┌────────────────────┼─────────────────────┐
        ▼                    ▼                     ▼
   Authentication       Event Discovery        Chat UI
        │                    │                     │
        ▼                    ▼                     ▼
   AuthContext          Event Components      Conversations
        │                    │                     │
        └────────────────────┼─────────────────────┘
                             ▼
                       API Client
                             │
                             ▼
                      Express Backend
```

### Frontend Responsibilities

* Route rendering
* UI state
* Authentication state
* Event browsing
* RSVP interactions
* Calendar visualization
* Invite workflows
* Chat experience
* API communication

### Main Routes

| Route              | Purpose                    |
| ------------------ | -------------------------- |
| `/`                | Event discovery            |
| `/events`          | Event search and filtering |
| `/events/:id`      | Event details              |
| `/calendar`        | Calendar                   |
| `/chat`            | Conversational assistant   |
| `/invite/:token`   | Invite acceptance          |
| `/dashboard/rsvps` | User's RSVPs               |
| `/profile`         | User profile               |
| `/login`           | Authentication             |
| `/register`        | Registration               |

---

# ⚙️ Backend Architecture

The backend follows a module-based architecture.

```text
Request
   │
   ▼
Express Router
   │
   ▼
Middleware
   │
   ├── CORS
   └── JWT Authentication
   │
   ▼
Domain Module
   │
   ├── Validation
   ├── Business Logic
   └── Database Operations
   │
   ▼
Mongoose Model
   │
   ▼
MongoDB
```

### Backend Modules

```text
apps/api/src/modules/

├── auth/
├── events/
├── rsvp/
├── invites/
├── reminders/
└── chat/
```

Each module owns a focused business responsibility.

This structure makes the system easier to:

* Maintain
* Test
* Extend
* Debug
* Scale across teams

---

# 🗄️ Database Architecture

MongoDB is used as the primary persistence layer.

```mermaid
erDiagram

    USER ||--o{ RSVP : creates
    EVENT ||--o{ RSVP : receives

    USER ||--o{ INVITE : creates
    EVENT ||--o{ INVITE : belongs_to

    USER ||--o{ REMINDER : creates
    EVENT ||--o{ REMINDER : triggers

    USER ||--o{ CONVERSATION : owns
    CONVERSATION ||--o{ MESSAGE : contains

    USER {
        ObjectId _id
        string name
        string email
        string passwordHash
        string avatarUrl
        string city
        string timezone
    }

    EVENT {
        ObjectId _id
        string source
        string sourceId
        string title
        string description
        string category
        string imageUrl
        string ticketUrl
        datetime startTime
        datetime endTime
        string timezone
        string status
    }

    RSVP {
        ObjectId _id
        ObjectId userId
        ObjectId eventId
        string status
        ObjectId inviteId
        ObjectId referredByUserId
    }

    INVITE {
        ObjectId _id
        string token
        ObjectId eventId
        ObjectId ownerUserId
        number clickCount
        number uniqueClickCount
        datetime expiresAt
    }

    REMINDER {
        ObjectId _id
        ObjectId userId
        ObjectId eventId
        datetime reminderTime
        string status
    }

    CONVERSATION {
        ObjectId _id
        ObjectId userId
        string title
    }

    MESSAGE {
        ObjectId _id
        ObjectId conversationId
        string role
        string content
        datetime timestamp
    }
```

---

# 🔐 Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant W as Next.js
    participant A as Express API
    participant DB as MongoDB

    U->>W: Enter credentials
    W->>A: POST /api/auth/login
    A->>DB: Find user
    DB-->>A: User record
    A->>A: Verify password
    A->>A: Generate JWT
    A-->>W: Access token
    W->>W: Store authentication state

    U->>W: Access protected page
    W->>A: API request + Bearer token
    A->>A: Verify JWT
    A-->>W: Authorized response
    W-->>U: Render protected content
```

---

# 🔎 Event Discovery Flow

```mermaid
flowchart LR

    USER[User] --> SEARCH[Search / Filters]

    SEARCH --> API[GET /api/events]

    API --> FILTERS[
        keyword<br/>
        category<br/>
        city<br/>
        startDate<br/>
        endDate<br/>
        page<br/>
        limit
    ]

    FILTERS --> DB[(MongoDB)]

    DB --> RESULTS[Event Results]

    RESULTS --> UI[Event Cards]

    UI --> DETAILS[Event Details]
```

---

# 🎟️ RSVP Flow

```mermaid
sequenceDiagram
    participant U as User
    participant W as Web App
    participant A as API
    participant DB as MongoDB

    U->>W: Click "RSVP"
    W->>A: POST /api/events/:eventId/rsvp
    A->>A: Validate JWT
    A->>DB: Check existing RSVP

    alt RSVP exists
        DB-->>A: Existing RSVP
        A-->>W: Existing / conflict response
    else No RSVP
        A->>DB: Create RSVP
        DB-->>A: RSVP created
        A-->>W: Success
    end

    W-->>U: Updated RSVP state
```

### RSVP State

```text
                    ┌─────────────┐
                    │   NONE      │
                    └──────┬──────┘
                           │ RSVP
                           ▼
                    ┌─────────────┐
                    │ CONFIRMED   │
                    └──────┬──────┘
                           │ Cancel
                           ▼
                    ┌─────────────┐
                    │ CANCELLED   │
                    └──────┬──────┘
                           │ Re-confirm
                           ▼
                    ┌─────────────┐
                    │ CONFIRMED   │
                    └─────────────┘
```

---

# 👥 Invite & Referral Flow

EventFlow supports invite-based RSVP attribution.

```mermaid
sequenceDiagram
    participant O as Event Owner
    participant W as Web App
    participant A as API
    participant DB as MongoDB
    participant F as Friend

    O->>W: Click Invite Friends
    W->>A: POST /api/events/:eventId/invites
    A->>DB: Create invite token
    DB-->>A: Token
    A-->>W: Invite URL

    W->>O: Display shareable link
    O->>F: Send invite URL

    F->>A: GET /api/invites/:token
    A->>DB: Resolve invite
    DB-->>A: Event + owner
    A-->>F: Invite event data

    F->>A: POST /api/invites/:token/rsvp
    A->>A: Validate authenticated user
    A->>DB: Create RSVP + referral attribution
    DB-->>A: Success
    A-->>F: RSVP confirmed
```

### Referral Relationship

```text
Event Owner
    │
    │ creates invite
    ▼
Invite Token
    │
    │ shared with friend
    ▼
Friend opens invite
    │
    │ RSVP
    ▼
RSVP
    │
    ├── eventId
    ├── userId
    ├── inviteId
    └── referredByUserId
```

This allows the platform to preserve **who invited whom to which event**.

---

# ⏰ Reminder Flow

```mermaid
flowchart LR

    U[User] --> E[Event]
    E --> R[Create Reminder]
    R --> API[POST Reminder API]
    API --> DB[(MongoDB)]
    DB --> P[Pending Reminder]
    P --> W[Future Reminder Worker]
```

> The current implementation persists reminders and exposes pending-reminder retrieval. A production worker/queue should be added to automatically deliver notifications.

Recommended production architecture:

```text
MongoDB
   ↓
Reminder Scheduler
   ↓
Message Queue
   ↓
Notification Worker
   ├── Email
   ├── Push
   └── In-App
```

---

# 🤖 Conversational Assistant Architecture

The application provides a chat interface for event-oriented queries.

## Current Architecture

```mermaid
flowchart TD

    USER[User Query]

    USER --> CHATUI[Chat UI]
    CHATUI --> API[POST /api/chat]

    API --> CLASSIFIER[Intent Classifier]

    CLASSIFIER --> SEARCH[search_events]
    CLASSIFIER --> EVENT[get_event]
    CLASSIFIER --> RSVP[get_my_rsvps]

    SEARCH --> DB[(MongoDB)]
    EVENT --> DB
    RSVP --> DB

    DB --> RESULT[Tool Result]

    RESULT --> RESPONSE[Assistant Response]
    RESPONSE --> CHATUI
```

## Tool Layer

```text
search_events()
        │
        └── Search database events

get_event()
        │
        └── Retrieve event details

get_my_rsvps()
        │
        └── Retrieve current user's RSVPs
```

## Example Conversation

```text
User:
"Find music events in New York"

        ↓

Intent Classification

        ↓

search_events()

        ↓

MongoDB

        ↓

Matching Events

        ↓

Assistant Response

        ↓

Event Cards
```

---

# 🧠 Future LLM Architecture

The current tool layer can evolve into a true LLM-based agent architecture.

```mermaid
flowchart TD

    USER[User Message] --> API[Chat API]

    API --> LLM[LLM / Agent Router]

    LLM --> TOOL1[search_events]
    LLM --> TOOL2[get_event]
    LLM --> TOOL3[get_my_rsvps]
    LLM --> TOOL4[create_reminder]
    LLM --> TOOL5[recommend_events]
    LLM --> TOOL6[invite_friend]

    TOOL1 --> DB[(MongoDB)]
    TOOL2 --> DB
    TOOL3 --> DB
    TOOL4 --> DB
    TOOL5 --> DB
    TOOL6 --> DB

    DB --> LLM
    LLM --> API
    API --> UI[Chat UI]
```

This architecture separates:

```text
LLM reasoning
      +
Tool execution
      +
Business logic
      +
Database
```

which provides a cleaner path toward production-grade agent functionality.

---

# 🔄 Complete User Journey

```mermaid
flowchart TD

    START[User Opens EventFlow]

    START --> AUTH{Authenticated?}

    AUTH -->|No| LOGIN[Login / Register]
    AUTH -->|Yes| HOME[Event Discovery]

    LOGIN --> HOME

    HOME --> SEARCH[Search / Filter]
    SEARCH --> EVENT[Open Event]

    EVENT --> DECISION{Want to Attend?}

    DECISION -->|No| SEARCH
    DECISION -->|Yes| RSVP[Create RSVP]

    RSVP --> INVITE{Invite Friends?}

    INVITE -->|No| REMINDER{Set Reminder?}
    INVITE -->|Yes| CREATE[Generate Invite]
    CREATE --> SHARE[Share Invite URL]
    SHARE --> FRIEND[Friend Opens Invite]
    FRIEND --> FR[Friend RSVPs]
    FR --> REMINDER

    REMINDER -->|Yes| SET[Create Reminder]
    REMINDER -->|No| MYEVENTS[My Events]

    SET --> MYEVENTS

    HOME --> CHAT[Ask Event Assistant]
    CHAT --> SEARCH
    CHAT --> EVENT
    CHAT --> MYEVENTS
```

---

# 📁 Repository Structure

```text
Intelli-Chat/
│
├── apps/
│   │
│   ├── web/                         # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── events/
│   │   │   │   ├── calendar/
│   │   │   │   ├── chat/
│   │   │   │   ├── invite/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── profile/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   │
│   │   │   ├── components/
│   │   │   └── lib/
│   │   │
│   │   └── package.json
│   │
│   └── api/                         # Express backend
│       ├── src/
│       │   ├── config/
│       │   ├── database/
│       │   ├── middleware/
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   ├── events/
│       │   │   ├── rsvp/
│       │   │   ├── invites/
│       │   │   ├── reminders/
│       │   │   └── chat/
│       │   └── seed.ts
│       │
│       └── package.json
│
├── packages/
│   └── shared/                      # Shared types/utilities
│
├── .env.example
├── package.json
├── pnpm-workspace.yaml
└── pnpm-lock.yaml
```

---

# 🧰 Technology Stack

| Layer              | Technology        |
| ------------------ | ----------------- |
| Frontend Framework | Next.js 15        |
| UI Library         | React 19          |
| Language           | TypeScript        |
| Backend            | Node.js + Express |
| Database           | MongoDB           |
| ODM                | Mongoose          |
| Authentication     | JWT               |
| Password Hashing   | bcryptjs          |
| Validation         | Zod               |
| Package Manager    | pnpm              |
| Architecture       | Monorepo          |

---

# 📡 API Documentation

## Authentication

| Method | Endpoint             | Authentication | Description     |
| ------ | -------------------- | -------------- | --------------- |
| `POST` | `/api/auth/register` | Public         | Register a user |
| `POST` | `/api/auth/login`    | Public         | Login           |
| `GET`  | `/api/auth/me`       | JWT            | Current user    |

---

## Events

| Method | Endpoint               | Description        |
| ------ | ---------------------- | ------------------ |
| `GET`  | `/api/events`          | List/search events |
| `GET`  | `/api/events/calendar` | Calendar events    |
| `GET`  | `/api/events/:id`      | Event details      |

### Supported Query Parameters

```text
keyword
category
city
startDate
endDate
page
limit
```

Example:

```http
GET /api/events?category=Music&city=New%20York&page=1&limit=20
```

---

## RSVP

| Method   | Endpoint                    | Description          |
| -------- | --------------------------- | -------------------- |
| `POST`   | `/api/events/:eventId/rsvp` | RSVP to event        |
| `DELETE` | `/api/events/:eventId/rsvp` | Cancel RSVP          |
| `GET`    | `/api/events/me/rsvps`      | Current user's RSVPs |

---

## Invites

| Method | Endpoint                             | Description         |
| ------ | ------------------------------------ | ------------------- |
| `POST` | `/api/events/:eventId/invites`       | Create invite       |
| `GET`  | `/api/invites/:token`                | Resolve invite      |
| `POST` | `/api/invites/:token/rsvp`           | RSVP through invite |
| `GET`  | `/api/events/:eventId/invites/stats` | Invite analytics    |

---

## Reminders

| Method | Endpoint                         | Description     |
| ------ | -------------------------------- | --------------- |
| `POST` | `/api/events/:eventId/reminders` | Create reminder |
| `GET`  | `/api/me/reminders`              | Get reminders   |

---

## Chat

| Method | Endpoint    | Description               |
| ------ | ----------- | ------------------------- |
| `POST` | `/api/chat` | Process assistant request |

Example:

```bash
curl -X POST http://localhost:4000/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -d '{"message":"Find music events in New York"}'
```

---

# 🔐 Environment Variables

Create:

```text
apps/api/.env
```

```env
NODE_ENV=development

PORT=4000

WEB_ORIGIN=http://localhost:3000

MONGODB_URI=mongodb://localhost:27017/eventflow

JWT_ACCESS_SECRET=change-this-access-secret
JWT_REFRESH_SECRET=change-this-refresh-secret

TICKETMASTER_API_KEY=

LLM_API_KEY=
```

Frontend:

```text
apps/web/.env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

# 💻 Local Development

## Prerequisites

Install:

* Node.js 18+
* pnpm
* MongoDB
* Git

---

## Clone Repository

```bash
git clone https://github.com/arsal-nez/Intelli-Chat.git
cd Intelli-Chat
```

---

## Enable pnpm

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

---

## Install Dependencies

```bash
pnpm install
```

---

## Configure Environment

Create:

```text
apps/api/.env
apps/web/.env.local
```

Use the environment-variable templates shown above.

---

## Start Development Servers

Run both applications:

```bash
pnpm dev
```

Or individually:

```bash
pnpm dev:web
```

```bash
pnpm dev:api
```

### Default URLs

```text
Frontend
http://localhost:3000

Backend
http://localhost:4000

Health Check
http://localhost:4000/api/health
```

---

# 🌱 Seed Data

The backend includes a seed mechanism for development data.

The sample dataset contains events across categories such as:

```text
Music
Conference
Comedy
Sports
Festival
Food
Wellness
```

For production environments, this should be replaced by a managed ingestion/synchronization pipeline from trusted event providers.

---

# ✅ Build & Validation

Build all packages:

```bash
pnpm build
```

Type-check:

```bash
pnpm typecheck
```

Lint:

```bash
pnpm lint
```

A recommended CI pipeline is:

```mermaid
flowchart LR

    PUSH[Git Push]
        ↓
    INSTALL[Install Dependencies]
        ↓
    TYPECHECK[Type Check]
        ↓
    TEST[Run Tests]
        ↓
    LINT[Lint]
        ↓
    BUILD[Production Build]
        ↓
    DEPLOY[Deploy]
```

---

# 🛡️ Security Architecture

The current implementation includes:

* Password hashing using bcrypt
* JWT-protected routes
* Unique user email constraints
* Unique RSVP constraints
* Unique invite tokens
* CORS configuration
* Password hashes excluded from user-facing responses

### Recommended Production Hardening

```text
Current
  │
  ├── JWT
  ├── bcrypt
  └── CORS
  │
  ▼
Production Hardening
  │
  ├── HTTP-only secure cookies
  ├── Refresh-token rotation
  ├── Token revocation
  ├── Rate limiting
  ├── Security headers
  ├── Strict request validation
  ├── Structured logging
  ├── Request tracing
  ├── Secret management
  └── Monitoring / alerting
```

---

# ☁️ Production Architecture

A production deployment can be structured as:

```mermaid
flowchart TB

    USER[Users]

    CDN[CDN / Edge]
    WEB[Next.js Application]

    LB[Load Balancer / API Gateway]

    API1[API Instance]
    API2[API Instance]

    CACHE[(Redis Cache)]

    DB[(MongoDB Atlas)]

    QUEUE[Message Queue]

    WORKER[Background Workers]

    EXTERNAL[External Event Providers]

    USER --> CDN
    CDN --> WEB

    WEB --> LB

    LB --> API1
    LB --> API2

    API1 --> CACHE
    API2 --> CACHE

    API1 --> DB
    API2 --> DB

    API1 --> QUEUE
    API2 --> QUEUE

    QUEUE --> WORKER

    WORKER --> DB
    WORKER --> EXTERNAL

    API1 --> EXTERNAL
    API2 --> EXTERNAL
```

---

# 📈 Scalability Strategy

## Frontend

* Next.js server rendering
* Edge/CDN caching
* Image optimization
* Component-level code splitting

## Backend

* Stateless API instances
* Horizontal scaling
* API gateway/load balancing
* Centralized authentication strategy

## Database

* MongoDB indexes
* Query optimization
* Pagination
* Connection pooling
* Read/write separation where necessary

## Caching

A future Redis layer can cache:

```text
Popular Events
Event Details
Search Results
Session Data
Rate Limit Counters
```

## Background Processing

Use workers for:

```text
Reminder delivery
Event synchronization
Email notifications
Analytics aggregation
Recommendation generation
```

---

# 🧪 Testing Strategy

## Unit Tests

Test isolated business logic:

```text
Authentication
Event filtering
Intent classification
RSVP state transitions
Invite attribution
Reminder creation
```

## Integration Tests

Test:

```text
API + MongoDB
Authentication
Events
RSVP
Invites
Chat tools
```

## End-to-End Tests

Representative flow:

```text
Register
   ↓
Login
   ↓
Search Event
   ↓
Open Event
   ↓
RSVP
   ↓
Generate Invite
   ↓
Open Invite
   ↓
Friend RSVP
   ↓
Verify Attribution
```

---

# ⚠️ Known Limitations

The current implementation is an MVP-oriented architecture.

The following areas are candidates for production expansion:

### AI

The existing assistant uses deterministic intent routing and database tools.

A production LLM layer can be introduced for:

* Natural-language understanding
* Multi-step planning
* Tool calling
* Context-aware conversations
* Personalized recommendations

### Notifications

Reminder records exist, but a background delivery mechanism should be added.

### Event Providers

A production event ingestion architecture should support:

```text
Provider API
    ↓
Ingestion
    ↓
Normalization
    ↓
Deduplication
    ↓
MongoDB
    ↓
Search / Discovery
```

### Testing

A comprehensive automated test suite should be added before large-scale deployment.

---

# 🗺️ Roadmap

## Phase 1 — Engineering Foundation

* [ ] Comprehensive unit tests
* [ ] Integration tests
* [ ] E2E tests
* [ ] CI/CD
* [ ] Production logging
* [ ] Error monitoring
* [ ] Docker support
* [ ] Strict request validation

## Phase 2 — Event Intelligence

* [ ] External event-provider integration
* [ ] Automated event synchronization
* [ ] Event deduplication
* [ ] Event freshness management
* [ ] Advanced search

## Phase 3 — AI Assistant

* [ ] LLM-powered intent understanding
* [ ] Function/tool calling
* [ ] Conversation memory
* [ ] Multi-step event planning
* [ ] Personalized recommendations

## Phase 4 — Engagement

* [ ] Push notifications
* [ ] Email reminders
* [ ] Calendar integration
* [ ] Social recommendations
* [ ] Referral analytics dashboard

---

# 🧱 Engineering Principles

The project follows several engineering principles:

### Separation of Concerns

```text
UI
 ↓
API Client
 ↓
Routes
 ↓
Business Modules
 ↓
Data Models
 ↓
Database
```

### Modular Domain Design

Features are isolated into independently maintainable modules.

### Typed Development

TypeScript is used across the application to reduce runtime errors and improve maintainability.

### API-First Design

Frontend functionality communicates through explicit REST API boundaries.

### Extensibility

The chat tool layer is intentionally separated from the interface, providing a foundation for future AI and agent-based capabilities.

---

# 🤝 Contributing

1. Fork the repository.

2. Create a feature branch:

```bash
git checkout -b feature/your-feature
```

3. Install dependencies:

```bash
pnpm install
```

4. Implement the feature.

5. Run validation:

```bash
pnpm typecheck
pnpm lint
pnpm build
```

6. Commit:

```bash
git commit -m "feat: add your feature"
```

7. Push:

```bash
git push origin feature/your-feature
```

8. Open a Pull Request.

---

# 📝 Commit Convention

Recommended commit format:

```text
feat: add event recommendation engine
fix: prevent duplicate RSVP creation
refactor: separate event search service
docs: update API documentation
test: add invite attribution tests
chore: update dependencies
```

---

# 📊 Architecture at a Glance

```text
                         EVENTFLOW
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
  DISCOVERY              ENGAGEMENT             AI
        │                    │                    │
        ├─ Search            ├─ RSVP              ├─ Chat
        ├─ Filters           ├─ Invites           ├─ Intent
        ├─ Calendar          ├─ Referrals         └─ Tools
        └─ Details           └─ Reminders
        │                    │                    │
        └────────────────────┼────────────────────┘
                             ▼
                        EXPRESS API
                             │
                             ▼
                          MONGODB
```

---

# 📌 Project Metadata

| Property        | Value                    |
| --------------- | ------------------------ |
| Project         | Intelli-Chat / EventFlow |
| Repository      | `arsal-nez/Intelli-Chat` |
| Architecture    | Full-Stack Monorepo      |
| Frontend        | Next.js                  |
| Backend         | Express                  |
| Database        | MongoDB                  |
| Language        | TypeScript               |
| Authentication  | JWT                      |
| Package Manager | pnpm                     |

---

# 👨‍💻 Author

## MD Arsalan

Full-Stack Developer | Data & AI Enthusiast

**GitHub:**
https://github.com/arsal-nez

**LinkedIn:**
https://www.linkedin.com/in/md-arsalan-72924a2ab/

---

# ⭐ Why This Project?

EventFlow demonstrates the architecture of a modern full-stack application by combining:

```text
Modern Frontend
      +
REST API
      +
Authentication
      +
NoSQL Data Modeling
      +
Social Workflows
      +
Conversational UX
      +
Scalable Architecture
```

The project provides a foundation that can evolve from an MVP into a production-grade event intelligence platform with real-time event ingestion, background processing, LLM-based agents, personalized recommendations, notifications, and analytics.

---

<p align="center">

### Built with TypeScript, Next.js, Express & MongoDB

</p>
