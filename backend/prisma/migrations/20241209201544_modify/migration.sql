/*
  Warnings:

  - The primary key for the `Todo` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Todo" DROP CONSTRAINT "Todo_pkey",
ADD CONSTRAINT "Todo_pkey" PRIMARY KEY ("todo_id");
