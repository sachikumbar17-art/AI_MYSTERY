# AI Mystery Room

A MERN mystery investigation game built from `spec.md`. The frontend is React + Vite; the API is Express + Mongoose and calls Gemini only from the server.

## Local setup

1. Install Node.js 20+ and MongoDB (local or hosted).
2. Copy `server/.env.example` to `server/.env`, then set `MONGODB_URI`, `GEMINI_API_KEY`, and `GEMINI_MODEL`.
3. From the repository root, run `npm install`, `npm --prefix client install`, and `npm --prefix server install`.
4. Run `npm run dev`. Vite runs at `http://localhost:5173` and the API at `http://localhost:5000`.

The AI integration intentionally reports a configuration error when Gemini is not configured; it does not substitute mock cases. Image evidence is represented with clearly labeled, CSS-generated fictional scene cards. CCTV evidence uses a timestamped synthetic still/event sequence, never a claim of real video.

Case secrets are stored in a separate MongoDB collection and are only returned after the investigation submits an accusation. Guest investigations use a random browser session ID; this MVP does not provide accounts.

## Deploy to Render + MongoDB Atlas

This repository includes `render.yaml` for a single Render web service. The service builds the React client and serves it from Express, so the browser and API share one origin. MongoDB and Gemini credentials are entered as Render secrets and are never added to the frontend bundle.

### 1. Prepare the repository

1. Make sure `.env`, `server/.env`, and `client/.env` remain untracked. The root `.gitignore` excludes them.
2. Push this project to a GitHub repository you control. Do not commit either `.env` file or paste an API key into a source file.
3. Keep `render.yaml`, `client/package-lock.json`, and `server/package-lock.json` in the repository.

### 2. Create a MongoDB Atlas database

1. Create an Atlas account and a project, then create a cluster.
2. Under **Database Access**, create an application database user with a strong password. Give it read/write access only to the app database.
3. Under **Network Access**, add the Render service's outbound IP ranges after creating the service in the next section. In the Render service dashboard, open **Connect → Outbound** and add each displayed CIDR range to the Atlas IP access list. These are shared regional ranges; use dedicated outbound IPs/private networking when you need a narrower production allowlist. Avoid `0.0.0.0/0` unless you accept allowing connection attempts from any IP.
4. Select **Connect → Drivers**, copy the Node.js connection string, replace its password placeholder, and set the database name to `ai-mystery-room`. Keep the URI private.

### 3. Deploy the Render service

1. Sign in to Render and choose **New → Blueprint**.
2. Connect the GitHub repository and select the branch to deploy. Render reads `render.yaml` and configures the web service.
3. When prompted for the two `sync: false` values, enter `MONGODB_URI` and `GEMINI_API_KEY`. The API key comes from Google AI Studio. Do not add either value to a `VITE_` variable.
4. Confirm the service settings: build command `npm --prefix client ci && npm --prefix server ci && npm run build`; start command `npm start`; health check `/health`.
5. Create the service. While its first deploy runs, add the service's outbound CIDR ranges to Atlas as described above. If the first startup fails before Atlas access is configured, use **Manual Deploy → Deploy latest commit** after adding the ranges.
6. Wait for the deploy to finish. Render supplies `PORT`; the server listens on it automatically.
7. Open `https://<your-service>.onrender.com/health`. A healthy deployment returns `{"success":true,"status":"ok"}`. Then load the homepage and generate a small test case.

`GEMINI_MODEL` is set to `gemini-3.8-flash` by the Blueprint and can be changed in the Render service's environment settings. `NODE_ENV=production` enables Express to serve the compiled React app and its client-side routes from the same service.

### 4. After deployment

- Use Render's **Logs** page to inspect startup or generation errors. A MongoDB connection error usually means the URI, database user password, or Atlas network access list needs attention.
- If Gemini returns a temporary 503, the server retries with backoff; retry the case later if the provider remains busy.
- Add a custom domain from the Render service settings when you're ready. The frontend uses a relative `/api/v1` URL, so it will continue to call the API on the same domain.
- Free Render web services can spin down when idle and take time to wake on the next request. Choose a paid always-on service if that delay is unsuitable.
