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
    },
  })
  return folder
}

async function uploadFile(folder) {
  await prisma.file.create({
    data: {
      name: 'My File',
      url: 'www.google.com',
      inFolderId: folder,
    },
  })
}

async function createFolder(folder) {
  await prisma.folder.create({
    data: {
      name: 'My Folder',
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

module.exports = {
  createUser,
  getUserByUsername,
  deleteAll,
  getUserById,
  getUserFolder,
  getAllFiles,
  uploadFile,
  createFolder,
}
