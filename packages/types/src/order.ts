import { OrderSchemaType } from "@repo/order-db";
import { Schema } from "mongoose";
export type OrderType = OrderSchemaType & {
  _id: { type: Schema.Types.ObjectId; auto: true };
};
