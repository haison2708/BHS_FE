import { AutocompleteTypes } from "@ionic/core"

export interface FieldType {
    value: string | number | null | undefined
    label?: string | number | null | undefined
    type: "text" | "password" | "email" | "number" | "search" | "tel" | "url"
    placeholder?: string
    isEye?: boolean
    icon?: any
    onChange?: Function
    autocomplete?: AutocompleteTypes
    FaIcon?: any

    error?: boolean
    messageError?: string
    isRequired?: boolean
    disabled?: boolean
}