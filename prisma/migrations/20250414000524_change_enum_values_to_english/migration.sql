/*
  Warnings:

  - The values [HOMEM,MULHER,NAO_BINARIO] on the enum `Gender` will be removed. If these variants are still used in the database, this will fail.
  - The values [HETERO,HOMOSSEXUAL,BI,PAN] on the enum `SexualOrientation` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Gender_new" AS ENUM ('MAN', 'WOMAN', 'NON_BINARY');
ALTER TABLE "Profile" ALTER COLUMN "gender" TYPE "Gender_new" USING ("gender"::text::"Gender_new");
ALTER TABLE "FilterPreference" ALTER COLUMN "gender" TYPE "Gender_new" USING ("gender"::text::"Gender_new");
ALTER TYPE "Gender" RENAME TO "Gender_old";
ALTER TYPE "Gender_new" RENAME TO "Gender";
DROP TYPE "Gender_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "SexualOrientation_new" AS ENUM ('HETEROSEXUAL', 'HOMOSEXUAL', 'BISEXUAL', 'PANSEXUAL');
ALTER TABLE "Profile" ALTER COLUMN "sexual_orientation" TYPE "SexualOrientation_new" USING ("sexual_orientation"::text::"SexualOrientation_new");
ALTER TABLE "FilterPreference" ALTER COLUMN "sexualOrientation" TYPE "SexualOrientation_new" USING ("sexualOrientation"::text::"SexualOrientation_new");
ALTER TYPE "SexualOrientation" RENAME TO "SexualOrientation_old";
ALTER TYPE "SexualOrientation_new" RENAME TO "SexualOrientation";
DROP TYPE "SexualOrientation_old";
COMMIT;
