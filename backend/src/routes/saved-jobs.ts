import express from 'express'
import prisma from '../../prisma/client'
import { StatusCodes } from 'http-status-codes'
import { Request, Response } from 'express'
import verifyToken from '../middleware/authMiddleware'

const savedJobsRouter = express.Router()

savedJobsRouter.post('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const { jobId } = req.body

    await prisma.savedJob.create({
      data: {
        jobId,
        jobSeekerId: (req as any).userId,
      },
    })

    res.status(StatusCodes.CREATED).send()
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
  }
})

savedJobsRouter.get('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const savedJobs = await prisma.savedJob.findMany({
      select: {
        id: true,
        job: {
          select: {
            id: true,
            title: true,
            location: true,
            salary: true,
            createdAt: true,
            companyId: true,
            company: {
              select: {
                name: true,
                logo: true,
              },
            },
          },
        },
      },
      where: {
        jobSeekerId: (req as any).userId,
      },
    })

    res.send({
      data: savedJobs,
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
  }
})

export default savedJobsRouter
