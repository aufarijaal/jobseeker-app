import express from 'express'
import exctractUserId from '../middleware/extractUserId'
import { Request, Response } from 'express'
import prisma from '../../prisma/client'
import convertRupiah from '../lib/convertRupiah'
import { StatusCodes } from 'http-status-codes'

const router = express.Router()

router.get('/', exctractUserId, async (req: Request, res: Response) => {
  try {
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

    const formattedJobsData = jobs.map((job) => ({
      ...job,
      savedByThisJobSeeker: (req as any).userId
        ? savedJobsId.includes(job.id as any)
        : false,
      salary: {
        raw: job.salary,
        formatted: convertRupiah(job.salary as any, {
          floatingPoint: 0,
        }),
      },
      createdAt: job.createdAt.toLocaleDateString(),
      company: {
        name: job.company.name,
        logo: job.company.logo,
      },
    }))

    return res.send({
      data: formattedJobsData,
      page: currentPage,
      hasNextPage,
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
  }
})

router.get(
  '/:jobId',
  exctractUserId,
  async function show(req: Request, res: Response) {
    try {
      const { jobId } = req.params

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
            equals: parseInt(jobId),
          },
        },
      })

      const isAppliedByThisAuthenticatedUser = await prisma.application
        .findFirst({
          where: {
            jobId: job.id,
            jobSeekerId: (req as any).userId,
          },
        })
        .then((application) => {
          return application !== null
        })

      const isSavedByThisAuthenticatedUser = await prisma.savedJob
        .findFirst({
          where: {
            jobId: job.id,
            jobSeekerId: (req as any).userId,
          },
        })
        .then((savedJob) => {
          return savedJob !== null
        })

      res.send({
        data: {
          ...job,
          salary: {
            raw: job.salary,
            formatted: convertRupiah(job.salary as any, {
              floatingPoint: 0,
            }),
          },
          isAppliedByThisAuthenticatedUser,
          isSavedByThisAuthenticatedUser,
        },
      })
    } catch (error) {
      console.log(error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
    }
  }
)

router.get(
  '/:excludedId/get-similar',
  exctractUserId,
  async (req: Request, res: Response) => {
    try {
      const { excludedId } = req.params

      const excludedJob = await prisma.job.findFirstOrThrow({
        select: {
          category: {
            select: {
              slug: true,
            },
          },
        },
        where: {
          id: parseInt(excludedId),
        },
      })

      const similarJobs = await prisma.job.findMany({
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
            not: parseInt(excludedId),
          },
        },
        take: 3,
      })

      if ((req as any).userId) {
        const savedJobsId = await prisma.savedJob
          .findMany({
            select: {
              jobId: true,
            },
            where: {
              jobSeekerId: (req as any).userId,
            },
          })
          .then((savedJobs) => savedJobs.map((savedJob) => savedJob.jobId))

        return res.send({
          data: similarJobs.map((similarJob) => ({
            ...similarJob,
            salary: {
              raw: similarJob.salary,
              formatted: convertRupiah(similarJob.salary as any, {
                floatingPoint: 0,
              }),
            },
            isSaved: savedJobsId.includes(similarJob.id),
          })),
        })
      }

      res.send({
        data: similarJobs,
      })
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
    }
  }
)

router.get(
  '/:excludedId/get-more-jobs-from-related-company',
  exctractUserId,
  async (req: Request, res: Response) => {
    try {
      const { excludedId } = req.params

      const excludedJob = await prisma.job.findFirstOrThrow({
        select: {
          company: {
            select: {
              slug: true,
            },
          },
        },
        where: {
          id: parseInt(excludedId),
        },
      })

      const relatedJobs = await prisma.job.findMany({
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
            not: parseInt(excludedId),
          },
        },
        take: 3,
      })

      if ((req as any).userId) {
        const savedJobsId = await prisma.savedJob
          .findMany({
            select: {
              jobId: true,
            },
            where: {
              jobSeekerId: (req as any).userId,
            },
          })
          .then((savedJobs) => savedJobs.map((savedJob) => savedJob.jobId))

        return res.send({
          data: relatedJobs.map((relatedJob) => ({
            ...relatedJob,
            salary: {
              raw: relatedJob.salary,
              formatted: convertRupiah(relatedJob.salary as any, {
                floatingPoint: 0,
              }),
            },
            isSaved: savedJobsId.includes(relatedJob.id),
          })),
        })
      }

      res.send({
        data: relatedJobs,
      })
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
    }
  }
)

export default router
