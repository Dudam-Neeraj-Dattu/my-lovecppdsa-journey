---
sidebar_position: 6
title: Nginx, HTTPS, and the Final Deployment
---


# 10.6 The Pre-Final Mile: Nginx Reverse Proxy, HTTPS, and a Live Application

With my application running on the server, the final challenge was to solve a series of complex networking and security issues that are common in production environments. This is where I learned the true value of a reverse proxy and HTTPS.

---

## Nginx as the Gateway: Reverse Proxying and Securing the Application

I discovered that the best practice—and the solution to my CORS and networking problems—was to put both the frontend and backend behind a single "front door" using a third Nginx container as a **reverse proxy**.

**Analogy: The Restaurant Maître d'**

I started thinking of my application like a restaurant:

- Users should only have one address to go to: `http://43.205.229.41`.
- The **Nginx reverse proxy** is the **maître d'** standing at the front door (port 80).
- When a request comes for the website (e.g., `/` or `/dashboard`), the maître d' directs the user to the **frontend container** (the dining area).
- When a request comes for the API (e.g., `/api/v1/users/login`), the maître d' directs that request to the **backend container** (the kitchen).

From the browser's perspective, everything is coming from the same origin, so there are **no CORS issues**.

---

## The Final Implementation: Step by Step

**Step 1: Create the Nginx Config**

I wrote a custom `nginx.conf` file to define the routing rules for the reverse proxy.

**Step 2: Add the Nginx Container**

I added the Nginx container to my `docker-compose.yml` and removed the `expose` settings from the backend and frontend. Now, only Nginx was exposed to the outside world, acting as the single entry point.

---

## The "405 Not Allowed" Error: The Final Networking Puzzle

I was incredibly close, but then hit a `405 Not Allowed` error. This was caused by a mismatch in my frontend's environment variables.

### The Problem: The Frontend Was Calling the Wrong "Door"

My frontend was configured with:
```
VITE_BACKEND_URL='http://43.205.229.41:3000/api/v1'
```
This meant the frontend was trying to talk directly to the backend's port 3000, bypassing the Nginx "maître d'". Nginx, expecting all traffic to come through it, got confused and rejected the request.

### The Fix: Update the Frontend Environment Variable

I changed the frontend `.env` file to use a simple, relative path:
```
VITE_BACKEND_URL='/api/v1'
```
Now, all API calls went through Nginx, and routing worked perfectly.

---

## WebSockets and the Nginx Proxy

I also realized my frontend was trying to connect to the backend for WebSockets directly:
```
VITE_BACKEND_SOCKET_URL='http://43.205.229.41:3000/'
```
This bypassed Nginx and was blocked by the browser. The fix was to remove this variable and let the frontend connect to the main address, letting Nginx handle the connection.

**Final `.env` for the frontend:**
```
VITE_BACKEND_URL='/api/v1'
# VITE_BACKEND_SOCKET_URL is no longer needed
```

---

## Managing Dev vs. Prod Environments

I learned that I needed different configurations for development and production. Vite exposes the current mode in `import.meta.env.MODE`, so I updated my `socketMiddleware.js` to use the correct connection logic based on the environment.

---

## The Final Bug: The `502 Bad Gateway`

After deploying the containers, I hit a `502 Bad Gateway` error. The backend and frontend containers were running, but they couldn't communicate inside Docker's network. This was a classic race condition in automated deployment.

The solution was to define an **explicit, dedicated network** in the `docker-compose.yml` file. This ensured all three containers (`backend`, `frontend`, and `nginx`) were connected to the same private network from the start, creating a stable and reliable communication channel.

---

## Securing the Site with HTTPS

The final step was to secure the application with HTTPS, eliminating the "Not Secure" browser warning and providing end-to-end encryption. This was a two-part process:

1. **Cloudflare (The Public-Facing Certificate):** I used a free SSL certificate from Cloudflare to secure the connection between the user's browser and Cloudflare's network. This provided the padlock icon and protected against common attacks like DDoS.
2. **Certbot & Let's Encrypt (The Internal Certificate):** To achieve full end-to-end encryption, I used **Certbot** on the EC2 server to obtain a second free certificate from **Let's Encrypt**. This certificate secured the connection between Cloudflare's network and my server itself.

After a final, challenging debugging session involving conflicting Nginx processes on the server, the application was successfully deployed and accessible to the world at **`https://lovecppdsa.com`**.