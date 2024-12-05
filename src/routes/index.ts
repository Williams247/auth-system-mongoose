import { Router } from 'express';
import { authRouter } from "./auth";
import { profileRoutes } from './profile'

const router = Router();

router.use("/auth", authRouter);
router.use("/profile", profileRoutes);

export default router;