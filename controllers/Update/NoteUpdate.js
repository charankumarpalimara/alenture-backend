const express = require('express');
const mySqlpool = require('../../db');



const NoteUpdate = async (req, res) => {
    try {
        const noteId = req.params.id;
        const {  name, description, id } = req.body;

        if (!name || !description ) {
            return res.status(400).json({ error: "Note ID, title, and content are required" });
        }

        // Check if the note exists
        const [note] = await mySqlpool.query("SELECT * FROM notes WHERE id = ?", [noteId]);
        if (!note || note.length === 0) {
            return res.status(404).json({ error: "Note not found" });
        }

        // Update the note
        await mySqlpool.query("UPDATE notes SET name = ?, description = ? WHERE id = ?", [name, description, noteId]);

        res.status(200).json({ message: "Note updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}


module.exports = { NoteUpdate };