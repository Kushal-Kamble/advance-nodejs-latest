/*

🧒 Lodash क्या करता है? (Super Simple)

मान लो तुम्हारे पास:

बड़ी list है (जैसे खिलौनों की सूची)

कुछ difficult काम हैं (जैसे sort करना, duplicate हटाना, group बनाना, numbers handle करना)

तुम ये सब खुद कर सकते हो, लेकिन time ज्यादा लगता है।
Lodash कहता है:

➡️ "Chinta mat karo! Main sab mushkil काम easy कर दूँगा!"

यह एक helper toolkit है जो JavaScript को easy, fast, और clean बनाता है।

⭐ Lodash kya-kya easy banाता है?
✔️ 1. Arrays संभालना

(duplicates हटाना, sorting, group बनाना, slice, chunking)

✔️ 2. Objects संभालना

(deep copy, merge, values निकालना, safe access)

✔️ 3. Strings संभालना

(trim, camelCase, kebabCase, words निकालना)

✔️ 4. Functions simplify करना

(debounce, throttle)

✔️ 5. Math काम

(sum, mean, random number)

*/


// ✔️ Example 1: Array से duplicates हटाना
const _ = require("lodash");

let toys = ["car", "ball", "ball", "doll", "car"];

let uniqueToys = _.uniq(toys);

console.log(uniqueToys);
// 👉 ["car", "ball", "doll"]
// 🧒 Lodash bolta: "Main same-cheez-do-bar wali problem solve karta hoon!"


//******************************************* */

// ✔️ Example 2: Array को छोटे-छोटे groups (chunks) में तोड़ना


let numbers = [1, 2, 3, 4, 5, 6];

let chunks = _.chunk(numbers, 2);

console.log(chunks);
// 👉 [[1,2], [3,4], [5,6]]
// 🧒 Jaise bade box ke chote-chote dabbe kar dena.



//****************************************************
//  ✔️ Example 3: Object से safely value लेना

let student = {
  name: "Amit",
  details: { age: 12 }
};

let age = _.get(student, "details.age", "Not Available");

console.log(age);
// 👉 12
// 🧒 Yahan lodash bolta: "Error mat do, mujhe check kar lene do!"


//************************************* */


// ✔️ Example 4: String को camelCase में बदलना

console.log(_.camelCase("Hello World"));
// 👉 "helloWorld"

// ✔️ Example 5: Numbers का sum


console.log(_.sum([10, 20, 30]));
// 👉 60






