const express = require('express');
const mySqlpool = require('../../db'); // Adjust path if needed

const getUserEvents = async (req, res) => {
    try {

        const { userid } = req.params;
        console.log("User ID:", userid);
        const [rows] = await mySqlpool.query('SELECT * FROM calender WHERE userid = ?', [userid]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add event
const addEvent = async (req, res) => {
    try {
        const {
            userid, userrole, event,
            eventstartdate, eventenddate,
            eventstarttime, eventendtime,
            time, date, color, allDay
        } = req.body;
        console.log("Adding event for user:", req.body);

        const [result] = await mySqlpool.query(
            'INSERT INTO calender (userid, userrole, event, eventstartdate, eventenddate, eventstarttime, eventendtime, time, date, color, allDay) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [userid, userrole, event, eventstartdate, eventenddate, eventstarttime, eventendtime, time, date, color, allDay]
        );
        const [rows] = await mySqlpool.query('SELECT * FROM calender WHERE id = ?', [result.insertId]);
        if (!rows[0]) {
            console.error("Event not found after insertion");
            return res.status(404).json({ error: "Event not found" });
        }
        res.json(rows[0]);
        console.log("Event added successfully:", rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.error("Error adding event:", err);
    }
};

const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            event, eventstartdate, eventenddate,
            eventstarttime, eventendtime,
            color, allDay
        } = req.body;
        const currentDate = new Date();
        const date = currentDate.toLocaleDateString('en-US');
        const time = currentDate.toLocaleTimeString('en-US', { hour12: true });

        await mySqlpool.query(
            'UPDATE calender SET event = ?, eventstartdate = ?, eventenddate = ?, eventstarttime = ?, eventendtime = ?, color = ?, allDay = ?, time = ?, date = ? WHERE id = ?',
            [event, eventstartdate, eventenddate, eventstarttime, eventendtime, color, allDay, time, date, id]
        );
        const [rows] = await mySqlpool.query('SELECT * FROM calender WHERE id = ?', [id]);
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// Delete event by id
const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Deleting event with ID:", id);
        await mySqlpool.query('DELETE FROM calender WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getUserEvents,
    addEvent,
    updateEvent,
    deleteEvent,
};



