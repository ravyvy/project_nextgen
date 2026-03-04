const db = require('../database/db');
const fs = require('fs');
const path = require('path');
// 1. GET ALL CATEGORIES
const getall = (req, res) => {
    const sql = "SELECT * FROM category ORDER BY id DESC";

    db.query(sql, (err, data) => {
        if (err) {
            return res.status(500).json({ status: false, message: err.message });
        }

        if (data.length > 0) {
            res.status(200).json({
                status: true,
                message: "Get data successfully!",
                data: data
            });
        } else {
            res.status(404).json({ status: false, message: "Data Not Found!" });
        }
    });
};
// 2. CREATE CATEGORY (With Image Upload)
const create = (req, res) => {
  const { name, title, dis, price, stock, description } = req.body;

  const img = req.files['img'] ? req.files['img'][0].filename : null;
  const imgone = req.files['imgone'] ? req.files['imgone'][0].filename : null;
  const imgtwo = req.files['imgtwo'] ? req.files['imgtwo'][0].filename : null;

  const sql = `
    INSERT INTO category
    (name, img, imgone, imgtwo, title, dis, price, stock, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [name, img, imgone, imgtwo, title, dis, price, stock, description];

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ status: false, message: err.message });
    }
    res.json({
      status: true,
      message: 'Category created successfully',
      id: result.insertId
    });
  });
};

// 3. REMOVE CATEGORY
const remove = (req, res) => {
  const { id } = req.params;

  // 1. get image names first
  const getSql = "SELECT img, imgone, imgtwo FROM category WHERE id = ?";
  db.query(getSql, [id], (err, rows) => {
    if (err) return res.status(500).json({ status: false, message: err.message });
    if (rows.length === 0) {
      return res.status(404).json({ status: false, message: "Category not found" });
    }

    const { img, imgone, imgtwo } = rows[0];

    // 2. delete images from folder
    [img, imgone, imgtwo].forEach(file => {
      if (file) {
        const filePath = path.join(__dirname, '../uploads/images', file);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    });

    // 3. delete DB record
    const deleteSql = "DELETE FROM category WHERE id = ?";
    db.query(deleteSql, [id], (err, result) => {
      if (err) return res.status(500).json({ status: false, message: err.message });

      res.json({ status: true, message: "Category + images deleted successfully" });
    });
  });
};
// 4. EDIT CATEGORY
const edit = (req, res) => {
  const { id } = req.params;

  // 1. get old data
  db.query("SELECT * FROM category WHERE id = ?", [id], (err, rows) => {
    if (err) return res.status(500).json({ status: false, message: err.message });
    if (rows.length === 0) {
      return res.status(404).json({ status: false, message: "Category not found" });
    }

    const old = rows[0];

    // 2. merge new + old
    const name = req.body.name ?? old.name;
    const title = req.body.title ?? old.title;
    const dis = req.body.dis ?? old.dis;
    const price = req.body.price ?? old.price;
    const stock = req.body.stock ?? old.stock;
    const description = req.body.description ?? old.description;

    const img = req.files?.img ? req.files.img[0].filename : old.img;
    const imgone = req.files?.imgone ? req.files.imgone[0].filename : old.imgone;
    const imgtwo = req.files?.imgtwo ? req.files.imgtwo[0].filename : old.imgtwo;

    // 3. update
    const sql = `
      UPDATE category
      SET name=?, img=?, imgone=?, imgtwo=?, title=?, dis=?, price=?, stock=?, description=?
      WHERE id=?
    `;

    const values = [
      name, img, imgone, imgtwo,
      title, dis, price, stock, description,
      id
    ];

    db.query(sql, values, (err) => {
      if (err) return res.status(500).json({ status: false, message: err.message });
      res.json({ status: true, message: "Category updated successfully" });
    });
  });
};

// search
const searchData = (req , res) => {
   const { q } = req.query; // get search keyword from URL: /search?q=laptop

  if (!q) {
    return res.status(400).json({ status: false, message: "Please provide a search query" });
  }

  const sql = `
    SELECT * FROM category
    WHERE name LIKE ? OR title LIKE ? OR description LIKE ?
  `;

  const searchTerm = `%${q}%`; // Add % for SQL LIKE
  db.query(sql, [searchTerm, searchTerm, searchTerm], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ status: false, message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ status: false, message: "No matching categories found" });
    }

    res.json({ status: true, message: "Search results", data: results });
  });
}
module.exports = {
  getall,
  create,
  remove,
  edit,
  searchData
 
};