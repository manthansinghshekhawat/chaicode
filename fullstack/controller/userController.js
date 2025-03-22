import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../models/user_model.js";

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exist",
      });
    }
    const user = await User.create({
      name,
      email,
      password,
    });
    if (!user) {
      return res.status(400).json({
        message: "User already exist",
      });
    }
    const token = crypto.randomBytes(32).toString("hex");
    console.log(token);
    user.verificationToken = token;
    await user.save();

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_TRAP_HOST,
      port: process.env.MAIL_TRAP_PORT,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: process.env.MAIL_TRAP_USER,
        pass: process.env.MAIL_TRAP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_TRAP_SENDER_EMAIL, // sender address
      to: user.email, // list of receivers
      subject: "Verify your email!", // Subject line
      text: `Please click on the following link 127.0.0.1:4000/api/v1/users/verify/${token}`, // plain text body
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({
      message: "user created sucessfully ",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "User not registered",
      error,
      success: false,
    });
  }
  // await db();
};

const verifyUser = async (req, res) => {
  const { token } = req.params;
  if (!token) {
    return res.status(400).json({
      message: "Invalid token",
    });
  }
  const user = await User.findOne({ verificationToken: token });
  if (!user) {
    return res.status(400).json({
      message: "Invalid token",
    });
  }
  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();
  return res.status(200).json({
    message: "User verifed sucessfully",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  if (!email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!email) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }
    console.log(email);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("maching not ");
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }
    console.log("ohooo");
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    };
    res.cookie("token", token, cookieOptions);
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {}
};

const getMe = async (req, res) => {
  try {
    console.log("readed at profile level");
    console.log("user data", req.user);

    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error in getMe:", error);
    // Ensure only one response is sent
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
};

const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", {});
    return res.status(200).json({
      sucess: true,
      message: "logout sucessfully",
    });
  } catch (error) {}
};

const forgotPassword = async (req, res) => {
  try {
  } catch (error) {}
};

const resetPassword = async (req, res) => {
  try {
  } catch (error) {}
};

export {
  forgotPassword,
  getMe,
  login,
  logoutUser,
  registerUser,
  resetPassword,
  verifyUser,
};
