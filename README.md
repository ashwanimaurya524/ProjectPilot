# ProjectPilot AI

MERN AI project management application with:

- JWT authentication
- Project and task management
- AI Task Breakdown
- AI Project Assistant
- Real-time Socket.IO collaboration and chat
- GitHub OAuth + repository linking
- Notifications and activity feed
- Team management

## Local setup

### Server

```bash
cd server
copy .env.example .env
npm install
npm run dev
```

Fill `server/.env` with your MongoDB URI, JWT secret, Gemini key, and optional GitHub/Gmail credentials.

### Client

```bash
cd client
copy .env.example .env
npm install
npm run dev
```

The client defaults to `http://localhost:5000` when `VITE_API_URL` is not supplied.

## GitHub OAuth

For local development use:

`GITHUB_CALLBACK_URL=http://localhost:5000/api/github/callback`

For production, use your Render backend URL and set the same callback URL in the GitHub OAuth App.

## Render

Create a Render Web Service with root directory `server`, build command `npm install`, and start command `npm start`. Add the variables from `server/.env.example` in Render. Set the Vercel frontend URL in `CLIENT_URL`.

## Vercel

Set `VITE_API_URL` to the deployed Render API URL and redeploy the React client.
