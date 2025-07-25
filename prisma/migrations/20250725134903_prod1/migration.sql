/*
  Warnings:

  - You are about to drop the `fileupload_file` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `fileupload_folder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `fileupload_session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `fileupload_user` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "fileupload_file" DROP CONSTRAINT "fileupload_file_inFolderId_fkey";

-- DropForeignKey
ALTER TABLE "fileupload_folder" DROP CONSTRAINT "fileupload_folder_parentFolderId_fkey";

-- DropForeignKey
ALTER TABLE "fileupload_user" DROP CONSTRAINT "fileupload_user_homeFolderId_fkey";

-- DropTable
DROP TABLE "fileupload_file";

-- DropTable
DROP TABLE "fileupload_folder";

-- DropTable
DROP TABLE "fileupload_session";

-- DropTable
DROP TABLE "fileupload_user";

-- DropEnum
DROP TYPE "fileupload_role";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "homeFolderId" TEXT,
    "filesUploaded" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Folder" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentFolderId" TEXT,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "dateUploaded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inFolderId" TEXT NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sid" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_homeFolderId_key" ON "User"("homeFolderId");

-- CreateIndex
CREATE UNIQUE INDEX "Folder_id_key" ON "Folder"("id");

-- CreateIndex
CREATE UNIQUE INDEX "File_id_key" ON "File"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sid_key" ON "Session"("sid");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_homeFolderId_fkey" FOREIGN KEY ("homeFolderId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_parentFolderId_fkey" FOREIGN KEY ("parentFolderId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_inFolderId_fkey" FOREIGN KEY ("inFolderId") REFERENCES "Folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
