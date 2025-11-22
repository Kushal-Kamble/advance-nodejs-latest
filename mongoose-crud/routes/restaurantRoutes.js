// routes/restaurantRoutes.js
// ----------------------------------------------
// दूसरा तरीका - controller object के साथ
// ----------------------------------------------

const express = require("express");
const router = express.Router();

// पूरा controller एक बैग की तरह import किया
const controller = require("../controllers/restaurantController");

// Create
router.post("/", controller.createRestaurant);

// Read All
router.get("/", controller.getAllRestaurants);

// Read One
router.get("/:id", controller.getRestaurantById);

// Update
router.put("/:id", controller.updateRestaurant);

// Delete
router.delete("/:id", controller.deleteRestaurant);

module.exports = router;



/*


⭐ 4) 5 साल वाले बच्चे के लिए Final Example

"controller एक बड़ा बैग है।
bag के अंदर बहुत सारे टूल्स हैं:
✂ createRestaurant
🧹 deleteRestaurant
✏ updateRestaurant
🔍 getAllRestaurants
🔎 getRestaurantById

जब भी route बनाना है,
बस bag से tool निकाल कर इस्तेमाल कर लो!"


*/
