const db = require('../database/db');

// ============ get information alert =============
const alerthome = (req , res ) => {
    const sql = "SELECT * FROM alerthome "
    db.query(sql , (err , data ) => {
        if(err){
            res.status(400).json({
                status:false,
                message:"select alert home errr"
            })
        }
        else{
            res.status(200).json({
                status:true,
                message:"select alert home success!",
                data:data
            })
        }
    })
}
module.exports = {
    alerthome
}