---
sidebar_position: 5
title: Building Core Services & Authentication
---

# 1.5 Building a Professional Backend: Core Services & Authentication

A cornerstone of my application's security is the two-token authentication system I implemented using JSON Web Tokens (JWTs). I wanted to follow modern security best practices, so I designed the system to generate a short-lived *access token* (valid for 1 day) and a long-lived *refresh token* (valid for 7 days). The access token is used to authorize requests to protected API endpoints, while the refresh token, stored securely in an HTTP-only cookie, is used to obtain a new access token without requiring the user to log in again. This approach lets me minimize the exposure time of the access token for security, while still providing users with a persistent and convenient session. I built dedicated endpoints for user registration, login, logout, and access token renewal, creating a complete and secure authentication lifecycle.

---

## The Dashboard Data Pipeline

The next major challenge was deciding how to deliver the comprehensive list of topics and problems to the frontend, complete with the user's solved status for each problem. I considered two approaches:
1. Send the raw data (all topics, all problems, and the user's solved problem IDs) in separate API calls and let the frontend do the heavy lifting of mapping and filtering.
2. Create a single, powerful endpoint on the backend that processes everything and delivers a perfectly structured response.

While the first approach might seem simpler for the backend, it puts a significant processing burden on the client's browser and increases network traffic. I chose the second approach to optimize for frontend performance.

A new endpoint was created that, in a single API call, retrieves the user's solved problems, fetches all topics populated with their respective problems, and then efficiently merges this data. A key performance optimization was converting the user's list of solved problem IDs into a `Set` data structure, allowing for an O(1) (constant time) lookup to add a new `isSolved` field to each problem. This backend-driven approach ensures the frontend receives a clean, ready-to-render data structure, resulting in a faster and smoother user experience.

---

## Marking Problems as Solved or Unsolved

Next, I needed to build a route to mark a problem as solved or unsolved. When a user clicks to mark a problem as solved or unsolved, the backend adds or removes the problem ID from the user's `problemSolved` array in the database. I initially wondered if rapidly toggling the solved status (e.g., clicking multiple times quickly) would cause issues or overload the database. However, MongoDB efficiently handles these operations, so there was no need for concern.

---

## Renewing Access Tokens

Finally, I added the `renewAccessToken` endpoint, since the access token is valid for only 1 day. This endpoint uses the refresh token (stored securely in an HTTP-only cookie) to issue a new access token, allowing users to stay logged in without re-entering their credentials.

---
<details>
<summary>**What are access tokens and refresh tokens? Why do we need both?**</summary>
- The access token is short-lived and used to authenticate API requests. This means users don't have to log in every time they navigate the site.
- For security, the access token expires quickly. When it does, instead of forcing the user to log in again, the backend checks the refresh token (which lives longer and is stored securely). If the refresh token is valid, a new access token is issued.
- This system balances security (short-lived access tokens) and convenience (persistent sessions via refresh tokens).
</details>

<details> 
<summary>**Cookies vs. LocalStorage: How and Why We Store Tokens**</summary>

**Cookies** are a browser feature used for sending tiny bits of data back and forth between browser and server — especially useful for authentication and sessions.

**LocalStorage** is also a browser feature, but only accessible to the page's JavaScript — not sent to the server.

**1. What Are Cookies?**

- Cookies are small pieces of data stored in your browser by a website.
- They are key–value pairs like: `user_id=12345`, `session_token=abcde12345`
- Max size per cookie: ~4 KB
- Automatically sent by browser **with every request** to that website

**2. Why Do We Use Cookies?**

| Use Case             | Why It's Useful                                 |
|----------------------|-------------------------------------------------|
| Session Management   | To keep users logged in (store token/session ID) |
| Preferences          | Theme, language, layout choices                 |
| Tracking / Analytics | Count visits, time on site, etc.                |
| Security Tokens      | CSRF tokens, JWT tokens, etc.                   |

**3. What Is That "Accept Cookies" Popup?**

- That popup is about **privacy**, not programming.
- Laws like **GDPR** require consent for tracking cookies.
- Functional cookies (like login tokens) often **don’t require consent**.

**4. How Are Cookies Used With Tokens?**

- **Option 1:** Store JWT in LocalStorage  
   `localStorage.setItem("access_token", token);`  
   ❌ Accessible to JS → vulnerable to XSS (cross-site scripting attacks)

- **Option 2:** Store JWT in Cookies  
   `res.cookie("access_token", token, { httpOnly: true, secure: true, sameSite: "strict" });`  
   ✅ Cookies are more secure when configured with:
   - httpOnly: not accessible to JavaScript
   - secure: only over HTTPS
   - sameSite: restricts cross-site sending

**5. What is `cookie-parser` in Express?**

- `cookie-parser` is Express middleware that reads cookies from incoming requests and makes them available on `req.cookies`.
- Example:
   ```js
   import cookieParser from 'cookie-parser';
   app.use(cookieParser());
   // Now you can do:
   const token = req.cookies.access_token;
   ```

**Quick Analogy**

| Concept         | Analogy                        |
|-----------------|-------------------------------|
| Cookie          | Passport stamp                 |
| Server sets     | Airport stamps your passport   |
| Browser request | You show passport at entry     |
| cookie-parser   | Border officer reading stamp   |

**Summary**

| Term          | Meaning                                               |
|---------------|-------------------------------------------------------|
| Cookie        | Small browser-stored key–value data                   |
| Why needed    | To maintain login sessions, preferences, security     |
| Accept/Reject | Privacy law requirement, especially for tracking      |
| cookie-parser | Express middleware to access cookies in backend       |
| Token storage | Storing tokens in httpOnly cookies is safer than localStorage |
</details>

---

Now, with the core functionality and important endpoints completed, it's time to move to the frontend!