const db = require('../database/db');

const totalold = (req, res) => {
    const sql = "SELECT * FROM order_store";
    db.query(sql, (err, data) => {
        if (err) {
            res.json({
                status: false,
                message: "Select data order_store field"
            })
        }
        res.status(200).json({
            message: 'select success',
            data: data
        })
    })
}
// ====================== invoice===============
const total = (req, res) => {
    // ១. កូពីទិន្នន័យទាំងអស់ពី dborder ទៅ order_store ក្នុងពេលតែមួយ
    const SQL_MOVE = `
        INSERT INTO order_store (userName, phone, products, total) 
        SELECT userName, phone, products, total FROM dborder
    `;

    db.query(SQL_MOVE, (err, result) => {
        if (err) return res.status(500).json({ error: "Move failed: " + err.message });

        // ២. បន្ទាប់ពី Move ជោគជ័យ ទើបលុបចេញពី dborder
        const SQL_DELETE = "DELETE FROM dborder";

        db.query(SQL_DELETE, (err, deleteData) => {
            if (err) return res.status(500).json({ error: "Delete failed: " + err.message });

            res.json({
                status: true,
                message: `ជោគជ័យ! បានផ្លាស់ទីទិន្នន័យចំនួន ${result.affectedRows} ជួរ`
            });
        });
    });
};

// store in order
const storeOrder = (req, res) => {
    const sqlQuery = "SELECT COUNT(id) AS totalOrders, SUM(total) AS totalAmount FROM order_store";
    db.query(sqlQuery, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        // លទ្ធផលដែលបានមកពី Database
        const stats = results[0];

        res.json({
            success: true,
            data: {
                message: "Get success",
                total_records: stats.totalOrders,
                grand_total: parseFloat(stats.totalAmount || 0)
            }
        });
    });
}

const totaluser = (req, res) => {
    const sqlQuery = "SELECT COUNT(id) AS usertotal FROM users";
    db.query(sqlQuery, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        // លទ្ធផលដែលបានមកពី Database
        const stats = results[0];
        res.json({
            success: true,
            data: {
                user_records: stats.usertotal,
            }
        });
    });
}
const totalcategory = (req, res) => {
    const sqlQuery = `
      SELECT 
            (SELECT IFNULL(SUM(CASE WHEN name IN ('asus', 'msi', 'rog', 'dell', 'apple') THEN 1 ELSE 0 END), 0) FROM category) AS laptop,
            (SELECT IFNULL(SUM(CASE WHEN name IN ('mouse', 'keyboard', 'headset', 'mousepad', 'game') THEN 1 ELSE 0 END), 0) FROM products) AS accessories,
            (SELECT IFNULL(SUM(CASE WHEN name IN ('razer') THEN 1 ELSE 0 END), 0) FROM products) AS Ac_office_gaming,
            (SELECT IFNULL(SUM(CASE WHEN name IN ('table','chair') THEN 1 ELSE 0 END), 0) FROM category) AS Ac_office ,
            (SELECT IFNULL(SUM(CASE WHEN name IN ('ram', 'cpu','gpu') THEN 1 ELSE 0 END), 0) FROM products) AS custom_pc_build
    `;

    db.query(sqlQuery, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        // ដោយសារលទ្ធផលចេញតែ ១ row យើងប្រើ results[0] បាន
        res.json({
            success: true,
            data: results[0]
        });
    });
}
const getMonthlySales = (req, res) => {
    // Query នេះនឹងបូកសរុប total តាមខែនីមួយៗក្នុងឆ្នាំបច្ចុប្បន្ន
    const sqlQuery = `
        SELECT 
        DATE_FORMAT(createdAt, '%b') AS month, 
        SUM(total) AS revenue 
        FROM  order_store
        WHERE YEAR(createdAt) = YEAR(CURDATE())
        GROUP BY MONTH(createdAt), month
        ORDER BY MONTH(createdAt)
    `;

    //      SELECT 
    // DATE_FORMAT(createdAt, '%d %b') AS day, 
    // SUM(total) AS revenue 
    // FROM dborder
    // WHERE MONTH(createdAt) = MONTH(CURDATE()) 
    //  AND YEAR(createdAt) = YEAR(CURDATE())
    // GROUP BY DATE(createdAt)
    // ORDER BY DATE(createdAt) ASC;

    db.query(sqlQuery, (err, results) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, data: results });
    });
};
const get_total = (req, res) => {
    const sqlQuery = "SELECT COUNT(id) AS totalOrders, SUM(total) AS totalAmount FROM dborder";
    db.query(sqlQuery, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        // លទ្ធផលដែលបានមកពី Database
        const stats = results[0];

        res.json({
            success: true,
            data: {
                message: "Get success dborder",
                total_records: stats.totalOrders,
                grand_total: parseFloat(stats.totalAmount || 0)
            }
        });
    });
}
module.exports = {
    total,
    totaluser,
    totalcategory,
    getMonthlySales,
    storeOrder,
    get_total,
    totalold
}