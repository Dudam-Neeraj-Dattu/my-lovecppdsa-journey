---
sidebar_position: 4
---

# Final Folder Structure

The **LoveCppDSA** project is organized as a modern monorepo, separating backend and frontend codebases for clarity, scalability, and ease of maintenance. This structure supports robust CI/CD, containerization, and efficient team collaboration.

---

## 🗂️ Project Root

The root directory contains configuration and orchestration files for the entire application, including CI/CD, Docker, and reverse proxy setup.

```plaintext
lovecppdsa/
├── .github/
│   └── workflows/
│       └── deploy.yml         # CI/CD pipeline for automated deployment
├── loveCppDsa_Backend/        # Backend service (see below)
├── loveCppDsa_Frontend/       # Frontend service (see below)
├── nginx/
│   └── nginx.conf             # Nginx reverse proxy configuration
└── docker-compose.yml         # Orchestrates all services (frontend, backend, nginx)
```

---

## 🖥️ Backend (`loveCppDsa_Backend`)

A Node.js (Express.js) application, structured for modularity and scalability. Each concern—routing, business logic, data models, real-time sockets, and AI services—lives in its own directory.

```plaintext
loveCppDsa_Backend/
├── src/
│   ├── app.js                 # Express app setup and middleware
│   ├── constants.js           # Application-wide constants
│   ├── controllers/           # Request handlers and business logic
│   ├── db/                    # Database connections (MongoDB, Redis)
│   ├── index.js               # Server entry point
│   ├── middlewares/           # Auth, file uploads, socket auth, etc.
│   ├── models/                # Mongoose schemas for all entities
│   ├── routes/                # API endpoint definitions
│   ├── services/              # AI logic (e.g., LangChain integration)
│   ├── sockets/               # Real-time event handlers (Socket.IO)
│   └── utils/                 # Helpers, error handling, prompt templates
├── .env                       # Environment variables (never commit secrets)
├── .dockerignore
├── Dockerfile                 # Backend container build instructions
└── package.json
```

---

## 💻 Frontend (`loveCppDsa_Frontend`)

A modern React application (Vite + Redux Toolkit), organized by feature for maintainability and rapid development. The "feature-slice" pattern keeps related logic together.

```plaintext
loveCppDsa_Frontend/
├── src/
│   ├── api/                   # Axios instance and API configs
│   ├── app/                   # Redux store, middleware, and setup
│   ├── assets/                # Static assets (images, logos, etc.)
│   ├── components/            # Reusable UI components
│   ├── features/              # Redux slices (auth, chat, aiChat, etc.)
│   ├── pages/                 # Top-level page components
│   ├── routes/                # Route guards (ProtectedRoute, PublicRoute)
│   ├── services/              # API service modules (authService, etc.)
│   ├── App.jsx                # Root component with router
│   └── main.jsx               # Application entry point
├── .env                       # Frontend environment variables
├── .dockerignore
├── Dockerfile                 # Frontend container build instructions
├── vite.config.js
└── package.json
```

---

This structure ensures clear separation of concerns, supports containerized deployment, and makes it easy for contributors to navigate and extend the