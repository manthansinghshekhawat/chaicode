import User from "../models/user_model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
    const user =await User.create({
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
    console.log(error)
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
    message: "User verifed sucessfully"
  })
};



const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email,password)
  if (!email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const user =await User.findOne({ email });
    if (!email) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }
    console.log(email)

    const isMatch = await  bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("maching not ")
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }
    console.log("ohooo")
    const token = jwt.sign(
      { id: user._id, role: user.role },

      "shhhhh",
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
    console.log("yha aagaaya")
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
  } catch (error) {

  }
};



export { registerUser, verifyUser, login };
