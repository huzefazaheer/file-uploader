-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_homeFolderId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "homeFolderId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_homeFolderId_fkey" FOREIGN KEY ("homeFolderId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
