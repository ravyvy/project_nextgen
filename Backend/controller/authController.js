const db = require("../database/db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "secret_key_123";

// ====================register=================
const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({
            status: false,
            message: "All fields required"
        })
    }
    const hashpassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (name , email , password) VALUES (? , ? , ?)";
    const params = [name, email, hashpassword];
    db.query(sql, params, (err, data) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(400).json({
                    status: false,
                    message: "Email already exists"
                });
            }
            return res.status(500).json({
                status: false,
                message: err.message
            });
        }
        res.json({ status: true, message: "Register success" });
    });
}

// ==============================Login==============================
const login = (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, data) => {
        if (err) return res.status(500).json({
            status: false,
            message: err.message
        });
        if (data.length === 0) {
            return res.status(401).json({
                status: false,
                message: "Invalid email or password"
            });
        }
        const user = data[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            if (rows.length === 0) {
                return res.status(401).json({
                    status: false,
                    message: "Invalid email or password"
                });
            }
        }
        const token = jwt.sign(
        { id:user.id,email:user.email } ,JWT_SECRET , {expiresIn: "1d"} );
        res.json({
            status : true,
            message:"Login success!",
            token,
            uesr: {
                id: user.id,
                name: user.name,
                email: user.email 
            }
        })
    })
}
// ==============================logout==============================

const logout = (req , res ) => {
    return res.status(200).json({
        status:true,
        message:"Logout seccess",
    })
}

module.exports = {
    register,
    login,
    logout
}