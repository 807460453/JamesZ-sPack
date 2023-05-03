// import type { validator } from 'async-validator';
interface Attrs {
    [key: string]: any;
}
interface SubComp {
    key: string | number;
    label: string
    content: string
    [key: string]: any;
}
interface Events {
    [key: string]: () => any;
}

interface CmpInfo {
    style: any;
    cls: any;
    type: string;
    attrs?: Attrs;
    subComps?: Array<SubComp>
    events?: Events
    slotName?: string
}
interface CmpItem {
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



interface Rule {
    required?: boolean
    message?: string
    // validator?: validator
    validator?: (rule: Rule, value: any, callback: (e: any) => any) => void
}

interface SubCompTypes {
    [key: string]: string
}

interface Ctx {
    [key: string]: any
}