import { getAuth } from "@hono/clerk-auth";
import { createMiddleware } from "hono/factory";

export const shouldBeUser = createMiddleware<{
  Variables: {
    userId: string;
  };
}>(async (c, next) => {
  const { userId } = getAuth(c);
  if (!userId) {
    return c.json({
      message: "You are not logged in.",
    });
  }
  c.set("userId", userId);
  await next();
});
