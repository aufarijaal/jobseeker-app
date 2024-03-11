import express from 'express'
import prisma from '../../prisma/client'
import { StatusCodes } from 'http-status-codes'

const router = express.Router()

router.get('/salary-ranges', async (req, res) => {
  try {
    const salaryRanges = await prisma.job.aggregate({
      _min: {
        salary: true,
      },
      _max: {
        salary: true,
      },
    })

    res.send(salaryRanges)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
  }
})

export default router
