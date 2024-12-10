import { Hono } from "hono";
import { userRouter } from "./routes/user";
import { todoRouter } from "./routes/todo";
const app = new Hono();
app.route("/api/v1/user", userRouter);
app.route("/api/v1/todo", todoRouter);
// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTd9.jJTpadLYxyRoN7IKIV4zJBcHDEEYJ6ijwbI5ZmFBb68"
export default app;
