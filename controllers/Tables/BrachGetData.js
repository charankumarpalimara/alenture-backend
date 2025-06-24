const mySqlpool = require('../../db');

const getBranchbyOrganizationname = async (req, res) => {
    try {
        const orgName = req.params.organizationname;
        if (!orgName) {
            return res.status(400).json({ error: "No organization name received" });
        }

        const [rows] = await mySqlpool.query(
            "SELECT branch FROM listoforganizations WHERE organizationname = ? order by id desc ",
            [orgName]
        );
        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: "No organization found" });
        }
        const branchDetails = rows;
        res.status(200).json({ message: "Branch details found", branchDetails });
        console.log({ message: "Branch details found", branchDetails });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong in this API" });
    }
};



module.exports = { getBranchbyOrganizationname };
