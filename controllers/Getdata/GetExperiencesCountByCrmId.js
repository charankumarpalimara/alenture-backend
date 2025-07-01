const express = require('express');
const mySqlpool = require('../../db');
const { wss } = require('../../index'); // Adjust path if needed

function broadcastCount(type, crmid, count) {
    if (wss && wss.clients) {
        const message = JSON.stringify({ type, crmid, count });
        wss.clients.forEach(client => {
            if (client.readyState === 1) { // 1 = OPEN
                client.send(message);
            }
        });
    }
}

const AllExperiencesCountByCrmid = async (req, res) => {
    try {
        const crmId = req.params.crmid;
        const [total] = await mySqlpool.query("SELECT COUNT(experienceid) AS total FROM experiences WHERE extraind1 = ?", [crmId]);
        const [resolved] = await mySqlpool.query("SELECT COUNT(experienceid) AS resolved FROM experiences WHERE extraind1 = ? AND status = 'Resolved'", [crmId]);
        const [newCount] = await mySqlpool.query("SELECT COUNT(experienceid) AS newCount FROM experiences WHERE extraind1 = ? AND status = 'New'", [crmId]);
        const [processing] = await mySqlpool.query("SELECT COUNT(experienceid) AS processing FROM experiences WHERE extraind1 = ? AND status = 'Processing'", [crmId]);

        const counts = {
            total: total[0].total,
            resolved: resolved[0].resolved,
            new: newCount[0].newCount,
            processing: processing[0].processing
        };

        res.status(200).json({
            message: "Total Experience Count",
            ...counts
        });

        // Broadcast all counts together
        broadcastCount(crmId, counts);

        console.log("Total Experience Count:", counts.total);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
  AllExperiencesCountByCrmid
};