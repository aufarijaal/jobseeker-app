import express from 'express'
import jwt from 'jsonwebtoken'
import prisma from '../../prisma/client'
import { StatusCodes } from 'http-status-codes'
import verifyToken from '../middleware/authMiddleware'
import type { Request, Response } from 'express'

const router = express.Router()

router.get('/me', verifyToken, async (req: any, res: Response) => {
  try {
    const user = await prisma.user.findFirstOrThrow({
      select: {
        id: true,
        fullName: true,
        email: true,
      },
      where: {
        id: req.userId,
      },
    })

    res.send({
      data: user
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
  }
})

router.post('/upload-pp', verifyToken, async (req: Request, res: Response) => {
  try {
    
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
  }
})

export default router
