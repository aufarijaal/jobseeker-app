import { NextFunction } from 'express'
import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'

function verifyToken(req: any, res: Response, next: NextFunction) {
  const accessToken = req.cookies.accessToken
  if (!accessToken)
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Access denied' })
  try {
    console.log(`accessToken from verifyToken middleware: ${accessToken}`)
    const decoded: any = jwt.verify(
      accessToken,
      process.env.JWT_SECRET as string
    )

    req.userId = decoded.userId
    next()
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid token' })
  }
}

export default verifyToken
