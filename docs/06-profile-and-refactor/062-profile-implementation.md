---
sidebar_position: 2
title: Profile Page & Progress SVG
---

# 6.2 Implementation of the Profile Logic and Design

The implementation of the profile page required a comprehensive approach, involving both efficient backend data aggregation and advanced frontend data visualization. Every detail, from database queries to UI polish, was considered to deliver a robust and visually engaging user experience.

### Efficient Backend Logic

To support a decoupled `Profile` model, a dedicated `getProfileData` controller was developed. This controller fetches data from both the `User` and `Profile` models and combines it into a single object for the frontend. Security is maintained by using `req.user._id` to ensure only the authenticated user's data is accessed.

A key utility in this process is `getProgressSummary`, which was extracted to keep the controller focused and maintain separation of concerns. This function leverages a **MongoDB Aggregation Pipeline** for optimal performance:

- **Aggregation Pipeline:**  
  Instead of fetching all problems and filtering them in JavaScript, the aggregation pipeline groups problems by `difficulty`, counts totals, and returns a concise summary. This server-side processing is significantly more efficient than client-side filtering, especially as the problem set grows.

    ```js
    // Example aggregation
    const difficultyStats = await Problem.aggregate([
      {
        $group: {
          _id: '$difficulty',
          total: { $sum: 1 },
          problems: { $push: '$_id' }
        }
      }
    ]);
    ```

- **Efficiency:**  
  The implementation uses a `Set` for `solvedProblems`, which is a highly efficient data structure for lookups (O(1) average time complexity). This prevents performance issues as the problem list grows.


- **Comparison with Previous Implementation:**  
  The earlier approach fetched all problems and filtered them in JavaScript, which was less efficient and could lead to performance issues as data scaled.

    ```js
    // Previous approach
    const allProblems = await Problem.find({});
    const easyProblems = allProblems.filter(p => p.difficulty === 'easy');
    // ...and so on
    ```
<details>
<summary> **Aggregation vs populate** </summary>
  #### **Use Aggregation When:**


 ```js
 // Grouping, counting, summing, averaging
 const stats = await Problem.aggregate([
    { $match: { difficulty: { $in: ['easy', 'medium'] } } },
    { $group: { _id: '$difficulty', count: { $sum: 1 } } }
 ]);
 ```

 #### **Use Populate When:**

 ```js
 // Joining related collections
 const user = await User.findById(userId)
 .populate('profile')     // Join with Profile collection
 .populate('solvedProblems'); // Join with Problem collection
```

 #### **Use Regular Queries When:**

 ```js
 // Simple CRUD operations
 const user = await User.findById(userId);
 const problems = await Problem.find({ difficulty: 'easy' });
 ```
</details>

### Frontend: Bringing the Design to Life

The frontend implementation focused on translating a custom Figma design into a live, interactive profile page. This process involved several advanced techniques and careful attention to detail, including:

- **SVG-Based 3D Progress Visualization:**  
  The centerpiece of the profile page is a 3D progress box, built using SVG and `<polygon>` elements. The `getResponsivePoints` helper function dynamically calculates the coordinates for each polygon based on the user's progress in each difficulty category, making the visualization fully data-driven.

- **Animation and Responsiveness:**  
  The use of classes like `transition-all duration-400 ease-in-out` ensures that progress updates are smoothly animated, enhancing the user experience.

- **UI Layout and Design:**  
  - The layout uses a clean two-column structure: progress visualization on the left, user information on the right.
  - Icons from `react-icons` are integrated for intuitive, visually appealing user info fields.
  - Conditional styling is applied to user info fields, providing clear visual cues for missing or present data.

- **UX Consideration:**  
  To ensure data accuracy, the `getProfileData` thunk is dispatched every time the user visits their profile. This guarantees that the profile always reflects the most up-to-date progress, even if the user solves more problems between visits. While this results in an extra API call, it is a worthwhile trade-off for accuracy.

### Implementation Challenges and Solutions

A significant challenge was translating the Figma design into a working SVG component. This required a deep understanding of SVG, polygons, and coordinate systems. The process involved:

- Experimenting with SVG and polygon points to achieve the desired 3D frame.
- Developing the `getResponsivePoints` function to ensure the fill polygons accurately represent progress percentages.
- Iteratively adjusting and testing the design until it matched the intended look and feel.

This process took two days—one day for designing the UI frame and another for implementing the dynamic SVG logic. The result is a unique, animated, and visually engaging component that serves as the centerpiece of the user's profile.
