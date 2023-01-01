import axios from "axios";
import { ILoyaltyProgram } from "../../types/interface";
import apiClient from "../apiClient";
import { IGetLoyaltyProgramsRespone } from "./interface";

const queryString = require("query-string");

class LoyaltyProgram {
    readonly url: string;
    source;
    constructor() {
        this.url = `/api/v1/LoyaltyProgram`;
        this.source = axios.CancelToken.source();
    }
    getAllLoyaltyPrograms(
        pageSize = 10,
        pageIndex = 1
    ): Promise<IGetLoyaltyProgramsRespone> {
        const query = {
            pageSize: pageSize,
            pageIndex: pageIndex,
        };
        return apiClient.client.get(
            `${this.url}?${queryString.stringify(query)}`,
            { cancelToken: this.source.token }
        );
    }
    getLoyaltyProgramDetail(id: string): Promise<ILoyaltyProgram> {
        return apiClient.client.get(`${this.url}/${id}`, {
            cancelToken: this.source.token,
        });
    }
    cancelRequest() {
        return this.source.cancel("Vendor - canceled by the user.");
    }
}

const loyaltyProgramAPIs = new LoyaltyProgram();
export default loyaltyProgramAPIs;
