---
sidebar_position: 2
title: Email Verification System
---

# 4.2 Engineering User Trust - Implementing Email Verification with OTP

To enhance user security and ensure the authenticity of accounts, the next major feature was to implement an email verification system using a One-Time Password (OTP). This seemingly straightforward feature required a significant backend refactor, a deep dive into email services, and a careful data migration.

### Schema Refactor and Data Migration

The first step was to update the `User` model to support the OTP flow. New fields were added to store a hashed OTP and an expiry timestamp (set to 10 minutes).

To update existing users to this new schema, a standalone `migrate.js` script was written. This process surfaced a practical DevOps challenge: a standalone Node.js script does not automatically load environment variables. The solution was to explicitly configure the `dotenv` package at the start of the script, a key lesson in managing configurations outside of the main application entry point.

### The Deep Dive into Email Services

The most significant hurdle was choosing and implementing a service to send emails from the backend. This led to a comprehensive research journey:
1.  **Initial Research:** The journey began with `nodemailer`, a popular Node.js library, and `ethereal.email`, a great service for temporary test emails.
2.  **The Real Email Challenge:** The goal was to send emails from a real Gmail account. Initial exploration into client-side services like `emailjs` revealed a critical limitation: they were designed for contact forms and did not allow for dynamically setting the recipient's (`to`) address.
3.  **Transactional Email Services:** Further research led to professional, transactional email services like Mailgun and Amazon SES. While powerful, these were primarily paid services.
4.  **The Breakthrough (Gmail "App Passwords"):** The final solution came from returning to `nodemailer` and discovering the concept of a Gmail **"App Password."** This is a 16-digit code that you can generate from your Google Account settings. It allows a specific application (like this backend server) to send emails on your behalf without you having to expose your main account password. This was the key to a secure and free email implementation.

### The Implementation Flow

With the email service figured out, the full feature was implemented across more than 15 files. To manage the complexity of the data flow, I created a detailed flow map, which was crucial for visualizing how the frontend, backend, and Redux state would interact.

![OTP Verification Flow Map](./img/otp-flow-map.png)

This structured approach allowed for the successful creation of new utility functions for OTP generation and email transport, new controller methods for sending and verifying the OTP, and the full frontend integration with new pages and Redux state.