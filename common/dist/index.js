"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.todoUpdateInput = exports.todoInput = exports.userInput = void 0;
const zod_1 = __importDefault(require("zod"));
exports.userInput = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string(),
    name: zod_1.default.string().optional(),
});
exports.todoInput = zod_1.default.object({
    title: zod_1.default.string(),
    description: zod_1.default.string(),
    isCompleted: zod_1.default.boolean().optional(),
    user_id: zod_1.default.number(),
});
exports.todoUpdateInput = zod_1.default.object({
    title: zod_1.default.string().optional(),
    description: zod_1.default.string().optional(),
    isCompleted: zod_1.default.boolean().optional(),
});
