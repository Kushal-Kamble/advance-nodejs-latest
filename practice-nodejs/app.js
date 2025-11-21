const express = require('express'); // import ki jagah require

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});


app.get('/about', (req, res) => {
  res.send('About Page');
});

app.get('/contact', (req, res) => {
  res.send('Contact Page hai kushal bhai');
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
