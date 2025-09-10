---
sidebar_position: 5
title: Implementing Protected and Public Routes
---

# 2.5 Handling Public and Protected Routing

With basic navigation and state management in place, the next step was to secure the application by implementing protected routes. The goal was to ensure that only authenticated users could access sensitive pages like the dashboard, while unauthenticated users would be restricted to public pages such as login and register.

### Implementing Protected and Public Route Components

The solution involved creating two specialized wrapper components using `react-router-dom`:
- **ProtectedRoute:** Checks if a user is logged in. If authenticated, it renders the requested page; if not, it redirects to the `/login` page.
- **PublicRoute:** Does the inverse, ensuring that already logged-in users cannot access pages like `/login` or `/register`.

### The Challenge of Initial Authentication on App Load

An attempt was made to implement initial authentication on app load, but this quickly became a complex feature involving both state management and user experience. After spending significant time (about two days) wrestling with the intricacies, this feature was postponed to focus on getting protected routing working smoothly first.

### Using Redux DevTools for State Debugging

To better observe state changes in Redux, the Redux DevTools browser extension was installed. Reloading the page allowed for real-time inspection of the Redux state and actions, which was invaluable for debugging routing and authentication logic.

## The "Hard Refresh" Realization

While testing, a key behavior of Single-Page Applications became apparent: even after a successful login, manually typing `/dashboard` in the URL bar and hitting enter would redirect the user back to the login page. This revealed a fundamental concept: a **hard refresh of the browser completely wipes the Redux store's in-memory state**. Since initial authentication on app load wasn't implemented yet, this explained the behavior. For now, this limitation was accepted, with plans to address it later using a persistent session management system (like the `renewAccessToken` flow).

### Solving the "Duplicate Toast" Bug

Another bug surfaced during the logout process. After logging out, users would see two toast notifications at once: "Logout successful!" and "You need to login to access this page." This was a classic race condition. The logout action would succeed, but immediately after, the `ProtectedRoute` component would detect the user was no longer authenticated and trigger a redirect, causing the second "unauthorized" error message.

To resolve this, a new temporary state variable, `isLoggingOut`, was added to the `authSlice`. The flow was as follows:
1. When a user initiates a logout, `isLoggingOut` is set to `true`.
2. The `ProtectedRoute` component checks this flag. If `isLoggingOut` is `true`, it suppresses the "You need to login..." message.
3. After logout is complete and the user is redirected, the state is reset.

This use of a temporary state flag successfully resolved the race condition, ensuring a clean and professional