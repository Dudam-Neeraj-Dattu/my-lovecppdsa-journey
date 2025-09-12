---
sidebar_position: 3
title: The Recommendation Engine & Redis Caching
---

# 8.3 Building the "Find a Fellow Coder" Recommendation Engine with Redis Caching

The "Find a Fellow Coder" feature is a sophisticated user discovery engine designed to connect users with similar progress and interests. This system required advanced data aggregation, a robust scoring algorithm, and a multi-layered caching strategy to ensure both accuracy and high performance.

---

## The Core: MongoDB Aggregation Pipeline

At the heart of the recommendation engine is a complex, multi-stage MongoDB Aggregation Pipeline. This is not a simple `find()` query, but a data processing pipeline that executes directly on the database server. The pipeline includes:

- **`$addFields`:** Computes new fields on the fly, such as each user's total `solvedProblemsCount`.
- **`$lookup`:** Performs a join-like operation with the `profiles` collection to filter for public profiles.
- **`$match`:** Filters out the current user and non-public profiles.
- **`$addFields` (with `$cond`):** Calculates a weighted `recommendationScore` based on multiple criteria:
    - **Exact problem count match:** +40 points
    - **Similar problem count (within +/- 5):** Up to +30 points
    - **Similar account creation date (within +/- 7 days):** Up to +15 points
    - **Recent activity (in the last 30 days):** Up to +15 points
- **`$facet`:** Runs multiple aggregation pipelines in parallel, efficiently generating both the recommended users and categorized lists in a single query.
- **`$bucket`:** Groups users into categories based on their number of solved problems (e.g., "150-199 solved").

This approach leverages the full power of MongoDB to efficiently solve a complex product requirement.

---

## Scoring Strategy

The recommendation score is calculated as follows:

- **Exact Match Bonus (40 points):**
    - If the user's `solvedProblemsCount` is exactly equal to the current user's, add 40 points.
- **Similar Level Bonus (up to 30 points):**
    - If the absolute difference in solved count is ≤ 5, the score is `30 - (difference * 2)`.
- **Account Creation Bonus (up to 15 points):**
    - If the user's `createdAt` is within ±7 days of the current user's, the score is `15 - (day_difference * 2)`.
- **Activity Bonus (up to 15 points):**
    - If the user's last activity (`updatedAt`) is within the last 30 days, the score is `15 - (days_since_active * 0.5)`.

The current system uses this scoring-based approach, but as the user base grows, there are plans to move to an AI-based recommendation engine using a vector database. In that future system, each user would be represented as an n-dimensional vector (using an LLM), and similarity would be calculated using vector calculus. The vector database would be updated daily to keep recommendations fresh.

---

<details>
<summary><strong>Common MongoDB Operators Explained</strong></summary>

- `$eq`: Equal to
- `$ne`: Not equal to
- `$gt`: Greater than
- `$gte`: Greater than or equal to
- `$lt`: Less than
- `$lte`: Less than or equal to
- `$add`: Add numbers
- `$subtract`: Subtract numbers
- `$multiply`: Multiply numbers
- `$divide`: Divide numbers
- `$abs`: Absolute value
- `$size`: Get array length
- `$cond`: If-then-else logic
- `$sum`: Sum values
- `$avg`: Average values
- `$max`: Maximum value
- `$push`: Add to array

</details>

---

## The Caching Dilemma: Performance Optimization

Given the heavy nature of the aggregation, caching was essential. Two main strategies were considered:

### Option 1: Frontend Caching (Redux)

- **How it works:** The frontend stores the recommendation data in Redux after the first API call. If the user navigates away and returns within the same session, the data is instantly available from Redux.
- **Pros:** Simple to implement, no extra infrastructure, and prevents redundant API calls during a session.
- **Cons:** The cache is temporary (lost on refresh), and data can become stale until the next fetch.

### Option 2: Backend Caching (Redis)

- **How it works:** The backend checks Redis for a cached result before running the aggregation. If a cache hit occurs, the result is returned instantly; otherwise, the aggregation runs, and the result is cached with an expiration time.
- **Pros:** Drastically reduces database load, provides fast responses even after a hard refresh, and is centrally managed.
- **Cons:** Adds complexity and requires managing Redis. Data is only as fresh as the cache expiration.

Redis was chosen for backend caching, as it provides a scalable, high-performance solution.

---

## The Challenge of Cache Invalidation

A key trade-off in caching is **data freshness vs. performance**. For example, if a user solves 50 problems in a day, their profile may remain outdated in the cache until it expires. Several strategies were considered:

### Strategy 1: Time-Based Expiration

- **How it works:** Set a TTL (Time-To-Live) on the cache key (e.g., 15 minutes). Data is automatically deleted after this period.
- **Pros:** Simple to implement, guarantees eventual freshness.
- **Cons:** Data can be stale for the duration of the TTL.

### Strategy 2: Event-Driven Invalidation

- **How it works:** Invalidate the cache whenever underlying data changes.
- **Cons:** For this use case, it's extremely complex, as changes in one user's data could affect many other users' recommendations, potentially causing a "cache stampede."

### Strategy 3: The Hybrid Approach

- **How it works:** Combine a short TTL (e.g., 5 minutes) with targeted invalidation (e.g., deleting a user's own cache after they solve a problem).
- **Pros:** Ensures users see fresh data after their own actions, while keeping other data reasonably fresh.

### Final Approach: Daily Expiring Cache with User Transparency

The final, practical solution was to use a **daily-expiring cache**. When a user requests recommendations, the result is cached until midnight. The frontend displays a "Last updated at..." timestamp, so users know exactly how fresh the data is. This approach:

- Drastically reduces database load (aggregation runs only once per user per day).
- Simplifies implementation (no need for complex event-driven invalidation).
- Manages user expectations with clear UI feedback.
- Is well-suited for discovery features that do not require real-time accuracy.

---

## Implementation Details and Pagination

Integrating Redis required significant changes across more than 15 files. The backend was updated to modularize the recommendation and chat features, and to support efficient pagination.

### Caching Paginated Data

The "Browse All" feature required paginating through categories. Caching an entire category was inefficient, so a **unique cache key** was created for each page, category, and user. This granular caching ensures only requested data is cached, optimizing both memory usage and performance.

- The backend's `browseUsersByCategory` function was updated to send only one API call using the `$facet` keyword, allowing efficient parallel aggregation.
- The frontend was updated to store paginated results as objects, with each page and category mapped separately.

---

## Engineering Challenges and Solutions

- **Pagination in Redis:**  
  Storing paginated results in Redis required rethinking both backend and frontend data structures. Each page/category/user combination was given a unique cache key.
- **Frontend Integration:**  
  Displaying paginated, cached data in the UI required significant refactoring to ensure smooth user experience.
- **Modularity:**  
  The codebase was modularized to support these features, making future enhancements and maintenance easier.

---

This recommendation engine, with its advanced aggregation, scoring, and caching strategies, demonstrates a robust, scalable approach to user discovery and performance optimization. The system balances efficiency, accuracy, and user experience, and is designed to evolve with future AI-driven enhancements.