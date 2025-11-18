// हिन्दी कमेंट्स के साथ पूरा MySQL + Sequelize कनेक्शन
const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();


// .env से values लेना
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 3306;


const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
host: DB_HOST,
port: DB_PORT,
dialect: "mysql",
logging: console.log // optional: Sequelize queries console पर दिखेगा
});


// कनेक्शन चेक करना
sequelize.authenticate()
.then(() => {
console.log("MySQL Connected Successfully...✌✌🔥🔥🔥");
})
.catch(err => {
console.log("Error in MySQL Connection: ", err);
});


module.exports = sequelize;