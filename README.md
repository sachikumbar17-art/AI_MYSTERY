# AI Mystery Room

A MERN mystery investigation game built from `spec.md`. The frontend is React + Vite; the API is Express + Mongoose and calls Gemini only from the server.

## Setup

1. Install Node.js 20+ and MongoDB (local or hosted).
2. Copy `server/.env.example` to `server/.env`, then set `MONGODB_URI`, `GEMINI_API_KEY`, and `GEMINI_MODEL`.
3. From the repository root, run `npm install`, `npm --prefix client install`, and `npm --prefix server install`.
4. Run `npm run dev`. Vite runs at `http://localhost:5173` and the API at `http://localhost:5000`.

The AI integration intentionally reports a configuration error when Gemini is not configured; it does not substitute mock cases. Image evidence is represented with clearly labeled, CSS-generated fictional scene cards. CCTV evidence uses a timestamped synthetic still/event sequence, never a claim of real video.

Case secrets are stored in a separate MongoDB collection and are only returned after the investigation submits an accusation. Guest investigations use a random browser session ID; this MVP does not provide accounts.
