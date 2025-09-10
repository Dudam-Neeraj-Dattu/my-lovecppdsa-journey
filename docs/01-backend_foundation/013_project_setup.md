---
sidebar_position: 3
title: Structuring the Backend and Core Utilities
---

# 1.3 The Initial Setup: Structuring the Monorepo

With a clear data model in mind, the next phase was to establish the project's foundational structure. The first major decision was how to organize the codebase. After weighing the options between separate repositories or a single monorepo, I chose to house both the `frontend` and `backend` directories within a single `lovecppdsa` repository. This approach simplifies dependency management and streamlines the development workflow.

The backend was initialized as a Node.js project, and essential packages like `express`, `mongoose`, and `dotenv` were installed. A standard, scalable folder structure was created within a `src/` directory, separating concerns for database connections (`db/`), application setup (`app.js`), and the main server entry point (`index.js`). A key part of the setup was configuring the server to first establish a successful connection to the database *before* it begins listening for incoming requests, ensuring the application starts in a healthy state.

---

## Core Utilities for a Robust API

To avoid repetitive code and ensure consistent responses and error handling across the application, a set of core utilities was developed.

* **`ApiResponse` & `ApiError`:** Custom classes were built to standardize the structure of all successful and failed API responses. This creates a predictable and easy-to-consume API for any client.

* **`asyncHandler`:**  
  This is a special function called a "higher-order function." If you're new to this concept, a higher-order function is simply a function that takes another function as an argument or returns a function.

  In Express.js, when you write asynchronous route handlers (using `async`/`await`), any errors thrown inside them won't be caught by Express's default error handler unless you use a `try...catch` block in every handler. This quickly becomes repetitive and messy.

  The `asyncHandler` solves this by wrapping your async functions and automatically catching any errors, passing them to Express's error-handling middleware. Here’s a detailed breakdown of how it works:

> **How asyncHandler Works (Step-by-Step):**
> 
> - You're passing your **actual handler function** (the async function) into `asyncHandler`.
> - `asyncHandler` returns a **wrapped function** that Express will actually call.
> - So now, to Express, your handler looks like:
>   ```js
>   (req, res, next) => {
>     Promise.resolve(
>       yourAsyncFunction(req, res)
>     ).catch((err) => next(err));
>   }
>   ```
> - **Step 1:** A POST request comes in (e.g., `POST /register`).
> - **Step 2:** Express calls your route handler: `registerUser(req, res, next);`
> - **Step 3:** But `registerUser` is not your original async function—it's the wrapped version from `asyncHandler`.
> - **Step 4:** Inside `asyncHandler`, this code runs:
>   ```js
>   Promise.resolve(requestHandler(req, res, next))
>     .catch((err) => next(err));
>   ```
> - If your async function throws an error, it goes to `.catch(...)` and then calls `next(err)`, which triggers Express’s error-handling middleware.
> - **If no error:** The response is sent as usual.
> - **If error:** The error is sent to your global error handler.
> 
> **Visual Summary:**
> ```
> POST /register
>     ↓
> Express finds .post(registerUser)
>     ↓
> registerUser = asyncHandler(yourAsyncFunction)
>     ↓
> asyncHandler returns a new function (req, res, next)
>     ↓
> That function runs: Promise.resolve(yourAsyncFunction).catch(next)
>     ↓
> If OK: res.status(200) is sent
> If error: next(err) is called
> ```
> 
> **The Magic of asyncHandler:**  
> Without it, you'd write this every time:
> ```js
> router.post("/register", async (req, res, next) => {
>   try {
>     ...
>   } catch (err) {
>     next(err);
>   }
> });
> ```
> But now, you just write clean async code:
> ```js
> const registerUser = asyncHandler(async (req, res) => {
>   ...
> });
> ```
> 

> **Analogy:**  
> Think of `asyncHandler` as a safety net under a tightrope walker. If you fall (an error happens), the net (asyncHandler) catches you and safely hands you over to the rescue team (Express error handler).

---

## Securing the Foundation: CORS and Authentication

From the very beginning, security was a primary consideration.

* **CORS (Cross-Origin Resource Sharing):**  
  By default, browsers block web pages from making requests to a different domain or port than the one that served the web page. This is a security feature called the "Same-Origin Policy." For example, if your frontend runs on `localhost:5173` and your backend on `localhost:3000`, the browser will block requests from the frontend to the backend unless you explicitly allow it.

  The `cors` package in Express is middleware that tells the browser, "It's okay for this other origin to access my server." You enable it by adding `app.use(cors())` in your backend code. This is crucial for development and production, as it prevents unwanted or malicious sites from accessing your API, but allows your own frontend to communicate with your backend.

  There is also a more secure way to use CORS: you can specify which origins are allowed to access your backend by passing an options object to the middleware. For example:
  ```js
  app.use(cors({ origin: "http://localhost:5173" }));
  ```
  This ensures that only requests from your frontend (and not from any random site) are accepted. You can also provide an array of allowed origins if you have multiple frontends.

  > **Analogy:**  
  > Imagine your backend is a building with a security guard. By default, the guard only lets people in from the same building. With CORS, you give the guard a list of trusted buildings (origins) whose visitors are allowed in.

* **Authentication with JWT & bcrypt:**  
  To secure user data, a robust authentication system was designed using two key technologies:

  - **`bcrypt`:**  
    When a user registers, you never want to store their password in plain text. `bcrypt` is a library that hashes (scrambles) the password before saving it to the database. Even if someone gains access to your database, they can't see the actual passwords. In Mongoose, this is typically done using a "pre-save hook," which means the password is hashed automatically before saving the user document.

    > **Analogy:**  
    > bcrypt is like locking a password in a safe and throwing away the key. You can check if a password matches the hash, but you can't get the original password back.

  - **JSON Web Tokens (JWT):**  
    After a user logs in, you want them to stay authenticated without sending their password on every request. JWTs are small, signed tokens that the server gives to the client after login. The client sends this token with each request, and the server verifies it to check the user's identity. Typically, you use two tokens:
      - **Access Token:** Short-lived, used for most requests.
      - **Refresh Token:** Longer-lived, used to get a new access token when the old one expires.

    The tokens are signed with a secret key, so they can't be tampered with. In the user model, methods are added to generate these tokens using `jwt.sign`, including only the necessary user data.

    > **Analogy:**  
    > Think of JWTs as a visitor badge you get after signing in at a building. You show the badge to security each time you enter, instead of showing your ID and filling out a form every time.

---

By carefully structuring the project, implementing robust utilities, and prioritizing security with CORS and authentication, the backend foundation of LoveCppDSA is both developer-friendly and secure—even for those new to these concepts.