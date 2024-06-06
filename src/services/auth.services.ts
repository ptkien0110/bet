import { ObjectId } from 'mongodb'
import { ROLE, TokenType, UserVerifyStatus } from '~/constants/enum'
import { USERS_MESSAGES } from '~/constants/messages'
import { RegisterReqBody } from '~/models/requests/User.request'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import { hashPassword } from '~/utils/crypto'
import { signToken, verifyToken } from '~/utils/jwt'

class AuthService {
  private signAccessToken({ user_id, verify, roles }: { user_id: string; verify: UserVerifyStatus; roles: ROLE }) {
    return signToken({
      payload: {
        user_id,
        roles,
        token_type: TokenType.AccessToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
      }
    })
  }
  private signRefreshToken({
    user_id,
    verify,
    exp,
    roles
  }: {
    user_id: string
    verify: UserVerifyStatus
    exp?: number
    roles: ROLE
  }) {
    if (exp) {
      return signToken({
        payload: {
          user_id,
          roles,
          token_type: TokenType.RefreshToken,
          verify,
          exp
        },
        privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
      })
    }
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken,
        verify,
        roles
      },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
      }
    })
  }

  private decodeRefreshToken(refresh_token: string) {
    return verifyToken({
      token: refresh_token,
      secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
    })
  }

  private signAccessTokenAndRefreshToken({
    user_id,
    verify,
    roles
  }: {
    user_id: string
    verify: UserVerifyStatus
    roles: ROLE
  }) {
    return Promise.all([
      this.signAccessToken({ user_id, verify, roles }),
      this.signRefreshToken({ user_id, verify, roles })
    ])
  }

  async checkEmailExist(email: string) {
    const user = await databaseService.users.findOne({
      email
    })
    return Boolean(user)
  }

  async register(payload: RegisterReqBody) {
    const user = await databaseService.users.insertOne(
      new User({
        ...payload,
        password: hashPassword(payload.password),
        roles: ROLE.CUSTOMER,
        verify: UserVerifyStatus.Unverified
      })
    )
    const result = await databaseService.users.findOne({ _id: new ObjectId(user.insertedId) })
    return result
  }

  async login({ user_id, roles, verify }: { user_id: string; roles: ROLE; verify: UserVerifyStatus }) {
    const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken({
      user_id,
      roles,
      verify
    })

    const { iat, exp } = await this.decodeRefreshToken(refresh_token)

    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token, iat, exp })
    )

    return {
      access_token,
      refresh_token
    }
  }

  async refreshToken({
    user_id,
    verify,
    refresh_token,
    roles,
    exp
  }: {
    user_id: string
    verify: UserVerifyStatus
    refresh_token: string
    roles: ROLE
    exp: number
  }) {
    const [new_access_token, new_refresh_token] = await Promise.all([
      this.signAccessToken({ user_id, verify, roles }),
      this.signRefreshToken({ user_id, verify, exp, roles }),
      databaseService.refreshTokens.deleteOne({ token: refresh_token })
    ])
    const decoded_refresh_token = await this.decodeRefreshToken(new_refresh_token)
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user_id),
        token: new_refresh_token,
        iat: decoded_refresh_token.iat,
        exp: decoded_refresh_token.exp
      })
    )
    return {
      access_token: new_access_token,
      refresh_token: new_refresh_token
    }
  }

  async logout(refresh_token: string) {
    await databaseService.refreshTokens.deleteOne({ token: refresh_token })
    return {
      message: USERS_MESSAGES.LOGOUT_SUCCESS
    }
  }
}

const authService = new AuthService()
export default authService
