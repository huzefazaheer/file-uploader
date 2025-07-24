const { PrismaClient } = require('../../generated/prisma/client.js')

const prisma = new PrismaClient()

async function createUser(username) {
  await prisma.folder.deleteMany()
  await prisma.user.deleteMany()
  const folder = await prisma.folder.create({ data: {} })
  console.log(folder)
  const user = await prisma.user.create({
    data: {
      username: 'Huzefa',
      password: '123',
      homeFolderId: folder.id,
      filesUploaded: 0,
    },
  })
  console.log(user)
}

module.exports = { createUser }
