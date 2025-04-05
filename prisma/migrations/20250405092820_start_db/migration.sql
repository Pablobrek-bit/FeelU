-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('HOMEM', 'MULHER', 'NAO_BINARIO');

-- CreateEnum
CREATE TYPE "SexualOrientation" AS ENUM ('HETERO', 'HOMOSSEXUAL', 'BI', 'PAN');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "deleted" BOOLEAN DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "course" TEXT,
    "institution" TEXT,
    "bio" TEXT NOT NULL,
    "avatar_url" TEXT NOT NULL,
    "instagram_url" TEXT,
    "favorite_emoji" TEXT,
    "gender" "Gender" NOT NULL,
    "sexual_orientation" "SexualOrientation" NOT NULL,
    "show_gender" BOOLEAN NOT NULL DEFAULT true,
    "show_sexual_orientation" BOOLEAN NOT NULL DEFAULT true,
    "deleted" BOOLEAN DEFAULT false,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Filter" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "Filter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FilterPreference" (
    "id" UUID NOT NULL,
    "filterId" UUID NOT NULL,
    "gender" "Gender" NOT NULL,
    "sexualOrientation" "SexualOrientation" NOT NULL,

    CONSTRAINT "FilterPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Like" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "likedUser" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "matchedUser" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "idx_users_deleted" ON "User"("deleted");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE INDEX "idx_profiles_filter" ON "Profile"("gender", "sexual_orientation");

-- CreateIndex
CREATE INDEX "idx_profiles_deleted" ON "Profile"("deleted");

-- CreateIndex
CREATE UNIQUE INDEX "Filter_userId_key" ON "Filter"("userId");

-- CreateIndex
CREATE INDEX "idx_filters_user_id" ON "Filter"("userId");

-- CreateIndex
CREATE INDEX "idx_filter_preferences_filter_id" ON "FilterPreference"("filterId");

-- CreateIndex
CREATE INDEX "idx_likes_liked_user" ON "Like"("likedUser");

-- CreateIndex
CREATE INDEX "idx_matches_matched_user" ON "Match"("matchedUser");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Filter" ADD CONSTRAINT "Filter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilterPreference" ADD CONSTRAINT "FilterPreference_filterId_fkey" FOREIGN KEY ("filterId") REFERENCES "Filter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
