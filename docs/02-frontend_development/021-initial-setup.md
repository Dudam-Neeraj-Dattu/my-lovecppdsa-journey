---
sidebar_position: 1
title: SPA Paradigm & Initial Setup
---

# 2.1 Embracing the Single-Page Application (SPA) Paradigm

When I started building the frontend for LoveCppDSA, I drew on my experience from simpler projects, but I knew that a more complex, authentication-driven application would require a robust architecture. Choosing the Single-Page Application (SPA) model was fundamental. Unlike traditional multi-page apps that reload the entire page for every interaction, an SPA loads a single HTML shell and dynamically updates its content, giving users a fast, seamless experience—much like a desktop app.

To achieve this, I relied on two core libraries:

---

<details>
<summary>💡 Why <code>react-router-dom</code>?</summary>

This application, LoveCppDSA, is designed to have multiple "views" or "screens": a login page, a registration page, and a dashboard where users track their progress. In a traditional website, each of these "screens" would be a separate HTML file. However, since this is a **Single Page Application (SPA)**, everything is handled within a single HTML page.

- **Single Page Application (SPA):** An SPA loads a single HTML page and dynamically updates its content as the user interacts with the application, rather than reloading entire new pages from the server. This provides a faster, smoother, and more "app-like" user experience.
- **The Problem:** Since there's only one HTML page, I needed a way to show different content (like the login form versus the registration form) based on what the user wants to do or what URL they type in. I also wanted users to navigate between these different "screens" without a full page reload.
- **The Solution: react-router-dom:** This library provides **client-side routing** for React applications. It allows me to:
  - **Define different "paths" (URLs)** within the single-page application (e.g., /login, /register, /dashboard).
  - **Render specific React components** when the URL matches a defined path.
  - **Enable navigation** between these paths without causing a full page refresh, making the user experience seamless.

**What are BrowserRouter, Routes, Route, Link from react-router-dom?**

These are the core building blocks I used from react-router-dom to achieve client-side routing:

- **BrowserRouter as Router**:
    - **What it is:** This is the foundational component for react-router-dom. I wrapped my entire application with it. It uses the HTML5 history API (which modifies the browser's URL directly without a full page reload) to keep the UI in sync with the URL.
    - **Why I need it:** It provides the context for all other routing components to work. Without it, Routes, Route, and Link wouldn't know how to interact with the browser's URL. I use it as Router just for a shorter, more conventional alias.
    - **Where it goes:** It *must* wrap the entire application's routing logic. That's why my App component's JSX is enclosed within `<Router>...</Router>`.
- **Routes**:
    - **What it is:** This component is like a container for all the individual Route components. It looks at the current URL and renders the *first* Route whose path matches the URL.
    - **Why I need it:** It efficiently manages multiple Route definitions. Before Routes, you'd use Switch, but Routes is the modern, improved way to handle this.
    - **Where it goes:** Inside BrowserRouter, it contains all the Route definitions.
- **Route**:
    - **What it is:** This component defines a specific path and the React component that should be rendered when that path is active.
    - **Why I need it:** This is how I tell react-router-dom "if the URL is /login, show the LoginPage."
    - **Key Props:**
        - path: The URL path to match (e.g., "/login").
        - element: The React component to render when the path matches (e.g., `<LoginPage />`).
- **Link**:
    - **What it is:** This component is the React Router equivalent of an HTML `<a>` tag.
    - **Why I need it:** When I click a Link component, react-router-dom intercepts the click and changes the URL using the history API *without* causing a full page reload. If I used a regular `<a>` tag, it would trigger a full page reload, defeating the purpose of an SPA.
    - **Key Props:**
        - to: The internal application path to navigate to (e.g., "/login").
</details>

---

<details>
<summary>💡 Why <code>axios</code>?</summary>

- **What it is:** axios is a popular, promise-based HTTP client for the browser and Node.js.
- **Why I chose it:** My frontend React application needed to communicate with the backend Express.js API. This communication happens over HTTP (e.g., sending user credentials for login, fetching topics/problems). axios makes it very easy to send GET, POST, PATCH requests, handle responses, and manage errors. While I *could* have used the native fetch API, axios offers a more streamlined experience, especially for features like request/response interceptors, automatic JSON parsing, and better error handling.
</details>

---

With these libraries in place, I wrote the initial code for `App.jsx`, then added `login` and `register` pages in the `pages` folder. I created an `axiosInstance` in the `api` folder and used it in `authservices.js` inside the `services` folder to handle authentication actions.

Before moving further, I refactored `App.jsx` for a more modular approach—moving large chunks of code into components and pages, and importing them as needed.

The first real integration was connecting the client to the backend for login. Initially, I ran into a CORS (Cross-Origin Resource Sharing) error: the backend was rejecting requests from the frontend because they were coming from a different origin (`localhost:5173` vs. `localhost:3000`). At first, I set `CORS_ORIGIN = '*'` on the backend while also sending credentials, but browsers prohibit this for security reasons. The correct solution was to explicitly whitelist the frontend's origin in the backend's `.env` file: `CORS_ORIGIN=http://localhost:5173`. After this fix, my first successful login worked, and I used the `useNavigate` hook from `react-router-dom` to redirect the user to the dashboard.