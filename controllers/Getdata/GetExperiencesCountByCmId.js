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

const AllExperiencesCountByCmid = async (req, res) => {
    try {
        const cmId = req.params.cmid;
        const [total] = await mySqlpool.query("SELECT COUNT(experienceid) AS total FROM experiences WHERE cmid = ?", [cmId]);
        const [resolved] = await mySqlpool.query("SELECT COUNT(experienceid) AS resolved FROM experiences WHERE cmid = ? AND status = 'Resolved'", [cmId]);
        const [newCount] = await mySqlpool.query("SELECT COUNT(experienceid) AS newCount FROM experiences WHERE cmid = ? AND status = 'New'", [cmId]);
        const [processing] = await mySqlpool.query("SELECT COUNT(experienceid) AS processing FROM experiences WHERE cmid = ? AND status = 'Processing'", [cmId]);

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
        broadcastCount(cmId, counts);

        console.log("Total Experience Count:", counts.total);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
  AllExperiencesCountByCmid
};