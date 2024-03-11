import express from 'express'
import { StatusCodes } from 'http-status-codes'
import type { Response, Request } from 'express'
import verifyToken from '../middleware/authMiddleware'
import prisma from '../../prisma/client'

const applicationRouter = express.Router()

applicationRouter.post(
  '/job-seeker-apply',
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId
      const { jobId } = req.body

      await prisma.application.create({
        data: {
          jobId: parseInt(jobId),
          jobSeekerId: userId
        }
      })

      res.status(StatusCodes.CREATED).send({message: 'Job application created successfully'})
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
      console.log(error)
    }
  }
)

applicationRouter.get(
  '/',
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId

      const jobApps = await prisma.application.findMany({
        select: {
          id: true,
          jobId: true,
          status: true,
          job: {
            select: {
              title: true,
              salary: true,
              location: true,
              company: {
                select: {
                  name: true,
                  logo: true
                }
              }
            }
          }
        },
        where: {
          jobSeekerId: {
            equals: userId
          }
        }
      })

      res.send({
        data: jobApps
      })
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
      console.log(error)
    }
  }
)

export default applicationRouter
