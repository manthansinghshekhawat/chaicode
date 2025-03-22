import jwt from "jsonwebtoken";

export const isLoggedIn = async (req, res, next) => {
  try {
    console.log(req.cookies);
    const token = req.cookies?.token;
    console.log("Token Found:", token ? "yes" : "no");
    if (!token) {
      console.log("No token");
      return res.status(401).json({
        success: false,
        message: "Authentication failed",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded DATA:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error in isLoggedIn middleware:", error);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
};
