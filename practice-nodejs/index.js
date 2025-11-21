// important topic of javascript function ,  callback, object


var a = 5;
var b = 6;

var ans = a + b;

console.log(ans)


/*************  ✨ Windsurf Command ⭐  *************/
// for(let i = 0; i < 10; i++){
//     console.log(i);
// }
/*******  339feea4-662a-41d9-bde2-d04e659b6ca0  *******/    

var count = 10;
for(var i = 0; i < count; i++){ // 10 tak count hoga
    console.log(i);
}


// 

/*************  ✨ Windsurf Command ⭐  *************/
// Example of Arrays
var colors = ["red", "green", "blue"];
console.log(colors[0]); // red
console.log(colors[1]); // green
console.log(colors[2]); // blue

/*******  bfc66131-ead6-44fd-bc2b-939273c5ff6b  *******/    

/*************  ✨ Windsurf Command ⭐  *************/
var person = {
    firstName: "Kushal",
    lastName: "Kamble",
    age: 25,
    hobbies: ["coding", "reading", "writing"],
    address: {
        street: "123 Main St",
        city: "Sawangi",
        state: "CA",
        zip: "12345"
    }
};

console.log(person.firstName); // John
console.log(person.lastName); // Doe
console.log(person.age); // 25
console.log(person.hobbies[0]); // coding
console.log(person.address.city); // Anytown
/*******  fab0fc72-a0ea-4846-9f2c-bb9ae6fd2e3b  *******/    


/*************  ✨ Windsurf Command 🌟  *************/

// filter function simple function

const adult = [32, 33, 16, 40];
const filterAdult = adult.filter(function(age) {
    return age < 18;
});
console.log(filterAdult);


// filter function arrrow function

const ages = [32, 33, 16, 40];
const filterAges = ages.filter((age) => age > 18);
console.log(filterAges);


// ************************************


// callback function
// khana khane ke baad market chale jaana
// es kaam ke baad o kam krna matlab ek kaam ke khtam hon eke baad dusra lam start kr dena




