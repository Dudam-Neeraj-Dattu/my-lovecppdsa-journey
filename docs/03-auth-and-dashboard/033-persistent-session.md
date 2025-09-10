---
sidebar_position: 3
title: Implementing a Persistent User Session
---

# 3.3 Implementation of Initial Authentication

Implementing the initial authentication check on app load required several coordinated changes across the codebase to ensure a seamless and persistent user session. The primary motivation was to address the issue where any page refresh would wipe the in-memory Redux state, forcing users to log in again. The solution was to create a "silent renewal" process and robustly manage authentication state, routing, and user feedback.

---

### 1. `authSlice.js` — Thunks and Reducers for Robust Auth State

- **Error Handling in `renewAccessToken` Thunk:**
    - The `catch` block in the thunk was structured to return different error payloads based on the error message.
    - `NO_REFRESH_TOKEN` handles the absence of a token.
    - `TOKEN_ERROR` groups together expired, invalid, mismatch, and not found errors, all of which require a forced logout and display a user-friendly "Session has expired..." message.
    - `GENERIC_AUTH_ERROR` serves as a fallback for unexpected issues.
    - This approach provides a clean, maintainable way to manage error types, improving on simple string comparisons.

- **`logoutUser.fulfilled` Reducer:**
    - Sets `state.isLoggingOut = true;` to reflect that a logout action has completed. This state is then used in `ProtectedRoute` to manage the UX during logout.

- **`renewAccessToken` Extra Reducers:**
    - Manages `state.isAuthChecking` correctly: set to `true` on `pending`, and `false` on `fulfilled` or `rejected`. This state drives the global loading spinner during authentication checks.

---

### 2. `App.jsx` — Routing and Toast Notification Logic

- **Routing with `PublicRoute` and `ProtectedRoute`:**
    - Routing logic is encapsulated in dedicated components: `<Route element={<PublicRoute />}> ... </Route>` and `<Route element={<ProtectedRoute />}> ... </Route>`.
    - This pattern keeps `App.jsx` clean and scalable, avoiding complex conditional logic.

- **Toast Notification Logic:**
    - The `useEffect` for toasts checks if `error` is a string or an object with a `type`, accommodating both plain string errors (from thunks like `loginUser` and `registerUser`) and structured error objects (from `renewAccessToken`).
    - Example:
      ```js
      if (typeof error === 'string') {
        toast.error(error);
      } else {
        if (error.type !== 'NO_REFRESH_TOKEN') {
          toast.error(error.message);
        }
      }
      ```
    - This ensures correct and user-friendly error feedback for all authentication flows.

- **Initial Auth Check:**
    - The initial authentication check is dispatched in a `useEffect`:
      ```js
      useEffect(() => { dispatch(renewAccessToken()); }, [dispatch]);
      ```
    - The `isAuthChecking` global state manages the loading spinner and UI during this process.

---

### 3. `PublicRoute.jsx` — Guarding Public Routes

- **Functionality:**  
  This component checks if the user is logged in (`isLoggedIn`). If so, it redirects to `/dashboard`; otherwise, it renders the child route (`<Outlet />`). The `useEffect` for redirection and the `isLoading` check for a global spinner ensure a smooth user experience.

---

### Additional Improvements

- The routing architecture is now clean, with dedicated components for public and protected routes.
- The toast notification system is refined to handle different error payload types and suppresses unnecessary toasts for first-time visitors.
- The use of a temporary `isLoggingOut` state in `authSlice` prevents duplicate toast notifications during logout, resolving a common race condition.

---

This implementation demonstrates a robust, well-structured approach to persistent authentication, state management, and user experience in a full-stack React/Redux application.