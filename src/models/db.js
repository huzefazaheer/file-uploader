const { PrismaClient } = require('../../generated/prisma/client.js')
const { connect } = require('../routes/routes.js')
const fs = require('fs')
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()
const supabase = createClient(process.env.SUPABASE, process.env.STORAGE_KEY)

const prisma = new PrismaClient()

async function getUserById(id) {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  })
  return user
}

async function incrementUpload(id) {
  const user = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      filesUploaded: {
        increment: 1,
      },
    },
  })
  return user
}

async function getUserByUsername(username) {
  const user = await prisma.user.findFirst({
    where: {
      username: username,
    },
  })
  return user
}

async function createUser(username, password) {
  const folder = await prisma.folder.create({ data: { name: 'home' } })
  const user = await prisma.user.create({
    data: {
      username: username,
      password: password,
      homeFolderId: folder.id,
      filesUploaded: 0,
    },
  })
  console.log(user)
}

async function getUserFolder(id) {
  const folder = await prisma.folder.findUnique({
    where: { id: id },
    select: {
      id: true,
      files: true,
      subFolders: true,
      parentFolder: true,
    },
  })
  return folder
}

async function uploadFile(folder, name, url, size) {
  await prisma.file.create({
    data: {
      name: name,
      url: url,
      inFolderId: folder,
      fileSize: size,
    },
  })
}

async function createFolder(folder, name) {
  await prisma.folder.create({
    data: {
      name: name,
      parentFolder: {
        connect: {
          id: folder,
        },
      },
    },
  })
}

async function deleteAll() {
  await prisma.folder.deleteMany()
  await prisma.user.deleteMany()
  await prisma.file.deleteMany()
}

async function getAllFiles() {
  const folders = await prisma.file.findMany({})
  console.log(folders)
}

async function getFile(id) {
  const file = await prisma.file.findUnique({
    where: { id: id },
    select: {
      id: true,
      dateUploaded: true,
      name: true,
      fileSize: true,
      url: true,
    },
  })
  return file
}

async function deleteFile(id) {
  const file = await getFile(id)
  const { data, error } = await supabase.storage.from('data').remove([file.url])
  await prisma.file.delete({
    where: { id: id },
  })
}

async function deleteFolder(id) {
  const selectedFolder = await prisma.folder.findUniqueOrThrow({
    where: { id: id },
    select: { subFolders: true, files: true },
  })
  if (selectedFolder.files.length > 0) {
    for (const file of selectedFolder.files) {
      await deleteFile(file.id)
    }
  }
  if (selectedFolder.subFolders.length > 0) {
    for (const subfolder of selectedFolder.subFolders) {
      await deleteFolder(subfolder.id)
    }
  }
  await prisma.folder.delete({
    where: { id: id },
  })
}

module.exports = {
  createUser,
  getUserByUsername,
  deleteAll,
  getUserById,
  getUserFolder,
  getAllFiles,
  uploadFile,
  createFolder,
  getFile,
  deleteFile,
  deleteFolder,
  incrementUpload,
  supabase,
}
