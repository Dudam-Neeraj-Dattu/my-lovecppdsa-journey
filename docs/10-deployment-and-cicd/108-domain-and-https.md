---
sidebar_position: 7
title: The Domain Expansion
---


# 10.6 The Final Mile: Domain, HTTPS, and a Live Application

The final step in my deployment process was to transition the application from a raw IP address to a professional, secure domain: **`https://lovecppdsa.com`**. This journey took me deep into DNS, cloud security, and a marathon 13-hour debugging session to solve a series of classic production networking issues.

---

## Why I Chose Cloudflare

After comparing several domain registrars, I chose **Cloudflare**. While other options like Porkbun were simple and affordable, Cloudflare offered a suite of powerful, free services that are perfect for a modern web application:

1. **Performance (Free Global CDN):** Cloudflare automatically caches static assets (images, CSS, JS) on servers around the world, making my site load much faster for users everywhere.
2. **Security (Free DDoS Protection):** My application is protected by Cloudflare's network, which absorbs most common attacks before they ever reach my EC2 server.
3. **Simplified HTTPS (Free SSL Certificate):** Cloudflare provides a free, automatically renewing SSL certificate, making HTTPS setup much easier.

I learned that with Cloudflare, I must use their dashboard to manage DNS records, but this is actually a benefit—their DNS is fast and reliable. I created `A` and `CNAME` records in Cloudflare to point my new domain to the EC2 server's IP address.

---

## Setting Up DNS Records

I logged into the Cloudflare dashboard, selected my domain, and went to the DNS settings. I added:

- An **A record** for `@` (the root domain) pointing to my EC2 public IP, with proxy ON (orange cloud).
- A **CNAME record** for `www` pointing to `lovecppdsa.com`, also with proxy ON.

---

## The Final Gauntlet: Debugging Production Bugs

With DNS configured, the final push to go live revealed a cascade of real-world networking and configuration bugs. Here’s what I learned and how I fixed each one:

### Bug #1: The `521` Error

The first issue was a `521 Bad Gateway` error from Cloudflare. This meant Cloudflare couldn't connect to my server. The root cause was the **AWS Security Group** (firewall) blocking incoming traffic from Cloudflare. I fixed this by updating the inbound rules to allow HTTP (port 80) from anywhere.

### Bug #2: `Connection Refused`

Even with the firewall open, Nginx logs showed `connect() failed (111: Connection refused)` errors. The Node.js server inside the backend container was only listening for connections from `localhost`, not from other containers. The fix was to explicitly tell the server to listen on all interfaces: `server.listen(PORT, '0.0.0.0')`.

### Bug #3: The Nginx Port Conflict

Setting up end-to-end encryption was the next hurdle. I used `certbot` on the EC2 server to get a free SSL certificate from **Let's Encrypt**. But the `certbot --nginx` command started a new Nginx process directly on the server, which conflicted with my Nginx container on port 80. The solution was to stop the server-level Nginx, obtain the certificate in standalone mode, and then mount the certificate files into the Nginx container using Docker volumes.

### Bug #4: The `docker compose` Race Condition

The final bug was subtle: sometimes the CI/CD pipeline would result in a `521` error, but a manual restart would fix it. This was a race condition—Nginx was starting before the backend Node.js app was fully initialized. The professional solution was to add a **healthcheck** in the `docker-compose.yml` file, so Nginx would wait until the backend was healthy before starting.

---

## The Grand Finale

After this final fix, my application was live, secure, and stable at `https://lovecppdsa.com`. This grueling but invaluable debugging journey marked the final transition from a development project to a production-grade, globally accessible platform.

I’ll never forget the moment I sent the new domain to my mom—she scrolled to the bottom, saw my photo, and said it looked good. That’s when it really hit me: I have my own domain name, and my project is truly live for the world to see.