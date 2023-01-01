import { IGetCategoriesRespone } from './interface';
import axios from 'axios';
import apiClient from "../apiClient";

const queryString = require('query-string');

class Category {
    readonly url: string
    source
    constructor() {
        this.url = `/api/v1/Category`;
        this.source = axios.CancelToken.source();
    }
    getAll(pageSize = 10, pageIndex = 1 ): Promise<IGetCategoriesRespone> {
        const query = {
            pageSize: pageSize,
            pageIndex: pageIndex
        }
        return apiClient.client.get(`${this.url}?${queryString.stringify(query)}`, { cancelToken: this.source.token })
    }
    cancelRequest() {
        return this.source.cancel('Vendor - canceled by the user.');
    }
}


const categoryAPIs = new Category();
export default categoryAPIs;