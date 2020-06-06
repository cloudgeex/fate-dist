import { FateNode } from './fate-node';
export declare class FateHtmlParserService {
    constructor();
    parse(html: string): FateNode;
    parseElement(element: HTMLElement): FateNode;
    findParentNodes(node: Node, until: Node): Array<FateNode>;
    protected getAdditonalStyle(element: HTMLElement): Array<FateNode>;
    protected parseType(element: HTMLElement): Array<FateNode>;
    protected parseValue(element: HTMLElement): any;
    protected serializeType(node: FateNode): string;
    protected isLinebreak(child: Node): boolean;
    serialize(node: FateNode, fallbackToBr?: boolean): string;
}
