import express from 'express'
import type { CookieOptions, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import prisma from '../../prisma/client'
import { check } from 'express-validator'
import { validationResult } from 'express-validator'
import StatusCodes from 'http-status-codes'
import { Prisma } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { generateRefreshToken, generateAccessToken } from '../lib/utils'

const router = express.Router()
const cookieOptions: CookieOptions = {
  maxAge: 3_600_000, // Cookie expiration time in milliseconds
  httpOnly: true, // Cookie accessible only through HTTP(S) requests, not JavaScript
  secure: true, // Cookie sent only over HTTPS
  sameSite: 'none',
}

router.post(
  '/signup',
  [
    check('fullName').notEmpty().isString().trim(),
    check('email').notEmpty().isString().isEmail().trim(),
    check('password').notEmpty().isString().isLength({ min: 6 }),
  ],
  async (req: Request, res: Response) => {
    try {
      const result = validationResult(req)
      if (!result.isEmpty()) {
        return res
          .status(StatusCodes.UNPROCESSABLE_ENTITY)
          .send({ errors: result.array() })
      }

      const { fullName, email, password } = req.body
      const hashedPassword = await bcrypt.hash(password, 10)

      const user = await prisma.user.create({
        data: {
          fullName,
          email,
          password: hashedPassword,
        },
      })

      const accessToken = generateAccessToken({ userId: user.id })
      const refreshToken = generateRefreshToken({ userId: user.id })

      res.cookie('accessToken', accessToken, {...cookieOptions, maxAge: 3_600_000})
      res.cookie('refreshToken', refreshToken, {...cookieOptions, maxAge: 3_600_000 * 2})
      res.send({ message: 'Signed up successfully', accessToken, refreshToken })
    } catch (error: any | Prisma.PrismaClientKnownRequestError) {
      if (error && error.meta.target[0] === 'email') {
        return res
          .status(StatusCodes.CONFLICT)
          .json({ message: 'Email already taken' })
      }

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
    }
  }
)

router.post(
  '/signin',
  [
    check('email').notEmpty().isString().isEmail().trim(),
    check('password').notEmpty().isString(),
  ],
  async (req: Request, res: Response) => {
    try {
      const result = validationResult(req)
      if (!result.isEmpty()) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .send({ errors: result.array() })
      }

      const { email, password } = req.body

      const foundUser = await prisma.user.findFirstOrThrow({
        select: {
          id: true,
          email: true,
          password: true,
        },
        where: {
          email,
        },
      })

      if (!bcrypt.compareSync(password, foundUser.password)) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Invalid email or password' })
      }

      const accessToken = generateAccessToken({ userId: foundUser.id })
      const refreshToken = generateRefreshToken({ userId: foundUser.id })

      res.cookie('accessToken', accessToken, {...cookieOptions, maxAge: 3_600_000})
      res.cookie('refreshToken', refreshToken, {...cookieOptions, maxAge: 3_600_000 * 2})
      res.send({ message: 'Signed in successfully', accessToken, refreshToken })
    } catch (error: any) {
      if (error && error.name === 'NotFoundError') {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Account not found' })
      }
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
    }
  }
)

router.post('/refresh-token', async (req: Request, res: Response) => {
  try {
    const {refreshToken} = req.cookies

    if(!refreshToken) {
      return res.status(StatusCodes.UNAUTHORIZED).send({message: 'Token is not being provided'})
    }

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string)

    if(!payload) {
      return res.status(StatusCodes.UNAUTHORIZED).send({message: 'Invalid token'})
    }

    const newAccessToken = generateAccessToken(payload)

    res.cookie('token', newAccessToken, cookieOptions)
    res.send({message: 'OK', accessToken: newAccessToken})
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
  }
})

router.post('/employer/signup', (req, res) => {
  res.send('employer signup route')
})

router.post('/employer/signin', (req, res) => {
  res.send('employer signin route')
})

router.post('/signout', (req, res) => {
  res.cookie('accessToken', '', {
    ...cookieOptions,
    maxAge: -1,
    path: '/'
  })
  res.cookie('refreshToken', '', {
    ...cookieOptions,
    maxAge: -1,
    path: '/'
  })
  res.send()
})

export default router
