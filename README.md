# Proxima

## Scaffold
There's currently a loose project scaffold that will be subject to change. Each file and directory should contain notes on what their intended usage will be.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org) (v18 or higher)
- [Docker](https://docker.com)

### Docker
We will use Docker to ensure everyone runs the same Postgres + PostGIS environment locally. I have created two scripts in [Setup](###Setup) to start and stop the database.

### Setup
1. Run `npm install` from the project root
2. Run `npm run db:up` to start the database (you need to have the desktop app open in the background)
3. Run `npm run dev:server` to start a local server
4. Run `npm run db:down` to stop the database