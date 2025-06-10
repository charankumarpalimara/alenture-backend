let wss = null;

function setWebSocketServer(server) {
    wss = server;
    console.log("WebSocket server initialized."); // Debugging log
}

function broadcast(data) {
    if (!wss) {
        console.error("WebSocket server is not initialized.");
        return;
    }
    console.log("Broadcasting data:", data); // Debugging log
    wss.clients.forEach(client => {
        if (client.readyState === client.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

function broadcastNotification({ title, message, crmid }) {
    if (wss && wss.clients) {
        const notification = {
            type: 'notification',
            title,
            message,
            crmid, // Include crmid for targeted notification
            timestamp: new Date().toISOString()
        };
        wss.clients.forEach(client => {
            if (client.readyState === 1) {
                client.send(JSON.stringify(notification));
            }
        });
    }
}

module.exports = { setWebSocketServer, broadcast, broadcastNotification };
