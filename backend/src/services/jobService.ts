import prisma from '../../prisma/client'
import convertRupiah from '../lib/convertRupiah'

type GetJobsFilter = {
  salaryMin?: string
  salaryMax?: string
  q?: string
  sortBy?: 'highestSalary' | 'mostRelevant' | 'recentlyPosted'
  page?: string
  jobCategory?: string
  userId?: number
}

export async function getJobs({
  salaryMin,
  salaryMax,
  q,
  sortBy,
  page,
  jobCategory,
  userId,
}: GetJobsFilter) {
  // const itemsPerPage = 10
  // const currentPage = parseInt(page ?? '1')
  // const whereQuery: any = {
  //   salary: {
  //     gte: salaryMin,
  //     lte: salaryMax,
  //   },
  //   category: {
  //     slug: {
  //       contains: jobCategory,
  //     },
  //   },
  //   OR: [
  //     {
  //       company: {
  //         name: {
  //           contains: q,
  //           mode: 'insensitive',
  //         },
  //       },
  //     },
  //     {
  //       title: {
  //         contains: q,
  //         mode: 'insensitive',
  //       },
  //     },
  //   ],
  // }
  // const selectQuery = {
  //   id: true,
  //   title: true,
  //   description: true,
  //   requirements: true,
  //   location: true,
  //   salary: true,
  //   createdAt: true,
  //   companyId: true,
  //   employerId: true,
  //   company: {
  //     select: {
  //       name: true,
  //       logo: true,
  //     },
  //   },
  // }
  // const jobsCount = await prisma.job.count({
  //   where: whereQuery,
  // })
  // const hasNextPage = currentPage < jobsCount / itemsPerPage
  // const jobs = await prisma.job.findMany({
  //   select: selectQuery,
  //   where: whereQuery,
  //   orderBy:
  //     sortBy === 'highestSalary'
  //       ? { salary: 'desc' }
  //       : sortBy === 'recentlyPosted'
  //       ? { createdAt: 'desc' }
  //       : {},
  //   take: itemsPerPage,
  //   skip: (currentPage - 1) * itemsPerPage,
  // })
  // if (!jobs.length) {
  //   return {
  //     data: [],
  //     page: currentPage,
  //     nextPage: null,
  //   }
  // }
  // const savedJobsId = await prisma.savedJob
  //   .findMany({
  //     select: {
  //       jobId: true,
  //     },
  //     where: {
  //       jobSeekerId: userId,
  //     },
  //   })
  //   .then((savedJobs) => {
  //     return savedJobs.map((savedJob) => savedJob.jobId)
  //   })
  //   .catch(() => [])
  // console.log(`userId: ${userId}`)
  // console.log(`typeof userId ${typeof userId}`)
  // const formattedJobsData = jobs.map((job) => {
  //   let savedByThisJobSeeker = false
  //   if (userId) {
  //     savedByThisJobSeeker = savedJobsId.some((jobId) => jobId === job.id)
  //   }
  //   return {
  //     id: job.id,
  //     title: job.title,
  //     description: job.description,
  //     requirements: job.requirements,
  //     location: job.location,
  //     salary: {
  //       raw: job.salary,
  //       formatted: convertRupiah(job.salary as any, {
  //         floatingPoint: 0,
  //       }),
  //     },
  //     createdAt: job.createdAt.toLocaleDateString(),
  //     companyId: job.companyId,
  //     employerId: job.employerId,
  //     company: {
  //       name: job.company.name,
  //       logo: job.company.logo,
  //     },
  //     savedByThisJobSeeker,
  //   }
  // })
  // return {
  //   data: formattedJobsData,
  //   page: currentPage,
  //   hasNextPage,
  // }
}

export async function getJobDetail(jobId: number) {
  const job = await prisma.job.findFirstOrThrow({
    select: {
      id: true,
      title: true,
      salary: true,
      location: true,
      description: true,
      requirements: true,
      company: {
        select: {
          id: true,
          name: true,
          about: true,
          slug: true,
          logo: true,
          location: true,
        },
      },
    },
    where: {
      id: {
        equals: jobId,
      },
    },
  })

  return job
}

export async function getSimilarJobs(excludedId: number) {
  const excludedJob = await prisma.job.findFirstOrThrow({
    select: {
      category: {
        select: {
          slug: true,
        },
      },
    },
    where: {
      id: excludedId,
    },
  })

  const jobs = await prisma.job.findMany({
    select: {
      id: true,
      title: true,
      salary: true,
      location: true,
      createdAt: true,
      updatedAt: true,
      company: {
        select: {
          name: true,
          logo: true,
        },
      },
    },
    where: {
      category: {
        slug: {
          equals: excludedJob.category.slug,
        },
      },
      id: {
        not: excludedId,
      },
    },
    take: 3,
  })

  return jobs
}

export async function getMoreJobsFromRelatedCompany(excludedId: number) {
  const excludedJob = await prisma.job.findFirstOrThrow({
    select: {
      company: {
        select: {
          slug: true,
        },
      },
    },
    where: {
      id: excludedId,
    },
  })

  const jobs = await prisma.job.findMany({
    select: {
      id: true,
      title: true,
      salary: true,
      location: true,
      createdAt: true,
      updatedAt: true,
      company: {
        select: {
          name: true,
          logo: true,
        },
      },
    },
    where: {
      company: {
        slug: excludedJob.company.slug,
      },
      id: {
        not: excludedId,
      },
    },
    take: 3,
  })

  return jobs
}
