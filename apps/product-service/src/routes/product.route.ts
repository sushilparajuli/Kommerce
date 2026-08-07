import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updatedProduct,
  getProduct,
} from "../controllers/product.controller";
import { shouldBeAdmin } from "../middleware/authMiddleware";

const router: Router = Router();

router.post("/", shouldBeAdmin, createProduct);
router.put("/:id", shouldBeAdmin, updatedProduct);
router.delete("/:id", shouldBeAdmin, deleteProduct);
router.get("/", getProducts);
router.get("/:id", getProduct);

export default router;
