/*
  Warnings:

  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Folder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "fileupload_role" AS ENUM ('USER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_inFolderId_fkey";

-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_parentFolderId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_homeFolderId_fkey";

-- DropTable
DROP TABLE "File";

-- DropTable
DROP TABLE "Folder";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "fileupload_user" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "fileupload_role" NOT NULL DEFAULT 'USER',
    "homeFolderId" TEXT,
    "filesUploaded" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "fileupload_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fileupload_folder" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentFolderId" TEXT,

    CONSTRAINT "fileupload_folder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fileupload_file" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "dateUploaded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inFolderId" TEXT NOT NULL,

    CONSTRAINT "fileupload_file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fileupload_session" (
    "id" TEXT NOT NULL,
    "sid" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fileupload_session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fileupload_user_id_key" ON "fileupload_user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "fileupload_user_homeFolderId_key" ON "fileupload_user"("homeFolderId");

-- CreateIndex
CREATE UNIQUE INDEX "fileupload_folder_id_key" ON "fileupload_folder"("id");

-- CreateIndex
CREATE UNIQUE INDEX "fileupload_file_id_key" ON "fileupload_file"("id");

-- CreateIndex
CREATE UNIQUE INDEX "fileupload_session_sid_key" ON "fileupload_session"("sid");

-- AddForeignKey
ALTER TABLE "fileupload_user" ADD CONSTRAINT "fileupload_user_homeFolderId_fkey" FOREIGN KEY ("homeFolderId") REFERENCES "fileupload_folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fileupload_folder" ADD CONSTRAINT "fileupload_folder_parentFolderId_fkey" FOREIGN KEY ("parentFolderId") REFERENCES "fileupload_folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fileupload_file" ADD CONSTRAINT "fileupload_file_inFolderId_fkey" FOREIGN KEY ("inFolderId") REFERENCES "fileupload_folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
