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

const getAllExperiencesCountByCrmId = async (req, res) => {
    try{
        const crmId = req.params.crmid;
        if (!crmId) {
            return res.status(400).json({ error: "CRM ID is required" });
        }
        const [data] = await mySqlpool.query("SELECT COUNT(experienceid) AS total FROM experiences WHERE extraind1 = ?", [crmId]);
        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No Records Found" });
        }
        res.status(200).json({ message: "Total Experience Count for CRM ID", count: data[0].total });
        broadcastCount('all', crmId, data[0].total);
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const getResolvedExperiencesCountByCrmId = async (req, res) => {
    try{
        const crmId = req.params.crmid;
        if (!crmId) {
            return res.status(400).json({ error: "CRM ID is required" });
        }
        const [data] = await mySqlpool.query("SELECT COUNT(experienceid) AS totalResolved FROM experiences WHERE extraind1 = ? AND status = 'Resolved'", [crmId]);
        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No Records Found" });
        }
        res.status(200).json({ message: "Resolved Experience Count for CRM ID", count: data[0].totalResolved });
        broadcastCount('resolved', crmId, data[0].totalResolved);
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const getNewExperiencesCountByCrmId = async (req, res) => {
    try{
        const crmId = req.params.crmid;
        if (!crmId) {
            return res.status(400).json({ error: "CRM ID is required" });
        }
        const [data] = await mySqlpool.query("SELECT COUNT(experienceid) AS totalNew FROM experiences WHERE extraind1 = ? AND status = 'New'", [crmId]);
        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No Records Found" });
        }
        res.status(200).json({ message: "New Experience Count for CRM ID", count: data[0].totalNew });
        broadcastCount('new', crmId, data[0].totalNew);
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const getPendingExperiencesCountByCrmId = async (req, res) => {
    try{
        const crmId = req.params.crmid;
        if (!crmId) {
            return res.status(400).json({ error: "CRM ID is required" });
        }
        const [data] = await mySqlpool.query("SELECT COUNT(experienceid) AS totalPending FROM experiences WHERE extraind1 = ? AND status = 'Processing'", [crmId]);
        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No Records Found" });
        }
        res.status(200).json({ message: "Pending Experience Count for CRM ID", count: data[0].totalPending });
        broadcastCount('pending', crmId, data[0].totalPending);
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    getAllExperiencesCountByCrmId,
    getResolvedExperiencesCountByCrmId,
    getNewExperiencesCountByCrmId,
    getPendingExperiencesCountByCrmId
};