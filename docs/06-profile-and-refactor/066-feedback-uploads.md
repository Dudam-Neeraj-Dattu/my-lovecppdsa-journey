---
sidebar_position: 6
title: Extending File Uploads to Feedback
---

# 6.6 The Power of Reusability - Extending File Uploads to Feedback

The final feature built in this phase was a powerful demonstration of the project's robust and modular architecture. To enhance the feedback system, functionality was added to allow users to upload screenshots, providing valuable visual context for their suggestions.

### The Power of a Reusable System

Implementing this feature was remarkably efficient because the core infrastructure for file handling was already in place from the "Edit Profile" feature. The previously built, generic systems were seamlessly repurposed:
* **The `multer` Middleware:** The same middleware used for staging avatar uploads was reused to handle the temporary storage of feedback images.
* **The Cloudinary Service:** The `uploadOnCloudinary` utility, designed to be flexible, was used to upload the new feedback images to the cloud.

The only new backend work required was a minor update to the `Feedback` model to store an array of image URLs and a modification to the `submitFeedback` controller to handle multiple files. This experience was a powerful, practical lesson in the benefits of writing clean, modular, and reusable code.

> **Deep Dive: `JSON` vs. `multipart/form-data`**
>
> Implementing file uploads requires a deep understanding of the two primary ways data is sent in web applications.
>
> * **`JSON` (JavaScript Object Notation):** This is the standard for sending structured text data. It's lightweight and easy for both the frontend and backend to parse. However, it cannot natively handle binary data like images.
>
> * **`multipart/form-data`:** This is the format designed for sending files. It breaks the request into multiple "parts," with a separate part for each text field and each file. The `multer` middleware on the backend is specifically designed to parse this complex format, extract the files, and make them available to the controller. This project required using `FormData` on the frontend to construct these requests when a file was included.