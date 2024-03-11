import express from 'express'
import prisma from '../../prisma/client'
import { StatusCodes } from 'http-status-codes'

const router = express.Router()

router.get('/for-dropdown', async (req, res) => {
  try {
    const jobCategories = await prisma.jobCategory.findMany()

    res.send(jobCategories)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
  }
})

export default router
