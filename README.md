# Blog Verse - A Full-Stack Social Blogging Platform

![Blog App Logo](server/uploads/Blog.svg) <!-- Optional: Add a small logo if you like -->

## ✨ About The Project ✨

**Blog Verse** is a modern, full-stack social blogging platform built to connect users and facilitate seamless sharing of ideas. Inspired by the need for a dynamic and interactive space for content creators, Blog Verse offers a comprehensive suite of features, from real-time communication to rich content publishing. This project showcases a robust implementation of the MERN stack with a strong emphasis on real-time capabilities using Socket.IO and a polished user experience designed with Tailwind CSS.

It serves as a demonstration of building complex, real-time applications from the ground up.

## 🚀 Live Demo

Experience Blog Verse live!

*   **Frontend (Deployed on Vercel):** [https://your-vercel-app-url.vercel.app](https://blog-fullstack-neon.vercel.app/)
*   **Backend API (Deployed on Render):** [https://blog-fullstack-wjoy.onrender.com](https://blog-fullstack-wjoy.onrender.com)
    *(Note: This is a backend API only. You won't see a website here, but it's the server powering the frontend.)*

## 📦 Features

Blog Verse comes packed with features designed for a rich social blogging experience:

*   **User Authentication:** Secure Sign Up and Login using JWT.
*   **Profile Management:** Users can view and edit their own profiles (username, bio, avatar) and delete their account.
*   **Post Management (CRUD):** Create, Read, Update, and Delete blog posts with rich text formatting and optional image uploads.
*   **Rich Text Editor:** Integrated **TipTap** editor for creating beautifully formatted post content.
*   **Social Interaction:** Like posts, follow and unfollow users.
*   **Follower/Following Lists:** View who a user is following and who follows them via modals.
*   **Nested Comments:** Engage in discussions with multi-level comment threads on posts.
*   **Real-Time Chat:**
    *   Private one-on-one messaging.
    *   Instant message delivery via Socket.IO.
    *   Message editing and deletion with a time limit.
    *   Real-time "User is typing..." indicator.
    *   Conversation management (hide/unhide - *Note: Hide/Unhide might need re-integration after recent refactoring, but the core feature structure is there.*)
    *   Online user status indicators in chat.
*   **Emoji Pickers:** Add expressive emojis to chat messages and comments.
*   **Responsive Design:** Fully optimized for desktop and mobile views with a clean, animated hamburger menu.
*   **Cosmic Theme:** A unique and attractive dark theme built with Tailwind CSS.

## 🛠️ Tech Stack

**Frontend:**

*   **React:** (Functional Components, Hooks, Context API)
*   **React Router DOM:** Client-side routing
*   **Tailwind CSS:** Styling and responsive design
*   **TipTap:** Rich Text Editor
*   **Emoji Picker React:** Emoji selection
*   **Axios:** API Client
*   **Socket.IO Client:** Real-time communication

**Backend:**

*   **Node.js:** JavaScript Runtime
*   **Express.js:** Web Framework
*   **MongoDB:** Database
*   **Mongoose:** MongoDB ODM
*   **Socket.IO:** Real-time communication
*   **JWT:** Authentication
*   **bcryptjs:** Password Hashing
*   **Multer:** File Uploads
*   **CORS:** Cross-Origin Resource Sharing

**Deployment:**

*   **Frontend:** Vercel
*   **Backend:** Render
*   **Database:** MongoDB Atlas

## 🏃 Getting Started (Local Setup)

Follow these steps to get a local copy of the project up and running.

**Prerequisites:**

*   Node.js (v18 or higher recommended)
*   MongoDB (local installation or access to a cloud instance like MongoDB Atlas)
*   Git

**Installation:**

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Saumy-TOXOTIS/blog-fullstack.git  <-- **Replace with your GitHub URL**
    cd blog-fullstack
    ```

2.  **Set up the Server:**
    ```bash
    cd server
    npm install
    ```
    *   **Create a `.env` file** in the `server` directory.
    *   Add your MongoDB connection URI and a JWT secret:
        ```env
        MONGO_URI=your_mongodb_connection_string # e.g., mongodb://localhost:27017/blogdb or your Atlas string
        JWT_SECRET=your_super_secret_key # Choose a strong, random string
        PORT=5000
        ```
    *   **Start the server:**
        ```bash
        node app.js
        ```
        *(Keep this terminal window open)*

3.  **Set up the Client:**
    ```bash
    cd ../client # Go back to the root and then into the client folder
    npm install --force
    ```
    *   **Create a `.env` file** in the `client` directory.
    *   Add the backend API URL for local development:
        ```env
        VITE_API_URL=http://localhost:5000
        ```
    *   **Start the client:**
        ```bash
        npm run dev
        ```
        *(Keep this terminal window open)*

4.  **Access the App:**
    *   Open your browser and go to `http://localhost:5173` (or the address provided by Vite).

## 🗺️ Deployment

The project is deployed using:

*   **Frontend:** Vercel (Connects to the `client` subdirectory)
*   **Backend:** Render (Connects to the `server` subdirectory)
*   **Database:** MongoDB Atlas

Refer to the detailed deployment steps in our conversation history for full instructions on connecting these services.

## ✨ Future Enhancements

*   Pagination / Infinite Scrolling for posts
*   Global Real-Time Notification System (Beyond chat)
*   Full-Text Search for posts
*   Chat Read Receipts
*   User Roles (Admin/Moderator)
*   Post Bookmarking
*   User Analytics Dashboard

## 🙏 Acknowledgements

This project was developed with invaluable guidance and expertise. Special thanks to the AI assistant that served as a technical partner and mentor throughout the development process.

## 📧 Contact

Connect with me!

*   **GitHub:** [https://github.com/Saumy-TOXOTIS](https://github.com/Saumy-TOXOTIS) <-- **Replace with your GitHub profile URL**

*(Consider adding links to your LinkedIn or personal portfolio website here too!)*

---

This README is detailed, highlights your best features, provides clear setup instructions, and is well-formatted. Copy this content into a `README.md` file in the root of your project, push it to GitHub, and your repository will look professional and impressive!
