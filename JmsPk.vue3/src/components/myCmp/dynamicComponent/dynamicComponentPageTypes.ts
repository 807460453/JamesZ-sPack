// import type { validator } from 'async-validator';
export interface Attrs {
    [key: string]: any;
}

export interface CmpData {
    is: string | any;
    tagType: string;
    modelValue?:any;
    attrs?:Attrs;
    content?:string;
    slots?: Slots;
}


export interface Slots {
    [key: string]: CmpData[];
}


