import { Socket } from "socket.io";
import http from "http";
import cors from 'cors';
import dotenv from 'dotenv';

import express from 'express';
import { Server } from 'socket.io';
import { UserManager } from "./managers/UserManger";
import { connectDB } from './config/database';
import authRoutes from './routes/auth';
import protectedRoutes from './routes/protected';
import conversationRoutes from './routes/conversation';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
const allowedOrigins: string[] = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL
].filter((origin): origin is string => typeof origin === "string");

// Express CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman / server-to-server

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api', conversationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

const userManager = new UserManager();

io.on('connection', (socket: Socket) => {
  console.log('a user connected');
  userManager.addUser("randomName", socket);
  socket.on("disconnect", () => {
    console.log("user disconnected");
    userManager.removeUser(socket.id);
  })
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});