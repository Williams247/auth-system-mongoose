import { Router } from "express";
import { register } from "../controllers/auth/register";
import { login } from "../controllers/auth/login";
import { verifyAccount } from "../controllers/auth/verify-account";
import { resendOtp } from "../controllers/auth/resend-otp";
import { forgotPassword } from "../controllers/auth/forgot-password"
import { validateAuthLogin, validateAuthRegister, validateForgotPassword, validateResendOtp, validateResetPassword, validateVerifyAccount } from "../middleware/validation/auth";
import { resetPassword } from "../controllers/auth/reset-password";

const router = Router();

router.post("/register", validateAuthRegister, register);
router.post("/login", validateAuthLogin, login);
router.post("/resend-otp", validateResendOtp, resendOtp);
router.post("/forgot-password", validateForgotPassword, forgotPassword);
router.patch("/verify-account", validateVerifyAccount, verifyAccount);
router.patch("/reset-password", validateResetPassword, resetPassword);

export const authRouter = router;
