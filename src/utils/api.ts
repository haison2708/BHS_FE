export const objToURLParam = <TObject extends Record<string, string>>(obj: TObject) => {
    return new URLSearchParams({ ...obj });
}