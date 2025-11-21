
// callback function
// khana khane ke baad market chale jaana
// es kaam ke baad o kam krna matlab ek kaam ke khtam hon eke baad dusra lam start kr dena


function callbackFunction(callback) {
    // do some work
    callback(); // call the callback function
}


function callback(){
    console.log("callback function called kushal")
}

const add = function(a, b, callback){ //jab pura function call ho jayega to callback function call hoga
    const sum = a + b;
    console.log("result : " + sum);
    callback(sum);
}

add(2, 3, callback);


// ******************************************

/*

मान लो तुमने अपनी मम्मी को बोला: “Mummy, please खाना बना दो, और बनने पर मुझे बुला देना।”

खाना बनाना = एक काम (function)

बुलाना = callback

यानी काम ख़त्म होने के बाद जो करना है, वही callback होता है।

📌 Callback मतलब:

“Ek function ke kaam khatam hone ke baad doosra function chala dena.”

*/



// callback function in arrow
// this function takes another function as an argument and calls it after some work
const callbackFunctionInArrow = (callback) => {
    // do some work
    console.log("doing some work...");
    callback(); // call the callback function
}

// example usage
const sayHello = () => console.log("hello");
callbackFunctionInArrow(sayHello); // output: doing some work... hello



// **********************************************

function kaamKaro(callback) {
  console.log("🍪 Pehle main biscuit bana raha hoon..."); 
  // 🧒 Yeh pehla kaam hai

  callback(); 
  // 🧒 Biscuit ban gaya, ab mummy ko bula raha hoon (callback)
}

function doosraKaam() {
  console.log("🥛 Ab main doodh pi raha hoon!"); 
  // 🧒 Yeh doosra kaam hai jo pehle wale ke baad hoga
}

kaamKaro(doosraKaam);

// इसलिए हम बोलते हैं: "Kaam ho jaye toh mujhe bula dena" → यही callback है!



