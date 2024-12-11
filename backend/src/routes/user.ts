import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign, verify } from "hono/jwt";
import { userInput } from "@bhavesh_mhadse/common-test";
import { cacheData, expiry } from "../constants";

export const userRouter = new Hono();

const handleCache = (id: any) => {
  let now: any = new Date();
  let timeDifference = now - cacheData[id].ts;
  const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
  console.log("minutes for", id, minutes);

  if (minutes == expiry || Object.keys(cacheData).length > 10) {
    console.log("Delleted from cache");
    delete cacheData[id];
    return;
  }
};

userRouter.get("/getAll", async (c: any) => {
  const response: any = await verify(c.req.header("Authorization") || "", c.env.JWT_SECRET);

  console.log("response.id is:", response.id);
  const { id } = response;
  if (id in cacheData) {
    console.log("Serving from cache", id, cacheData[id]?.userData);
    let obj = { msg: "User Got!", data: cacheData[id]?.userData };
    handleCache(id);
    return c.json(obj);
  }
  console.log("Serving from db", id, cacheData[id]);

  // @ts-ignore
  const prisma = new PrismaClient({ datasourceUrl: c.env.url }).$extends(withAccelerate());
  try {
    const newUser = await prisma.user.findMany({
      where: { id },
      select: {
        email: true,
        firstName: true,
        Todo: {
          select: {
            title: true,
            todo_id: true,
            isCompleted: true,
            description: true,
          },
        },
      },
    });

    cacheData[id] = {
      userData: newUser,
      ts: new Date(),
    };

    return c.json({ msg: "User Got!", data: newUser });
  } catch (e) {
    c.status(403);
    return c.json({ error: "error in signup" });
  }
});

userRouter.post("/signup", async (c) => {
  const body = await c.req.json();

  let { success } = userInput.safeParse(body);

  if (!success) {
    c.status(411);
    return c.json({ error: "wrong inputs" });
  }
  // @ts-ignore
  const prisma = new PrismaClient({ datasourceUrl: c.env.url }).$extends(withAccelerate());
  try {
    const newUser = await prisma.user.create({
      data: { email: body.email, password: body.password, firstName: body.name },
    });

    // @ts-ignore
    let token = await sign({ id: newUser.id }, c.env.JWT_SECRET);
    return c.json({ msg: "User Created!", jwt: token });
  } catch (e) {
    c.status(403);
    return c.json({ error: "error in signup" });
  }
});

userRouter.post("/signin", async (c) => {
  const body = await c.req.json();

  let { success } = userInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({ error: "wrong inputs" });
  }

  // @ts-ignore
  const prisma = new PrismaClient({ datasourceUrl: c.env.url }).$extends(withAccelerate());
  try {
    const newUser = await prisma.user.findFirst({
      where: { email: body.email, password: body.password },
    });

    if (!newUser) {
      c.status(403);
      c.json({ error: "unauthorised" });
    }

    // @ts-ignore
    let token = await sign({ id: newUser.id }, c.env.JWT_SECRET);
    return c.json({ msg: "User signed in!", jwt: token });
  } catch (e) {
    c.status(403);
    return c.json({ error: "error in signup" });
  }
});
