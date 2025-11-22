/*


3) Postman में API कैसे टेस्ट करो — Step-by-step (हिंदी में, उम्मीद है तुम्हें समझ आ जायेगा)

Base URL मान लेते हैं: http://localhost:5000/api/restaurants
(अगर तुमने .env में PORT अलग रखा है तो 5000 की जगह अपना PORT use करो)

A) नया restaurant (Create) — POST

Postman खोलो → New Request

Method चुनो: POST

URL डालो:

http://localhost:5000/api/restaurants


Headers टैब में जोड़ो:

Key: Content-Type

Value: application/json

Body टैब → raw → JSON select करो और यह JSON डालो:

{
  "name": "Blue Ocean",
  "address": "Goa, Baga",
  "cuisine": "Seafood",
  "rating": 4.6
}


Send दबाओ।

Expected Status: 201 Created

Response: नया object JSON के रूप में आएगा, उसमें _id होगा और बाकी fields। Example:

{
  "success": true,
  "data": {
    "_id": "654a1f8b9c0f3a7b12345678",
    "name": "Blue Ocean",
    "address": "Goa, Baga",
    "cuisine": "Seafood",
    "rating": 4.6,
    "createdAt": "2025-11-22T06:30:00.000Z",
    "__v": 0
  }
}

B) सब restaurants देखो (Read All) — GET

New Request → Method GET

URL:

http://localhost:5000/api/restaurants


Send दबाओ।

Expected Status: 200 OK

Response एक array में सभी restaurants देगा:

{
  "success": true,
  "count": 6,
  "data": [
    { "_id": "...", "name": "Blue Ocean", ... },
    { "_id": "...", "name": "Hotel Taj", ... },
    ...
  ]
}

C) एक restaurant देखो (Read One) — GET by id

पहले GET All में जो response आया, उसमें से किसी एक item का _id copy करो।

New Request → Method GET

URL:

http://localhost:5000/api/restaurants/<यहाँ-पेस्ट-करो-_id>


Example:

http://localhost:5000/api/restaurants/654a1f8b9c0f3a7b12345678


Send दबाओ।

Expected Status: 200 OK

या अगर गलत id हो तो 404 और message "Restaurant नहीं मिला" आएगा।

D) Update करना (PUT) — Update by id

New Request → Method PUT

URL:

http://localhost:5000/api/restaurants/<id>


Headers: Content-Type: application/json

Body (raw JSON) — जो fields change करने हो वही भेजो, example:

{
  "rating": 4.9,
  "address": "Goa, Calangute"
}


Send दबाओ।

Expected Status: 200 OK

Response में updated object आएगा:

{
  "success": true,
  "data": {
    "_id": "654a1f8b9c0f3a7b12345678",
    "name": "Blue Ocean",
    "address": "Goa, Calangute",
    "cuisine": "Seafood",
    "rating": 4.9,
    "createdAt": "...",
    "__v": 0
  }
}

E) Delete करना (DELETE) — Delete by id

New Request → Method DELETE

URL:

http://localhost:5000/api/restaurants/<id>


Send दबाओ।

Expected Status: 200 OK

Response:

{
  "success": true,
  "message": "सफलतापूर्वक हटाया गया"
}


अगर id गलत हो तो 404 और "Restaurant नहीं मिला".



     "start": "node index.js",
     "dev": "nodemon index.js"



*/