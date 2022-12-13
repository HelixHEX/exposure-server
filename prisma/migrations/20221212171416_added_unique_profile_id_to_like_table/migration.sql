/*
  Warnings:

  - A unique constraint covering the columns `[post_id]` on the table `Like` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[profile_id]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Like_post_id_key" ON "Like"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "Like_profile_id_key" ON "Like"("profile_id");
