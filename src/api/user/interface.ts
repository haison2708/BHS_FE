import {
    IFortuneRewardHistoryItem,
    IListResponse,
    IUserAppSetting,
} from "../../types/interface";

export interface IUseQRRequest {
    qrCode?: string;
}

export interface IUseQRRespone {
    image?: string;
    name?: string;
    points?: string;
    price?: number;
    productId?: string;
}

export interface ILogoutRequest {
    token: string; // pass in access Token: logout on 1 device, refresh TokenL logout on all devices
    fcmToken?: string; 
}

export interface IUpdateUserAppSettingRequest extends IUserAppSetting {}

export interface IGetFortuneRewardHistoryResponse extends IListResponse{
    data?: IFortuneRewardHistoryItem[];
}

export interface IExchangeGiftRequest {
    giftOfLoyaltyId: number;
    quantity: number;
}