import { checkEducationLevel, idExistsInEducationTable } from '../lib/utils'
import verifyToken from '../middleware/authMiddleware'
import { param, body } from 'express-validator'

export const updateEducationValidator = [
  verifyToken,
  param('id').exists().isNumeric().isInt({ gt: 0 }),
  body('level')
    .exists()
    .isString()
    .trim()
    .notEmpty()
    .custom(checkEducationLevel),
  body('institution').exists().isString().trim().notEmpty(),
  body('major').exists().isString().trim().notEmpty(),
]

export const createEducationValidator = [
  verifyToken,
  body('level')
    .exists()
    .isString()
    .trim()
    .notEmpty()
    .custom(checkEducationLevel),
  body('institution').exists().isString().trim().notEmpty(),
  body('major').exists().isString().trim().notEmpty(),
]
