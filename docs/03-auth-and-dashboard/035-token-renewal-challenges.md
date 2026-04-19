---
sidebar_position: 5
title: Token Renewal Race Condition
---

# 3.5 The Implementation Hurdles of Silent Token Renewal

Implementing the silent token renewal flow with an Axios interceptor was essential for a professional user experience, but it introduced a challenging asynchronous conflict—a classic race condition in state management.

---

### The Challenge: State Management Race Condition

This issue surfaced as the next major bug during development. To thoroughly test the flow, the expiration times for both the access token and refresh token were reduced (e.g., 5 seconds for access, 10–200 seconds for refresh). The initial approach was to use error messages as conditions in the Axios interceptor, such as checking for the string "unauthorized access." However, the backend actually returned messages like "jwt expired," so the logic was updated to use the HTTP status code (`401`) as the condition instead.

Console logs were added at various points (e.g., `error1`, `error21`, `error3`) to trace execution and confirm that the interceptor logic was being reached. During this process, a conflict was discovered between the initial authentication check and the silent token renewal. When the refresh token expired, different error messages appeared on the current page. For example, after toggling a problem on the dashboard, if both tokens had expired, the backend would throw an error, the frontend would attempt renewal, and—when that failed—both "Session expired" and "You need to login to access this page" toasts would appear. The intended behavior was to show only "Session expired" in this scenario, while first-time unauthorized users should see "You need to login..."

Attempts to resolve this included:
- Dispatching a `logoutUser` action from the interceptor's `catch` block.
- Forcing a hard refresh with `window.location.reload(true)`.
- Adjusting error handling in the `ProtectedRoute` component, but this led to infinite loops and uncaught errors.

### The Solution: A Pragmatic State Reset

Solving this required a methodical debugging process. Initial attempts to dispatch a `logoutUser` action or force a `window.location.reload()` from within the interceptor's `catch` block did not cleanly resolve the race condition.

The final, pragmatic solution was to use **`window.location.replace('/login')`** within the interceptor's failure block.

```javascript
window.location.replace('/login');
```

within the Axios interceptor's failure block. This hard navigation breaks the React state lifecycle, ensuring that only the "Session expired" message is displayed and eliminating duplicate or conflicting notifications.