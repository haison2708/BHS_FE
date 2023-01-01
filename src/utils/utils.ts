import {ILoyaltyType, IVendorOfUser} from './../types/interface';
import {userAPIs} from './../api/user/index';
import {listLoyaltyType, ProgramTypes} from './../constants/constants';
import {ILoyaltyProgram} from '../types/interface';
import {RootState, store} from '../app/store';
import {IUpdateUserAppSettingRequest} from '../api/user/interface';
import {Preferences} from '@capacitor/preferences';
import _ from 'lodash';
import authAPIs from '../api/auth';
import CryptoJS from 'crypto-js';

var passwordValidator = require('password-validator');

export const isFortune = (item: any): boolean => {
  return item.hasOwnProperty('fortuneDetails');
};

export const validatePasswordDeceprated = (password: string): boolean => {
  var schema = new passwordValidator();
  schema
    .is()
    .min(6) // Minimum length 8
    .is()
    .max(100) // Maximum length 100
    .has()
    .lowercase() // Must have lowercase letters
    .has()
    .digits(1); // Must have at least 2 digits

  return schema.validate(password);
};

export const updateAppSetting = async (
  vendorId?: number | string,
  langId?: string,
  isGetNotifications?: boolean,
  isFingerprintLogin?: boolean
) => {
  const appSetting = store.getState().user.appSetting;
  try {
    const body: IUpdateUserAppSettingRequest = {
      vendorId: vendorId || appSetting.vendorId,
      isGetNotifications: isGetNotifications || appSetting.isGetNotifications,
      isFingerprintLogin: isFingerprintLogin || appSetting.isFingerprintLogin,
      langId: langId || appSetting.langId,
    };
    const res = await userAPIs.updateUserAppSetting({
      ...appSetting,
      ...body,
    });
  } catch (e) {
    console.log('Error update user app setting: ', e);
  }
};

export const getChosenVendor = () => {
  const appSetting = store.getState().user.appSetting;
  const allVendors = store.getState().vendor.allVendors;
  return allVendors?.find((item) => {
    return item?.id == appSetting.vendorId;
  });
};

export const getLoyaltyType = (rank: string): ILoyaltyType | undefined => {
  return listLoyaltyType.find((item) => {
    return rank === item.rank;
  });
};

export const getRandomColor = () => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const getRandomNumber = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export const trimURLId = (url: string): string => {
  // Only work if 'id' is the last param (Ex: https://abc.com/User/id )
  return url.substring(url.lastIndexOf('/') + 1);
};

export const getRefreshToken = async () => {
  const token = await Preferences.get({key: '_refreshToken'});
  if (!_.isEmpty(token.value)) {
    return token.value;
  }
};

export const getAccessToken = async () => {
  const token = await Preferences.get({key: '_accessToken'});
  if (!_.isEmpty(token.value)) {
    return token.value;
  }
};

const secretKey = '/haison\\';

export const encodePassword = (password: string = '') => {
  const hashPassword = CryptoJS.AES.encrypt(JSON.stringify(password), secretKey).toString();
  return hashPassword;
};

export const decodePassword = (hashPassword: string = '') => {
  const bytes = CryptoJS.AES.decrypt(hashPassword, secretKey);
  const originPassword = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return originPassword;
};

export const getFingerprintFlag = async () => {
  const fingerprintFlag = await Preferences.get({key: '_fingerprintFlag'});
  return fingerprintFlag.value;
};

export const getInformationUserLogin = async () => {
  const username = await Preferences.get({key: '_username'});
  const password = await Preferences.get({key: '_password'});
  const data = {
    username: username.value,
    password: password.value ? decodePassword(password.value) : '',
  };
  return data;
};

export const refreshAppToken = async (refreshToken: string) => {
  try {
    const res = await authAPIs.refreshToken({
      client_id: 'ro.client',
      grant_type: 'refresh_token',
      client_secret: 'secret',
      refresh_token: refreshToken,
    });
    await Preferences.set({
      key: '_accessToken',
      value: res?.access_token || '',
    });
    await Preferences.set({
      key: '_refreshToken',
      value: res?.refresh_token || '',
    });
    return true;
  } catch (e) {
    console.log('Error refresh token: ', e);
    return false;
  }
};

export const getLangId = () => {
  const langId = store.getState().user.appSetting.langId;
  return langId || 'vi'}
