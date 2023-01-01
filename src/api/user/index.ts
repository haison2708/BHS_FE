import {Preferences} from '@capacitor/preferences';
import axios from 'axios';
import {IGiftOfLoyalty, IRankOfUserByVendor, IReward, IUserAppSetting, IUserGiftOfLoyalty, IUserLoyalty, IVendorOfUser} from '../../types/interface';
import {arrayToString} from '../../utils/array';
import apiClient from '../apiClient';
import {
  IExchangeGiftRequest,
  IGetFortuneRewardHistoryResponse,
  ILogoutRequest,
  IUpdateUserAppSettingRequest,
  IUseQRRequest,
  IUseQRRespone,
} from './interface';

const queryString = require('query-string');

class User {
  source;
  constructor() {
    this.source = axios.CancelToken.source();
  }
  useQR(data: IUseQRRequest): Promise<IUseQRRespone> {
    return apiClient.client.put('/api/v1/User/UseQrCode', data, {
      cancelToken: this.source.token,
    });
  }
  getLoyaltyPoint(): Promise<any> {
    return apiClient.client.get('/api/v1/User/PointOfUser/TotalPoints', {
      cancelToken: this.source.token,
    });
  }
  followVendor(vendorIds: string[]): Promise<any> {
    const body = {
      vendorIds: arrayToString(vendorIds),
      isFollow: true,
    };
    return apiClient.client.post('/api/v1/User/UserFollowVendor', body, {
      cancelToken: this.source.token,
    });
  }
  unFollowVendor(vendorIds: string[]): Promise<any> {
    const body = {
      vendorIds: arrayToString(vendorIds),
      isFollow: false,
    };
    return apiClient.client.post('/api/v1/User/UserFollowVendor', body, {
      cancelToken: this.source.token,
    });
  }
  exchangeGift(data: IExchangeGiftRequest): Promise<any> {
    return apiClient.client.put('/api/v1/User/GiftExchange', data, {
      cancelToken: this.source.token,
    });
  }
  async logout(fcmToken?: string) {
    const accessToken = await Preferences.get({key: '_accessToken'});
    // const refreshToken = await Preferences.get({ key: "_refreshToken" });
    const body: ILogoutRequest = {
      token: accessToken.value || '',
      fcmToken,
    };
    return apiClient.client.put('api/v1/User/Logout', body, {
      cancelToken: this.source.token,
    });
  }
  getGiftsOfUser(type: number = 1, pageSize: number = 12, pageIndex: number = 1): Promise<any> {
    return apiClient.client.get(`/api/v1/User/Gift?type=${type}&pageSize=${pageSize}&pageIndex=${pageIndex}`, {
      cancelToken: this.source.token,
    });
  }
  getGiftOfUserDetail(id?: number | string): Promise<IUserGiftOfLoyalty> {
    return apiClient.client.get(`/api/v1/User/Gift/${id}`, {
      cancelToken: this.source.token,
    });
  }
  getLoyaltyProgram(pageSize: number = 12): Promise<any> {
    return apiClient.client.get(`/api/v1/LoyaltyProgram/Gift?pageSize=${pageSize}`, {
      cancelToken: this.source.token,
    });
  }
  getUserAppSetting(): Promise<IUserAppSetting> {
    return apiClient.client.get('/api/v1/User/Settings', {
      cancelToken: this.source.token,
    });
  }
  updateUserAppSetting(data: IUpdateUserAppSettingRequest): Promise<any> {
    return apiClient.client.put('/api/v1/User/UserSettings', data, {
      cancelToken: this.source.token,
    });
  }
  FortuneUserReward(fortuneId: number): Promise<IReward> {
    const body = {
      fortuneId: fortuneId,
    };
    return apiClient.client.post('/api/v1/User/FortuneUserReward', body, {
      cancelToken: this.source.token,
    });
  }
  getFortuneRewardHistory(
    fortuneId: number | string,
    pageSize = 100,
    pageIndex = 1
  ): Promise<IGetFortuneRewardHistoryResponse> {
    const query = {
      pageSize: pageSize,
      pageIndex: pageIndex,
    };
    return apiClient.client.get(`/api/v1/User/Fortune/${fortuneId}/FortuneUserReward?${queryString.stringify(query)}`, {
      cancelToken: this.source.token,
    });
  }
  getEarnPointHistory(pageSize = 12, pageIndex = 1): Promise<any> {
    const query = {
      pageSize: pageSize,
      pageIndex: pageIndex,
    };
    return apiClient.client.get(`api/v1/User/PointOfUser/Programs?${queryString.stringify(query)}`, {
      cancelToken: this.source.token,
    });
  }
  getEarnPointHistoryUsed(pageSize = 12, pageIndex = 1): Promise<any> {
    const query = {
      pageSize: pageSize,
      pageIndex: pageIndex,
    };
    return apiClient.client.get(`api/v1/User/PointOfUser/History?${queryString.stringify(query)}`, {
      cancelToken: this.source.token,
    });
  }
  getTotalPointsOfUserByVendor(): Promise<any> {
    return apiClient.client.get(`api/v1/User/Vendor/TotalPoints`, {
      cancelToken: this.source.token,
    });
  }
  getTotalGiftsOfUserByVendor(): Promise<any> {
    return apiClient.client.get(`api/v1/User/Vendor/TotalGifts`, {
      cancelToken: this.source.token,
    });
  }
  getRankOfUserByVendor(pageSize = 12, pageIndex = 1): Promise<IRankOfUserByVendor[]> {
    return apiClient.client.get(`api/v1/User/Vendor/Rank`, {
      cancelToken: this.source.token,
    });
  }
  getVendorOverview(): Promise<IVendorOfUser[]> {
    return apiClient.client.get(`api/v1/User/Vendor/Overview`, {
      cancelToken: this.source.token,
    });
  }
  getTotalPointAndGift(): Promise<IUserLoyalty> {
    return apiClient.client.get(`api/v1/User/TotalPoints/TotalGift`, {
      cancelToken: this.source.token,
    });
  }
  appToken(fcmToken: string, appId = '', enviroment = 0): Promise<any> {
    const body = {
      token: fcmToken,
      appId: appId,
      enviroment: enviroment,
    };
    return apiClient.client.post(`api/v1/User/AppToken`, body, {cancelToken: this.source.token});
  }
}

export const userAPIs = new User();
export default userAPIs;
