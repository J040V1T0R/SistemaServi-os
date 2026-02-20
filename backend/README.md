# Backend for SistemaServi\u00e7os

This directory contains a simple Express-based backend API for the SistemaServi\u00e7os project. It can be expanded as needed with routes, controllers, models, and database connections.

## Getting Started

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the example environment file and adjust settings:
   ```bash
   cp .env.example .env
   ```
4. Run the server in development mode:
   ```bash
   npm run dev
   ```
   Or start normally:
   ```bash
   npm start
   ```

The server will listen on the port defined in `.env` (default `3001`).

## Extending

- Add additional route files under `src/` and import them in `src/index.js`.
- **API routes provided by default:**
  - `GET /api/status` – health check
  - `GET /api/orders` – list all service orders (stored in database)
  - `POST /api/orders` – create new order (JSON body with `clientCpf`, `serialNumber`, `equipType`, `problemDescription`; optional `technicianId`)

- The server uses a simple JSON database (`lowdb`) stored in the file specified by `DB_FILE` (defaults to `data.json`).
- Run `npm install` after editing `package.json` to add the database dependency.
- Implement authentication, validation, and other middleware as needed.
