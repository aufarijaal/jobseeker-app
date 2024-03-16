import express from 'express'
import prisma from '../../prisma/client'
import { StatusCodes } from 'http-status-codes'
import verifyToken from '../middleware/authMiddleware'
import type { Request, Response } from 'express'
import multer from 'multer'
import { photoProfileStorage } from '../middleware/storages'
import emailAvailability from '../middleware/email-availability'
import bcrypt from 'bcryptjs'

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
      data: user,
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
  }
})

router.get('/about', verifyToken, async (req: any, res: Response) => {
  try {
    const user = await prisma.user.findFirstOrThrow({
      select: {
        id: true,
        about: true,
      },
      where: {
        id: req.userId,
      },
    })

    res.send({
      data: user,
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
  }
})

router.put('/about', verifyToken, async (req: any, res: Response) => {
  try {
    const { about } = req.body

    await prisma.user.update({
      where: {
        id: req.userId,
      },
      data: {
        about,
      },
    })

    res.send()
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
  }
})

router.get('/pp', verifyToken, async (req: Request, res: Response) => {
  try {
    const photo = await prisma.user.findFirst({
      where: {
        id: (req as any).userId,
      },
      select: {
        photoProfile: true,
      },
    })

    res.send({
      data: photo,
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
  }
})

router.put(
  '/pp',
  [verifyToken, multer({ storage: photoProfileStorage }).single('photo')],
  async (req: Request, res: Response) => {
    try {
      const file = req.file

      if (!file) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .send({ message: 'No file is selected.' })
      }

      await prisma.user.update({
        where: {
          id: (req as any).userId,
        },
        data: {
          photoProfile: file.filename,
        },
      })

      res.send()
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
    }
  }
)

router.put('/name', verifyToken, async (req: Request, res: Response) => {
  try {
    const { fullName } = req.body

    const user = await prisma.user.update({
      where: {
        id: (req as any).userId,
      },
      data: {
        fullName,
      },
    })

    res.send({
      data: user,
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
  }
})

router.put(
  '/email',
  [verifyToken, emailAvailability],
  async (req: Request, res: Response) => {
    try {
      const { email } = req.body

      const user = await prisma.user.update({
        where: {
          id: (req as any).userId,
        },
        data: {
          email,
        },
      })

      res.send({
        data: user,
      })
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
    }
  }
)

router.put('/password', [verifyToken], async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body

    const foundUser = await prisma.user.findFirst({
      select: {
        id: true,
        password: true,
      },
      where: {
        id: (req as any).userId,
      },
    })

    if (!bcrypt.compareSync(oldPassword, foundUser!.password)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Wrong password' })
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10)

    const user = await prisma.user.update({
      where: {
        id: (req as any).userId,
      },
      data: {
        password: hashedNewPassword,
      },
    })

    res.send({
      data: user,
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
  }
})

export default router
