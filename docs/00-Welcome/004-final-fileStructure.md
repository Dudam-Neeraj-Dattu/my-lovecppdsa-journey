---
sidebar_position: 4
---

# Final Folder Structure

The **LoveCppDSA** project is organized as a modern monorepo, separating backend and frontend codebases for clarity, scalability, and ease of maintenance. This structure supports robust CI/CD, containerization, and efficient team collaboration.

---

## 🗂️ Project Root

The root directory contains configuration and orchestration files for the entire application, including CI/CD, Docker, and reverse proxy setup.

```plaintext
lovecppdsa/
├── .github/
│   └── workflows/
│       └── deploy.yml         # CI/CD pipeline for automated deployment
├── loveCppDsa_Backend/        # Backend service (see below)
├── loveCppDsa_Frontend/       # Frontend service (see below)
├── nginx.conf                 # Nginx reverse proxy configuration
└── docker-compose.yml         # Orchestrates all services (frontend, backend, nginx)
```

---

## 🖥️ Backend (`loveCppDsa_Backend`)

A Node.js (Express.js) application, structured for modularity and scalability. Each concern—routing, business logic, data models, real-time sockets, and AI services—lives in its own directory.

```plaintext
loveCppDsa_Backend/
├── src/
│   ├── controllers/
│   │   ├── ai.controller.js
│   │   ├── chat.controller.js
│   │   ├── feedback.controller.js
│   │   ├── missingProblem.controller.js
│   │   ├── problems.controller.js
│   │   ├── profile.controller.js
│   │   ├── updateProblem.controller.js
│   │   └── user.controller.js
│   ├── data/
│   │   └── .gitkeep
│   ├── db/
│   │   ├── index.js
│   │   ├── migrate.js
│   │   ├── migrateProfile.js
│   │   ├── mongo.db.js
│   │   └── redis.db.js
│   ├── middlewares/
│   │   ├── auth.middlware.js
│   │   ├── error.middleware.js
│   │   ├── multer.middlware.js
│   │   └── socket.middleware.js
│   ├── models/
│   │   ├── aiConversation.model.js
│   │   ├── aiMessage.model.js
│   │   ├── conversation.model.js
│   │   ├── feedback.model.js
│   │   ├── message.model.js
│   │   ├── missingProblem.model.js
│   │   ├── otp.model.js
│   │   ├── problem.model.js
│   │   ├── profile.model.js
│   │   ├── topic.model.js
│   │   ├── updateProblem.model.js
│   │   └── user.model.js
│   ├── routes/
│   │   ├── ai.route.js
│   │   ├── chat.route.js
│   │   ├── feedback.route.js
│   │   ├── missingProblem.route.js
│   │   ├── problems.route.js
│   │   ├── profile.route.js
│   │   ├── updateProblem.route.js
│   │   └── user.route.js
│   ├── services/
│   │   └── ai.service.js
│   ├── sockets/
│   │   └── chat.socket.js
│   ├── tests/
│   │   └── user.test.js
│   ├── utils/
│   │   ├── ai/
│   │   │   ├── historyFormatter.js
│   │   │   └── promptTemplates.js
│   │   ├── email/
│   │   │   ├── emailContent.js
│   │   │   ├── generateOTP.js
│   │   │   └── sendEmail.js
│   │   ├── seed/
│   │   │   ├── checkAndSeedDB.js
│   │   │   ├── seed.js
│   │   │   └── seedCheck.js
│   │   ├── apiError.js
│   │   ├── apiResponse.js
│   │   ├── asyncHandler.js
│   │   ├── cloudinary.js
│   │   ├── cookieOptions.js
│   │   ├── generateTokens.js
│   │   └── socketHandler.js
│   ├── app.js
│   └── index.js
├── .dockerignore
├── .gitkeep
├── Dockerfile
├── README.md
├── jest.config.js
├── package-lock.json
└── package.json

```

---

## 💻 Frontend (`loveCppDsa_Frontend`)

A modern React application (Vite + Redux Toolkit), organized by feature for maintainability and rapid development. The "feature-slice" pattern keeps related logic together.

```plaintext
loveCppDsa_Frontend/
├── public/
│   ├── logo.svg
│   └── vite.svg
├── src/
│   ├── api/
│   │   └── axiosInstance.js
│   ├── app/
│   │   ├── socketMiddleware.js
│   │   └── store.js
│   ├── assets/
│   ├── components/
│   │   ├── chat/
│   │   │   ├── leftPanel/
│   │   │   │   ├── AiChatCard.jsx
│   │   │   │   ├── ChatListing.jsx
│   │   │   │   ├── Leftpanel.jsx
│   │   │   │   └── PersonalChatCard.jsx
│   │   │   ├── problemChat/
│   │   │   │   ├── ProblemAiChatWindow.jsx
│   │   │   │   └── ProblemChatModal.jsx
│   │   │   └── rightPanel/
│   │   │       └── chatWindow/
│   │   │           ├── aiChat/
│   │   │           │   ├── AiChatWindow.jsx
│   │   │           │   └── MessageCard.jsx
│   │   │           └── personalChat/
│   │   │               ├── MessageCard.jsx
│   │   │               └── PersonalChatWindow.jsx
│   │   ├── discovery/
│   │   │   ├── AllCoders.jsx
│   │   │   ├── CategoryPagination.jsx
│   │   │   ├── CategoryUsers.jsx
│   │   │   ├── DiscoveryView.jsx
│   │   │   ├── PublicProfileModal.jsx
│   │   │   ├── RecommendedUsers.jsx
│   │   │   └── UserCard.jsx
│   │   ├── welcomeView/
│   │   │   ├── WelcomeView.jsx
│   │   │   └── RightPanel.jsx
│   │   ├── forgotPassword/
│   │   │   ├── EmailInput.jsx
│   │   │   ├── NewpasswordInput.jsx
│   │   │   └── OtpVerification.jsx
│   │   └── home/
│   │       ├── AnimateOnScroll.jsx
│   │       ├── CallToAction.jsx
│   │       ├── CreatorStory.jsx
│   │       ├── FeatureCard.jsx
│   │       ├── FeaturesSection.jsx
│   │       ├── Footer.jsx
│   │       ├── HeroSection.jsx
│   │       ├── AiResponseLoading.jsx
│   │       ├── LoadingSpinner.jsx
│   │       ├── Modal.jsx
│   │       ├── ModernDropdown.jsx
│   │       ├── Navbar.jsx
│   │       ├── PlatformLink.jsx
│   │       ├── Sidebar.jsx
│   │       └── Toggle.jsx
│   ├── contexts/
│   │   └── ForgotPasswordContext.jsx
│   ├── features/
│   │   ├── auth/
│   │   │   └── authSlice.js
│   │   ├── chat/
│   │   │   ├── aiChatSlice.js
│   │   │   ├── chatSlice.js
│   │   │   └── discoverySlice.js
│   │   ├── errorSuccess/
│   │   │   └── errorSuccessSlice.js
│   │   ├── feedback/
│   │   │   └── feedbackSlice.js
│   │   ├── missingProblem/
│   │   │   └── missingProblemSlice.js
│   │   ├── problems/
│   │   │   └── problemSlice.js
│   │   ├── profile/
│   │   │   ├── profileSlice.js
│   │   │   └── publicProfileSlice.js
│   │   └── updateProblem/
│   │       └── updateProblemSlice.js
│   ├── hooks/
│   │   └── useForgotPassword.jsx
│   ├── pages/
│   │   ├── ChatPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── EditProfilePage.jsx
│   │   ├── ErrorPage.jsx
│   │   ├── FeedbackPage.jsx
│   │   ├── ForgotPasswordPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── MissingProblemPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── PublicProfilePage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── UpdateProblemPage.jsx
│   │   └── VerifyEmailPage.jsx
│   ├── routes/
│   │   ├── ProtectedRoute.jsx
│   │   └── PublicRoute.jsx
│   ├── services/
│   │   ├── aiService.js
│   │   ├── authService.js
│   │   ├── chatService.js
│   │   ├── discoveryService.js
│   │   ├── feedbackService.js
│   │   ├── missingProblemService.js
│   │   ├── problemService.js
│   │   ├── profileService.js
│   │   └── updateProblemService.js
│   ├── utils/
│   │   ├── formatTimeAndDate.js
│   │   └── framerMotionVariants.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .dockerignore
├── .gitkeep
├── Dockerfile
├── README.md
├── eslint.config.js
├── index.html
├── nginx.conf
├── package-lock.json
├── package.json
└── vite.config.js

```

---

This structure ensures clear separation of concerns, supports containerized deployment, and makes it easy for contributors to navigate and extend the