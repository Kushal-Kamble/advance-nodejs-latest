const express = require('express'); // sabse pehle expresss packge ko include kiya hai
const Razorpay = require('razorpay') // razorpay package ko include kiya hai
const dotenv = require('dotenv')
const path = require('path') // path 
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');
const { error } = require('console');

dotenv.config();

const app = express(); // phir yha humne uska object bnaya hai matlab instance 

app.set("view engine", "ejs")// ejs template ko use krne waala hooo me
app.use(express.json()) // form ki informatin json me lunga
app.use(express.static("public")) // static folder name

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

app.get("/", (req, res) => {
  res.render("index", { key: process.env.RAZORPAY_KEY_ID }) //automatic page open hoga
})

// Create Order Route
app.post("/create-order", async (req, res) => {
  try{
    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    }

    const order = await razorpay.orders.create(options)
    res.json(order);

  }catch(err){
    res.status(500).send({error: err.message }) // 500 means server error
  }
})

app.post("/verify-payment", (req, res) => {
  try{
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const isValidSignature = validateWebhookSignature(body, razorpay_signature, secret);
    if (isValidSignature) {
      res.status(200).json({ status: 'ok' });
      console.log("Payment verification successful");
    }else {
      res.status(400).json({ status: 'verification_failed' });
      console.log("Payment verification failed");
    }

  }catch(err){
    res.status(500).send({error: err.message })
  }
})

app.get("/payment-success", (req, res) => {
  res.sendFile(path.join(__dirname, 'views/success.html'))
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));