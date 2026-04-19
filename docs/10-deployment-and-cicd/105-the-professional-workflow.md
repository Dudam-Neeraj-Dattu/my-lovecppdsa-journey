---
sidebar_position: 5
title: The Professional Workflow & The Deployment Gauntlet
---


# 10.5 The Professional Deployment Workflow

The failure of the on-server build was the final proof for me that a professional workflow was necessary. I realized I needed to **build the Docker images on my powerful local PC** and then **push them to a container registry (like Docker Hub)**. My small EC2 server's only job would be to *download* and *run* these pre-built, finished images.

---

## 10.3.2 The Professional Way: Step-by-Step

Here's exactly how I learned to do it, and what I discovered at each step:

### Step 1: Stop the Hung Process on the EC2 Server

I went to my EC2 terminal where the build was stuck, pressed `Ctrl + C` to cancel, and ran `docker compose down` to make sure everything was stopped and cleaned up.

### Step 2: Create a Free Docker Hub Account

I signed up for a free account at https://hub.docker.com/ and made note of my Docker ID (username). This would be my secure "warehouse" for finished application images.

### Step 3: Log In to Docker Hub on My Local Computer

On my local PC, I opened a terminal and ran:

```bash
docker login
```

I entered my Docker ID and password.

### Step 4: Update the `docker-compose.yml` File

On my local PC, I opened the `docker-compose.yml` file at the root of my project. I added an `image:` line for both the `backend` and `frontend` services, replacing `your-docker-id` with my actual Docker Hub username:

```yaml
services:
  backend:
    image: my-docker-id/lovecppdsa-backend
    build: ./loveCppDsa_Backend
  frontend:
    image: my-docker-id/lovecppdsa-frontend
    build: ./loveCppDsa_Frontend
```

### Step 5: Build and Push the Images from My Local PC

I ran the build command:

```bash
docker compose build
```

Once the build was complete, I pushed the images to Docker Hub:

```bash
docker compose push
```

After the push, my professional, pre-built application images were stored on the internet, ready for any server to download and run.

---

#### The Private Repository Limitation and the Tag Solution

At this point, I noticed that Docker Hub's free plan only allows for **one private repository**. I wanted both my backend and frontend images to be private, but it was asking for payment to make a second one private. The solution was to use a single repository with different **tags** (like `:backend` and `:frontend`).

**Analogy:** A Docker Hub repository is like a folder, and a Docker tag is like a file inside that folder. So I used `my-docker-id/lovecppdsa:backend` and `my-docker-id/lovecppdsa:frontend`.

---

### Step 6: Log In to Docker Hub on the EC2 Server

Back on the EC2 server, I navigated to the project root and ran:

```bash
docker login
```

I entered my Docker Hub username and password when prompted.

---

### Step 7: Run the Application

With everything in place, I started the application:

```bash
docker compose up -d
```

This time, I did **not** use the `--build` flag. Docker Compose read my `docker-compose.yml` file and **pulled** the pre-built, private images directly from Docker Hub. This was much faster and more efficient.

---

## The Real-World Debugging Gauntlet: What I Learned

After this, I faced a series of real-world problems, and here's how I (with Copilot's help) solved each one:

1. **Pull Warnings and Unwanted Builds:**
    - I got warnings that images couldn't be pulled, and Docker started building instead. I stopped the build with `Ctrl+C`, double-checked spellings, names, and tags—everything was correct.
2. **Removing Build Syntax for Production:**
    - Copilot suggested removing the `build` syntax from the production compose file. I created a new `docker-compose-prod.yml` without the `build` commands.
3. **Still Building Instead of Pulling:**
    - After pulling the latest code and running `sudo docker compose -f docker-compose-prod.yml up -d`, the problem persisted. I checked Docker Hub—everything looked fine.
4. **Credentials and Permissions:**
    - I checked `cat ~/.docker/config.json` and saw credentials were there. I tried logging out and back in with credentials instead of browser-based login. Still, the issue remained.
5. **Sudo and Docker Permissions:**
    - I tried `sudo docker compose -f docker-compose-prod.yml up -d`—still the same problem.
6. **Root User Authentication:**
    - Finally, I did `docker logout`, then `sudo docker login`, and then `sudo docker compose -f docker-compose-prod.yml up -d`. This time, it pulled the images and ran the containers on EC2.
7. **Can't Access by IP/Port:**
    - I couldn't access the app at `http://<public-ip>:3000`. Copilot suggested editing the AWS Security Group inbound rules to add custom TCP rules for ports 3000 and 5173, source set to my IP for security. After saving, I could see the application running.
8. **Backend Not Connecting to Database:**
    - The backend wasn't running. Checking logs with `sudo docker logs lovecppdsa-backend-1`, I saw it was trying to connect to the DB. Copilot told me to whitelist the new EC2 IP in MongoDB Atlas. After doing so and restarting the backend, it connected.
9. **Frontend Can't Access Backend (CORS):**
    - The frontend couldn't access the backend. I realized the `.env` CORS origin was set to localhost. I changed it to the new EC2 IP in both backend and frontend `.env` files, then restarted the containers.
10. **Frontend Still Using Localhost:**
    - The frontend was still using localhost. I updated the code to force it to use `VITE_BACKEND_URL` only, committed, built locally, pushed to Docker Hub, pulled on EC2, and pruned old images before restarting everything.
11. **Frontend Still Not Connected:**
    - Still no connection. I found a typo in the backend `.env` (wrote `http:43...` instead of `http://43...`). Fixed it and restarted.
12. **CORS Origin and Browser IP:**
    - The frontend still couldn't access the backend. I realized the CORS origin in the backend only allowed requests from the EC2 IP, but I was accessing from my own IP. The request was coming from my IP, not the EC2's. I remembered two options: set CORS origin to `*` or use a proxy in the Vite config. At this point, I paused, unsure of the best practice for production.

---

This entire process was a true gauntlet of real-world deployment and debugging. Every step, every error, and every fix taught me something new about professional DevOps, cloud security, and the realities of deploying a full-stack application in production.