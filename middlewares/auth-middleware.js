import jwt from "jsonwebtoken";
import User from "../models/user.js";

const authMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { email } = jwt.decode(token, process.env.JWT_SECRET, (err) => {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    });
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    req.user = {
      userId: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default authMiddleware;
