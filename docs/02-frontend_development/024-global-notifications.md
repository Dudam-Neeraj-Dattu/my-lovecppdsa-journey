---
sidebar_position: 4
title: Global Notification System 
---

# 2.4 Centralizing the User Experience: Global State for UI - The Toast Notification System

With the core authentication and data fetching in place, the focus shifted to refining the user feedback loop. This led to a multi-hour debugging session centered on a seemingly simple feature: toast notifications. The journey to solve a persistent "duplicate toast" bug resulted in a profound architectural shift and a deeper understanding of React's render cycles and Redux state management.

### The Challenge: Race Conditions and Duplicate Toasts

The initial approach was to trigger notifications directly from within individual components. For example, `LoginPage` would call `toast.success('Login successful!')` after a successful API response, and similarly, `toast.error()` would be called if there was an error. However, this decentralized approach quickly led to a host of problems. Because of the asynchronous nature of state updates and the rapid re-rendering of components during navigation (for example, moving from `LoginPage` to `DashboardPage`), notifications would often appear multiple times, in the wrong place, or not at all.

This was not just a minor annoyance—it became a major debugging headache. For hours, I tried to find a reliable way to display toast notifications without running into duplicate or missing messages. I experimented with moving the `toast.success` and `toast.error` calls into `useEffect` hooks inside `LoginPage.jsx`, hoping that would help control when notifications appeared. But since both success and error states could change rapidly, and because React re-renders components during navigation, this often resulted in multiple toasts being shown, or toasts appearing at the wrong time.

I then tried integrating a dedicated loading page: when authentication was in progress, a loading screen would appear, and only after that would the dashboard or login page render. I hoped this would isolate the toast logic, but it only made things worse—multiple renders of different pages meant multiple toasts, especially for logout and login flows.

Next, I moved the toast logic and navigation code back and forth between the `handleSubmit` function and `useEffect`, and even tried moving the toast calls into the dashboard page. At one point, I thought the problem was that success messages were lingering in state, so I created a new global state called `success` and tried to use it in the dashboard when the page rendered. When that didn't work, I added a new reducer, `clearSuccess`, and included it in every action of the extraReducers (like `loginUser.fulfilled`, `registerUser.fulfilled`, and `logoutUser.fulfilled`), setting `state.success = "login successful"` or similar messages. But this approach also failed to solve the problem.

I kept removing and refactoring toast logic—moving it from the login page, to the dashboard, to the loading page, and back again. I even tried conditional rendering in the login page's return statement (if loading, show the loading page; else, show the login page), but the issue persisted. The loading page was only visible for a short time, and multiple re-renders kept causing duplicate toasts.

### The Breakthrough: A Single Source of Truth

After hours of frustration and trial-and-error, the core issue became clear: notifications should not be managed at the component level at all. Both error and success messages were already available globally in Redux, but handling toasts in individual components led to unpredictable behavior—duplicate notifications, missed messages, and race conditions caused by React's asynchronous state updates and frequent re-renders during navigation.

To address this, the entire notification logic was centralized, resulting in a robust, scalable solution:

1. **Redux as the Single Source of Truth:**  
   All asynchronous thunks (like `loginUser`, `registerUser`, `logoutUser`) were updated to set a global `error` or `success` message in the Redux store upon completion. This meant that the Redux store alone determined when a notification should be shown, rather than scattering toast logic across multiple components.

2. **`App.jsx` as the Single Renderer:**  
   All `toast.error()` and `toast.success()` calls were removed from individual pages. Instead, a single `useEffect` hook was placed in the root `App.jsx` component. This hook listens for changes to the global `error` and `success` states.

3. **The Flow:**  
   Whenever a message appears in the Redux store, this single, high-level component (`App.jsx`) is responsible for displaying the toast notification. After displaying the toast, it dispatches a "clear" action to reset the state, ensuring the system is ready for the next notification and preventing duplicates.

This process was a deep dive into how React's render cycles, Redux state updates, and notification libraries like `react-toastify` interact. The journey involved trying many approaches—moving toast logic between `useEffect` hooks, loading pages, dashboards, and even experimenting with new reducers like `clearSuccess`. Each attempt revealed more about the timing and flow of state in a React/Redux app, but only this centralized pattern truly solved the problem.

> This centralized pattern, born from a rigorous debugging process, completely eliminated the race conditions. It created a system that is predictable, bug-free, and easy to manage. This experience represents a fundamental lesson in building scalable frontend architectures: **global UI concerns should be managed by a global state and rendered from a single, high-level component.**