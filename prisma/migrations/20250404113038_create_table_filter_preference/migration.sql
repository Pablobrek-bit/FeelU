/*
  Warnings:

  - You are about to drop the column `gender` on the `filters` table. All the data in the column will be lost.
  - You are about to drop the column `sexualOrientation` on the `filters` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "filters" DROP COLUMN "gender",
DROP COLUMN "sexualOrientation";

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "deleted" BOOLEAN DEFAULT false,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ALTER COLUMN "course" DROP NOT NULL,
ALTER COLUMN "institution" DROP NOT NULL,
ALTER COLUMN "instagram_url" DROP NOT NULL,
ALTER COLUMN "favorite_emoji" DROP NOT NULL;

-- CreateTable
CREATE TABLE "filter_preferences" (
    "id" UUID NOT NULL,
    "filterId" UUID NOT NULL,
    "gender" "Gender" NOT NULL,
    "sexualOrientation" "SexualOrientation" NOT NULL,

    CONSTRAINT "filter_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_filter_preferences_filter_id" ON "filter_preferences"("filterId");

-- CreateIndex
CREATE INDEX "idx_profiles_deleted" ON "profiles"("deleted");

-- AddForeignKey
ALTER TABLE "filter_preferences" ADD CONSTRAINT "filter_preferences_filterId_fkey" FOREIGN KEY ("filterId") REFERENCES "filters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
