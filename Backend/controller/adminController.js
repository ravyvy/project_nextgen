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

const changepassword_admin = async (req, res) => {
  try {
    const { id, oldPassword, newPassword, confirmPassword } = req.body;

    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Admin ID missing",
      });
    }

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        status: false,
        message: "New password and confirm password do not match",
      });
    }

    const sql = "SELECT password FROM admin WHERE id = ?";
    db.query(sql, [id], async (err, data) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      if (data.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(oldPassword, data[0].password);
      if (!isMatch) {
        return res.status(400).json({ message: "Old password is incorrect" });
      }

      const hashed = await bcrypt.hash(newPassword, 10);

      db.query(
        "UPDATE admin SET password = ? WHERE id = ?",
        [hashed, id],
        (err) => {
          if (err) {
            return res.status(500).json({ message: "Update failed" });
          }

          res.json({ message: "Password updated successfully" });
        }
      );
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  login_admin,
  create,
  changepassword_admin
};
