export const normalizeInput = (value: any) => {
    // return nothing if no value
    if (!value) return value;
    // only allows 0-9 inputs
    const currentValue = value.replace(/[^\d]/g, '');
    const cvLength = currentValue.length;
    if (value.length) {
        // returns: "x", "xx", "xxx"
        if (cvLength < 5) return currentValue;
        // returns: "(xxx)", "(xxx) x", "(xxx) xx", "(xxx) xxx",
        if (cvLength < 8) return `${currentValue.slice(0, 4)} ${currentValue.slice(4)}`;
        // returns: "(xxx) xxx-", (xxx) xxx-x", "(xxx) xxx-xx", "(xxx) xxx-xxx", "(xxx) xxx-xxxx"
        return `${currentValue.slice(0, 4)} ${currentValue.slice(4, 7)} ${currentValue.slice(7, value.length)}`;
    }
};

export function formatTextNoSpacing(value: string) {
    let text = value.replace(/\n/g, "");
    text = text.replaceAll(/\s/g, '');
    return text;
}

export const formatMoney = (x:number = 0) => {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}
