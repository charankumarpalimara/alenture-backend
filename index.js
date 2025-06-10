/**********************************
 *   Updated Backend Index File   *
 **********************************/

const express = require('express');
const app = express();
const mySqlpool = require('./db');

const registrationRoutes = require('./routes/RegistrationRout');
const LoginRouter = require('./routes/LoginRoute');
const updateRoutes = require('./routes/UpdateRoute');
const DeleteRoute = require('./routes/DeleteRoute');
const GetRoute = require('./routes/GetRoute');
const getAssignrouter = require('./routes/AssignTaskRoute');
const chatRoutes = require('./routes/ChatRoute');

const cors = require('cors');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import modules for HTTP Server and WebSocket
const http = require('http');
const WebSocket = require('ws');

// Create an HTTP server based on Express app
const server = http.createServer(app);

// ----- Socket.IO Setup ----- //
const socketIo = require('socket.io');
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "http://161.35.54.196", "http://localhost:3001" ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// ----- WebSocket Setup (For live updates) ----- //
const wss = new WebSocket.Server({ server });

// Import custom utility to set the WebSocket server (if needed)
const { setWebSocketServer } = require('./WebSocketUtils');

// Middleware setup
app.use(express.json());
app.use(cors());

// Serve static files from 'uploads' folder
app.use('/uploads/', express.static(path.join(__dirname, 'uploads')));

// Register API routes
app.use("/v1", registrationRoutes);
app.use("/v1", LoginRouter);
app.use("/v1", updateRoutes);
app.use("/v1", DeleteRoute);
app.use("/v1", GetRoute);
app.use("/v1", getAssignrouter);
app.use("/v1", chatRoutes);

// Default landing route
app.get('/', (req, res) => {
  res.status(200).send('<h1>Node.js MySQL App</h1>');
});

/**********************************
 *  WebSocket (wss) Connections   *
 **********************************/
wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  ws.on('close', (code, reason) => {
    console.warn(`WebSocket client disconnected. Code: ${code}, Reason: ${reason}`);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
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
io.on('connection', (socket) => {
  console.log('User connected via Socket.IO:', socket.id);

  // Join a room based on provided identifiers
  socket.on('joinRoom', ({ experienceid, crmid }) => {
    socket.join(`${experienceid}_${crmid}`);
  });

  // Handle sending messages to a room
  socket.on('sendMessage', async (data) => {
    // Insert database save logic here if needed

    // Emit the message to all clients in the room
    io.to(`${data.experienceid}_${data.crmid}`).emit('receiveMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected from Socket.IO:', socket.id);
  });
});

/**********************************
 *       Database Check &         *
 *       Server Start-up          *
 **********************************/
const PORT = 8080;

mySqlpool.query('SELECT 1')
  .then(() => {
    console.log('MySQL connected successfully');
  })
  .catch((error) => {
    console.error('Database connection failed:', error.message);
  });

// Start the HTTP server (handling Express, Socket.IO, and WebSocket)
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});

module.exports = { app, server, broadcast };
