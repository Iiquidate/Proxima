# Proxima

## Scaffold
There's currently a loose project scaffold that will be subject to change. Each file and directory should contain notes on what their intended usage will be.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org) (v18 or higher)
- [Docker](https://docker.com)
- [Expo Go](https://expo.dev/client) installed on your phone

### Docker
We will use Docker to ensure everyone runs the same Postgres + PostGIS environment locally. If you have any questions let me know.

## Setup
1. Clone the repo and make your own branch
2. Run `npm install` from the project root
3. Run `npm run db:up` to start the database

### Running the Server
```bash
npm run dev:server
```

### Running the Mobile App
```bash
cd apps/mobile
npx expo start
```
Scan the QR code with Expo Go on your phone to run the app on a real device.

### Environment Variables
The `.env` file is not committed to the repo for security reasons. 
Create a file called `.env` inside `apps/server/` with the following:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=proxima
DB_PASSWORD=proxima
DB_NAME=proxima
PORT=3000
```

### Database
Start the database:
```bash
npm run db:up
```
Connect to psql to run queries directly:
```bash
docker exec -it proxima-db-1 psql -U proxima -d proxima
```
Use `\q` to exit psql

Stop the database:
```bash
npm run db:down
```
