import { IGetNotificationsResponse } from './interface';
import axios from 'axios';
import apiClient from "../apiClient";
import { typeOfNotificationSetup } from '../../constants/constants';

const queryString = require('query-string');

class Notification {
    readonly url: string
    source
    constructor() {
        this.url = `/api/v1/Notify`;
        this.source = axios.CancelToken.source();
    }
    getAllNotifications(pageSize = 100, pageIndex = 1 ): Promise<IGetNotificationsResponse> {
        const query = {
            pageSize: pageSize,
            pageIndex: pageIndex
        }
        return apiClient.client.get(`${this.url}?${queryString.stringify(query)}`, { cancelToken: this.source.token })
    }
    getPromotionNotifications(pageSize = 20, pageIndex = 1 ): Promise<IGetNotificationsResponse> {
        const query = {
            type: typeOfNotificationSetup.promotionProgram,
            pageSize: pageSize,
            pageIndex: pageIndex
        }
        return apiClient.client.get(`${this.url}?${queryString.stringify(query)}`, { cancelToken: this.source.token })
    }
    getOtherNotifications(pageSize = 20, pageIndex = 1 ): Promise<IGetNotificationsResponse> {
        const query = {
            type: typeOfNotificationSetup.other,
            pageSize: pageSize,
            pageIndex: pageIndex
        }
        return apiClient.client.get(`${this.url}?${queryString.stringify(query)}`, { cancelToken: this.source.token })
    }
    getSystemNotifications(pageSize = 20, pageIndex = 1 ): Promise<IGetNotificationsResponse> {
        const query = {
            type: typeOfNotificationSetup.system,
            pageSize: pageSize,
            pageIndex: pageIndex
        }
        return apiClient.client.get(`${this.url}?${queryString.stringify(query)}`, { cancelToken: this.source.token })
    }
    cancelRequest() {
        return this.source.cancel('Notify - canceled by the user.');
    }
}


const notificationAPIs = new Notification();
export default notificationAPIs;