const express = require('express');
const app = express();
const mySqlpool = require('./db')

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

// for live data updates
const http = require('http'); // Add this line to import the http module
const WebSocket = require('ws'); // Add this line to import the WebSocket module
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const { setWebSocketServer } = require('./WebSocketUtils'); // Import setWebSocketServer


// const http = require('http');
const socketIo = require('socket.io');
// const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } }); 

app.use(express.json());    

// Enable CORS for all origins
app.use(cors());

// Set up Global configuration access
dotenv.config();


// live data updates
wss.on('connection', (ws) => {
    console.log('WebSocket client connected');

    ws.on('close', (code, reason) => {
        console.warn(`WebSocket client disconnected. Code: ${code}, Reason: ${reason}`);
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

// Initialize WebSocket server
setWebSocketServer(wss);

// Broadcast function
const broadcast = (data) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};


io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinRoom', ({ experienceid, crmid }) => {
    socket.join(`${experienceid}_${crmid}`);
  });

  socket.on('sendMessage', async (data) => {
    // Save to DB as before
    // ...insert into DB logic...
    // After saving, emit to room
    io.to(`${data.experienceid}_${data.crmid}`).emit('receiveMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/v1", registrationRoutes)

app.use("/api/v1", LoginRouter)

app.use('/api/v1', updateRoutes);

app.use("/api/v1", DeleteRoute)

app.use("/api/v1", GetRoute)


app.use("/api/v1", getAssignrouter)

app.use("/api/v1", chatRoutes);

// app.use("api/v1",)

app.get('/', (req, res) => {
    res.status(200).send('<h1>Node.js MySQL App</h1>');
});


const PORT = 8080;

mySqlpool.query('SELECT 1')
    .then(() => {
        console.log('MySQL connected successfully');
    })
    .catch((error) => {
        console.error('Database connection failed:', error.message);
    });

// Start the server and listen on port 8080
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});

module.exports = { app, server, broadcast };
