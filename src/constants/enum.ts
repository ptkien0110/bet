export enum ROLE {
  ADMIN,
  SELLER,
  CUSTOMER
}

export enum UserVerifyStatus {
  Unverified, // chưa xác thực bởi admin, mặc định = 0
  Verified, // đã xác thực bởi admin
  Banned // bị khóa
}

export enum TokenType {
  AccessToken,
  RefreshToken
}

export enum CategoryStatus {
  Visible,
  Hidden
}

export enum ProductStatus {
  Visible,
  Hidden
}
