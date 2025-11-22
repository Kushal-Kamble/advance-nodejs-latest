// routes/restaurantRoutes.js
// ------------------------------------------------------
// यह फाइल API के endpoints बनाती है
// ------------------------------------------------------

const express = require("express");
const router = express.Router();

const {
    getAllRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
} = require("../controllers/restaurantController");

// सारे routes यहाँ define हैं

router.get("/", getAllRestaurants);       // सभी restaurants
router.get("/:id", getRestaurantById);    // एक restaurant
router.post("/", createRestaurant);       // नया जोड़ो
router.put("/:id", updateRestaurant);     // अपडेट करो
router.delete("/:id", deleteRestaurant);  // हटाओ

module.exports = router;
