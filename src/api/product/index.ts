import { IGetProductDetailRespone, IGetProductsRespone } from "./interface";
import axios from "axios";
import apiClient from "../apiClient";

const queryString = require("query-string");

class Product {
    readonly url: string;
    source;
    constructor() {
        this.url = `/api/v1/Product`;
        this.source = axios.CancelToken.source();
    }
    getProductsByVendor(
        vendorId: string,
        pageSize = 10,
        pageIndex = 1
    ): Promise<IGetProductsRespone> {
        const query = {
            pageSize: pageSize,
            pageIndex: pageIndex,
        };
        return apiClient.client.get(
            `${this.url}/Vendor/${vendorId}/?${queryString.stringify(query)}`,
            { cancelToken: this.source.token }
        );
    }
    getAllPromotionProducts(): Promise<IGetProductsRespone> {
        const query = {
            promoFlag: true,
        };
        return apiClient.client.get(
            `${this.url}/Promotion?${queryString.stringify(query)}`,
            { cancelToken: this.source.token }
        );
    }
    getPromotionProducts(
        pageSize?: number,
        pageIndex?: number
    ): Promise<IGetProductsRespone> {
        const query = {
            promoFlag: true,
            pageSize: pageSize,
            pageIndex: pageIndex,
        };
        return apiClient.client.get(
            `${this.url}/Promotion?${queryString.stringify(query)}`,
            { cancelToken: this.source.token }
        );
    }
    getSuggestProducts(
        pageSize?: number,
        pageIndex?: number
    ): Promise<IGetProductsRespone> {
        const query = {
            pageSize: pageSize,
            pageIndex: pageIndex,
        };
        return apiClient.client.get(
            `${this.url}/false?${queryString.stringify(query)}`,
            { cancelToken: this.source.token }
        );
    }
    getViewedProducts(
        pageSize?: number,
        pageIndex?: number
    ): Promise<IGetProductsRespone> {
        const query = {
            pageSize: pageSize,
            pageIndex: pageIndex,
        };
        return apiClient.client.get(
            `${this.url}/true?${queryString.stringify(query)}`,
            { cancelToken: this.source.token }
        );
    }
    getProductDetail(idProduct: string): Promise<IGetProductDetailRespone> {
        return apiClient.client.get(`${this.url}/${idProduct}`);
    }
    getProductsByCategory(
        categoryId: number | string,
        pageSize?: number,
        pageIndex?: number
    ): Promise<IGetProductsRespone> {
        const query = {
            pageSize: pageSize,
            pageIndex: pageIndex,
        };
        return apiClient.client.get(
            `${this.url}/Category/${categoryId}?${queryString.stringify(
                query
            )}`,
            { cancelToken: this.source.token }
        );
    }
    cancelRequest() {
        return this.source.cancel("Vendor - canceled by the user.");
    }
}

const productAPIs = new Product();
export default productAPIs;
