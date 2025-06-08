// server/app.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
// Import Node's built-in http module and the Server class from socket.io
const http = require('http');
const { Server } = require("socket.io");

// Import our new socket logic handler (we will create this file next)
const { socketHandler, userSocketMap } = require('./socket/socket'); 

dotenv.config();

const app = express();
// Create an HTTP server from our Express app
const server = http.createServer(app);

// Create a new Socket.IO server and attach it to the HTTP server.
// It's crucial to configure CORS here as well for the WebSocket connection.
// --- THIS IS THE CORRECTED CORS CONFIGURATION ---
const allowedOrigins = [
  "http://localhost:5173", // For your local development
  process.env.CLIENT_URL,  // For your live frontend
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

const io = new Server(server, {
  cors: corsOptions
});

// Pass the `io` instance to our socket handler
socketHandler(io);

app.use(express.json());
app.use(cors());
app.use('/images', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
  req.io = io;
  req.userSocketMap = userSocketMap; // Attach the map to each request
  next();
});
// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/follow', require('./routes/followRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
// We will create and add the chat routes in a later step.

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("Connected to MongoDB");
  // IMPORTANT: We now listen on the `server` instance, not the `app` instance.
  server.listen(PORT, () => { 
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
});