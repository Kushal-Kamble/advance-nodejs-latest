// middleware/roleCheck.js

// role expected: single string or array of allowed roles
export const allowRoles = (roles) => (req, res, next) => {
  const allowed = Array.isArray(roles) ? roles : [roles];
  if (!req.user || !allowed.includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied - role check failed" });
  }
  next();
};
