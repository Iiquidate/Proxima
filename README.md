# Proxima

A location-aware messaging platform designed to facilitate local connection and passive networking among students. Proxima enables users to discover and join digital chat channels that are physically anchored to specific GPS coordinates — campus libraries, lecture halls, study lounges, or social get-togethers.

Built with **React Native (Expo)**, **Express**, **Socket.io**, **PostgreSQL/PostGIS**, and **Supabase Auth**.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Socket.io Events](#socketio-events)
- [Database Schema](#database-schema)
- [Tech Stack](#tech-stack)

---

## Features

### Location-Based Channel Discovery
- Channels are anchored to real GPS coordinates with a configurable radius in meters
- Users only see and can join channels when they are physically within range
- Uses PostGIS `ST_DWithin` spatial queries for efficient geofencing
- GPS tracking updates every 10 seconds with a 10-meter distance threshold

### Official & Community Channels
- **Official channels** are created by admins at known campus locations (libraries, dining halls, rec centers, etc.) with pre-mapped coordinates and images
- **Community channels** are user-created and anchored to the creator's current GPS location
- Each channel has a customizable radius defining its geographic reach

### Real-Time Messaging
- Powered by Socket.io for instant message delivery
- Messages persist in PostgreSQL and are loaded as history when entering a channel
- Users see sender usernames and admin badges in chat


### Public & Private Channels
- **Public channels** are visible to all users within range
- **Private channels** are only visible to the creator and invited members
- Channel owners can add and remove members from private channels via a dedicated management screen

### Role-Based Access Control
- **Members** can create community channels, delete their own channels, and chat
- **Admins** can create official channels with custom coordinates, delete any channel, and delete any message (via long press)

### Channel Info & Maps Integration
- Swipe right on any channel to view its info card with image, type, and zone radius
- "Open in Maps" button launches Apple Maps or Google Maps with the channel's coordinates

### Authentication
- Email/password registration and login via Supabase Auth
- Bearer token validation on all protected endpoints
- User roles stored in PostgreSQL and attached to every authenticated request


---

## Project Structure

```
proxima/
├── package.json                        # npm workspaces root config
├── LICENSE
├── README.md
│
├── apps/
│   ├── server/                         # express + socket.io backend
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts                # server entry point
│   │       ├── db/
│   │       │   ├── connection.ts       # postgresql pool config
│   │       │   └── schema.sql          # database schema (postgis)
│   │       ├── lib/
│   │       │   └── supabase.ts         # supabase auth clients
│   │       ├── middleware/
│   │       │   └── requireAuth.ts      # bearer token validation
│   │       ├── routes/
│   │       │   ├── auth.ts             # /auth endpoints
│   │       │   ├── channels.ts         # /channels endpoints
│   │       │   └── message.ts          # /messages endpoints
│   │       ├── controllers/
│   │       │   └── channelController.ts
│   │       ├── models/
│   │       │   ├── channelModel.ts     # channel sql queries (postgis)
│   │       │   └── messageModel.ts     # message sql queries
│   │       └── sockets/
│   │           └── handler.ts          # real-time messaging handlers
│   │
│   └── mobile/                         # react native expo app
│       ├── package.json
│       ├── tsconfig.json
│       ├── app.json                    # expo configuration
│       ├── App.tsx                     # root component
│       ├── index.ts
│       └── src/
│           ├── config.ts               # server url configuration
│           ├── theme.ts                # color and typography system
│           ├── assets/
│           │   └── channel-icons/      # 19 official location images
│           ├── components/
│           │   ├── ProximaLogo.tsx      # svg logo component
│           │   ├── button-style.tsx     # reusable themed button
│           │   └── input-fields.tsx     # reusable themed text input
│           ├── context/
│           │   └── ThemeContext.tsx      # theme provider and hook
│           ├── hooks/
│           │   └── useLocation.ts       # gps tracking hook
│           ├── navigation/
│           │   └── AppNavigator.tsx      # stack navigator config
│           └── screens/
│               ├── LandingScreen.tsx     # entry screen with sign in/up
│               ├── LoginScreen.tsx       # email/password login
│               ├── SignUpScreen.tsx      # registration form
│               ├── NearbyListScreen.tsx  # main channel list
│               ├── ChatScreen.tsx        # real-time chat
│               ├── ManageMembersScreen.tsx    # add/remove private members
│               └── ChannelMembersScreen.tsx   # view channel participants
│
└── packages/
    └── common/                         # shared typescript interfaces
        ├── package.json
        └── index.ts                    # User, Channel, ChatMessage, AuthUser
```

---

## Prerequisites

- [Node.js](https://nodejs.org) v18 or higher
- **iOS:** Install [TestFlight](https://apps.apple.com/us/app/testflight/id899247664) from the App Store, then navigate to [https://testflight.apple.com/join/GZJxxfUU](https://testflight.apple.com/join/GZJxxfUU) and click **"Install"** to download the Expo Go 55.0.4 beta. We use a beta release of Expo that is not yet available on the App Store.
- **Android:** Install [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) from the Google Play Store.

---

## Getting Started

The backend server and database are already hosted on Render — no server setup required. You just need to install dependencies and start the Expo dev server.

1. **Clone the repository**
   ```bash
   git clone https://github.com/Iiquidate/Proxima.git
   cd Proxima
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Start the app**
   ```bash
   cd apps/mobile
   npx expo start
   ```
   Scan the QR code with Expo Go on your phone to launch the app.
   It is reccomended that you agree to allow Expo to find devices on your local network.
   
   **IMPORTANT:** This app is largely location based. It is vital you allow your location to be shared.

5. **Sharing with others on a different network**

   If someone isn't on the same Wi-Fi as you, use tunnel mode instead:
   ```bash
   npx expo start --tunnel
   ```
   This creates a public URL that works from any network. It may prompt you to install `@expo/ngrok` the first time.
   You can also use `--tunnel` if you prefer to run the app on your cellular data.

---

## API Endpoints

### Authentication (`/auth`)

| Method | Endpoint          | Auth | Description                              |
|--------|-------------------|------|------------------------------------------|
| POST   | `/auth/register`  | No   | Register with email, password, username  |
| POST   | `/auth/login`     | No   | Login, returns access and refresh tokens |

### Channels (`/channels`)

| Method | Endpoint                       | Auth | Description                                      |
|--------|--------------------------------|------|--------------------------------------------------|
| GET    | `/channels/official`           | No   | Get all official channels                        |
| GET    | `/channels/all`                | Yes  | Get all channels visible to the user             |
| GET    | `/channels/nearby?lat=X&lng=Y` | Yes  | Get channels within the user's GPS radius        |
| GET    | `/channels/:id`                | Yes  | Get a single channel by ID                       |
| POST   | `/channels`                    | Yes  | Create a channel (official for admins, community for members) |
| DELETE | `/channels/:id`                | Yes  | Delete a channel (own channels or admin)         |
| GET    | `/channels/:id/members`        | Yes  | Get members of a private channel                 |
| POST   | `/channels/:id/members`        | Yes  | Add a member to a private channel (owner only)   |
| DELETE | `/channels/:id/members/:userId`| Yes  | Remove a member from a private channel (owner only) |
| GET    | `/channels/users/all`          | Yes  | Get all non-admin users (for member picker)      |
| GET    | `/channels/:id/participants`   | Yes  | Get users who have messaged in a channel         |

### Messages (`/messages`)

| Method | Endpoint              | Auth | Description                          |
|--------|-----------------------|------|--------------------------------------|
| GET    | `/messages/:channelId`| Yes  | Get message history for a channel    |
| DELETE | `/messages/:messageId`| Yes  | Delete a message (admin only)        |

### Health

| Method | Endpoint   | Auth | Description                    |
|--------|------------|------|--------------------------------|
| GET    | `/health`  | No   | Server status + DB connectivity|

---

## Socket.io Events

| Event           | Direction       | Payload                                      | Description                        |
|-----------------|-----------------|----------------------------------------------|------------------------------------|
| `joinChannel`   | Client → Server | `channelId: string`                          | Join a channel's real-time room    |
| `leaveChannel`  | Client → Server | `channelId: string`                          | Leave a channel's room             |
| `sendMessage`   | Client → Server | `{ channelId, userId, content }`             | Send a message to a channel        |
| `newMessage`    | Server → Client | `ChatMessage`                                | Receive a new message in real-time |

---

## Database Schema

The database uses PostgreSQL with the PostGIS extension for geospatial queries.

**users** — linked to Supabase Auth
| Column     | Type          | Description            |
|------------|---------------|------------------------|
| id         | UUID (PK)     | Supabase auth user ID  |
| username   | TEXT (UNIQUE)  | Display name           |
| role       | TEXT          | `'member'` or `'admin'`|
| created_at | TIMESTAMPTZ   | Registration timestamp |

**channels** — geofenced chat rooms
| Column        | Type                  | Description                        |
|---------------|-----------------------|------------------------------------|
| id            | UUID (PK)             | Channel identifier                 |
| name          | TEXT                  | Channel display name               |
| location      | GEOGRAPHY(POINT,4326) | GPS coordinates (PostGIS)          |
| radius_meters | INTEGER               | Geofence radius (default 100m)     |
| type          | TEXT                  | `'official'` or `'community'`      |
| visibility    | TEXT                  | `'public'` or `'private'`          |
| created_by    | UUID (FK)             | Creator's user ID                  |
| created_at    | TIMESTAMPTZ           | Creation timestamp                 |

**channel_members** — private channel membership
| Column     | Type          | Description             |
|------------|---------------|-------------------------|
| channel_id | UUID (FK)     | Channel reference        |
| user_id    | UUID (FK)     | Member reference         |
| added_at   | TIMESTAMPTZ   | When the member was added|

**messages** — chat messages
| Column     | Type          | Description             |
|------------|---------------|-------------------------|
| id         | UUID (PK)     | Message identifier       |
| channel_id | UUID (FK)     | Channel reference        |
| user_id    | UUID (FK)     | Sender reference         |
| content    | TEXT          | Message body             |
| created_at | TIMESTAMPTZ   | Send timestamp           |

---

## Tech Stack

| Layer      | Technology                                    |
|------------|-----------------------------------------------|
| Mobile     | React Native 0.83, Expo 55, React 19         |
| Navigation | React Navigation (Native Stack)               |
| Real-time  | Socket.io Client                              |
| Backend    | Express 5, Socket.io                          |
| Database   | PostgreSQL + PostGIS                          |
| Auth       | Supabase Auth                                 |
| Language   | TypeScript                                    |
| Deployment | Render (server)                               |
