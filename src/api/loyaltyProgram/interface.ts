import { IListResponse, IVendorOfUser } from "./../../types/interface";

export interface IGetLoyaltyProgramsRespone extends IListResponse {
    data: IVendorOfUser[];
}
