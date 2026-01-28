const db = require('../database/db');
const bcrypt = require('bcrypt');

const login_admin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. check username
    const sql = "SELECT * FROM admin WHERE username = ?";
    const [result] = await db.promise().query(sql, [username]);
    const user = result[0];

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password"
      });
    }

    // 2. check password
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password"
      });
    }

    // ❌ NO TOKEN
    res.json({
      success: true,
      message: "Login successfully",
      admin: {
        id: user.id,
        username: user.username
      }
    });

  } catch (e) {
    res.status(500).json({
      message: "Login error",
      error: e.message
    });
  }
};

const create = async (req, res) => {
  try {
    const { username, password } = req.body;

    // check duplicate
    const [exists] = await db.promise().query(
      "SELECT id FROM admin WHERE username = ?",
      [username]
    );

    if (exists.length > 0) {
      return res.status(400).json({
        message: "Username already exists"
      });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    await db.promise().query(
      "INSERT INTO admin (username, password) VALUES (?, ?)",
      [username, hashpassword]
    );

    res.json({
      message: "Admin created successfully",
      username
    });

  } catch (e) {
    res.status(500).json({
      message: "Create admin error",
      error: e.message
    });
  }
};

module.exports = {
  login_admin,
  create
};
