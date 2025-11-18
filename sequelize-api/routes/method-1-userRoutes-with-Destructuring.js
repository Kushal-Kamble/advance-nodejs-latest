/* 

🟦 सबसे पहले समझो: Destructuring क्या होता है?

🟦 सबसे पहले समझो: Destructuring क्या होता है?
➤ Destructuring = किसी object से उसकी properties को अलग-अलग variables में निकाल लेना।
👉 Example 1 (Simple Object)
const user = {
    name: "Kushal",
    age: 21,
};

बिना Destructuring:
const name = user.name;
const age = user.age;

Destructuring के साथ:
const { name, age } = user;


➡ सीधे दोनों values variables में मिल गईं।
➡ कोड छोटा और clean दिखता है।

🟦 Destructuring क्यों useful है controllers में?

तुम्हारा controller file ऐसा होगा:

module.exports = {
   createUser,
   getUsers,
   getUser,
   updateUser,
   deleteUser
}


इसका मतलब है controller एक object export कर रहा है, जैसे:

{
   createUser: function,
   getUsers: function,
   getUser: function,
   updateUser: function,
   deleteUser: function
}

इसलिए हम ऐसा कर सकते हैं:
const { createUser, getUsers, getUser, updateUser, deleteUser } 
    = require("../controllers/userController");


➡ यह object से functions को अलग-अलग variables में खींच लेता है।
➡ अब हम उन्हें directly use कर सकते हैं:

router.post("/create", createUser);


*/



const express = require("express");
const router = express.Router();
// इसमें हम controller से functions को सीधे destructure कर लेते हैं:
const {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser
} = require("../controllers/userController");

// इसमें हम controller से functions को सीधे destructure कर लेते हैं:
// फायदे:

// Clean और short code

// हर function सीधे नाम से use कर सकते हैं

// Create User
router.post("/create", createUser);

// Get All Users
router.get("/", getUsers);

// Get Single User
router.get("/:id", getUser);

// Update User
router.put("/:id", updateUser);

// Delete User
router.delete("/:id", deleteUser);

module.exports = router;
