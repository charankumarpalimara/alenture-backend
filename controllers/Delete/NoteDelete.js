const express = require('express');
const mySqlpool = require('../../db');

const NoteDelete = async (req, res) => {
    try {
        const noteId = req.params.id;
        if (!noteId) {
            return res.status(400).json({ error: "Note ID is required" });
        }

        // Check if the note exists
        const [note] = await mySqlpool.query("SELECT * FROM notes WHERE id = ?", [noteId]);
        if (!note || note.length === 0) {
            return res.status(404).json({ error: "Note not found" });
        }

        // Delete the note
        await mySqlpool.query("DELETE FROM notes WHERE id = ?", [noteId]);

        res.status(200).json({ message: "Note deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { NoteDelete };