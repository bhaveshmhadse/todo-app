import z from "zod";
export declare const userInput: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    name?: string | undefined;
}, {
    email: string;
    password: string;
    name?: string | undefined;
}>;
export declare const todoInput: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    user_id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    title: string;
    description: string;
    user_id: number;
}, {
    title: string;
    description: string;
    user_id: number;
}>;
export declare const todoUpdateInput: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    isCompleted: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    description?: string | undefined;
    isCompleted?: boolean | undefined;
}, {
    title?: string | undefined;
    description?: string | undefined;
    isCompleted?: boolean | undefined;
}>;
export type UserInput = z.infer<typeof userInput>;
export type TodoInput = z.infer<typeof todoInput>;
export type TodoUpdateInput = z.infer<typeof todoUpdateInput>;
