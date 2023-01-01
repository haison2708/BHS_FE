import axios from 'axios';
import { IFortune } from '../../types/interface';
import apiClient from "../apiClient";
import { IGetAllFortuneResponse } from './interface';

const queryString = require('query-string');

class Fortune {
    readonly url: string
    source
    constructor() {
        this.url = `/api/v1/Fortune`;
        this.source = axios.CancelToken.source();
    }
    getListFortune(vendorId?: number, pageSize = 1000, pageIndex = 1 ): Promise<IGetAllFortuneResponse> {
        const query = {
            vendorId: vendorId,
            pageSize: pageSize,
            pageIndex: pageIndex
        }
        return apiClient.client.get(`${this.url}?${queryString.stringify(query)}`, { cancelToken: this.source.token })
    }
    getFortuneDetail(fortuneId : number | string): Promise<IFortune> {
        return apiClient.client.get(`${this.url}/${fortuneId}`, { cancelToken: this.source.token })
    }
    cancelRequest() {
        return this.source.cancel('Fortune - canceled by the user.');
    }
}


const fortuneAPIs = new Fortune();
export default fortuneAPIs;