const mySqlpool = require('../../db');

const CmDataGetByBranches = async (req, res) => {

    try{
     const {organizationid} = req.body;
     console.log(organizationid)
     if (!organizationid ) {
        console.log("Organization Id required")
        return res.status(400).json({ error: "Organization Id required" });
    }
        const [cmDetails] = await mySqlpool.query(
            "SELECT * FROM listofcm WHERE organizationid = ? ",
            [organizationid]
        );
        if (!cmDetails || cmDetails.length === 0) {
            console.log("Customer Manager not found")
            return res.status(402).json({ error: "Customer Manager not found" });
        }
        console.log({message :"Get Success full", data: cmDetails});
        res.status(200).json({ message: "Customer Manager details found", data: cmDetails });

    } catch(error){
        console.log('Internal Server Error');
        res.status(500).json({ error: "Internal Server Error" });

    }

}

module.exports = {CmDataGetByBranches};