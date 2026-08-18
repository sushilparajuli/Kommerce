import { consumer } from "./kafka";
import { createOrder } from "./order";

export const runKafkaSubscribtions = async () => {
  consumer.subscribe("payment.successful", async (message) => {
    const order = message.value;
    console.log("Recived Message: payment.successful", order);
    await createOrder(order);
  });
};
