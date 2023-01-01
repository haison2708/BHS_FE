export interface FieldType {
    label?: any
    content?: any

    value: string | number | null | undefined
    type: "text" | "password" | "email" | "number" | "search" | "tel" | "url"
    placeholder?: string
    onChange?: Function
    ripperEffect?: boolean,
    disabled?: boolean,

    error?: boolean
    messageError?: string
}