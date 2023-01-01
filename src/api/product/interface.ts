import {IAttributes, IListResponse, IProduct, IProductParent} from "../../types/interface";

export interface IGetProductsRespone extends IListResponse{
    data?: IProduct[];
}

export interface IGetProductDetailRespone {
    attributes?: IAttributes;
    product?: IProductParent;
}
