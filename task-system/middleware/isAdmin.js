// middleware/isAdmin.js - Admin access check karne ke liye

// ============================================
// ADMIN MIDDLEWARE - Ye check karega ki user admin hai ya nahi
// ============================================
// NOTE: Ye middleware auth middleware ke BAAD hi chalega
// Kyunki req.user auth middleware se hi milta hai
const isAdmin = (req, res, next) => {
  try {
    // Step 1: req.user se user ka role check karte hain
    // req.user auth middleware ne set kiya hoga
    if (!req.user) {
      // Agar req.user nahi hai to unauthorized access
      return res.status(401).send('Unauthorized - Please login first'); // 401 unauthorized
    }
    
    // Step 2: User ka role check karte hain
    if (req.user.role !== 'admin') {
      // Agar user admin nahi hai to access denied
      return res.status(403).send('Access Denied - Admin only'); // 403 forbidden
    }
    
    // Step 3: Agar user admin hai to next function call karte hain
    next(); // Admin hai, aage badho
  } catch (error) {
    // Error handling
    console.error('Admin Middleware Error:', error.message); // Error console me
    res.status(500).send('Server Error'); // 500 internal server error
  }
};

// Middleware ko export karte hain
export default isAdmin;


