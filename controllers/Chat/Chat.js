const express = require('express');
const mySqlpool = require('../../db');
// const { message } = require('antd');

const ChatInsert = async (req, res) => {
    try {
        const { experienceid, crmid, cmid, message, sender, crmname } = req.body;
        console.log(req.body);
        if (!experienceid || !crmid || !cmid || !message || !sender || !crmname) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const currentDate = new Date();
        const time = currentDate.toTimeString().split(' ')[0];
        const date = currentDate.toISOString().split('T')[0];

        await mySqlpool.query(
            "INSERT INTO chat (cmid, crmid, experienceid, messege, sender, time, date, extraind1) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [cmid, crmid, experienceid, message, sender, time, date, crmname ]
        );

        res.status(201).json({ message: "Message sent successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const GetChatMessages = async (req, res) => {
    try {
        const { experienceid, crmid } = req.query;
                console.log(req.body);
        if (!experienceid || !crmid) {
            return res.status(400).json({ error: "experienceid and crmid are required" });
        }

        const [messages] = await mySqlpool.query(
            "SELECT * FROM chat WHERE experienceid = ?  ORDER BY date, time",
            [experienceid, crmid]
        );

        res.status(200).json({ messages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { ChatInsert, GetChatMessages };
