const express = require('express');
const cron = require('node-cron');
const fs = require("fs")
const path = require("path")
const app = express();

const sourceDir = path.join(__dirname, "data")
const backupDir = path.join(__dirname, "backups")

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// * * * * * 
// minute, hour, day, month, day
// minute (0-59), hour (0-23), day of month (1-31), month (1-12), day of week (0-6) (sunday = 0)
// * * * * * example every minutes
// */5 * * * * example every 5 minutes
// 0 * * * * example every hour
// 0 0 * * * example every day
// 0 0 1 * * example every month
// 0 0 1 1 * example every year
// 0 9 * * * example every day at 9 am
// 0 0 * * * example every day at 12 am (midnight)
// 0 12 * * * example every day at 12 pm (noon)
// 0 0 1 * * example every day at 1 am
// 0 0 * * 1 example every saturday
// 0 0 1 1 0 example every sunday
// 0 0 1 1 1 example every monday
// 0 0 1 1 2 example every tuesday

cron.schedule('* * * * *',async () => { // har minute baad run ho every minute
  try{
    const timestamp = new Date().toISOString().replace(/[:.]/g,"-")
    const destination = path.join(backupDir, `backup-${timestamp}`)

    await fs.cp(sourceDir,destination, { recursive: true }, (err)=>{
      if(err){
        console.log("Backup Failed :", err)
      }else{
        console.log(`Backup created at ${destination}`)
      }
    })
  }catch(err){
    console.error("Backup failed :", err)
  }
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
