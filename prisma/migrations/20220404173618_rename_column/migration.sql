/*
  Warnings:

  - You are about to drop the column `decription` on the `bags` table. All the data in the column will be lost.
  - Added the required column `description` to the `bags` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bags" DROP COLUMN "decription",
ADD COLUMN     "description" VARCHAR(4096) NOT NULL;
