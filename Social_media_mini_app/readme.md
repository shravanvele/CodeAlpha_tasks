# Social Media-like Application

## Introduction

This is a social media-like application built using Node.js, Express.js, EJS for templating, and MongoDB as the database. The application allows users to connect, share posts, comment on posts, and like posts. Users can sign in with their username or email and interact with other users within the platform.

## Features

- **Authentication:**
  - Users can sign in using their username and password or email using Google OAuth2 service.
  - User registration for new users.
  - Session authentication.
  - OAuth2 authentication.

- **User Profile:**
  - Users have profiles displaying their information, including username, email, and profile picture.
  - Users can edit their profiles.

- **Posts:**
  - Users can create and delete posts.
  - Posts support text content and timestamps.

- **Comments:**
  - Users can comment on posts.
  - Comments can be edited and deleted.

- **Likes:**
  - Users can like posts.
  - Display the number of likes on each post.

- **News Feed:**
  - Users can view a news feed with posts from their friends or connections.
  - Posts are displayed in chronological order.

- **Notifications:**
  - Send notifications for new comments on email.
  - Receives notifications on performing any activity on the application using Noty.js.

- **Security:**
  - Authentication middleware protects routes.
  - Secure user sessions.
  - Data validation and security measures against web vulnerabilities.

- **Forgot Password:**
  - Users will receive a link on their registered email.
  - Can reset passwords.
  - Data validation and security measures against web vulnerabilities.

- **UI/UX:**
  - EJS templates for rendering views.
  - Responsive design for various devices.

- **Database:**
  - MongoDB stores user data, posts, comments, likes, etc.
  - Defined schemas and models for data storage.

- **Error Handling:**
  - Graceful error handling with user-friendly error messages.

- **Deployment:**
  - The app is live on render.com
  - Domain setup and HTTPS for secure communication.
  - Deployed link :- https://codeial-gu73.onrender.com

- **Testing:**
  - Unit tests and integration tests for critical parts of the application.

## Getting Started

### Prerequisites

- Node.js and npm installed on your system.
- MongoDB installed and running.
- Redis Server Installed.

### Installation

1. Clone this repository to your local machine.

   ```shell
   git clone https://github.com/yourusername/social-media-app.git
   
2. npm install

3. Install redis from.

 ```shell
   https://github.com/MicrosoftArchive/redis/releases
```

4. npm start
- The Server will run on port 8000 locally.
- Open port 8000 no your browser to access the app.

