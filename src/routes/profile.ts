import { Router } from "express";
import { fetchProfile } from "../controllers/user/fetch-profile";
import { authPass } from "../middleware/auth-pass";
import { updateProfile } from "../controllers/user/update-profile";
import { updatePassword } from "../controllers/user/update-password";
import { validateUpdatePassword, validateUpdateProfile } from "../middleware/validation/profile";

const router = Router();

router.get('/fetch-profile', authPass({ forAllUsers: true }), fetchProfile);
router.put("/update-profile", authPass({ forAllUsers: true }), validateUpdateProfile, updateProfile);
router.patch("/update-password", authPass({ forAllUsers: true }), validateUpdatePassword, updatePassword);

export const profileRoutes = router;
