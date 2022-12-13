-- CreateTable
CREATE TABLE "_ProfileFollows" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProfileFollows_AB_unique" ON "_ProfileFollows"("A", "B");

-- CreateIndex
CREATE INDEX "_ProfileFollows_B_index" ON "_ProfileFollows"("B");

-- AddForeignKey
ALTER TABLE "_ProfileFollows" ADD CONSTRAINT "_ProfileFollows_A_fkey" FOREIGN KEY ("A") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileFollows" ADD CONSTRAINT "_ProfileFollows_B_fkey" FOREIGN KEY ("B") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
