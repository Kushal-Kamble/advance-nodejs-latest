const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const path = require('path');
const ejs = require('ejs');
const app = express();
const port = 3000;

// saare package ko include kr liya

app.set('view engine', 'ejs'); // EJS ko view engine ke roop me set kr diya

// Multer configuration for file uploads

const upload = multer({ dest: 'uploads/' }); // Uploaded files ko 'uploads' folder me store krne ke liye

// Routes



app.get('/', (req, res) => { // Home route
  res.render('excel');
});

app.post('/upload-excel', upload.single('excelFile'), (req, res) => { // single method  Excel file upload route
  const filePath = path.join(__dirname, 'uploads', req.file.filename);

  const workbook = XLSX.readFile(filePath); //workbook ye variable hai  XLSX package ka readFile method use krke file read kr rha hai
  const worksheet = workbook.Sheets[workbook.SheetNames[0]]; // first sheet ko access kr rha hai
  const data = XLSX.utils.sheet_to_json(worksheet);// sheet ke data ko json me convert kr rha hai

  //data ko mujhe databse me store krna hai to yaha kr skta hu
  // Example: MySQL database me insert krne ka code yaha likh skta hu
  
  // const connection = mysql.createConnection({
  //   host: 'localhost',
  //   user: 'root',
  //   password: '',
  //   database: 'excel_db'
  // });

  // connection.connect((err) => {
  //   if (err) throw err;
  //   console.log('Connected to MySQL Database');
  // });

  // data.forEach((row) => {
  //   const query = 'INSERT INTO excel_data (Name, Age, City) VALUES (?, ?, ?)';
  //   connection.query(query, [row.Name, row.Age, row.City], (err, result) => {
  //     if (err) throw err;
  //     console.log('Data inserted into MySQL Database');
  //   });
  // });
  // connection.end();

  // mongodb se insert krne ka code yaha likh skta hu
  // const { MongoClient } = require('mongodb');
  // const uri = "mongodb://localhost:27017";
  // const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  // client.connect((err) => {
  //   if (err) throw err;
  //   console.log('Connected to MongoDB');
  //   const db = client.db('excel_db');
  //   const collection = db.collection('excel_data');
  //   collection.insertMany(data, (err, result) => {
  //     if (err) throw err;
  //     console.log('Data inserted into MongoDB');
  //   });
  //   client.close();
  // });

  // mongodb se insert krne ka code yaha likh skta hu
  // const { MongoClient } = require('mongodb');
  // const uri = "mongodb://localhost:27017";
  // const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  // client.connect((err) => {
  //   if (err) throw err;
  //   console.log('Connected to MongoDB');
  //   const db = client.db('excel_db');
  //   const collection = db.collection('excel_data');
  //   collection.insertMany(data, (err, result) => {
  //     if (err) throw err;
  //     console.log('Data inserted into MongoDB');
  //   });
  //   client.close();
  // });

  res.json({ // response me json data bhej rha hai
    message: 'Excel file uploaded successfully',
    data
  })
})

// Export Excel File
app.get('/export-excel', (req, res) => {
  const data = [ // sample data jo excel file me export krna hai
    { Name: "John", Age: 30, City: "New York" },
    { Name: "Jane", Age: 25, City: "London" },
    { Name: "Bob", Age: 40, City: "Paris" }
  ]

  const worksheet= XLSX.utils.json_to_sheet(data); // json data ko sheet me convert kr rha hai
  
  const workbook = XLSX.utils.book_new(); // naya workbook create kr rha hai
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');// worksheet ko workbook me add kr rha hai
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });// workbook ko excel file me convert kr rha hai

  // response me excel file bhej rha hai

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); // excel file ka content type set kr rha hai
  res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');// file download ke liye header set kr rha hai
  res.send(excelBuffer)// excel file bhej rha hai
  
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
