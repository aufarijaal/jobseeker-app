import { NextFunction } from 'express'
import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'

function makeSureEmployer(req: any, res: Response, next: NextFunction) {
  const accessToken = req.cookies.accessToken
  if (!accessToken)
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Access denied' })
  try {
    const decoded: any = jwt.verify(
      accessToken,
      process.env.JWT_SECRET as string
    )

    if (decoded.role !== 'EMPLOYER' || decoded.role === 'JOBSEEKER') {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: 'Forbidden Request' })
    }

    next()
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
  }
}

export default makeSureEmployer
