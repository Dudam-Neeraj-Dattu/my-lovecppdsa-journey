---
sidebar_position: 6
title: Complete Authentication System
---

# 3.6 Overview of the Complete Authentication System

The application is built on a secure, two-token (Access Token & Refresh Token) architecture. The flow is carefully orchestrated between the frontend (React/Redux/Axios Interceptor) and the backend (Express/JWT/Mongoose) to provide a persistent and secure user experience.

Below is a step-by-step breakdown of the five core authentication flows.

### 1. User Login & Registration Flow
This is how a user establishes an initial session.
* **Frontend Action:** A user submits the `LoginPage` or `RegisterPage` form.
* **API Call:** The `loginUser`/`registerUser` thunk dispatches a `POST` request to the backend.
* **Backend Logic:** The server verifies credentials, generates a short-lived `accessToken` and a long-lived `refreshToken`, and securely sets them as `httpOnly` cookies. The `refreshToken` is also saved to the user's document in the database.
* **Frontend Result:** The Redux state is updated (`isLoggedIn: true`), a success toast is displayed, and the user is redirected to the `/dashboard`.

### 2. Accessing Protected Routes Flow
This is how the system ensures a user is authorized for protected content.
* **Frontend Action:** A user navigates to a protected route like `/dashboard`.
* **Backend Logic:** The `verifyToken` middleware intercepts the request and checks for a valid `accessToken` in the cookies. If valid, the request proceeds. If invalid or expired, it returns a `401 Unauthorized` error.
* **Frontend Result:** If the token is valid, the page renders. If not, the Axios Interceptor catches the `401` error.

### 3. Silent Access Token Renewal Flow (Axios Interceptor)
This is the key to providing a seamless experience when the `accessToken` expires.
* **Frontend Action:** An API call is made with an expired `accessToken`.
* **Axios Interceptor Logic:** The interceptor catches the `401` response, pauses all other requests, and makes a dedicated call to the `/renewAccessToken` endpoint.
* **Backend Logic (`renewAccessToken`):** The backend verifies the `refreshToken` from the cookie against the one stored in the database. If valid, it issues a new set of tokens.
* **Frontend Result:** The interceptor receives the new tokens and automatically retries the original failed API call. The user never knows the token expired.

### 4. Fatal Refresh Token Expiration Flow
This handles the case where the session has truly ended.
* **Frontend Action:** The Axios Interceptor attempts to renew the token, but the `refreshToken` is also expired or invalid.
* **Backend Logic:** The `/renewAccessToken` endpoint fails.
* **Axios Interceptor Logic:** The `catch` block of the interceptor executes. It triggers `window.location.replace('/login')`.
* **Frontend Result:** The browser performs a hard refresh to the login page, wiping all state. A "Session expired" toast is displayed, and the user must log in again.

### 5. User Logout Flow
This provides a clean way to end a user's session.
* **Frontend Action:** A user clicks the "Logout" button.
* **API Call:** The `logoutUser` thunk is dispatched.
* **Backend Logic:** The backend sets the `refreshToken` in the database to `null` and clears the user's browser cookies.
* **Frontend Result:** The Redux state is cleared, a "Logged out" toast is displayed, and the user is redirected to the home page.
  
---

This system is a comprehensive, multi-layered approach to authentication that prioritizes both security and user experience. With the implementation of the progress bar and all core features, the MVP (Minimum Viable Product) of the application is complete.

The application now supports:

- **Authentication:** Secure account creation, login, and session management.
- **Content Display:** Structured list of DSA topics and problems.
- **Progress Tracking:** Persistent problem-solving state.
- **Progress Visualization:** Real-time summary and visual progress bar.

This end-to-end web application is fully functional and ready for use.