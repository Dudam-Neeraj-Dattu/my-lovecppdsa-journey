---
sidebar_position: 3
title: Initial steps From Local to a Live AWS Server
---

# 10.3 The Deployment Gauntlet: From Local Compose to a Live AWS Server

With the application fully containerized, the next step was to deploy it to a public cloud server. An **AWS EC2 instance** (specifically, a `t2.micro` from the free tier) was chosen, provisioned with an Ubuntu OS, and its security groups were configured to allow incoming web traffic.

---

## The "Build in the Garage" Failure

The initial deployment attempt involved cloning the repository onto the new EC2 instance and running `docker compose build` directly on the server. This led to a frustrating but incredibly valuable failure. The small `t2.micro` instance, with its limited CPU and RAM, struggled immensely with the resource-intensive build process. The build was painfully slow, pegged the CPU at 80%, and ultimately hung after running out of memory.

> This hands-on struggle provided a deep, practical understanding of a core DevOps principle: **separate the build environment from the run environment**. The failure was not a mistake but a direct demonstration of why CI/CD pipelines and container registries are not luxuries but necessities for professional deployment.

This experience prompted a pivot to the correct professional workflow. A private repository was created on **Docker Hub** to act as a container registry. The powerful local machine was used to build the Docker images, which were then "pushed" to this private repository. The EC2 server's role was simplified to just "pulling" these pre-built, finished images and running them—a much less resource-intensive task.

---

<details>
  <summary><strong>Deep Dive: The AWS EC2 Setup Process</strong></summary>

  The deployment process began with setting up a virtual server on AWS:

  1. **Account Creation:** A new account was created using the AWS Free Tier.
  2. **Launch Instance:** An EC2 instance was launched with the following configuration:
      - **Name:** `lovecppdsa-server`
      - **OS Image (AMI):** Ubuntu (Free tier eligible)
      - **Instance Type:** `t2.micro` (The standard Free Tier server)
      - **Key Pair:** A new `.pem` key was created and securely stored for SSH access.
      - **Network Settings (Security Group):** The firewall was configured to allow incoming traffic for:
          - SSH (Port 22, restricted to My IP)
          - HTTP (Port 80, Anywhere)
          - HTTPS (Port 443, Anywhere)
  3. **Tool Installation:** After connecting to the server via SSH, the latest versions of Docker and the Docker Compose plugin were installed from Docker's official repositories.
</details>

---

<details>
<summary>**Step-by-Step AWS EC2 Setup**</summary>

### Step 1: Create an AWS Account

1. Go to the AWS Free Tier page: https://aws.amazon.com/free/
2. Click "Create a Free Account" and follow the instructions.
3. **Note:** A credit card is required for verification, but as long as only "Free Tier eligible" services are used, there will be no charges.

### Step 2: Launch Your Virtual Server (EC2 Instance)

Once the account is created and logged into the **AWS Management Console**, follow these steps:

1. In the search bar at the top, type **"EC2"** and select it from the results to access the EC2 Dashboard.
2. Click the orange **"Launch instance"** button.
3. Fill out the launch wizard as follows:
    - **Name:** Assign a name, such as `lovecppdsa-server`.
    - **Application and OS Images (AMI):** Select **Ubuntu** (ensure it is "Free tier eligible").
    - **Instance type:** Select **`t2.micro`** (the standard Free Tier server).
    - **Key pair (login):**
        - Click **"Create new key pair."**
        - Name it (e.g., `lovecppdsa-key`).
        - Key pair type: RSA
        - Private key file format: **`.pem`**
        - Click **"Create key pair."** The `.pem` file will download immediately—store it securely, as it is required for SSH access.
    - **Network settings:**
        - Click **"Edit."**
        - In the "Security group rule" section, ensure SSH (port 22) is present. For "Source type," change from "Anywhere" to **"My IP"** for security.
        - Add two more rules:
            - **Rule 2:** Type: `HTTP`, Source type: `Anywhere` (opens port 80 for web traffic).
            - **Rule 3:** Type: `HTTPS`, Source type: `Anywhere` (opens port 443 for secure traffic).
4. **Launch Instance:** Leave all other settings as defaults and click the orange **"Launch instance"** button at the bottom right.

</details>
---

## Key Lessons and Professional Workflow

- **Resource Constraints:** Building Docker images on a low-resource server is impractical. The build process should be performed on a powerful local machine or in a CI/CD pipeline.
- **Separation of Concerns:** The build environment (where images are created) should be separate from the run environment (where images are deployed and executed).
- **Container Registry:** Using Docker Hub (or another registry) allows for efficient, scalable deployment. The server only needs to pull and run images, not build them.
- **Security Best Practices:** Proper configuration of security groups (firewall rules) is essential to protect the server while allowing necessary traffic.

---

This deployment phase not only delivered a live, cloud-hosted application but also provided practical experience with real-world DevOps workflows, cloud provisioning, and the importance of scalable, maintainable deployment strategies.