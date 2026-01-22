const db = require('../database/db')
const getall_data = (req, res) => {
    const { id } = req.params;
    // Step 1: get the category
    const categorySql = "SELECT * FROM category WHERE id = ?";
    db.query(categorySql, [id], (err, categoryRows) => {
        if (err)
            return res.status(500).json({
                status: false,
                message: "Database error"
            });
        if (categoryRows.length === 0)
            return res.status(404).json({
                status: false,
                message: "Category not found"
            });

        const category = categoryRows[0];

        // Step 2: get products for this category
        const productSql = "SELECT id, title, price FROM products WHERE category_id = ?";
        db.query(productSql, [id], (err, productRows) => {
            if (err)
                return res.status(500).json({
                    status: false,
                    message: "Database error"
                });
            category.products = productRows; // attach products array
            res.json(category);
        });
    });
};

const getall = (req, res) => {
    // Step 1: Get all categories
    const categorySql = "SELECT * FROM category";
    db.query(categorySql, (err, categoryRows) => {
        if (err)
            return res.status(500).json({
                status: false,
                message: "Database error"
            });

        if (categoryRows.length === 0)
            return res.status(404).json({
                status: false,
                message: "No categories found"
            });

        // Step 2: For each category, get its products
        const categoryIds = categoryRows.map(cat => cat.id);
        const productSql = `SELECT id, title, price, category_id FROM products WHERE category_id IN (?)`;

        db.query(productSql, [categoryIds], (err, productRows) => {
            if (err)
                return res.status(500).json({
                    status: false,
                    message: "Database error"
                });

            // Step 3: Merge products into their category
            const result = categoryRows.map(cat => {
                return {
                    ...cat,
                    products: productRows.filter(p => p.category_id === cat.id)
                };
            });

            res.json({ status: true, data: result });
        });
    });
};

module.exports = {
    getall_data,
    getall
}