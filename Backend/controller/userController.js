const db = require('../database/db');
const get_all_user = (req ,res) => {
    const SQL = "SELECT * FROM users ORDER BY id DESC";
    db.query(SQL , (err , data) => {
        if (err) {
            return res.status(500).json({ status: false, message: 'Get error' });
        }
        res.status(201).json({
            status: true,
            message: 'products created successfully',
            data:data
            
        });
    })
}
const remove = (req , res) => {
    const {id } = req.params
    const SQL = "DELETE from  users WHERE id = ?";
    const params = [id];
    db.query(SQL , params , (err , data) => {
         if (err) {
            return res.status(500).json({ status: false, message: 'delete error' });
        }
        res.status(201).json({
            status: true,
            message: 'delete created successfully',
        });
    })
}
module.exports = {
    get_all_user,
    remove
}