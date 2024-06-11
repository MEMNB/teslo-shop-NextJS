/*
  Warnings:

  - The values [SizeM] on the enum `Size` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `size` on the `Product` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Size_new" AS ENUM ('XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL');
ALTER TABLE "Product" ALTER COLUMN "size" DROP DEFAULT;
ALTER TABLE "Product" ALTER COLUMN "sizes" TYPE "Size_new"[] USING ("sizes"::text::"Size_new"[]);
ALTER TYPE "Size" RENAME TO "Size_old";
ALTER TYPE "Size_new" RENAME TO "Size";
DROP TYPE "Size_old";
COMMIT;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "size",
ADD COLUMN     "sizes" "Size"[] DEFAULT ARRAY[]::"Size"[];
