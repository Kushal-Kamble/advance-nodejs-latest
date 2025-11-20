const express = require('express');
const dotenv = require('dotenv');
const twilio = require('twilio')
const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authTokin = process.env.TWILIO_AUTH_TOKIN
const client = new twilio(accountSid, authTokin)

app.post('/send-sms',async (req, res) => {
  const {to, message} = req.body

  try{
    const result =await client.messages.create({
      body: message,
      from : process.env.TWILIO_PHONE_NUMBER,
      to : to
    })

    res.status(200).json({
      sid: result.sid,
      message: 'SMS send'
    })

  }catch(error){
    res.status(500).json({
      message: 'Failed to send SMS',
      error : error.message
    })
  }
});

app.get('/', (req, res) => {
  res.render('smspage');
});

app.listen(3000, () => console.log('Server running on port 3000'));

// // git rm -r --cached node_modules



// ✅ Step 2: Git cache से सभी node_modules हटाएँ

// अपने repo की root directory में यह command चलाएँ:

// git rm -r --cached node_modules


// अगर आपके पास कई sub-projects के node_modules हैं (जैसे screenshot में):

// git rm -r --cached **/node_modules


// या फिर पूरे repository में हर जगह से हटाने के लिए:

// git rm -r --cached .


// और फिर सिर्फ clean files add करें:

// git add .

// ✅ Step 3: Commit & Push करें
// git commit -m "Remove node_modules and apply .gitignore"
// git push

// 🎉 Result

// अब चाहे आप git add . हज़ार बार चलाएं,
// node_modules कभी भी Git में add नहीं होंगे।



