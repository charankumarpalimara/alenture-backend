/**********************************
 *   Updated Backend Index File   *
 **********************************/

const express = require("express");
const app = express();
const mySqlpool = require("./db");

const registrationRoutes = require("./routes/RegistrationRout");
const LoginRouter = require("./routes/LoginRoute");
const updateRoutes = require("./routes/UpdateRoute");
const DeleteRoute = require("./routes/DeleteRoute");
const GetRoute = require("./routes/GetRoute");
const getAssignrouter = require("./routes/AssignTaskRoute");
const chatRoutes = require("./routes/ChatRoute");
const assignedrelationsRoutes = require("./routes/AssisgnRelationRoute");
const routes = require("./routes/routes");
const passwordResetRoutes = require("./routes/ResetPasswordRoute");
const forgotPasswordRoutes = require("./routes/ForgotPasswordRoute");

const cors = require("cors");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

// Load environment variables

console.log("JWT_SECRET:", process.env.JWT_SECRET_KEY);
console.log("port", process.env.PORT);

// Import modules for HTTP Server and WebSocket
const http = require("http");
const WebSocket = require("ws");

// Create an HTTP server based on Express app
const server = http.createServer(app);

// ----- Socket.IO Setup ----- //
const socketIo = require("socket.io");
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://161.35.54.196",
  "https://161.35.54.196",
  "http://161.35.54.196:3000",
  "https://161.35.54.196:3000",
  "http://161.35.54.196:3001",
  "https://161.35.54.196:3001",
  "http://147.182.163.213:4000",
  "https://147.182.163.213:4000",
  "https://147.182.163.213:4000",
  "http://147.182.163.213:5000",
  "https://147.182.163.213:5000",
  "http://147.182.163.213:9000",
  "https://147.182.163.213:9000",
  "http://147.182.163.213",
  "https://147.182.163.213",
  "https://cem.alantur.ai",
  "*",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));

const ioServer = http.createServer();
const io = socketIo(ioServer, {
  path: "/socket.io/",
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  },
});

// ----- WebSocket Setup (For live updates) ----- //
const wss = new WebSocket.Server({ server, path: "/ws/" });

// Import custom utility to set the WebSocket server (if needed)
const { setWebSocketServer } = require("./WebSocketUtils");

// Middleware setup
app.use(express.json());

// Serve static files from 'uploads' folder
app.use("/uploads/", express.static(path.join(__dirname, "uploads")));

// Register API routes
app.use("/v1", registrationRoutes);
app.use("/v1", LoginRouter);
app.use("/v1", updateRoutes);
app.use("/v1", DeleteRoute);
app.use("/v1", GetRoute);
app.use("/v1", getAssignrouter);
app.use("/v1", chatRoutes);
app.use("/v1", assignedrelationsRoutes);
app.use("/v1", routes);
app.use("/v1", passwordResetRoutes);
app.use("/v1", forgotPasswordRoutes);


// Default landing route
app.get("/", (req, res) => {
  res.status(200).send("<h1>Node.js MySQL App</h1>");
});

/**********************************
 *  WebSocket (wss) Connections   *
 **********************************/
wss.on("connection", (ws) => {
  console.log("WebSocket client connected");

  ws.on("close", (code, reason) => {
    console.warn(
      `WebSocket client disconnected. Code: ${code}, Reason: ${reason}`
    );
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

// Initialize custom WebSocket server functions (if any)
setWebSocketServer(wss);

// Broadcast function using native WebSocket
const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

/**********************************
 *       Socket.IO Connections    *
 **********************************/
io.on("connection", (socket) => {
  console.log("User connected via Socket.IO:", socket.id);

  // Join a room based on provided identifiers
  socket.on("joinRoom", ({ experienceid, crmid }) => {
    socket.join(`${experienceid}_${crmid}`);
  });

  // Handle sending messages to a room
  socket.on("sendMessage", async (data) => {
    // Insert database save logic here if needed

    // Emit the message to all clients in the room
    io.to(`${data.experienceid}_${data.crmid}`).emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected from Socket.IO:", socket.id);
  });
});

/**********************************
 *       Database Check &         *
 *       Server Start-up          *
 **********************************/
const PORT = 8080;

mySqlpool
  .query("SELECT 1")
  .then(() => {
    console.log("MySQL connected successfully");
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
  });

// Start the HTTP server (handling Express, Socket.IO, and WebSocket)
server.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
ioServer.listen(8082, () => {
  console.log(`Socket.IO server running on http://127.0.0.1:8082`);
});

module.exports = { app, server, broadcast };
