import { PrismaClient } from "@prisma/client/edge";
import { verify } from "hono/jwt";
import { Hono } from "hono";
import { withAccelerate } from "@prisma/extension-accelerate";
import { todoInput, todoUpdateInput } from "@bhavesh_mhadse/common-test";

export const todoRouter = new Hono();

todoRouter.use("/*", async (c, next) => {
  try {
    console.log('c.req.header("Authorization") is:', c.req.header("Authorization"))
    // @ts-ignore
    
    const response = await verify(c.req.header("Authorization") || "", c.env.JWT_SECRET);
    if (response.id) {
      // @ts-ignore
      c.set("user_id", response.id);
      await next();
    } else {
      c.status(403);
      return c.json({ error: "unauthorised" });
    }
  } catch (e) {
    return c.json({ error: "unauthorised" });
  }
});

todoRouter.get("/", async (c: any) => {
  const prisma = new PrismaClient({ datasourceUrl: c.env.url }).$extends(withAccelerate());
  const todos = await prisma.todo.findMany({
    where: {
      user_id: c.get("user_id"),
    },
  });

  return c.json({ msg: "Todo get!", data: todos });
});

todoRouter.post("/", async (c: any) => {
  const body = await c.req.json();
  let { success } = todoInput.safeParse(body);

  if (!success) {
    c.status(411);
    return c.json({ error: "wrong inputs" });
  }
  // @ts-ignore
  const prisma = new PrismaClient({ datasourceUrl: c.env.url }).$extends(withAccelerate());
  const newTodo = await prisma.todo.create({
    data: { title: body.title, description: body.description, user_id: c.get("user_id") || 1 },
  });

  return c.json({ msg: "Todo Created!", data: newTodo });
});

todoRouter.put("/", async (c: any) => {
  const body = await c.req.json();

  let { success } = todoUpdateInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({ error: "wrong inputs" });
  }

  // @ts-ignore
  const prisma = new PrismaClient({ datasourceUrl: c.env.url }).$extends(withAccelerate());
  await prisma.todo.update({
    where: { todo_id: body.todo_id },
    data: {
      title: body.title,
      description: body.description,
      isCompleted: body.isCompleted,
    },
  });

  const allTodos = await prisma.todo.findMany({
    where: { user_id: c.get("user_id") },
  });

  return c.json({ msg: "Todo updated!", data: allTodos });
});
