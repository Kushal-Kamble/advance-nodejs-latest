// controllers/restaurantController.js
// -------------------------------------------------------
// यह फाइल सारी बिज़नेस लॉजिक संभालती है (CRUD operations)
// -------------------------------------------------------

const Restaurant = require("../models/Restaurant");

// GET - सभी restaurants लाओ
exports.getAllRestaurants = async (req, res) => {
    try {
        const data = await Restaurant.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: data.length, data });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// GET - एक restaurant लाओ ID से
exports.getRestaurantById = async (req, res) => {
    try {
        const rest = await Restaurant.findById(req.params.id);

        if (!rest) {
            return res.status(404).json({ success: false, message: "Restaurant नहीं मिला" });
        }

        res.status(200).json({ success: true, data: rest });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// POST - नया restaurant add करो
exports.createRestaurant = async (req, res) => {
    try {
        const { name, address, cuisine, rating } = req.body;

        // Basic Validation
        if (!name) {
            return res.status(400).json({ success: false, message: "रेस्टोरेंट का नाम जरूरी है" });
        }

        const newRest = await Restaurant.create({ name, address, cuisine, rating });

        res.status(201).json({ success: true, data: newRest });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// PUT - Update restaurant
exports.updateRestaurant = async (req, res) => {
    try {
        const updated = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updated) {
            return res.status(404).json({ success: false, message: "Restaurant नहीं मिला" });
        }

        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// DELETE - हटाओ restaurant
exports.deleteRestaurant = async (req, res) => {
    try {
        const deleted = await Restaurant.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ success: false, message: "Restaurant नहीं मिला" });
        }

        res.status(200).json({ success: true, message: "सफलतापूर्वक हटाया गया" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};
