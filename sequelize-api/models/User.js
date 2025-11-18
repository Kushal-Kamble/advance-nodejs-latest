// User table का schema define करना
// हिन्दी कमेंट्स शामिल

const { DataTypes } = require("sequelize"); // sequelize package ko include kiya hai  connection bnan el
const sequelize = require("../config/db");

// User मॉडल बनाना
const User = sequelize.define("users", {

    username: {
        type: DataTypes.STRING,      // VARCHAR की तरह
        allowNull: false,            // खाली नहीं छोड़ सकते
        unique: true                 // हर username unique होगा
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false
    }

}, {
    timestamps: false                // createdAt और updatedAt नहीं चाहिए
});

module.exports = User;
