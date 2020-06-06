import { FateType } from './fate-type.enum';
export declare class FateNode {
    type: FateType;
    value?: any;
    constructor(type?: FateType, value?: any);
    children: Array<FateNode | string>;
}
