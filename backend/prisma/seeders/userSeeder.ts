import { Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'

const salt = bcrypt.genSaltSync(10)

const usersData: Prisma.UserCreateInput[] = [
  {
    email: 'alice@prisma.io',
    fullName: 'Alice John Doe',
    password: bcrypt.hashSync('rahasia', salt),
  },
  {
    email: 'aufa@prisma.io',
    fullName: 'Aufa Rijal Alwan',
    password: bcrypt.hashSync('rahasia', salt),
  },
  {
    email: 'mama@prisma.io',
    fullName: 'Mama Lemon Sajiku',
    password: bcrypt.hashSync('rahasia', salt),
  },
  {
    email: 'aji@prisma.io',
    fullName: 'Aji No Moto',
    password: bcrypt.hashSync('rahasia', salt),
  },
]

export default usersData
