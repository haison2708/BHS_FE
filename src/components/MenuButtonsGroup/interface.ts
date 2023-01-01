import { IButton, IIcon } from "../CustomButton/interface";

export interface IMenuButton extends IButton{
    leftIcon ?: IIcon;
    rightIcon?: IIcon;
    rightItem?: any;
    title?: string;
}