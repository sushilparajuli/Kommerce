import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updatedProduct,
  getProduct,
} from "../controllers/product.controller";

const router: Router = Router();

router.post("/", createProduct);
router.put("/:id", updatedProduct);
router.delete("/:id", deleteProduct);
router.get("/", getProducts);
router.get("/:id", getProduct);

export default router;
