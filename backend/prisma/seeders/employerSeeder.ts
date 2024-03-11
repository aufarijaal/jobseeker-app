import { Prisma } from '@prisma/client'

const employersData: Prisma.EmployerCreateManyArgs = {
  data: [
    {
      userId: 3,
      companyId: 1,
    },
    {
      userId: 4,
      companyId: 3,
    },
  ],
}

export default employersData
