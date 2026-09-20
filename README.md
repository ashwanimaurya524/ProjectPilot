# 🚀 ProjectPilot — AI-Powered Project Management System

ProjectPilot is a full-stack **AI-powered project management platform** built with the MERN stack. It helps users manage projects, tasks, team communication, notifications, activity, GitHub-related functionality, and AI-assisted project workflows.

## 🔗 Project Links

- **Live Demo:** https://projectpilot-ai-sd78.onrender.com/
- **GitHub:** https://github.com/ashwanimaurya524/ProjectPilot

## ✨ Features

- 🔐 JWT authentication and bcrypt password hashing
- 📊 Personalized project/task dashboard
- 📁 Project management
- ✅ Task creation, assignment, status, priority and due dates
- 🤖 Google Gemini AI project assistant and AI-assisted task generation
- 💬 Real-time team chat with Socket.IO
- 🐙 GitHub-related project functionality
- 🔔 Notifications and activity
- 🌙 Dark/light theme support
- 🛡️ Protected routes and backend authorization

## 🛠️ Technology Stack

### Frontend
- React.js
- Vite
- React Router
- Axios
- Tailwind CSS
- Lucide React

### Backend
- Node.js
- Express.js
- JWT
- bcrypt
- Socket.IO
- CORS
- dotenv

### Database
- MongoDB
- MongoDB Atlas
- Mongoose

### AI
- Google Gemini
- `@google/genai`

### Deployment
- Render
- Vercel
- MongoDB Atlas
- GitHub

## 🏗️ Architecture

```text
User / Browser
      │
      ▼
React + Vite Frontend
      │
      │ Axios / HTTP
      ▼
Node.js + Express Backend
      │
      ├──────────────► MongoDB Atlas
      │
      ├──────────────► Google Gemini AI
      │
      └──────────────► Socket.IO
```

## 📂 Project Structure

```text
ProjectPilot/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/ashwanimaurya524/ProjectPilot.git
cd ProjectPilot
```

### 2. Frontend

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Run:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

### 3. Backend

Open another terminal:

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.5-flash
```

Run:

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

## 🔑 Environment Variables

### Frontend

Local:

```env
VITE_API_URL=http://localhost:5000
```

Production:

```env
VITE_API_URL=https://projectpilot-ocu6.onrender.com
```

### Backend

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.5-flash
```

> ⚠️ Never upload your real `.env` file, API keys, database passwords, or private tokens to GitHub.

Recommended `.gitignore`:

```gitignore
node_modules/
.env
.env.*
!.env.example
dist/
build/
```

## 🔄 Application Flow

### Authentication

```text
Login
  ↓
POST /api/auth/login
  ↓
Express Backend
  ↓
MongoDB
  ↓
JWT Token
  ↓
React Client
  ↓
Dashboard
```

### AI Request

```text
User
  ↓
AI Assistant
  ↓
React Frontend
  ↓
POST /api/ai
  ↓
Express Backend
  ↓
Google Gemini
  ↓
AI Response
  ↓
React UI
```

### Task Creation

```text
User
  ↓
Create Task
  ↓
React
  ↓
POST /api/tasks
  ↓
Express
  ↓
Authentication / Authorization
  ↓
MongoDB
```

## 🔐 Authentication

ProjectPilot uses JWT-based authentication and bcrypt password hashing.

When a user opens `/`, the application sends the user toward `/dashboard`. If the user is not authenticated, the protected route redirects to `/login`. After successful login, the user is redirected to `/dashboard`.

## 🤖 Gemini AI

Gemini is accessed from the backend using the Google GenAI SDK.

```env
GEMINI_API_KEY=your_api_key
GEMINI_MODEL=gemini-3.5-flash
```

The Gemini API key must remain server-side and should never be exposed in the React frontend.

## 📡 API Modules

```text
/api/auth
/api/projects
/api/tasks
/api/ai
/api/messages
/api/github
```

## 🌐 Deployment

### Backend — Render

Current deployed backend:

```text
https://projectpilot-ocu6.onrender.com
```

Configure these environment variables in Render:

```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.5-flash
```

### Frontend

Configure:

```env
VITE_API_URL=https://projectpilot-ocu6.onrender.com
```

Then deploy the frontend using your selected frontend hosting platform.

## 🛡️ Security

- JWT authentication
- bcrypt password hashing
- Protected routes
- Backend authorization
- Environment variables for secrets
- Server-side Gemini API key
- CORS configuration
- MongoDB Atlas authentication
- `.env` excluded from Git

## 🚀 Future Improvements

- Role-based access control
- Advanced project analytics
- File/document attachments
- Calendar integration
- Email notifications
- Advanced GitHub repository analytics
- AI project risk prediction
- AI-generated project reports
- Team performance analytics
- Automated testing
- Docker deployment
- CI/CD pipeline

## 🎯 Learning Outcomes

This project demonstrates:

- Full-stack MERN development
- React component architecture
- React Router
- REST API development
- Node.js and Express
- MongoDB and Mongoose
- JWT authentication
- Password hashing
- Protected routes
- Authorization
- Real-time communication
- Third-party API integration
- Gemini AI integration
- Environment variables
- Git and GitHub
- Cloud deployment
- Production debugging

## 👨‍💻 Developer

### Ashwani Maurya

**B.Tech — Computer Science Engineering**

📍 Noida, Uttar Pradesh

**GitHub:** https://github.com/ashwanimaurya524

## ⭐ Project Links

**Live Demo:**  
https://projectpilot-ai-sd78.onrender.com/

**GitHub Repository:**  
https://github.com/ashwanimaurya524/ProjectPilot

---

If you find this project useful, consider giving the repository a ⭐.

**ProjectPilot — AI-Powered Project Management System**

Built with ❤️ using **MERN + Gemini AI**
