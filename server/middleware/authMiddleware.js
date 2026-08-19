const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Token check
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please login.",
      });
    }

    // Bearer token se actual token nikalo
    const token = authHeader.split(" ")[1];

    // JWT verify
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // User information request me attach karo
    req.user = decoded;

    next();
  } catch (error) {
    console.error("AUTH MIDDLEWARE ERROR:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

module.exports = authMiddleware;