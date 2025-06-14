import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utils/db.js";
import authRoutes from "./routes/AuthRoute.js";
import contactRoutes from "./routes/ContactRoutes.js";
import setupSocket from "./socket.js";
import messagesRoutes from "./routes/MessagesRoutes.js";
import channelRoutes from "./routes/ChannelRoutes.js";
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9000;

const allowedOrigins = [
  "http://localhost:5173", // for local dev
  "https://chat-3h5lzhfa8-diptiagarwal2004-gmailcoms-projects.vercel.app", 
  "https://chat-app-eta-eight-49.vercel.app",
  "https://chat-app-git-main-diptiagarwal2004-gmailcoms-projects.vercel.app",
  "https://chat-3h5lzhfa8-diptiagarwal2004-gmailcoms-projects.vercel.app/"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }, 
  methods:["GET", "POST", "PUT", "DELETE"],
  credentials:true,      // to enable cookies
}));

app.use("/uploads/profiles", express.static("uploads/profiles")); // to serve static files
app.use("/uploads/files", express.static("uploads/files")); // to serve static files

app.use(cookieParser())
app.use(express.json());    // to parse incoming requests with JSON payloads
// app.use("")
app.use("/api/auth", authRoutes)
app.use("/api/contacts", contactRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/channel", channelRoutes);

connectDB();

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

setupSocket(server);
