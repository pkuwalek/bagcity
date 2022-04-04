/*
  Warnings:

  - Added the required column `decription` to the `bags` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bags" ADD COLUMN     "decription" VARCHAR(4096) NOT NULL;
