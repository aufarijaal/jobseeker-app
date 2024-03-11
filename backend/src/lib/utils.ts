import jwt, { JwtPayload } from 'jsonwebtoken'

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
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: expiresIn ?? process.env.JWT_REFRESH_EXPIRE_TIME,
  })

  return refreshToken
}
