import express, { RequestHandler } from 'express'
import prisma from '../../prisma/client'
import { StatusCodes } from 'http-status-codes'
import verifyToken from '../middleware/authMiddleware'
import { Request, Response } from 'express'
import { body, param, validationResult } from 'express-validator'

const router = express.Router()

router.get('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const jobExperiences = await prisma.jobExperience.findMany({
      where: {
        userId: (req as any).userId,
      },
    })

    res.send({
      data: jobExperiences,
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
  }
})

router.post(
  '/',
  [
    verifyToken,
    body('title').exists().isString().trim().notEmpty(),
    body('companyName').exists().isString().trim().notEmpty(),
  ],
  async (req: Request, res: Response) => {
    try {
      const result = validationResult(req)
      if (!result.isEmpty()) {
        return res
          .status(StatusCodes.UNPROCESSABLE_ENTITY)
          .send({ errors: result.array() })
      }

      const { title, companyName } = req.body

      await prisma.jobExperience.create({
        data: {
          title,
          companyName,
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
    const { title, companyName } = req.body

    const result = validationResult(req)
    if (!result.isEmpty()) {
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .send({ errors: result.array() })
    }

    await prisma.jobExperience.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title,
        companyName,
      },
    })

    res.send()
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
  }
}

router.put(
  '/:id',
  [
    verifyToken,
    param('id').exists().isNumeric().isInt({ gt: 0 }),
    body('title').exists().isString().trim().notEmpty(),
    body('companyName').exists().isString().trim().notEmpty(),
  ],
  putPatchHandler
)
router.patch(
  '/:id',
  [
    verifyToken,
    body('title').exists().isString().trim().notEmpty(),
    body('companyName').exists().isString().trim().notEmpty(),
  ],
  putPatchHandler
)

router.delete('/:id', verifyToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    await prisma.jobExperience.delete({
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
