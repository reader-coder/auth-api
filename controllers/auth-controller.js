import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/user.js";
import { errorExtractor } from "../lib/errorExtractor.js";
import mailer from "../lib/nodemailer.js";

export const register = async (req, res) => {
  try {
    //Check if all the fields are provided

    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    //Check if the username or email already exist

    const existingUserbyEmail = await User.findOne({ email });
    const existingUserbyName = await User.findOne({ username });
    if (existingUserbyEmail) {
      return res.status(409).json({
        success: false,
        message: "email already exists",
      });
    }
    if (existingUserbyName) {
      return res.status(409).json({
        success: false,
        message: "username already exists",
      });
    }

    //Hash the password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create new user

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    //Check if the user was created

    if (!newUser) {
      return res.status(500).json({
        success: false,
        message: "User creation failed",
      });
    }

    //Return success
    return res.status(200).json({
      success: true,
      message: "User created successfully",
      user: {
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: errorExtractor(error),
    });
  }
};

export const login = async (req, res) => {
  try {
    //Check if all the fields are provided

    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    //Find the user and compare password
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Please check the credentials",
      });
    }

    //Generate token cookie
    const token = jwt.sign(
      { username: user.username, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res.cookie("token", token, {
      httpOnly: true, //http only cookie
      secure: process.env.NODE_ENV === "production", // HTTPS-only in production
      maxAge: 1000 * 60 * 60 * 24, //Valid for 1 day
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "Successfully logged in",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: errorExtractor(error),
    });
  }
};

export const logout = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(403).json({
        success: false,
        message: "You're not authorized to perform this action",
      });
    }

    res.clearCookie("token", {
      httpOnly: true, //http only cookie
      secure: process.env.NODE_ENV === "production", // HTTPS-only in production
      maxAge: 1000 * 60 * 60 * 24, //Valid for 1 day
      sameSite: "strict",
    });
    return res.status(200).json({
      success: true,
      message: "Successfully logged out",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: errorExtractor(error),
    });
  }
};

export const passwordResetLinkGenerator = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //Generate token and hash it to store in database
    const resetPasswordToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetPasswordToken)
      .digest("hex");
    user.resetPasswordToken = hashedToken;
    user.resetPasswordTokenExpiry = new Date(Date.now() + 1000 * 60 * 60);
    await user.save();

    //Generate password reset link
    const resetLink = `${process.env.URL}/api/auth/reset-password?token=${resetPasswordToken}`;

    //Email the link using nodemailer
    await mailer(email, resetLink);

    return res.status(200).json({
      success: true,
      message: "Password reset link has been sent",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    //Get token from the url query nad password from the body
    const { token } = req.query;
    const { newPassword, repeatNewPassword } = req.body;

    //Check if token is available
    if (!token) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized",
      });
    }

    //Check and compare passwords
    if (!newPassword || !repeatNewPassword) {
      return res.status(400).json({
        success: false,
        message: "Please enter your password twice",
      });
    }
    if (newPassword !== repeatNewPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords don't match",
      });
    }

    //Compare the tokens by hashing the received token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    //Find the user with the token. Also verify the token isn't expired
    const user = await User.findOne({
      $and: [
        { resetPasswordToken: hashedToken },
        { resetPasswordTokenExpiry: { $gt: Date.now() } },
      ],
    });
    if (!user) {
      return res.status(403).json({
        success: false,
        message: "URL has expired",
      });
    }

    //Encrypt and save the new password. Reset the password reset token and expiry
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    user.resetPasswordToken = "";
    user.resetPasswordTokenExpiry = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
