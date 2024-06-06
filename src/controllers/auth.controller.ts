import { Request, Response } from 'express'
import {
  LoginReqBody,
  LogoutReqBody,
  RefreshTokenReqBody,
  RegisterReqBody,
  TokenPayload
} from '~/models/requests/User.request'
import { ParamsDictionary } from 'express-serve-static-core'
import authService from '~/services/auth.services'
import { USERS_MESSAGES } from '~/constants/messages'
import { ROLE, UserVerifyStatus } from '~/constants/enum'
import { ObjectId } from 'mongodb'
import User from '~/models/schemas/User.schema'

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  const data = await authService.register(req.body)
  return res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    data
  })
}

export const loginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId

  const data = await authService.login({
    user_id: user_id.toString(),
    roles: user.roles as ROLE,
    verify: user.verify as UserVerifyStatus
  })

  await res.cookie('refresh_token', data.refresh_token, { httpOnly: true })

  return res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    data: {
      access_token: data.access_token
    }
  })
}

export const refreshTokenController = async (
  req: Request<ParamsDictionary, any, RefreshTokenReqBody>,
  res: Response
) => {
  const { refresh_token } = req.cookies
  const { user_id, exp, roles, verify } = req.decoded_refresh_token as TokenPayload

  const data = await authService.refreshToken({ refresh_token, user_id, exp, roles, verify })
  await res.cookie('refresh_token', data.refresh_token, { httpOnly: true })
  return res.json({
    message: USERS_MESSAGES.REFRESH_TOKEN_SUCCESS,
    data: {
      access_token: data.access_token
    }
  })
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
  const { refresh_token } = req.body
  const result = await authService.logout(refresh_token)
  return res.json(result)
}
