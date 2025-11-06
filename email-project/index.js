const express = require('express');
const app = express();
const nodemailer = require('nodemailer')
const path = require('path')
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const transporter = nodemailer.createTransport({
  host : 'email-smtp.us-east-1.amazonaws.com',
  port: 587,
  secure: false, 
  auth: {
    user: 'AKIA5OQ6466FZWEYNNVJ',
    pass: 'BB8uQenn6fCEjW791mFxeUgQ39xwI/9PEBDPz7uasG58'
  }
})

app.post('/send-email', async (req, res) =>{
  const { to, subject, text } = req.body

  // const template = fs.readFile('./views/email-template.ejs')
  // const html = ejs.render(template, {name: 'John'})

  try{
    const info = await transporter.sendMail({
      from: '"Kushal Kamble" <kushal.kamble@mitsde.com>',
      to: to,
      subject : subject,
      text : text,
      // html: '<b>Hello Message</b>',
      // html: html,
      attachments: [
        {
          filename: 'data.pdf',
          path: path.join(__dirname, 'files', 'data.pdf')
        }
      ]
    })

    res.json({ message: 'Email Send Successfully', info})
  }catch(error){
    res.status(500).json({ message: 'Failed to send email',error })
  }
})

app.get('/', (req, res) => {
    res.render('mailpage');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

