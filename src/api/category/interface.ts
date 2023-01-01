import { ICategory, IListResponse } from "../../types/interface";

export interface IGetCategoriesRespone extends IListResponse{
    data?: ICategory[],
}