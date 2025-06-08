# Blog App - A Full-Stack Social Blogging Platform

![Blog Verse Logo](https://raw.githubusercontent.com/Saumy-TOXOTIS/blog-fullstack/main/server/uploads/Blog.svg)

## ✨ About The Project ✨

**Blog App** is a modern, full-stack social blogging platform built to connect users and facilitate the seamless sharing of ideas. This project showcases a robust implementation of the **MERN stack (MongoDB, Express, React, Node.js)** with a strong emphasis on real-time capabilities using **Socket.IO** and a polished, responsive user experience designed with **Tailwind CSS**.

From rich text post creation to live private messaging, Blog Verse serves as a comprehensive demonstration of building complex, interactive, and production-ready web applications from the ground up.

## 🚀 Live Demo

Experience Blog Verse live!

*   **Live Application (Frontend on Render):** **[https://blog-fullstack-frontend-uurb.onrender.com](https://blog-fullstack-frontend-uurb.onrender.com)**
*   **Backend API (Backend on Render):** **[https://blog-fullstack-wjoy.onrender.com](https://blog-fullstack-wjoy.onrender.com)**
    *(Note: This is a backend API only. You won't see a website here, but it's the server powering the live application.)*

## 📦 Features

Blog Verse comes packed with features designed for a rich social blogging experience:

*   **User Authentication:** Secure Sign Up and Login using **JWT**.
*   **Profile Management:** Users can view and edit their own profiles (username, bio, avatar) and delete their account.
*   **Post Management (CRUD):** Create, Read, Update, and Delete blog posts with optional image uploads.
*   **Rich Text Editor:** Integrated **TipTap** editor for creating beautifully formatted post content with bold, italics, lists, code blocks, and more.
*   **Social Interaction:** Like posts and follow/unfollow other users.
*   **Follower/Following Lists:** View who a user is following and who follows them via modals.
*   **Nested Comments:** Engage in discussions with multi-level comment threads on posts.
*   **Real-Time Chat:**
    *   Private one-on-one messaging initiated from user profiles.
    *   Instant message delivery via **Socket.IO**.
    *   Live **"User is typing..."** indicator.
    *   Message editing and deletion within a time limit.
    *   Real-time online user status indicators.
*   **Responsive Design:** Fully optimized for desktop and mobile views with a clean, animated slide-out menu.
*   **Emoji Pickers:** Add expressive emojis to chat messages and comments.
*   **And much more...**

## 🛠️ Tech Stack

**Frontend:**
*   **React:** (Functional Components, Hooks, Context API)
*   **React Router:** Client-side routing
*   **Vite:** Build Tool
*   **Tailwind CSS:** Utility-First Styling
*   **TipTap:** Rich Text Editor
*   **Axios:** API Client
*   **Socket.IO Client:** Real-time communication

**Backend:**
*   **Node.js:** JavaScript Runtime
*   **Express.js:** Web Framework
*   **MongoDB:** NoSQL Database
*   **Mongoose:** Object Data Modeling (ODM)
*   **Socket.IO:** Real-time WebSocket Communication
*   **JWT (JSON Web Tokens):** Authentication
*   **bcryptjs:** Password Hashing
*   **Multer:** File Upload Handling
*   **CORS:** Cross-Origin Resource Sharing

**Deployment & Infrastructure:**
*   **Frontend:** Render (Static Site)
*   **Backend:** Render (Web Service)
*   **Database:** MongoDB Atlas

## 🏃 Getting Started (Local Setup)

Follow these steps to get a local copy of the project up and running.

**Prerequisites:**
*   Node.js (v18 or higher)
*   MongoDB (a local installation or free cloud instance from MongoDB Atlas)
*   Git

**Installation:**

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Saumy-TOXOTIS/blog-fullstack.git
    cd blog-fullstack
    ```

2.  **Set up the Server:**
    ```bash
    cd server
    npm install
    ```
    *   Create a `.env` file in the `server` directory and add the following keys:
        ```env
        MONGO_URI=your_mongodb_connection_string
        JWT_SECRET=your_super_secret_key
        PORT=5000
        CLIENT_URL=http://localhost:5173
        ```
    *   Start the server (from the `server` directory):
        ```bash
        npm start  # or node app.js
        ```

3.  **Set up the Client:**
    *   Open a new terminal window. From the root `blog-fullstack` folder, navigate to the client:
        ```bash
        cd client
        npm install
        ```
    *   Create a `.env` file in the `client` directory and add the backend API URL:
        ```env
        VITE_API_URL=http://localhost:5000
        ```
    *   Start the client (from the `client` directory):
        ```bash
        npm run dev
        ```

4.  **Access the App:**
    *   Open your browser and go to `http://localhost:5173`.

## ✨ Future Enhancements

*   **Pagination / Infinite Scrolling** for the main post feed to improve performance.
*   **Full-Text Search** functionality for finding posts and users.
*   **Chat "Read Receipts"** to show when a message has been seen.
*   **User Roles** (Admin/Moderator) with special permissions.
*   **Post Bookmarking** feature for users to save posts to read later.

## 🙏 Acknowledgements

This project was developed with invaluable guidance and expertise. Special thanks to the AI assistant that served as a technical partner and mentor throughout the development process.

## 📧 Contact

**Saumy Tiwari**

*   **GitHub:** [https://github.com/Saumy-TOXOTIS](https://github.com/Saumy-TOXOTIS)
