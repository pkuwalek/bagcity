/*
  Warnings:

  - Added the required column `photo_url` to the `bags` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bags" ADD COLUMN     "photo_url" VARCHAR(1024) NOT NULL;
