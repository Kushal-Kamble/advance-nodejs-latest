const express = require('express');
const cron = require('node-cron');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

cron.schedule('* * * * * *', () => {
  console.log('running a task every minute kushal');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
