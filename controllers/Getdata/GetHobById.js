const mySqlpool = require('../../db');

const { broadcast } = require('../../WebSocketUtils'); // Import broadcast from WebSocketUtils.js


const getHobById = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(402).json({ error: "we not recieved any id value" })
        }

        const [data] = await mySqlpool.query(`SELECT * FROM listofhob WHERE id=? order by id desc `, [userId]);
        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No user found" });
        }
        res.status(200).json({ messege: "user details is ", HobDetails: data[0] });
        console.log({ messege: "user details is ", HobDetails: data[0] });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Somthing Wrong in this API" })
    }
}


module.exports = { getHobById }
