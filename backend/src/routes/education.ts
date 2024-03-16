import express, { RequestHandler } from 'express'
import prisma from '../../prisma/client'
import { StatusCodes } from 'http-status-codes'
import verifyToken from '../middleware/authMiddleware'
import { Request, Response } from 'express'
import { body, param, validationResult } from 'express-validator'
import { checkEducationLevel, idExistsInEducationTable } from '../lib/utils'
import {
  createEducationValidator,
  updateEducationValidator,
} from '../validators/education-validators'

const router = express.Router()

router.get('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const educations = await prisma.education.findMany({
      where: {
        userId: (req as any).userId,
      },
    })

    res.send({
      data: educations,
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
  }
})

router.post(
  '/',
  createEducationValidator,
  async (req: Request, res: Response) => {
    try {
      const result = validationResult(req)
      if (!result.isEmpty()) {
        return res
          .status(StatusCodes.UNPROCESSABLE_ENTITY)
          .send({ errors: result.array() })
      }
      console.log(req.body)

      const { level, institution, major } = req.body

      await prisma.education.create({
        data: {
          level,
          institution,
          major,
          userId: (req as any).userId,
        },
      })

      res.status(StatusCodes.CREATED).send()
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
    }
  }
)

const putPatchHandler: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { level, institution, major } = req.body

    const result = validationResult(req)
    if (!result.isEmpty()) {
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .send({ errors: result.array() })
    }

    await prisma.education.update({
      where: {
        id: parseInt(id),
      },
      data: {
        level,
        institution,
        major,
      },
    })

    res.send()
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
  }
}

router.put('/:id', updateEducationValidator, putPatchHandler)
router.patch('/:id', updateEducationValidator, putPatchHandler)

router.delete('/:id', [verifyToken], async (req: Request, res: Response) => {
  try {
    const result = validationResult(req)
    if (!result.isEmpty()) {
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .send({ errors: result.array() })
    }

    const { id } = req.params

    await prisma.education.delete({
      where: {
        id: parseInt(id),
      },
    })

    res.status(StatusCodes.NO_CONTENT).send()
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
  }
})

export default router
