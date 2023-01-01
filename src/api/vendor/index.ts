import { IConfigRankOfVendor, IVendorWithLuckyWheelTurn } from './../../types/interface';
import axios from "axios";
import { IVendor } from "../../types/interface";
import apiClient from "../apiClient";

const queryString = require("query-string");

class Vendor {
    readonly url: string;
    source;
    constructor() {
        this.url = `/api/v1/Vendor`;
        this.source = axios.CancelToken.source();
    }
    getAll(pageSize = 10, pageIndex = 1): Promise<IVendor[]> {
        const query = {
            pageSize: pageSize,
            pageIndex: pageIndex,
        };
        return apiClient.client.get(
            `${this.url}?${queryString.stringify(query)}`,
            { cancelToken: this.source.token }
        );
    }
    getById(id: string | number): Promise<IVendor> {
        return apiClient.client.get(`${this.url}/${id}`, {
            cancelToken: this.source.token,
        });
    }
    getFollowingVendors(): Promise<IVendor[]> {
        return apiClient.client.get(`${this.url}/User/`, {
            cancelToken: this.source.token,
        });
    }
    searchVendor(value: string, isFollowing?: boolean): Promise<IVendor[]> {
        const query = {
            byUser: isFollowing,
        };
        return apiClient.client.get(
            `${this.url}/${value}?${queryString.stringify(query)}`,
            { cancelToken: this.source.token }
        );
    }
    getConfigRank(): Promise<IConfigRankOfVendor> {
        return apiClient.client.get(`${this.url}/ConfigRankOfVendor/`, {
            cancelToken: this.source.token,
        });
    }
    getLuckyWheelTurns(): Promise<IVendorWithLuckyWheelTurn[]> {
        return apiClient.client.get(`${this.url}/LuckyWheelTurns/`, {
            cancelToken: this.source.token,
        });
    }
    cancelRequest() {
        return this.source.cancel("Vendor - canceled by the user.");
    }
}

const vendorAPIs = new Vendor();
export default vendorAPIs;
