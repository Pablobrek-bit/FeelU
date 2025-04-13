-- CreateIndex
CREATE INDEX "idx_likes_user_id" ON "Like"("userId");

-- CreateIndex
CREATE INDEX "idx_matches_user_id" ON "Match"("userId");
