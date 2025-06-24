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

const getAllExperiencesCountByCmId = async (req, res) => {
    try{
        const cmId = req.params.cmid;
        if (!cmId) {
            return res.status(400).json({ error: "CM ID is required" });
        }
        const [data] = await mySqlpool.query("SELECT COUNT(experienceid) AS total FROM experiences WHERE cmid = ?", [cmId]);
        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No Records Found" });
        }
        res.status(200).json({ message: "Total Experience Count for CM ID", count: data[0].total });
        broadcastCount('all', cmId, data[0].total);
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const getResolvedExperiencesCountByCmId = async (req, res) => {
    try{
        const cmId = req.params.cmid;
        if (!cmId) {
            return res.status(400).json({ error: "CM ID is required" });
        }
        const [data] = await mySqlpool.query("SELECT COUNT(experienceid) AS totalResolved FROM experiences WHERE cmid = ? AND status = 'Resolved'", [cmId]);
        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No Records Found" });
        }
        res.status(200).json({ message: "Resolved Experience Count for CM ID", count: data[0].totalResolved });
        broadcastCount('resolved', cmId, data[0].totalResolved);
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const getNewExperiencesCountByCmId = async (req, res) => {
    try{
        const cmId = req.params.cmid;
        if (!cmId) {
            return res.status(400).json({ error: "CM ID is required" });
        }
        const [data] = await mySqlpool.query("SELECT COUNT(experienceid) AS totalNew FROM experiences WHERE cmid = ? AND status = 'New'", [cmId]);
        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No Records Found" });
        }
        res.status(200).json({ message: "New Experience Count for CM ID", count: data[0].totalNew });
        broadcastCount('new', cmId, data[0].totalNew);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const getPendingExperiencesCountByCmId = async (req, res) => {
    try{
        const cmId = req.params.cmid;
        if (!cmId) {
            return res.status(400).json({ error: "CM ID is required" });
        }
        const [data] = await mySqlpool.query("SELECT COUNT(experienceid) AS totalPending FROM experiences WHERE cmid = ? AND status = 'Processing'", [cmId]);
        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No Records Found" });
        }
        res.status(200).json({ message: "Pending Experience Count for CM ID", count: data[0].totalPending });
        broadcastCount('pending', cmId, data[0].totalPending);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    getAllExperiencesCountByCmId,
    getResolvedExperiencesCountByCmId,
    getNewExperiencesCountByCmId,
    getPendingExperiencesCountByCmId
};