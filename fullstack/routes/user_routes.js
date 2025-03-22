import express from "express";
import {
  registerUser,
  verifyUser,
  login,
  getMe,
  logoutUser,
  forgotPassword,
  resetPassword,
} from "../controller/userController.js";
import { isLoggedIn } from "../middleware/auth_middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify/:token", verifyUser);
router.post("/login", login);
router.get("/profile", isLoggedIn, getMe);
router.get('/logout',isLoggedIn,logoutUser)
export default router;
