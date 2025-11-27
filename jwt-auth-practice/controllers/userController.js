// controllers/userController.js

const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ------------------ REGISTER USER ------------------
exports.registerUser = async (req, res) => {
    try {
            // User se data receive kiya

        const { name, email, password } = req.body;

        // Check if user exists
                // Check: email already exist to nahi?

        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists!" });
        }

        // Password hash karna
                // Password ko hash kar rahe hain (encrypt)

        const hashed = await bcrypt.hash(password, 10);

        // User save
                // New user create kar diya

        const user = await User.create({ name, email, password: hashed });

                // Success response


        res.json({ msg: "User Registered!", user });
    } catch (err) {
        res.status(500).json({ msg: "Error", err });
    }
};

// ------------------ LOGIN USER ------------------
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // User find
                // Check: user exist karta hai?

        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "User not found!" });

        // Password compare
        let match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ msg: "Wrong password!" });

        // TOKEN CREATE
                //   JWT TOKEN CREATE HO RHA

        const token = jwt.sign(
            { id: user._id, email: user.email }, // user ke data ko token me store kar rahe
            process.env.JWT_SECRET,             // secret key
            { expiresIn: "1h" }                 // token 1 hour chalega
        );

        res.json({ msg: "Login Success", token });
    } catch (err) {
        res.status(500).json({ msg: "Error", err });
    }
};

// ------------------ PROTECTED ROUTE CONTROLLER ------------------
exports.getProfile = async (req, res) => {
    // authMiddleware se req.user aayega
    res.json({
        msg: "Protected profile data!",
        user: req.user
    });
};
