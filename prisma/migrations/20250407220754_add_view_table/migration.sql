-- CreateTable
CREATE TABLE "View" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "viewedUser" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "View_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_views_user_id" ON "View"("userId");

-- CreateIndex
CREATE INDEX "idx_views_viewed_user" ON "View"("viewedUser");

-- CreateIndex
CREATE UNIQUE INDEX "View_userId_viewedUser_key" ON "View"("userId", "viewedUser");

-- AddForeignKey
ALTER TABLE "View" ADD CONSTRAINT "View_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
