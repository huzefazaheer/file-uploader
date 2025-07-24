/*
  Warnings:

  - You are about to drop the `_subFolder` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `fileSize` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentFolderId` to the `Folder` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_subFolder" DROP CONSTRAINT "_subFolder_A_fkey";

-- DropForeignKey
ALTER TABLE "_subFolder" DROP CONSTRAINT "_subFolder_B_fkey";

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "fileSize" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Folder" ADD COLUMN     "parentFolderId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_subFolder";

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_parentFolderId_fkey" FOREIGN KEY ("parentFolderId") REFERENCES "Folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
