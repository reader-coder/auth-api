import { Router } from "express";
import authMiddleware from "../middlewares/auth-middleware.js";
import adminMiddleware from "../middlewares/admin-middleware.js";
import uploadMiddleWare from "../middlewares/upload-middleware.js";
import { uploadImage } from "../controllers/image-controller.js";

const router = Router();

router.post(
  "/upload",
  authMiddleware,
  adminMiddleware,
  uploadMiddleWare.array("image", 5),
  uploadImage
);

export default router;
