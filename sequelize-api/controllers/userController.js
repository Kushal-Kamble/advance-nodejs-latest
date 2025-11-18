// सारे CRUD ऑपरेशन यहाँ होंगे (हिन्दी कमेंट्स के साथ)

const User = require("../models/User");

// ---------------- CREATE ----------------
exports.createUser = async (req, res) => {
    try {
        // body से डाटा लेना
        const { username, password } = req.body; // json ka data ho ya form ka req.body mehi aayega

        const user = await User.create({ username, password });

        res.json({
            message: "User Created Successfully",
            data: user
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ---------------- READ ALL USERS ----------------
exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll();   // सभी users fetch करो
        res.json(users);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ---------------- READ SINGLE USER (BY ID) ----------------
exports.getUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id); // Primary Key से खोजो

        if (!user) return res.json({ message: "User Not Found" });

        res.json(user);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ---------------- UPDATE USER ----------------
exports.updateUser = async (req, res) => {
    try {
        const id = req.params.id;

        await User.update(req.body, { where: { id } });

        res.json({ message: "User Updated Successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ---------------- DELETE USER ----------------
exports.deleteUser = async (req, res) => {
    try {
        const id = req.params.id;

        await User.destroy({ where: { id } });

        res.json({ message: "User Deleted Successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
