const express = require('express');
const app = express();
const mySqlpool = require('./db')
const router = require('./routes/RegistrationRout')

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

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/v1", router)


app.get('/', (req, res) => {
    res.status(200).send('<h1>Node.js MySQL App</h1>');
});


const PORT = process.env.PORT || 8081;

mySqlpool.query('SELECT 1')
    .then(() => {
        console.log('MySQL connected successfully');
    })
    .catch((error) => {
        console.error('Database connection failed:', error.message);
    });

// Start the server and listen on port 8080
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = { app, server, broadcast };
