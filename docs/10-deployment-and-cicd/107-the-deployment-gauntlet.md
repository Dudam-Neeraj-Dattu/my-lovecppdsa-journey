---
sidebar_position_label: "10.5 The Deployment Gauntlet & CI/CD"
sidebar_position: 6
title: The Final Frontier - A Journey Through Production Deployment & CI/CD
---

# 10.7 The Deployment Gauntlet: From Manual Steps to Full Automation

The final phase of the project was its most challenging and transformative: taking the application from a local environment to a live, production-ready product on the internet. This section chronicles the hands-on journey through containerization, cloud infrastructure, and full automation, a critical skill set that distinguishes a portfolio project from a professional-grade system.

### The Professional Workflow: Build Locally, Deploy Remotely

The failure of the on-server build was the final proof that a professional workflow was necessary. The strategy was pivoted to the industry standard: **build locally, push to a registry, and pull on the server.** A private repository was created on **Docker Hub** to act as a secure "showroom" for the finished Docker images. A key insight was that Docker Hub's free plan only allows one private repository. The solution was to use a single repository (`lovecppdsa/lovecppdsa`) and differentiate the images using **tags** (`:backend` and `:frontend`), a standard and efficient practice.

### The Deployment Gauntlet: A Real-World Debugging Session

With the new workflow in place, the application was ready for its first real deployment. This initiated a multi-hour, real-world debugging session that touched every part of the full-stack and cloud infrastructure.

* **Bug #1: Docker Hub Pull Access Denied:** The initial `docker compose pull` failed with a permission error.
    * **The Fix:** The issue was a subtle Linux permissions conflict. The solution was to run `sudo docker login` on the EC2 server to ensure the authentication credentials were saved for the root user running the Docker daemon.

* **Bug #2: Cannot Access by IP:** The containers were running, but the application was inaccessible from the browser.
    * **The Fix:** This was a firewall issue. The **AWS Security Group** was updated to create new inbound rules, opening ports `3000` (for direct backend access testing) and `5173` (for direct frontend access testing) to traffic.

* **Bug #3: Backend Can't Connect to Database:** The backend container was crashing. The logs revealed it couldn't connect to MongoDB.
    * **The Fix:** The EC2 server has a different public IP address than a local machine. This new IP address had to be added to the **IP Access List** in the MongoDB Atlas dashboard.

* **Bug #4: The Final Boss - CORS and the `502 Bad Gateway`:** With the individual containers working, a final, complex networking issue emerged. The frontend could not make API calls to the backend due to **CORS (Cross-Origin Resource Sharing)** errors.
    * **The Solution:** The professional solution was to implement an **Nginx Reverse Proxy**. A third `nginx` container was added to the `docker-compose.yml` file to act as the single "front door" for the application on port 80. This Nginx instance was configured to intelligently route traffic: requests for `/api/v1` were sent to the `backend` container, and all other requests were sent to the `frontend` container. From the browser's perspective, the entire application now came from a single origin, completely eliminating the CORS problem and resulting in a successful deployment.


### The Final Boss - Full Automation: Building a Professional CI/CD Pipeline with GitHub Actions

The culmination of my deployment journey was building a fully automated **Continuous Integration and Continuous Deployment (CI/CD) pipeline** using **GitHub Actions**. This pipeline transformed my deployment process from a series of manual, error-prone steps into a single, reliable `git push`.

I created a `deploy.yml` workflow file from scratch, codifying the entire path to production. The pipeline is triggered on every push to the `main` branch and executes the following stages:

1. **Checkout & Test:** The code is checked out, and the backend automated tests are run. If any test fails, the deployment stops, ensuring only quality code is deployed.
2. **Build & Push:** If tests pass, the workflow securely logs into Docker Hub (using secrets stored in GitHub) and runs `docker compose build` to create the new backend and frontend images. It then pushes these images to the private Docker Hub repository.
3. **Deploy:** The final stage uses a secure SSH connection (authenticating with a private key stored as a GitHub Secret) to connect to the EC2 server. It then executes a script on the server that runs `git pull` (to get the latest `docker-compose.yml`), `docker compose pull` (to download the new images), and `docker compose up -d` (to restart the application with zero downtime).

By the end of this process, I had not only built and deployed an application but had also engineered the automated "factory" that can reliably test, package, and ship it. Mastering Infrastructure as Code—using declarative files like `Dockerfile`, `docker-compose.yml`, and `deploy.yml` to manage the entire system—was a huge step in my DevOps journey.

---

<details>
<summary>💡 <strong>What is CI/CD? (The Robot Chef Analogy)</strong></summary>

Remember my earlier restaurant analogy? CI/CD is like hiring a fully automated robot chef and construction crew that works 24/7.

- **CI (Continuous Integration):** This is the "Quality Check" part of the assembly line. Every time I push new code to GitHub, the robot immediately runs all my automated tests. If a test fails, the robot stops everything and alerts me. This ensures that broken code never makes it to production.
- **CD (Continuous Deployment):** This is the "Delivery" part. If the quality check passes, the robot automatically:
    1. Builds new Docker images (the "kitchen stations").
    2. Pushes them to Docker Hub (the "showroom").
    3. Connects to my EC2 server and deploys the new version of the application.

This entire process happens automatically, usually in a few minutes, every time I run `git push`.

**Jenkins vs. GitHub Actions (The Tool for the Job)**

I considered Jenkins, which is a powerful and well-known tool for CI/CD. But Jenkins is like a classic, industrial robot: powerful, but you have to set it up and maintain it yourself. GitHub Actions, on the other hand, is a modern, smart robot that's already built into my GitHub repository. It's easier to set up, requires no extra server, and is a highly in-demand skill. For my project, GitHub Actions was the perfect tool.

</details>

---

## Step 1: Storing Secrets in GitHub

My automation workflow needed to log in to Docker Hub and my EC2 server. I learned to **never** put passwords or private keys directly into code. Instead, I used **GitHub Actions Secrets**, which is secure, encrypted storage for credentials.

I went to my repository's Settings > Secrets and variables > Actions, and added secrets for:
- `DOCKERHUB_USERNAME` (my Docker Hub username)
- `DOCKERHUB_TOKEN` (an access token from Docker Hub)
- `EC2_HOST` (my EC2 instance's public IP)
- `EC2_USERNAME` (`ubuntu`)
- `EC2_SSH_KEY` (the private SSH key from my server)

Then, I added every single variable from my backend `.env` file as a secret in GitHub (like `MONGODB_URI`, `PORT`, `CORS_ORIGIN`, `ACCESS_TOKEN_SECRET`, etc.).

---

## Step 2: Update `docker-compose.yml` to Use Environment Variables

I updated my `docker-compose.yml` so it reads environment variables from the system, not from a file. This makes it flexible for both local and CI/CD environments.

---

## Step 3: Update the `deploy.yml` Workflow

I made sure my GitHub Actions workflow passes the secrets into the build step and deployment.

---

## Debugging the CI/CD Pipeline: What I Learned

I ran into a series of classic CI/CD problems and learned a ton from each one:

1. **env file not found:**
    - The pipeline failed because the `.env` file wasn't present in the GitHub Actions environment. I learned that secrets must be added as GitHub Secrets and injected at build time.
2. **SSH Timeout:**
    - The workflow couldn't connect to my EC2 server because the firewall only allowed SSH from my IP. I updated the AWS Security Group to allow SSH from `0.0.0.0/0` (temporarily, for CI/CD).
3. **SSH Authentication Failed:**
    - The workflow reached the server, but the server didn't recognize the key. I fixed this by appending the public key to `~/.ssh/authorized_keys` and setting the right permissions.
4. **Case Sensitivity in Linux:**
    - The workflow failed with `cd: ***: No such file or directory` because the folder name casing didn't match. I updated the script to use the correct case.
5. **Secrets Not Set on Server:**
    - The backend container couldn't start because environment variables weren't set on the server. I updated the deployment script to create the `.env` file in the correct root directory before starting the containers.
6. **Networking Race Condition:**
    - Sometimes, the containers couldn't communicate because Docker's default network wasn't reliable in fast CI/CD runs. I fixed this by defining an explicit network in `docker-compose.yml`.
7. **Two Nginx Servers?**
    - I learned that the Nginx in the frontend container is just a static file server (the "waiter"), while the main Nginx container is the reverse proxy (the "maître d'"). This separation is standard and solves CORS issues.

---

Every step, every error, and every fix in this gauntlet taught me something new about professional DevOps, cloud security, and the realities of deploying a full-stack application in production. By the end, I had not only shipped a live app, but also built the automated factory that will keep it running smoothly with every push.