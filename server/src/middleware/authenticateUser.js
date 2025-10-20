const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET_CODE;

const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;  // attach to req for use in next handlers
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = authenticateUser;
