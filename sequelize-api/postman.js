/*

2) Postman सेटअप (Recommended)

Postman खोलो।

ऊपर-दाएँ → Environments → Create Environment → नाम: local

Add Variable: base_url = http://localhost:5000

Save करें और Environment select कर लो (右上 corner)।

अब हर request में URL इस तरह यूज़ करोगे: {{base_url}}/api/users/...

3) API Tests — Step by step

A) Create user (POST)

Method: POST

URL: {{base_url}}/api/users/create

Headers:

Content-Type: application/json

Body (raw → JSON):

{
  "username": "kushal",
  "password": "secret123"
}


Send पर क्लिक करो।

Expected response (example):

{
  "message": "User Created Successfully",
  "data": {
    "id": 1,
    "username": "kushal",
    "password": "secret123"
  }
}


Status code: 200 (या 201 अगर code में बदलो)

Common errors:

500, SequelizeUniqueConstraintError → username unique है, वही username पहले से है।

500, DB connection error → server console में error देखो (MySQL चल रहा है या नहीं).



****************************************************

B) Get all users (READ ALL) — GET

Method: GET

URL: {{base_url}}/api/users/

Headers: कोई ज़रूरी नहीं (JSON response आता है)

Send

Expected response (example):

[
  { "id": 1, "username": "kushal", "password": "secret123" },
  { "id": 2, "username": "rahul", "password": "rahulpw" }
]


Status code: 200

**********************************************

C) Get single user (READ by id) — GET

Method: GET

URL: {{base_url}}/api/users/1 ← यहाँ :id में जो id चाहिए वह लिखो

Send

Expected: single JSON object या { message: "User Not Found" } अगर id नहीं मिली।

Status code: 200 for found, or 404/200 with not found message depending implementation.


*************************************************************

D) Update user — PUT

Method: PUT

URL: {{base_url}}/api/users/1 ← जिस user को update करना है उसकी id डालो

Headers: Content-Type: application/json

Body (raw JSON):

{
  "username": "kushal_updated",
  "password": "newpass456"
}


Send

Expected response (example):

{ "message": "User Updated Successfully" }


*******************************************************************************


Tip: अगर तुम्हारी controller update के बाद अपडेटेड row return नहीं कर रहा, तो GET करके verify करो।

Common issues:

SequelizeUniqueConstraintError — नया username किसी और user के पास already है।

Missing WHERE clause → server side error (check console).







**************************************************************************

E) Delete user — DELETE

Method: DELETE

URL: {{base_url}}/api/users/1

Send

Expected response:

{ "message": "User Deleted Successfully" }


फिर GET all करके confirm कर लो कि वो user list से हट गया है।





******************************************************************************************

4) Useful Postman features — beginners के लिए

Collections: सभी requests को एक collection में save कर लो (उदाहरण: Sequelize API) → फिर अगली बार सिर्फ collection खोलकर run कर सकते हो।

Environment Variable: {{base_url}} use करने से अगर पोर्ट बदलना हो तो बस environment edit करो।

Params view: GET में ?q=... जैसे query params check करने के लिए Params tab use करो।

Body types: हमेशा API के लिए raw → JSON use करो जब server JSON expect करता है। (Form-data केवल files या form submissions के लिए)

History: left panel → history से पिछली requests देख सकते हो।

5) Quick Postman Tests (optional)

Postman में request → Tests tab में ये code डाल दो, हर request के लिए:

pm.test("Status is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response is JSON", function () {
    pm.response.to.be.json;
});


Send करने पर Tests पास/Fail दिखेगा।

6) Troubleshooting (Common errors & fixes)

Server not running / Connection refused

Check terminal: npm start run किया हुआ है?

सही base_url और पोर्ट इस्तेमाल कर रहे हो?

DB connection error

MySQL server चालू है? (XAMPP/Workbench में देखो)

config/db.js में username/password सही हैं?

Console errors में exact SQL error पढ़ो।

Unique constraint errors

जब username unique हो और duplicate भेजो तो error आएगा — नया username डालकर try करो या DB में पहले वाला delete करो।

500 internal server error

Server console में error stack देखो — usually missing fields, wrong SQL, या syntax error होगा।

404 User Not Found

जिस id से search कर रहे हो वो DB में है या नहीं — GET all से verify करो।

7) Example full flow (quick checklist)

npm start → server चल रहा है।

POST /api/users/create → नया user बनाओ।

GET /api/users/ → verify list में आया या नहीं।

GET /api/users/:id → single user verify।

PUT /api/users/:id → update करो।

GET फिर से करके verify करो।

DELETE /api/users/:id → delete करो।

GET all → confirm deleted।


*/