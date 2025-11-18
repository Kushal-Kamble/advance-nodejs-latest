// Contact table का schema define करना
// हिन्दी कमेंट्स शामिल


const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");


// Contact मॉडल बनाना (टेबल का नाम 'contact' रहेगा)
const Contact = sequelize.define("contact", {
first_name: {
type: DataTypes.STRING,
allowNull: false
},
last_name: {
type: DataTypes.STRING,
allowNull: true
},
email: {
type: DataTypes.STRING,
allowNull: false,
unique: true,
validate: {
isEmail: true
}
},
phone: {
type: DataTypes.STRING,
allowNull: true
},
address: {
type: DataTypes.TEXT,
allowNull: true
}
}, {
timestamps: false,
freezeTableName: true // ताकि sequelize table name को pluralize न करे
});


module.exports = Contact;