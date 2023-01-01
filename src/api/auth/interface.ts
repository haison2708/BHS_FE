export interface ILoginRespone {
    readonly access_token: string | undefined;
    readonly refresh_token: string | undefined;
    readonly expires_in: string | undefined;
    readonly token_type: string | undefined;
    readonly scope?: string | undefined;
  }
export interface ILoginRequest {
    readonly grant_type?: string | undefined;
    readonly scope?: "api" | "openid" | "api openid" | undefined;
    readonly client_id?: "ro.client" | "client" | undefined;
    readonly client_secret?: "secret" | undefined;
    readonly username: string;
    readonly password: string;
  }

export interface IUpdateUserInfoRequest {
    displayName?: string;
    email?: string;
    gender?: number | undefined;
    address?: string;
    birthday?: string;
  }

export interface IActiveCodeRequest {
  country?: string,
  phoneNumber?: string
}

export interface IValidateOTPRequest {
  confirmCode?: string,
  phoneNumber?: string
}

export interface IRegisterUserRequest {
  confirmCode?: string,
  birthday?: string,
  email?: string, 
  displayName?: string,
  phoneNumber?: string, 
  password?: string,
  confirmPassword?: string,
  address?: string, 
  gender?: number | string,
  image?: string,
  outletName?: string,
  stateId?: string,
  districtId?: string,
  wardId?: string,
  homeAddress?: string
}

export interface IConfirmPasswordFromAppRequest {
  confirmCode?: string,
  identity?: string, 
  password?: string,
  confirmPassword?: string,
}

export interface IChangePasswordFromAppRequest {
  identity: string, //phone number
  oldPassword?: string,
  password?: string,
  confirmPassword?: string,
}

export interface IRefreshTokenRespone {
  readonly access_token: string | undefined;
  readonly refresh_token: string | undefined;
  readonly expires_in: string | undefined;
  readonly token_type: string | undefined;
  readonly scope?: string | undefined;
  readonly id_token?: string | undefined;
}
export interface IRefreshTokenRequest {
  grant_type?: string;
  scope?: "api" | "openid" | "api openid" | undefined;
  client_id?: "ro.client" | "client" | undefined;
  client_secret?: "secret" | undefined;
  refresh_token: string | undefined;
}