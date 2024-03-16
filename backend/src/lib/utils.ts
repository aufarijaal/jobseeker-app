import jwt, { JwtPayload } from 'jsonwebtoken'
import prisma from '../../prisma/client'

export function generateAccessToken(
  payload: string | JwtPayload,
  expiresIn?: string | number
) {
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: expiresIn ?? process.env.JWT_EXPIRE_TIME,
  })

  return token
}

export function generateRefreshToken(
  payload: string | JwtPayload,
  expiresIn?: string | number
) {
  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: expiresIn ?? process.env.JWT_REFRESH_EXPIRE_TIME,
    }
  )

  return refreshToken
}

export function checkEducationLevel(value: string) {
  switch (value) {
    case 'SD':
    case 'SMP':
    case 'SMA':
    case 'DIPLOMA_1':
    case 'DIPLOMA_2':
    case 'DIPLOMA_3':
    case 'DIPLOMA_4':
    case 'SARJANA':
    case 'MAGISTER':
    case 'DOKTOR':
      return true
    default:
      throw new Error('Invalid education level')
  }
}

export async function idExistsInEducationTable(id: number) {
  const found = await prisma.education.findFirst({
    where: {
      id,
    },
  })

  if (found && found.id) {
    return true
  }

  throw new Error('Invalid education id')
}

export function parseEducationLevel(level: string) {
  let parsed = ''

  switch (level) {
    case 'DIPLOMA_1':
      parsed = 'D3'
      break
    case 'DIPLOMA_2':
      parsed = 'D2'
      break
    case 'DIPLOMA_3':
      parsed = 'D3'
      break
    case 'DIPLOMA_4':
      parsed = 'D4'
      break
    case 'SARJANA':
      parsed = 'S1'
      break
    case 'MAGISTER':
      parsed = 'S2'
      break
    case 'DOKTOR':
      parsed = 'S3'
      break
    case 'SD':
    case 'SMP':
    case 'SMA':
    default:
      break
  }

  return parsed
}
