import { Request, Response } from 'express'
import {
  getJobDetail,
  getJobs,
  getMoreJobsFromRelatedCompany,
  getSimilarJobs,
} from '../services/jobService'
import { StatusCodes } from 'http-status-codes'

export async function getJobController(req: Request, res: Response) {
  // const { salaryMin, salaryMax, sortBy, q, page, jobCategory } = req.query
  // try {
  //   const jobs = await getJobs({
  //     salaryMin,
  //     salaryMax,
  //     sortBy,
  //     q,
  //     page,
  //     jobCategory,
  //     userId: (req as any).userId,
  //   } as any)
  //   console.log(`Job Category is: ${jobCategory}`)
  //   if (!jobs.data.length) {
  //     return res.send({
  //       data: [],
  //       page: jobs.page,
  //       hasNextPage: false,
  //     })
  //   }
  //   res.send({
  //     data: jobs.data,
  //     page: jobs.page,
  //     hasNextPage: jobs.hasNextPage,
  //   })
  // } catch (error) {
  //   res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
  // }
}

export async function show(req: Request, res: Response) {
  try {
    const { jobId } = req.params

    const job = await getJobDetail(parseInt(jobId))

    res.send({
      data: job,
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
  }
}

export async function getSimilar(req: Request, res: Response) {
  try {
    const { excludedId } = req.params

    const similarJobs = await getSimilarJobs(parseInt(excludedId))

    res.send({
      data: similarJobs,
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
  }
}

export async function getMoreFromRelatedCompany(req: Request, res: Response) {
  try {
    const { excludedId } = req.params

    const jobs = await getMoreJobsFromRelatedCompany(parseInt(excludedId))

    res.send({
      data: jobs,
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
  }
}
