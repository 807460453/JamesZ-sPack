// import type { validator } from 'async-validator';
export interface Attrs {
    [key: string]: any;
}
export interface SubComp {
    key: string | number;
    label: string
    content: string
    [key: string]: any;
}
export interface Events {
    [key: string]: () => any;
}

export interface CmpInfo {
    style: any;
    cls: any;
    type: string;
    attrs?: Attrs;
    subComps?: Array<SubComp>
    events?: Events
    slotName?: string
}
export interface CmpItem {
    layout: any;
    before: any;
    after: any;
    vIf(vIf: any): unknown;
    vShow(vShow: any): unknown;
    formatter: any;
    key: string;
    prop: string;
    label: string;
    cmp: CmpInfo
}



export interface Rule {
    required?: boolean
    message?: string
    // validator?: validator
    validator?: (rule: Rule, value: any, callback: (e: any) => any) => void
}

export interface SubCompTypes {
    [key: string]: string
}

export interface Ctx {
    [key: string]: any
}

