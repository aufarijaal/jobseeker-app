import { NextFunction } from 'express'
import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import prisma from '../../prisma/client'

async function emailAvailability(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email } = req.body

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
      select: {
        id: true,
      },
    })

    if (user) {
      return res
        .status(StatusCodes.CONFLICT)
        .send({ message: 'Email already in use.' })
    }

    next()
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
  }
}

export default emailAvailability
