---
sidebar_position: 4
title: Profile Modals and the "Unknown User" Bug
---

# 8.4 The Hurdle of Profile Viewing and Chat Initiation

A seamless user journey from discovering a fellow coder to starting a conversation is a top priority in any collaborative platform. Achieving this required two essential features: an intuitive way to view a user's public profile and a robust mechanism for initiating a new chat.

### The Profile Modal: A UX-Driven Design

Instead of redirecting users to a full profile page, a **modal (popup)** was implemented for viewing public profiles directly from the discovery page. This design choice was intentional and rooted in user experience best practices:

- **Context Preservation:**  
  The modal allows users to quickly view another user's profile without losing their place on the discovery page. This keeps the browsing flow uninterrupted and makes it easy to return to where they left off.

- **Context-Aware UI:**  
  The modal dynamically adapts its action buttons based on the viewer's authentication status:
    - **Logged-in users** are presented with a simple "Close" button, ensuring a seamless in-app experience.
    - **Guests** see "Register" and "Login" buttons, turning the profile view into an effective user acquisition tool by encouraging sign-ups and logins at a moment of high engagement.

- **Robust Logic for All Scenarios:**  
  The modal logic was carefully designed to handle both internal navigation (clicking a user from the discovery list) and direct URL access, ensuring a consistent and reliable experience in all cases.

### The "Unknown User" Bug: A Full-Stack Debugging Journey

The next major bug encountered during development emerged after implementing the "Start Chat" button. When a user initiated a new chat, the other participant's name and avatar would appear as "Unknown User" in the chat list, even though the chat window itself functioned correctly.

This issue led to a comprehensive debugging process:

1. **Initial Hypothesis – Frontend Investigation:**  
   The first assumption was that the bug originated in the frontend, possibly due to a Redux reducer issue or incorrect React component props. To diagnose this, extensive `console.log` statements were added throughout the relevant components and Redux logic to trace the state and data flow.

2. **The "Aha!" Moment – Using Postman for API Inspection:**  
   After confirming that the frontend state logic appeared correct, attention shifted to the backend. Postman was used to inspect the raw API responses. By comparing the response from the main `/chat/conversations` endpoint (which was working correctly) with the response from the `/chat/start` endpoint (which was not), a key difference was identified.

3. **Root Cause – Data Inconsistency:**  
   The `/chat/conversations` endpoint was correctly returning fully populated participant objects, including usernames and avatars. However, the `/chat/start` endpoint was returning a conversation object with an array of unpopulated participant IDs. This inconsistency in the data contract between endpoints was the direct cause of the "Unknown User" display in the frontend.

4. **The Fix – Backend Population Logic:**  
   The solution was to update the backend's `startConversation` controller to use Mongoose's `.populate()` method on the participants array before sending the response. This ensured that both endpoints returned participant details in the same, fully populated format.

### Lessons Learned

This experience was a powerful lesson in full-stack debugging and the importance of maintaining a consistent data contract between the server and the client. It highlighted the need for:

- Careful UX design that keeps users in context and adapts to their authentication state.
- Thorough debugging that considers both frontend and backend sources of bugs.
- Consistency in API responses to prevent subtle, hard-to-diagnose issues in the user interface.

By addressing both the user experience and the technical consistency of the chat initiation flow, the platform now provides a smooth, professional, and reliable way for users to discover each other and start conversations.