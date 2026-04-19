---
sidebar_position: 1
---

# Introduction

Welcome to the technical journey of **LoveCppDSA**. What began as a simple tool to track progress through a DSA playlist evolved into a comprehensive, full-stack MERN application designed to create an interactive and collaborative learning ecosystem.

This platform is more than just a checklist; it's a feature-rich environment built to support every stage of a developer's DSA learning path. It combines personal progress tracking with real-time community interaction and a suite of advanced, AI-powered tools.

### Core Features

* **Dynamic Progress Dashboard:** A complete tracker for the 222-problem DSA playlist, featuring topic-wise completion, visual progress bars, and smart filters.
* **Real-Time Chat System:** A full-featured, one-on-one chat built with **Socket.IO**, including live online status, unread message notifications, and a rich messaging experience with Markdown and code snippet support.
* **User Discovery Engine:** A sophisticated recommendation system to help users find and connect with fellow coders on a similar journey, optimized with **Redis caching**.
* **AI-Powered Tutor:** An integrated AI assistant powered by **Google Gemini** and the **LangChain** framework. It uses a **RAG (Retrieval-Augmented Generation)** architecture to provide context-aware help in both a "General Discussion" mode and a strict "Mock Interview" mode for any problem.
* **Comprehensive User Profiles:** Secure user authentication with JWTs, detailed public and private user profiles, and cloud-based avatar uploads via Cloudinary.
* **Full Production Deployment:** The entire application is containerized with **Docker** and deployed on an **AWS EC2** instance, served securely via an **Nginx** reverse proxy with HTTPS, and features a complete **CI/CD pipeline** with **GitHub Actions** for automated testing and deployment.

### Tech Stack

This project was built using a modern, professional tech stack.

* **Frontend:**
    * React
    * Redux Toolkit (for state management)
    * Tailwind CSS
    * Vite (for the build tooling)
    * Framer Motion (for animations)
* **Backend:**
    * Node.js
    * Express.js
* **Database & Caching:**
    * MongoDB (with Mongoose ODM)
    * Redis (for caching)
* **Real-Time & AI:**
    * Socket.IO
    * LangChain.js
    * Google Gemini API
* **DevOps & Deployment:**
    * Docker & Docker Compose
    * Nginx
    * AWS EC2
    * GitHub Actions (for CI/CD)

---

### Packages Used

#### Backend

- **@langchain/core**: Core utilities for building language model applications.
- **@langchain/google-genai**: Google Gemini API integration for AI features.
- **bcrypt**: Password hashing for secure authentication.
- **cloudinary**: Cloud-based image and file uploads.
- **cookie-parser**: Parse cookies for Express apps.
- **cors**: Enable Cross-Origin Resource Sharing.
- **dotenv**: Load environment variables from `.env` files.
- **express**: Web framework for Node.js.
- **express-rate-limit**: Middleware to limit repeated requests.
- **helmet**: Security middleware for HTTP headers.
- **jsonwebtoken**: JWT creation and verification for auth.
- **langchain**: Framework for building LLM-powered apps.
- **mongoose**: MongoDB object modeling tool.
- **multer**: Middleware for handling file uploads.
- **nodemailer**: Email sending from Node.js.
- **redis**: Redis client for caching and pub/sub.
- **socket.io**: Real-time bidirectional event-based communication.

**Dev Dependencies:**
- **jest**: JavaScript testing framework.
- **mongodb-memory-server**: In-memory MongoDB for testing.
- **nodemon**: Auto-restart server on code changes.
- **supertest**: HTTP assertions for integration testing.

#### Frontend

- **@reduxjs/toolkit**: State management for React.
- **axios**: Promise-based HTTP client.
- **emoji-picker-react**: Emoji picker component.
- **motion**: Animation library for React.
- **react**: UI library for building interfaces.
- **react-dom**: DOM bindings for React.
- **react-hot-toast**: Toast notifications for React.
- **react-icons**: Popular icon packs as React components.
- **react-markdown**: Render Markdown in React.
- **react-parallax-tilt**: Parallax tilt hover effect.
- **react-redux**: Official React bindings for Redux.
- **react-router-dom**: Declarative routing for React.
- **react-scroll**: Scroll animations and navigation.
- **react-syntax-highlighter**: Syntax highlighting for code blocks.
- **rehype-sanitize**: Sanitize HTML in Markdown.
- **remark-breaks**: Convert line breaks in Markdown.
- **remark-gfm**: GitHub Flavored Markdown support.
- **socket.io-client**: Real-time client for Socket.IO.

**Dev Dependencies:**
- **@eslint/js**: ESLint JavaScript rules.
- **@tailwindcss/vite**: Tailwind CSS integration for Vite.
- **@types/react**: TypeScript types for React.
- **@types/react-dom**: TypeScript types for React DOM.
- **@vitejs/plugin-react**: React plugin for Vite.
- **eslint**: Pluggable JavaScript linter.
- **eslint-plugin-react-hooks**: ESLint rules for React Hooks.
- **eslint-plugin-react-refresh**: Fast refresh for React in development.
- **globals**: Global variables for ESLint configs.
- **tailwindcss**: Utility-first CSS framework.
- **vite**: Fast frontend build tool.