import { IFortune, IListResponse } from "../../types/interface";

export interface IGetAllFortuneResponse extends IListResponse{
    data?: IFortune[],
}