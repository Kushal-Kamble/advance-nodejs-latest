const User = require('../models/User');

// नया user बनाएँ
exports.createUser = async (req, res) => {
    try {
        const { name, email, age } = req.body;
        const user = new User({ name, email, age });
        await user.save();
        return res.status(201).json({ success: true, data: user });
    } catch (err) {
        console.error("createUser error:", err.message);
        if (err.code === 11000) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

// सारे users दिखाओ
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        return res.json({ success: true, data: users });
    } catch (err) {
        console.error("getUsers error:", err.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

// एक user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        return res.json({ success: true, data: user });
    } catch (err) {
        console.error("getUserById error:", err.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

// update user
exports.updateUser = async (req, res) => {
    try {
        const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updated) return res.status(404).json({ success: false, message: "User not found" });

        return res.json({ success: true, data: updated });
    } catch (err) {
        console.error("updateUser error:", err.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

// delete user
exports.deleteUser = async (req, res) => {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ success: false, message: "User not found" });

        return res.json({ success: true, message: "User deleted" });
    } catch (err) {
        console.error("deleteUser error:", err.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};
