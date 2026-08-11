import { consumer } from "./kafka";
import { createStripeProduct, deleTeStripeProduct } from "./stripeProduct";

export const runKafkaSubscribtions = async () => {
  consumer.subscribe("product.created", async (message) => {
    const product = message.value;
    console.log("Recived Message: product.created", product);
    await createStripeProduct(product);
  });

  consumer.subscribe("product.deleted", async (message) => {
    const productId = message.value;
    console.log("Deleted Message: product.deleted", productId);
    await deleTeStripeProduct(productId);
  });
};
