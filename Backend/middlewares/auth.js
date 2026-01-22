const jwt = require('jsonwebtoken');
const JWT_SECRET = "secret_key_123";
const midd = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ status: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ status: false, message: "Invalid token" });
        }
        req.user = decoded;
        next();
    });
}
module.exports = midd;