import {Preferences} from '@capacitor/preferences';
import axios from 'axios';
import * as _ from 'lodash';
import queryString from 'query-string';
import { store } from '../app/store';
import {AUTH_URL, BASE_URL} from '../env';
import {RequestContentType} from '../types/interface';

const axiosClient = () => {
  const getToken = async () => {
    const token = await Preferences.get({key: '_accessToken'});
    if (!_.isEmpty(token.value)) {
      return token.value;
    }
    return false;
  };

  const getLangId = () => {
    return store.getState().user.appSetting?.langId
  }

  const axiosClient = (url: string, requestContentType: RequestContentType = 'application/json') => {
    const axiosClient = axios.create({
      baseURL: url,
      paramsSerializer: (params) => queryString.stringify({params}),
    });
    axiosClient.interceptors.request.use(async (config) => {
      const headers: Record<string, string> = {
        Accept: 'application/json',
        'Content-Type': requestContentType,
        mode: 'no-cors',
        timeZone: 'SE Asia Standard Time',
        langId: getLangId() || 'vi'
      };
      const token = await getToken();
      if (token) headers.Authorization = `Bearer ${token}`;
      return {
        ...config,
        headers: {
          ...headers,
        },
      };
    });
    axiosClient.interceptors.response.use(
      (response) => {
        if (response && response.data) return response.data;
        return response;
      },
      (err) => {
        if (!err.response) {
          return alert(err);
        }
        throw err.response;
      }
    );
    return axiosClient;
  };
  return axiosClient;
};
const _axiosClient = axiosClient();
export default {
  auth: _axiosClient(AUTH_URL || ''),
  authFormReq: _axiosClient(AUTH_URL || '', 'application/x-www-form-urlencoded'),
  client: _axiosClient(BASE_URL || ''),
  clientFormReq: _axiosClient(BASE_URL || '', 'application/x-www-form-urlencoded'),
};
