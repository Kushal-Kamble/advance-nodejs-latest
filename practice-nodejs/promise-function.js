/*
💡 Real Life Example:

तुमने मम्मी को बोला:

"Mummy, mujhe chocolate chahiye."

मम्मी कहती हैं:
"Thik hai, main dukan se lekar aati hoon."

इस समय तुम्हारे पास chocolate नहीं है, पर mummy ka वादा (promise) है कि मिल जाएगी।

👉 यही programming में Promise है:
“Aane wale time me kuch milega ya nahi milega, iska वादा.”

Promise ke teen result hote hain:

Pending → mummy abhi dukan gayi hain

Fulfilled → mummy chocolate le aayi 😍

Rejected → shop band thi, chocolate nahi mili 😭


******************************

🧒 ASYNC / AWAIT क्या होता है?
Imagine:

तुम मम्मी से पूछते हो:
"Mummy chocolate laogi?"

और तुम आराम से wait करते हो —
jab tak mummy chocolate nahi le aati.

👉 यही await है = "ruk jao, kaam hone do"

और async बोलता है:
"Is function ke andar hum wait kar sakte hain."


🔍 Code Explanation (super simple)
✔️ resolve("🍫 Chocolate mil gayi!")

ये बताता है कि सब ठीक रहा

काम successful है

Promise “fulfilled” हो गया

.then() चलेगा

❌ reject("😭 Shop band thi.")

ये बताता है कि कुछ गड़बड़ हो गई

काम fail हुआ

Promise “rejected” हो गया

.catch() चलेगा



******************************************************


⭐ Short Summary (5 साल वाला आसान)
Concept	Real Life Example	Matlab
Callback------------------------	“Kaam ho jaye toh mujhe bula dena”	Ek function ke baad doosra chalo
Promise------------------------	“Mummy ne chocolate laane ka promise kiya”	Future me result milega ya error
async/await------------------------	“Main araam se wait kar raha hoon jab tak mummy chocolate nahi laati”	Promise ka result simple tarike se wait karke lena


*/


let chocolatePromise = new Promise((resolve, reject) => {
  
  let shopOpen = true; // 🧒 shop khuli hai ya band?

  if (shopOpen) {
    resolve("🍫 Chocolate mil gayi!"); 
    // 😊 Success! promise fullfill ho gaya
  } else {
    reject("😭 Shop band thi. Chocolate nahi mili."); 
    // 😭 Fail! promise reject ho gaya
  }

});


chocolatePromise
  .then((message) => {
    console.log(message); // 😍 fulfilled wali khushi
  })
  .catch((error) => {
    console.log(error); // 😭 rejected wali dukhi baat
  });



// *********************************************


// 🍫 Yeh promise chocolate dene ka vaada kar raha hai
function chocolatePromisenew() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("🍫 Chocolate mil gayi!");
    }, 2000); // ⏳ 2 second lag rahe hain
  });
}

// 🧒 yeh async function mummy ke aane ka wait karega
async function getChocolate() {
  console.log("Mummy chocolate lene gayi... ⏳"); 

  let result = await chocolatePromisenew(); 
  // 🧒 yaha hum mummy ka wait kar rahe hain
  
  console.log(result); // 😍 chocolate mil gayi!
}

getChocolate();

