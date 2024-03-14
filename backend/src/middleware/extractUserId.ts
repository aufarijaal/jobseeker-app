import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'

function exctractUserId(req: any, res: Response, next: NextFunction) {
  const accessToken = req.headers.authorization
  try {
    const decoded: any = accessToken
      ? jwt.verify(accessToken, process.env.JWT_SECRET as string)
      : { userId: null }

    req.userId = decoded.userId
    next()
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

export default exctractUserId
