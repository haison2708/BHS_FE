import { IListResponse, INotificationData, INotificationMessage } from "../../types/interface";

export interface IGetNotificationsResponse extends IListResponse{
    data?: INotificationData[],
}