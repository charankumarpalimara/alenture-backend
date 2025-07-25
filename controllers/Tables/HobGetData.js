const mySqlpool = require('../../db');
// const db = require('./db');
const express = require('express');


const getAllHobs = async (req, res) => {
    try {
        const [data] = await mySqlpool.query("SELECT hobid, firstname, lastname, email, phonecode, mobile, extraind1 FROM listofhob order by id desc");
        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No Records Found" });
        }

        // Add image URL to each record
        const updatedData = data.map((record) => ({
            ...record,
            imageUrl: record.extraind1 ? `${req.protocol}://${req.get('host')}/uploads/hob/${record.extraind1}` : null,
        }));

        res.status(200).json({ message: "All User Records", data: updatedData });
        // console.log("All students get successfully");
        // console.log(updatedData);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error in Get All Students API" });
    }
};


module.exports = { getAllHobs };