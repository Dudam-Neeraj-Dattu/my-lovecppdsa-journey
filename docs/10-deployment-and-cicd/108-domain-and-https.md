---
sidebar_position: 7
title: The Domain Expansion
---

# 10.8 The Final Mile: Domain, HTTPS, and a Live Application

The final step in this deployment journey was transitioning the application from a raw IP address to a professional, secure domain: **`https://lovecppdsa.com`**. This process involved deep dives into DNS, cloud security, and a marathon 13-hour debugging session to solve a series of classic production networking issues. Every detail, challenge, and fix along the way contributed to a much deeper understanding of modern web deployment.

---

## Why Cloudflare Was the Best Choice

After comparing several domain registrars, both Porkbun and Cloudflare stood out as highly respected options. While Porkbun is a fantastic, straightforward registrar, Cloudflare offers a suite of powerful, free services that are perfectly suited for a high-performance, modern web application. The price difference is minimal, but Cloudflare's extra features are a massive advantage:

1. **Performance (Free Global CDN):** Cloudflare automatically caches static assets (images, CSS, JS) on servers around the world. This means users from anywhere get fast load times, as files are served from a nearby server instead of directly from the EC2 instance.
2. **Security (Free DDoS Protection):** Cloudflare's network absorbs most common automated attacks before they ever reach the EC2 server, providing a major security benefit.
3. **Simplified HTTPS (Free SSL Certificate):** Cloudflare provides a free, automatically renewing SSL certificate, making HTTPS setup much easier than managing Certbot manually.

A key detail with Cloudflare is that their dashboard must be used to manage DNS records. This is actually a benefit, as Cloudflare's DNS is among the fastest and most reliable. The process involved creating `A` and `CNAME` records in Cloudflare to point the new domain to the EC2 server's IP address.

---

## Setting Up DNS Records

The DNS setup process was as follows:

1. Logged into the Cloudflare dashboard and selected the new domain.
2. Navigated to the DNS settings.
3. Added an **A record** for `@` (the root domain) pointing to the EC2 public IP, with proxy ON (orange cloud).
4. Added a **CNAME record** for `www` pointing to `lovecppdsa.com`, also with proxy ON.

---

## Debugging the Final Production Bugs

With DNS configured, the final push to go live revealed a cascade of real-world networking and configuration bugs. Here’s what was learned and how each issue was fixed:

### Bug #1: The `521` Error

The first issue was a `521 Bad Gateway` error from Cloudflare, meaning Cloudflare couldn't connect to the server. The root cause was the AWS Security Group (firewall) blocking incoming traffic from Cloudflare. This was fixed by updating the inbound rules to allow HTTP (port 80) from anywhere.

### Bug #2: `Connection Refused`

Even with the firewall open, Nginx logs showed `connect() failed (111: Connection refused)` errors. The Node.js server inside the backend container was only listening for connections from `localhost`, not from other containers. The fix was to explicitly tell the server to listen on all interfaces: `server.listen(PORT, '0.0.0.0')`.

### Bug #3: The Nginx Port Conflict

Setting up end-to-end encryption was the next hurdle. Using `certbot` on the EC2 server to get a free SSL certificate from **Let's Encrypt** was straightforward, but the `certbot --nginx` command started a new Nginx process directly on the server, which conflicted with the Nginx container on port 80. The solution was to stop the server-level Nginx, obtain the certificate in standalone mode, and then mount the certificate files into the Nginx container using Docker volumes.

### Bug #4: The `docker compose` Race Condition

A subtle bug appeared: sometimes the CI/CD pipeline would result in a `521` error, but a manual restart would fix it. This was a race condition—Nginx was starting before the backend Node.js app was fully initialized. The professional solution was to add a **healthcheck** in the `docker-compose.yml` file, so Nginx would wait until the backend was healthy before starting.

---

## The Security Layers: Cloudflare and Let's Encrypt

A key learning was the difference between Cloudflare's SSL and the certificate installed with Certbot:

- **Cloudflare Certificate:** Secures the connection between the user and Cloudflare's servers (the "public-facing" security).
- **Let's Encrypt Certificate:** Secures the connection between Cloudflare and the EC2 server (the "internal" security).

By using both, the application achieved true end-to-end encryption, ensuring data is encrypted at every step of its journey.

---

## The Final Fixes and Lessons

Several additional lessons were learned during the final deployment:

- **Port Conflicts:** When Certbot or another process was using port 80, it was necessary to stop and disable the server-level Nginx so the container could use the ports.
- **Finding Rogue Processes:** Used `sudo lsof -i :80` to find and kill any process still using port 80.
- **Unlocking the Secure Door:** Ensured that port 443 (HTTPS) was open in the firewall and mapped in `docker-compose.yml` so Cloudflare could connect securely.
- **Race Conditions:** Added a healthcheck to the backend service in `docker-compose.yml` to ensure Nginx only started routing traffic once the backend was ready.

---

## The Grand Finale

After all these fixes, the application was live, secure, and stable at `https://lovecppdsa.com`. This grueling but invaluable debugging journey marked the final transition from a development project to a production-grade, globally accessible platform.

The moment the new domain was shared with family, it became clear: the project was truly live for the world to see, and every lesson learned along the way contributed to a much deeper understanding of professional deployment.