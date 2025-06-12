const express = require('express');
const mySqlpool = require('../../../db');



const RelationDelete = async (req, res) => {
    try {
        const relationId = req.params.id;
        if (!relationId) {
            return res.status(400).json({ error: "No Relation ID received" });
        }

        const [result] = await mySqlpool.query("DELETE FROM assignedrelations WHERE id = ?", [relationId]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "No Record Found with the given ID" });
        }

        res.status(200).json({ message: "Relation deleted successfully" });
        console.log("Relation deleted successfully for ID:", relationId);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error in Delete Relation API" });
    }
}

module.exports = { RelationDelete };