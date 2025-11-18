/*

Postman — x-www-form-urlencoded से step-by-step (Hindi)
Base URL

{{base_url}} = http://localhost:5000

**************************************************************


A) Create contact (FORM)

Method: POST

URL: http://localhost:5000/api/contacts/

Body tab → select x-www-form-urlencoded

Add fields:

first_name = (required) उदाहरण: Kushal

last_name = Kamble

email = (required) kushal@example.com

phone = 9876543210

address = Pune, India

Send

Expected: 201 Created JSON with created contact.


**************************************************************

B) Read all contacts

Method: GET

URL: http://localhost:5000/api/contacts/

Send → JSON array मिलेगा



**************************************************************

C) Read single contact

Method: GET

URL: http://localhost:5000/api/contacts/:id (e.g. /api/contacts/1)


**************************************************************

D) Update contact (PUT)

Method: PUT

URL: http://localhost:5000/api/contacts/:id

Body → raw JSON या x-www-form-urlencoded दोनों चलेगा (app.use दोनों handle करता है)

Example body (raw JSON):

{ "phone": "1112223334", "address": "New address" }


**************************************************************


E) Delete contact

Method: DELETE

URL: http://localhost:5000/api/contacts/:id

11) Troubleshooting tips

अगर ECONNREFUSED आता है → MySQL चालू करो और credentials ठीक करो

Duplicate email error → email unique है, नया email try करो

req.body undefined → ensure x-www-form-urlencoded चुना हुआ है और app.use(express.urlencoded(...)) मौजूद है



11) Troubleshooting tips

अगर ECONNREFUSED आता है → MySQL चालू करो और credentials ठीक करो

Duplicate email error → email unique है, नया email try करो

req.body undefined → ensure x-www-form-urlencoded चुना हुआ है और app.use(express.urlencoded(...)) मौजूद है




*/