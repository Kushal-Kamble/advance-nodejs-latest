/*

🧒 JWT kya hota hai? (5-year-old style)

Soch lo tumhare paas ek magic school ID card hai.

Jab tum school jaate ho, guard ko ID card dikhate ho → guard bolta hai "haan, ye to tum ho!"

Agar ID card na ho → guard bolta hai "andar nahi ja sakte".

JWT token = Magic ID Card

Jab tum login karte ho → tumhe ek token milta hai.

Phir jab bhi tum koi protected page open karte ho → tum wo token dikhate ho.

Server check karta hai → "Token sahi hai ya fake?"

Bas ye hi JWT Authentication hai.



************************************************************



🔹 1. Register API (User create)

POST →

http://localhost:5000/api/user/register


Body → JSON

{
  "name": "Karan",
  "email": "karan@gmail.com",
  "password": "123456"
}

🔹 2. Login (Token generate)

POST →

http://localhost:5000/api/user/login


Body →

{
  "email": "karan@gmail.com",
  "password": "123456"
}


📌 Response me token milega:

"token": "eyJhbGciOiJIUzI1..."

🔹 3. Protected Route (Token verify)

GET →

http://localhost:5000/api/user/profile


Headers →

KEY	VALUE
Authorization	your_token_here




***************************************

Saare user-related APIs yahan start honge:
/api/user/register
/api/user/login
/api/user/profile



**************************************



🚀 1) Register API kya karta hai?
👉 Endpoint:
POST /api/auth/register

Tum kya bhejte ho:
name, email, password

Backend kya karta hai?

Password ko bcrypt se hash karta hai

User ko database me save karta hai

Token create nahi karta (Register usually token nahi deta)

🚀 2) Login API kya karta hai?
👉 Endpoint:
POST /api/auth/login

Tum Postman me bhejte ho:
email, password

Backend steps:

User ko DB me find karta hai

Password ko bcrypt se match karta hai

Agar password sahi — JWT Token banata hai

Token example:
eyJhbGciOiJIUzI1NiIsInR…

Token ke andar kya hota hai?

Token ke andar secret info nahi hoti, sirf basic data hota hai:

{
  "id": "69256b7ce09033ee1cc7f798",
  "email": "Kushal@gmail.com",
  "iat": 1764060053,
  "exp": 1764063653
}


✔ id = user ka ID
✔ email = user ka email
✔ iat = token kab banaya gaya (Issued At Time)
✔ exp = token kab expire hoga (Expiration Time)

🚀 3) Bearer Token kya hota hai?

Token tum Postman me aise bhejte ho:

👉 Header
Authorization: Bearer <token>


“Bearer” ka matlab:

“Ye user mera token lekar aa raha hai, isko andar jane do.”

🚀 4) Protected Route me kya hota hai?

Assume protected route hai:

GET /api/user/profile


Yaha token must hota hai.

Backend kya karta hai?

Step 1 — Authorization header check
Authorization: Bearer eyJhbGciOi...

Step 2 — "Bearer" ko remove karke token nikala
const token = authHeader.split(" ")[1];

Step 3 — Token verify kiya
const decoded = jwt.verify(token, process.env.JWT_SECRET);


Agar token sahi → decoded me ye data hota hai:

{
  "id": "69256b7ce09033ee1cc7f798",
  "email": "Kushal@gmail.com",
  "iat": 1764060053,
  "exp": 1764063653
}


Backend ye data aage pass kar deta hai:

req.user = decoded;

FINAL Step — Profile response
"msg": "Protected profile data!",
"user": req.user

❤️ 5) Tumhara Output About 100% Correct hai

Yani:

Token valid hai

Middleware sahi chal raha

User ka id/email token se extract ho gaya

Protected route ne sahi response diya

⭐ Simple Example – Token ko Aadhar Card Samjho
🔹 Login = Aadhar card banana

Token issue hota hai (Aadhar number mil gaya)

🔹 Protected route = Airport entry

Bina token = entry banned
Token valid = andar ja

🔹 Middleware = Security guard

Guard token check karega

fake ho to rokh lega

valid ho to aage jaane dega

👉 Aur easy kar du?

Agar chaho to main diagram + flowchart banake samjha sakta hoon.
Ya phir tumhara pura JWT project ekdum clean structure me bana dunga.



******************************************


💯 SUMMARY IN ONE LINE

Register = Data save
Login = Token generate
Middleware = Token check
Protected route = Only token users allowed


*/