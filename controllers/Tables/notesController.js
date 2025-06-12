const express = require('express');
const mySqlpool = require('../../db');

const noteRegister = async (req, res) => {
    try {

        const { createrid, createrrole, name, description } = req.body;
        console.log("Received data:", req.body);
        // Validate required fields
        if (!createrid || !createrrole || !name || !description ) {
            return res.status(400).json({ error: "Please provide  All required fields" });
            console.log("Please provide all  required fields");
        }
        const currentDate = new Date();
        const date = currentDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
        const time = currentDate.toTimeString().split(' ')[0]; // Format: HH:MM:SS

            const [data] = await mySqlpool.query(
                "INSERT INTO notes (id, createrid, createrrole, name, description, date, time, extraind1, extraind2, extraind3) VALUES (NULL, ?, ?, ?, ?, ?, ?, '', '', '')",
                [createrid, createrrole, name, description, date, time]
            );
            if (!data) {
                return res.status(500).json({ error: "Error inserting data into the database" });
            }


            return res.status(201).json({ message: "Note created successfully", data });
            console.log("Note created successfully", data);
         
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}


const noteGetByid = async (req, res) => {
    try {

        const createrid = req.params.createrid;
        if (!createrid) {
            return res.status(400).json({ error: "No Notes received" });
        }
  
        // const currentDate = new Date();
        // const date = currentDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
        // const time = currentDate.toTimeString().split(' ')[0]; // Format: HH:MM:SS

     const [notes] = await mySqlpool.query(
            "SELECT * FROM notes WHERE createrid = ? ",
            [createrid]
        );
         
        if (!notes || notes.length === 0) {
            return res.status(404).json({ error: `No one Is there with this id ${createrid}` });
        }

        res.status(200).json({ message: "Notes details found", notes });
        console.log({ message: "Notes details found", notes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}


module.exports = { noteRegister, noteGetByid };