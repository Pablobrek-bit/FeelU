-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('HOMEM', 'MULHER', 'NAO_BINARIO');

-- CreateEnum
CREATE TYPE "SexualOrientation" AS ENUM ('HETERO', 'HOMOSSEXUAL', 'BI', 'PAN');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "deleted" BOOLEAN DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "course" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "avatar_url" TEXT NOT NULL,
    "instagram_url" TEXT NOT NULL,
    "favorite_emoji" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "sexual_orientation" "SexualOrientation" NOT NULL,
    "show_gender" BOOLEAN NOT NULL DEFAULT true,
    "show_sexual_orientation" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "filters" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "gender" "Gender"[],
    "sexualOrientation" "SexualOrientation"[],

    CONSTRAINT "filters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "likes" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "likedUser" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "matchedUser" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_users_deleted" ON "users"("deleted");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_userId_key" ON "profiles"("userId");

-- CreateIndex
CREATE INDEX "idx_profiles_filter" ON "profiles"("gender", "sexual_orientation");

-- CreateIndex
CREATE UNIQUE INDEX "filters_userId_key" ON "filters"("userId");

-- CreateIndex
CREATE INDEX "idx_filters_user_id" ON "filters"("userId");

-- CreateIndex
CREATE INDEX "idx_likes_liked_user" ON "likes"("likedUser");

-- CreateIndex
CREATE INDEX "idx_matches_matched_user" ON "matches"("matchedUser");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "filters" ADD CONSTRAINT "filters_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
