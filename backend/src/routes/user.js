import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import { userInput } from "@bhavesh_mhadse/common-test";
export const userRouter = new Hono();
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
            data: { email: body.email, password: body.password },
        });
        // @ts-ignore
        let token = await sign({ id: newUser.id }, c.env.JWT_SECRET);
        return c.json({ msg: "User Created!", jwt: token });
    }
    catch (e) {
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
    }
    catch (e) {
        c.status(403);
        return c.json({ error: "error in signup" });
    }
});
