import User from "../models/user_model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

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
    const user = User.create({
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
      text: `Please click on the following link ${process.env.BASE_URL}/api/v1/users/verify/${token}`, // plain text body
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({
      message: "user created sucessfully ",
    });
  } catch (error) {
    res.status(400).json({
      message: "User not registered",
      error,
      success: false,
    });
  }
  // await db();
};

const verifyUser = async (req,res) => {
  const { token } = req.params
  if (!token) {
    return res.status(400).json({
      message: "Invalid token"

    })

  }
  const user = await User.findOne({ verificationToken: token });
  if (!user) {
    return res.status(400).json({
      message: "Invalid token",
    });
  }
  user.isVerified = true
  user.verificationToken = undefined
  await user.save()
  

}



export { registerUser, verifyUser };
