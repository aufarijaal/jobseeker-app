import express from 'express'
import * as jobController from '../controllers/jobController'
import exctractUserId from '../middleware/extractUserId'
import { Request, Response } from 'express'
import prisma from '../../prisma/client'
import convertRupiah from '../lib/convertRupiah'

const router = express.Router()

router.get('/', exctractUserId, async (req: Request, res: Response) => {
  const { salaryMin, salaryMax, sortBy, q, page, jobCategory } = req.query

  const itemsPerPage = 10
  const currentPage = parseInt((page as string) ?? '1')
  const whereQuery: any = {
    salary: {
      gte: salaryMin,
      lte: salaryMax,
    },
    category: {
      slug: {
        contains: jobCategory,
      },
    },
    OR: [
      {
        company: {
          name: {
            contains: q,
            mode: 'insensitive',
          },
        },
      },
      {
        title: {
          contains: q,
          mode: 'insensitive',
        },
      },
    ],
  }
  const selectQuery = {
    id: true,
    title: true,
    description: true,
    requirements: true,
    location: true,
    salary: true,
    createdAt: true,
    companyId: true,
    employerId: true,
    company: {
      select: {
        name: true,
        logo: true,
      },
    },
  }

  const jobsCount = await prisma.job.count({
    where: whereQuery,
  })

  const hasNextPage = currentPage < jobsCount / itemsPerPage

  const jobs = await prisma.job.findMany({
    select: selectQuery,
    where: whereQuery,
    orderBy:
      sortBy === 'highestSalary'
        ? { salary: 'desc' }
        : sortBy === 'recentlyPosted'
        ? { createdAt: 'desc' }
        : {},
    take: itemsPerPage,
    skip: (currentPage - 1) * itemsPerPage,
  })

  if (!jobs.length) {
    return res.send({
      data: [],
      page: currentPage,
      nextPage: null,
    })
  }

  const savedJobsId = await prisma.savedJob
    .findMany({
      select: {
        jobId: true,
      },
      where: {
        jobSeekerId: (req as any).userId,
      },
    })
    .then((savedJobs) => {
      return savedJobs.map((savedJob) => savedJob.jobId)
    })
    .catch(() => [])

  const formattedJobsData = jobs.map((job) => {
    let savedByThisJobSeeker = false

    if ((req as any).userId) {
      savedByThisJobSeeker = savedJobsId.some((jobId) => jobId === job.id)
    }

    return {
      id: job.id,
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      location: job.location,
      salary: {
        raw: job.salary,
        formatted: convertRupiah(job.salary as any, {
          floatingPoint: 0,
        }),
      },
      createdAt: job.createdAt.toLocaleDateString(),
      companyId: job.companyId,
      employerId: job.employerId,
      company: {
        name: job.company.name,
        logo: job.company.logo,
      },
      savedByThisJobSeeker,
    }
  })

  return res.send({
    data: formattedJobsData,
    page: currentPage,
    hasNextPage,
  })
})

router.get('/:jobId', exctractUserId, jobController.show)

router.get('/:excludedId/get-similar', exctractUserId, jobController.getSimilar)

router.get(
  '/:excludedId/get-more-jobs-from-related-company',
  exctractUserId,
  jobController.getMoreFromRelatedCompany
)

export default router
