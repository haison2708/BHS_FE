export interface IButton {
    onClick?: React.MouseEventHandler<HTMLIonButtonElement> | undefined

    size?: "small" | "default" | "large" | undefined
    slot?: "end" | "icon-only" | "start" | undefined
    className?: string
    border?: "4px" | "8px" | "12px" | "16px" | "Circle" | undefined
    isBackgroundTransparent?: boolean
    id?: string
    fill?: "solid" | "default" | "clear" | "outline" | undefined
    shape?: "round" | undefined
    color?: string
    style?: React.CSSProperties
}
export interface IIcon {
    size?: "small" | "default" | "large" | undefined
    slot?: "end" | "icon-only" | "start" | undefined
    className?: string
    icon?: any
    color?: string | undefined
    style?: React.CSSProperties
}