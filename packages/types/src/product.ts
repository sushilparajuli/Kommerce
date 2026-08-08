import type { Category, Product } from "@repo/product-db";

export type ProductType = Product;
export type CategoryType = Category;

export type ProductsType = ProductType[];

export type StripeProductType = {
  id: string;
  name: string;
  price: number;
};
