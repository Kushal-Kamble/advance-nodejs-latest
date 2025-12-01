// middleware/upload.js - File upload handle karne ke liye Multer

import multer from 'multer'; // Multer library import kiya file upload ke liye
import path from 'path'; // Path module import kiya file extensions ke liye

// ============================================
// MULTER STORAGE CONFIGURATION
// ============================================
// Ye define karta hai ki file kahan save hogi aur kya naam hoga
const storage = multer.diskStorage({
  // destination function - File kahan save hogi ye batata hai
  destination: function (req, file, cb) {
    // cb = callback function (error, destination)
    cb(null, 'public/uploads/'); // Files 'public/uploads/' folder me save hongi
    // null means koi error nahi hai
  },
  
  // filename function - File ka naam kya hoga ye define karta hai
  filename: function (req, file, cb) {
    // Unique filename generate karte hain timestamp aur random number se
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Timestamp + random number
    // Example: 1638345678901-123456789
    
    // Original file ka extension extract karte hain
    const ext = path.extname(file.originalname); // Example: .jpg, .png, .pdf
    
    // Final filename banate hain: fieldname-uniqueSuffix.extension
    cb(null, file.fieldname + '-' + uniqueSuffix + ext); // Example: website_logo-1638345678901-123456789.png
  }
});

// ============================================
// FILE FILTER - Kaunsi files allow hain ye check karta hai
// ============================================
const fileFilter = (req, file, cb) => {
  // Allowed file types define karte hain
  const allowedTypes = /jpeg|jpg|png|gif|pdf/; // Regex pattern - ye extensions allowed hain
  
  // File ka extension check karte hain
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase()); // Extension match kiya
  
  // File ka MIME type check karte hain
  const mimetype = allowedTypes.test(file.mimetype); // MIME type check kiya (image/jpeg, image/png, etc.)
  
  // Agar dono match ho gaye to file accept karo
  if (extname && mimetype) {
    cb(null, true); // File accept kar li (null = no error, true = accept)
  } else {
    // Agar file type invalid hai to error bhejo
    cb(new Error('Only images (JPEG, JPG, PNG, GIF) and PDF files are allowed!')); // Error message
  }
};

// ============================================
// MULTER UPLOAD INSTANCE
// ============================================
// Multer instance create karte hain configuration ke saath
const upload = multer({
  storage: storage, // Storage configuration use kiya
  limits: {
    fileSize: 5 * 1024 * 1024 // Maximum file size 5MB (5 * 1024 * 1024 bytes)
  },
  fileFilter: fileFilter // File filter function use kiya
});

// ============================================
// USAGE EXAMPLES IN ROUTES:
// ============================================
// Single file upload: upload.single('fieldname')
// Example: router.post('/upload', upload.single('profile_pic'), controller)

// Multiple files upload: upload.array('fieldname', maxCount)
// Example: router.post('/upload', upload.array('photos', 5), controller)

// Multiple fields: upload.fields([{name: 'field1'}, {name: 'field2'}])
// Example: router.post('/upload', upload.fields([{name: 'avatar'}, {name: 'gallery'}]), controller)

// Upload instance ko export karte hain
export default upload;


