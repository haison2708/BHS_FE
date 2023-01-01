import { v4 as uuidv4 } from 'uuid';

export interface choiceLocation {
    id: any;
    title: string;
    code: string;
    value: string;
    srcImageTitle: string;
}
export const CountryCode: choiceLocation[] = [{
    id: uuidv4(),
    title: "vietnam",
    code: "mk",
    value: "+84",
    srcImageTitle: "https://cdn-icons-png.flaticon.com/512/206/206632.png",
}]