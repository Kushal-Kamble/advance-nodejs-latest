const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    // Postman Bearer Token: "Bearer eyJhb..."
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).json({ msg: "Token missing!" });
    }

    // "Bearer TOKEN" me se token part nikal rahe hain
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ msg: "Invalid Token Format!" });
    }

    try {
        // Token verify
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // req.user me decoded data daal rahe hain
        req.user = decoded;

        next(); // aage controller ko jaane do

    } catch (err) {
        return res.status(401).json({ msg: "Invalid Token!" });
    }
};
