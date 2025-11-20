/*************  ✨ Windsurf Command ⭐  *************/
const prompt = require('prompt-sync')();   // <-- यहाँ () लगाना ज़रूरी है

let name = prompt('What is your name? ');
console.log(`Hello, ${name}!`);

let age = Number(prompt('How old are you? '));
console.log(`You are ${age} years old.`);
