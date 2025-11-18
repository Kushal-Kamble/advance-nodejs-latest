// हिन्दी कमेंट्स के साथ पूरा MySQL + Sequelize कनेक्शन
// Sequelize jada complex query nhi use krni padti

const { Sequelize } = require("sequelize");

// नया Sequelize ऑब्जेक्ट बनाना (DB Name, Username, Password)

const sequelize = new Sequelize("contacts_db_nodejs", "root", "", {
    host: "localhost", 
    port: 3309,      // जहाँ MySQL चल रहा है
    dialect: "mysql"         // हम MySQL इस्तेमाल कर रहे हैं yha me postx ya koi aur databse ka naam add kr sakta hoo
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
