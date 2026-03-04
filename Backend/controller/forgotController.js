const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require("../database/db");
const JWT_SECRET = "secret_key_123";

const forgot_password = (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  // 1️⃣ Check email exists
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (result.length === 0) {
      return res.status(404).json({ message: "Email not found" });
    }

    // 2️⃣ Generate random 6-digit code
    const resetCode = crypto.randomInt(100000, 999999).toString();
    const expireTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // 3️⃣ Save code to DB
    db.query(
      "UPDATE users SET reset_code=?, reset_code_expire=? WHERE email=?",
      [resetCode, expireTime, email],
      async (err) => {
        if (err) return res.status(500).json({ message: "Update failed" });

        // 4️⃣ Send email
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "ravyfaii31@gmail.com",
            pass: "sham jlob znug rjra",
          },
        });

        try {
          await transporter.sendMail({
            from: `"Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Reset Password Code",
            html: `
              <h3>Forgot Password</h3>
              <p>Your reset code is:</p>
              <h2>${resetCode}</h2>
              <p>This code expires in 5 minutes.</p>
            `,
          });

          res.json({ message: "Reset code sent to email" });
        } catch (mailErr) {
          res.status(500).json({ message: "Send email failed" });
        }
      }
    );
  });
};
const verify_reset_code = (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: "Email and code are required" });
  }

  db.query(
    `SELECT * FROM users 
     WHERE email=? AND reset_code=? AND reset_code_expire > NOW()`,
    [email, code],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (result.length === 0) {
        return res.status(400).json({ message: "Invalid or expired code" });
      }

      res.json({ message: "Code verified" });
    }
  );
};
const reset_password = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    // 1️⃣ Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 2️⃣ Update password in DB & remove reset_code
    db.query(
      `UPDATE users 
       SET password=?, reset_code=NULL, reset_code_expire=NULL 
       WHERE email=?`,
      [hashedPassword, email],
      async (err, result) => {
        if (err) return res.status(500).json({ message: "Update failed" });

        // 3️⃣ Get updated user info (id, email, etc)
        db.query("SELECT id, email, name FROM users WHERE email=?", [email], (err2, userRes) => {
          if (err2 || userRes.length === 0) {
            return res.status(500).json({ message: "User not found after reset" });
          }

          const user = userRes[0];

          // 4️⃣ Create JWT token
          const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            JWT_SECRET,
            { expiresIn: "30d" }
          );

          // 5️⃣ Return success + token
          res.json({
            message: "Password reset successful",
            token,
            user: { id: user.id, email: user.email, username: user.username }
          });
        });
      }
    );
  } catch (e) {
    res.status(500).json({ message: "Reset password error", error: e.message });
  }
};
module.exports = {
  forgot_password,
  verify_reset_code,
  reset_password
};
