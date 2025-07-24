const { PrismaClient } = require('../../generated/prisma/client.js')
const { connect } = require('../routes/routes.js')

const prisma = new PrismaClient()

async function getUserById(id) {
  const user = await prisma.user.findFirst({
    where: {
      id: id,
    },
  })
  return user
}

async function getUserByUsername(usernmae) {
  const user = await prisma.user.findFirst({
    where: {
      username: usernmae,
    },
  })
  return user
}

async function createUser(username, password) {
  const folder = await prisma.folder.create({ data: {} })
  console.log(folder)
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
  const folder = await prisma.user.findFirst({
    where: {
      id: id,
    },
    select: {
      homeFolder: true,
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

async function deleteAll() {
  await prisma.folder.deleteMany()
  await prisma.user.deleteMany()
}

module.exports = {
  createUser,
  getUserByUsername,
  deleteAll,
  getUserById,
  getUserFolder,
}
