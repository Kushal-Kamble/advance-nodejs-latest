// middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

// JWT verify middleware
export const authenticateJWT = async (req, res, next) => {
  try {
    // Token can be sent in Authorization header: Bearer <token>
    const authHeader = req.headers.authorization || req.cookies?.token;
    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);

    if (!user) return res.status(401).json({ message: "Invalid token user" });

    req.user = user; // request पर user attach कर दिया
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid/expired", error: err.message });
  }
};
