// server.js - Ye main file hai jisme hum Express server banate hain

// Step 1: Sabse pehle sabhi required modules ko import karte hain
import express from 'express'; // express naam ka variable banaya jisme express framework import kiya
import dotenv from 'dotenv'; // dotenv naam ka variable banaya environment variables ke liye
import cookieParser from 'cookie-parser'; // cookie-parser naam ka variable cookies handle karne ke liye
import bodyParser from 'body-parser'; // body-parser request body parse karne ke liye
import path from 'path'; // path module file paths handle karne ke liye
import { fileURLToPath } from 'url'; // ES modules me __dirname use karne ke liye
// server.js me add karo startup pe
import { verifyEmailConnection, sendTestEmail } from './utils/mailer.js';
import { triggerDailyReminder, triggerOverdueCheck } from './utils/cronJob.js';



// Step 2: Environment variables load karte hain .env file se
dotenv.config(); // .env file se environment variables load ho jayenge

// Step 3: Database connection import karte hain
import connectDB from './config/db.js'; // database connection function import kiya

// Step 4: Routes import karte hain
import authRoutes from './routes/authRoutes.js'; // authentication routes import kiye
import taskRoutes from './routes/taskRoutes.js'; // task routes import kiye
import adminRoutes from './routes/adminRoutes.js'; // admin routes import kiye

// Step 5: Cron job import karte hain (automatic reminders ke liye)
import './utils/cronJob.js'; // cron job automatically start ho jayega

// Step 6: ES modules me __dirname manually define karna padta hai
const __filename = fileURLToPath(import.meta.url); // current file ka path
const __dirname = path.dirname(__filename); // current directory ka path

// Step 7: Express app initialize karte hain
const app = express(); // app naam ka variable banaya jisme Express application hai

// Step 8: Database connect karte hain
connectDB(); // MongoDB se connection establish hoga

// Server start hone pe test karo
verifyEmailConnection().then(success => {
  if (success) {
    console.log('✅ Email system ready');
    // Optional: Test email bhejo
    // sendTestEmail();
  }
});

// Testing route
app.get('/test-cron', async (req, res) => {
  await triggerDailyReminder();
  res.send('Cron job triggered manually!');
});

// Step 9: Middleware setup - Ye request ko process karne se pehle chalte hain
app.use(bodyParser.json()); // JSON data parse karne ke liye
app.use(bodyParser.urlencoded({ extended: true })); // URL encoded data parse karne ke liye
app.use(cookieParser()); // Cookies parse karne ke liye
app.use(express.static(path.join(__dirname, 'public'))); // Static files (CSS, JS, images) serve karne ke liye

// Step 10: View engine setup - EJS templates use karenge
app.set('view engine', 'ejs'); // EJS ko view engine set kiya
app.set('views', path.join(__dirname, 'views')); // views folder ka path set kiya

// Step 11: Routes setup - Different URLs ko respective routes assign karte hain
app.use('/', authRoutes); // Authentication routes (login, register, logout)
app.use('/tasks', taskRoutes); // Task routes (CRUD operations)
app.use('/admin', adminRoutes); // Admin routes (dashboard, manage users)

// Step 12: Home route - Root URL pe redirect karenge
app.get('/', (req, res) => {
  // Agar user logged in hai to dashboard pe bhejo, warna login page pe
  if (req.cookies.token) {
    res.redirect('/dashboard'); // Dashboard pe redirect
  } else {
    res.redirect('/login'); // Login page pe redirect
  }
});

// Step 13: 404 Error handler - Agar koi route match nahi hua to error dikhayenge
app.use((req, res) => {
  res.status(404).send('404 - Page Not Found'); // 404 error message
});

// Step 14: Server start karte hain specified port pe
const PORT = process.env.PORT || 3000; // .env se PORT liya, agar nahi hai to 3000 use karenge
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`); // Server start hone ka message
});