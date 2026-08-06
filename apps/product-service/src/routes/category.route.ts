import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updatedCategory,
} from "../controllers/category.controller";

const router: Router = Router();

router.post("/", createCategory);
router.put("/:id", updatedCategory);
router.delete("/:id", deleteCategory);
router.get("/", getCategories);

export default router;
