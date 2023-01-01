export interface IBadge {
    text: number | string | undefined;
    className?: string
    style?: React.CSSProperties
    color?: string | undefined

}
export interface IIcon {
    className?: string
    style?: React.CSSProperties
}
export interface IButton {
    isIcon?: boolean;
    iconIon?: any
    isBadge?: boolean;
    ripperEffect?: boolean,
    
    className?: string
    style?: React.CSSProperties
    fill?: "solid" | "default" | "clear" | "outline" | undefined
}