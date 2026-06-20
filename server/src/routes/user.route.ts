import express from "express";
import { login, logout, signup, getMe, updateMe, verifyOtp, auth0Login } from "../controller/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { signupSchema, loginSchema, updateMeSchema, verifyOtpSchema } from "../validators/auth.validator.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post("/verify-otp", validate(verifyOtpSchema), verifyOtp);
router.post("/auth0-login", auth0Login);
router.post("/logout", logout);
router.get("/me", isAuthenticated, getMe);
router.put("/me", isAuthenticated, validate(updateMeSchema), updateMe);

export default router;