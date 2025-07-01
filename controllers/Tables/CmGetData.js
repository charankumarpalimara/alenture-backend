const mySqlpool = require('../../db');
// const db = require('./db');
const express = require('express');

// --- WebSocket server setup ---
// const http = require('http');
// const WebSocket = require('ws');

// Only set up WebSocket if this is the main module
// if (require.main === module) {
//   const app = express();
//   const server = http.createServer(app);
//   const wss = new WebSocket.Server({ server });

//   wss.on('connection', (ws) => {
//     console.log('WebSocket client connected');
//     ws.on('message', (message) => {
//       console.log('Received:', message);
//       // You can handle messages here
//     });
//     ws.send('WebSocket connection established');
//   });

//   server.listen(8080, () => {
//     console.log('Express and WebSocket server running on port 8080');
//   });
// }

const getAllCm = async (req, res) => {
    try {
        const [data] = await mySqlpool.query("SELECT * FROM listofcm order by cmid desc");
        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No Records Found" });
        }

        // Add image URL to each record
        const updatedData = data.map((record) => ({
            ...record,
            imageUrl: `${req.protocol}://${req.get('host')}/uploads/cm/${record.extraind1}`, // Construct image URL
        }));

        res.status(200).json({ message: "All User Records", data: updatedData });
        console.log("All students get successfully");
        // console.log(updatedData);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error in Get All Students API" });
    }
};


const getCmDataById = async (req, res) => {
    try {
        const userId = req.params.cmid;
        const [cmname] = await mySqlpool.query(
            "SELECT * FROM listofcm WHERE cmid = ? order by id desc ",
            [userId]
        );
        if (!cmname || cmname.length === 0) {
            return res.status(404).json({ error: `No one Is there with this id ${cmid}` });
        }
        const updatedData = cmname.map((record) => ({
            ...record,
            imageUrl: `${req.protocol}://${req.get('host')}/uploads/cm/${record.extraind1}`, // Construct image URL
        }));
        res.status(200).json({ message: "Cm details found", updatedData });
        console.log({ message: "Cm details found", updatedData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong in this API" });
    }
};



const getCmDataByCrmid = async (req, res) => {
    try {
        const userId = req.params.crmid;
        const [cmname] = await mySqlpool.query(
            "SELECT * FROM listofcm WHERE crmid = ? order by id desc ",
            [userId]
        );
        if (!cmname || cmname.length === 0) {
            return res.status(404).json({ error: `No one Is there with this id ${cmid}` });
        }
        const updatedData = cmname.map((record) => ({
            ...record,
            imageUrl: `${req.protocol}://${req.get('host')}/uploads/cm/${record.extraind1}`, // Construct image URL
        }));
        res.status(200).json({ message: "Cm details found", data: updatedData });
        console.log({ message: "Cm details found", updatedData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong in this API" });
    }
};


module.exports = { getAllCm , getCmDataById, getCmDataByCrmid};