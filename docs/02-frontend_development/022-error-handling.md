---
sidebar_position: 2
title: Engineering a Bulletproof Error Handling System
---

# 2.2 The First Bug and Engineering a Bulletproof Error Handling System

While working on the registration page, I wanted to see how the app would handle errors—like trying to register a username that already exists. But instead of getting a clear JSON error message like "User with this username already exists," I was surprised to see a full HTML error page returned to the frontend. When I checked the error variable in the frontend, `error.data` was just a block of HTML code from the backend, not the structured message I needed for the UI.

This made it clear that my backend was missing a **global error handling middleware** to catch and format errors as JSON.

---

## Why Did This Happen?

When I used `throw new ApiError(...)` in a controller, if there was no custom Express error-handling middleware set up, Express would fall back to its default error handler. In development, this default handler sends a basic HTML error page with a stack trace—helpful for backend debugging, but useless for a frontend expecting JSON.

---

## The Fix: Implementing a Global Error Handling Middleware

To solve this, I created a middleware that sits at the *end* of all Express route definitions. This middleware specifically catches instances of `ApiError` (and other errors) and transforms them into a clean JSON response that the frontend expects.

<details>
<summary>💡 <b>How <code>ApiError.js</code> and <code>error.middleware.js</code> Work Together</b></summary>

- **ApiError.js (The Custom Error Class):**
    - This is a custom error class that extends JavaScript's built-in `Error` class.
    - It lets me create specialized error objects with extra properties for the API, like `statusCode`, `success` (always `false` for errors), and `errors` (for validation details).
    - When I write `throw new ApiError(400, "User with this username already exists");`, I'm creating an instance of this custom class, which contains the HTTP status code, a user-friendly message, and sets `success` to `false`.
    - The `throw` keyword immediately stops the normal execution flow of the current `asyncHandler` function and "throws" the error up the call stack.
    - Because my `asyncHandler` utility wraps controller functions, it catches this thrown `ApiError` and passes it to the next error-handling middleware—`error.middleware.js`.

- **error.middleware.js (The Global Error Handler Middleware):**
    - This is a standard Express.js error-handling middleware. Express knows to call it when an error is thrown or passed to `next()`.
    - Its job is to be the centralized catcher and formatter of all errors in the app. It acts as the final gatekeeper before a response is sent back to the client.
    - When `error.middleware.js` receives an error (especially an `ApiError`), it checks `if (err instanceof ApiError)`.
    - If so, it uses the properties from `ApiError` (like `statusCode` and `message`) to build a clean, consistent JSON response.
    - This ensures that no matter where an `ApiError` is thrown in the backend, the frontend always receives a predictable JSON structure, not an HTML error page or stack trace.
    - It also acts as a fallback for any other unexpected errors (like a database connection drop) by sending a generic 500 Internal Server Error message.

**In short:**
- `ApiError.js` defines *what* a custom API error looks like.
- `error.middleware.js` defines *how* to handle and respond to all errors, especially custom `ApiErrors`, in a uniform way for the client.
</details>

---

## The End-to-End Error Flow

With this middleware in place, the error flow became robust and predictable:

1. **Backend Controller:** I throw a new `ApiError(...)` to create and throw a custom error object.
2. **Backend `asyncHandler`:** This utility catches the `ApiError` and passes it to the error middleware.
3. **Backend `error.middleware.js`:** This global handler catches the `ApiError`, formats it into a standard JSON response (like `{"success": false, "message": "..."}`), and sends it to the frontend.
4. **Frontend Service (`authService.js`):** When making an HTTP request, if a non-2xx response is received, `axios` creates an `AxiosError` object. The `catch` block extracts the specific error message from the JSON response body (`error.response.data.message`) and re-throws that message string.
5. **Frontend Component (e.g., `RegisterPage.jsx`):** The component's `catch` block receives the specific error message string and uses it to update the UI.

This full chain ensures that user-friendly, specific error messages generated in the backend consistently reach and display on the frontend. It's a robust error handling strategy!

---

At this stage, the basic functionality for frontend login and registration was working. But I noticed another issue: on the login and register pages, clicking the links to switch between them caused a full page reload, while using the navbar did not. I realized that in the pages I had used anchor (`<a>`) tags, but in the navbar I used the `Link` component from `react-router-dom`. Switching to `Link` everywhere fixed the reload issue and preserved the seamless SPA experience.