const { PrismaClient } = require('../../generated/prisma/client.js')
const { connect } = require('../routes/routes.js')

const prisma = new PrismaClient()

async function getUserById(id) {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
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
  await prisma.file.delete({
    where: { id: id },
  })
}

async function deleteFolder(id) {
  const selectedFolder = await prisma.folder.findUniqueOrThrow({
    where: { id: id },
    select: { subFolders: true, files: true },
  })
  if (selectedFolder.files) {
    selectedFolder.files.forEach(async (file) => {
      await deleteFile(file.id)
    })
  }
  if (selectedFolder.subFolders) {
    selectedFolder.subFolders.forEach(async (folder) => {
      await deleteFolder(folder.id)
    })
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
}
