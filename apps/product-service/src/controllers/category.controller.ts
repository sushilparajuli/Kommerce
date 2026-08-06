import { Response, Request } from "express";
import { prisma, Prisma } from "@repo/product-db";

export const createCategory = async (req: Request, res: Response) => {
  const data: Prisma.CategoryCreateInput = req.body;
  const product = await prisma.category.create({ data });
  res.status(201).json(product);
};
export const updatedCategory = async (req: Request, res: Response) => {};
export const deleteCategory = async (req: Request, res: Response) => {};
export const getCategories = async (req: Request, res: Response) => {};
