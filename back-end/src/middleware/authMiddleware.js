const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
        return res.status(401).json({ message: "Access Denied: No token provided" });
    }

    const token = authHeader.split(" ")[1]; // "Bearer token" olduğu için ikinci kısmı alıyoruz.

    if (!token) {
        return res.status(401).json({ message: "Access Denied: Invalid token format" });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET); // 📌 JWT doğrulama
        req.user = verified;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid Token" });
    }
};
