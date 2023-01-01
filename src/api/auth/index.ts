import axios from "axios";
import qs from "qs";
import { IUser } from "../../types/interface";
import apiClient from "../apiClient";
import {
    ILoginRespone,
    IActiveCodeRequest,
    IRegisterUserRequest,
    ILoginRequest,
    IUpdateUserInfoRequest,
    IValidateOTPRequest,
    IConfirmPasswordFromAppRequest,
    IChangePasswordFromAppRequest,
    IRefreshTokenRequest,
    IRefreshTokenRespone,
} from "./interface";
class Auth {
    source;
    constructor() {
        this.source = axios.CancelToken.source();
    }
    login(auth: ILoginRequest): Promise<ILoginRespone> {
        return apiClient.authFormReq.post(
            "/identityserver/connect/token",
            qs.stringify({ ...auth }),
            { cancelToken: this.source.token }
        );
    }
    getUserInfo(): Promise<IUser> {
        return apiClient.authFormReq.get(
            "/identityserver/Account/GetUserInfo",
            { cancelToken: this.source.token }
        );
    }
    updateUserAvatar(image: string): Promise<any> {
        return apiClient.auth.post(
            "/identityserver/Account/UpdateUserAvatar",
            image,
            { cancelToken: this.source.token }
        );
    }
    updateUserInfo(data: IUpdateUserInfoRequest): Promise<any> {
        return apiClient.auth.post(
            "/identityserver/Account/UpdateUserInfo",
            data,
            { cancelToken: this.source.token }
        );
    }
    createUser(data: IUser): Promise<any> {
        return apiClient.client.post("/api/v1/User", data, {
            cancelToken: this.source.token,
        });
    }
    registerUserActiveCode(data: IActiveCodeRequest): Promise<any> {
        return apiClient.auth.post(
            "/identityserver/Account/RegisterUserActiveCode",
            data,
            { cancelToken: this.source.token }
        );
    }
    forgotPasswordActiveCode(data: IActiveCodeRequest): Promise<any> {
        return apiClient.auth.post(
            "/identityserver/Account/ForgotPasswordActiveCode",
            data,
            { cancelToken: this.source.token }
        );
    }
    validateOTP(data: IValidateOTPRequest): Promise<any> {
        return apiClient.auth.post(
            "/identityserver/Account/ValidateOTP",
            data,
            { cancelToken: this.source.token }
        );
    }
    registerUser(data: IRegisterUserRequest): Promise<any> {
        return apiClient.auth.post(
            "/identityserver/Account/RegisterUser",
            data,
            { cancelToken: this.source.token }
        );
    }
    confirmPasswordFromApp(data: IConfirmPasswordFromAppRequest): Promise<any> {
        return apiClient.auth.post(
            "/identityserver/Account/ConfirmPasswordFromApp",
            data,
            { cancelToken: this.source.token }
        );
    }
    changePasswordFromApp(data: IChangePasswordFromAppRequest): Promise<any> {
        return apiClient.auth.post(
            "/identityserver/Account/ChangePasswordFromApp",
            data,
            { cancelToken: this.source.token }
        );
    }
    refreshToken(body: IRefreshTokenRequest): Promise<IRefreshTokenRespone> {
        return apiClient.authFormReq.post(
            "/identityserver/connect/token",
            qs.stringify({ ...body }),
            { cancelToken: this.source.token }
        );
    }
}

export const authAPIs = new Auth();
export default authAPIs;
