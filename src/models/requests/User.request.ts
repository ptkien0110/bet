import { JwtPayload } from 'jsonwebtoken'
import { ROLE, TokenType, UserVerifyStatus } from '~/constants/enum'

export interface RegisterReqBody {
  name: string
  phone: string
  email: string
  date_of_birth: Date
  address: string
  password: string
  confirm_password: string
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  email: string
  roles: ROLE
  token_type: TokenType
  verify: UserVerifyStatus
  exp: number
  iat: number
}

export interface LoginReqBody {
  email: string
  password: string
}

export interface RefreshTokenReqBody {
  refresh_token: string
}

export interface LogoutReqBody {
  refresh_token: string
}
