import { Router } from "express";
import authMiddleware from "../middlewares/auth-middleware.js";
import adminMiddleware from "../middlewares/admin-middleware.js";
import uploadMiddleWare from "../middlewares/upload-middleware.js";
import {
  deleteImgs,
  getAllImages,
  uploadImage,
} from "../controllers/image-controller.js";

const router = Router();

router
  .post(
    "/upload",
    authMiddleware,
    adminMiddleware,
    uploadMiddleWare.array("image", 5),
    uploadImage
  )
  .post("/delete", authMiddleware, adminMiddleware, deleteImgs)
  .get("/", getAllImages);

export default router;
