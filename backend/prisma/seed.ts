import { PrismaClient, Prisma } from '@prisma/client'
import usersData from './seeders/userSeeder'
import companiesData from './seeders/companySeeder'
import employersData from './seeders/employerSeeder'
import jobCategoryData from './seeders/jobCategorySeeder'
import jobsData from './seeders/jobSeeder'
import { parseArgs } from 'node:util'

const prisma = new PrismaClient()

async function main() {
  const {
    values: { seeder },
  } = parseArgs({
    options: {
      seeder: {
        type: 'string',
      },
    },
  })

  console.log(`Start seeding ...`)
  // users
  for (const user of usersData) {
    const createdUser = await prisma.user.create({
      data: user,
    })
    console.log(`Created user with id: ${createdUser.id}`)
  }
  // companies
  for (const c of companiesData) {
    const createdCompany = await prisma.company.create({
      data: c,
    })
    console.log(`Created company with id: ${createdCompany.id}`)
  }
  // employers
  const createdEmployer = await prisma.employer.createMany(employersData)
  console.log(`Created ${createdEmployer.count} employers data`)
  // job categories
  for (const j of jobCategoryData) {
    const createdJobCategory = await prisma.jobCategory.create({
      data: j,
    })
    console.log(`Created job category with id: ${createdJobCategory.id}`)
  }
  // jobs
  const createdJobs = await prisma.job.createMany(jobsData)
  console.log(`Created job category with id: ${createdJobs.count}`)
  // applications
  
  console.log(`Seeding finished.`)
}

main()
.then(async () => {
  await prisma.$disconnect()
})
.catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
