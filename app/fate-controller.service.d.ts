import { Subject } from 'rxjs';
import { FateType } from './fate-type.enum';
import { FateLinkDropdownComponent } from './fate-link-dropdown/fate-link-dropdown.component';
export interface FateCommand {
    name: string;
    value: any;
}
export declare class FateControllerService {
    protected actionMapping: {
        bold: {
            command: string;
            name: string;
            detect: FateType;
        };
        italic: {
            command: string;
            name: string;
            detect: FateType;
        };
        underline: {
            command: string;
            name: string;
            detect: FateType;
        };
        strike: {
            command: string;
            name: string;
            detect: FateType;
        };
        subscript: {
            command: string;
            name: string;
            label: string;
            detect: FateType;
        };
        superscript: {
            command: string;
            name: string;
            label: string;
            detect: FateType;
        };
        heading1: {
            command: string;
            value: string;
            name: string;
            label: string;
            detect: FateType;
        };
        heading2: {
            command: string;
            value: string;
            name: string;
            label: string;
            detect: FateType;
        };
        heading3: {
            command: string;
            value: string;
            name: string;
            label: string;
            detect: FateType;
        };
        heading4: {
            command: string;
            value: string;
            name: string;
            label: string;
            detect: FateType;
        };
        heading5: {
            command: string;
            value: string;
            name: string;
            label: string;
            detect: FateType;
        };
        heading6: {
            command: string;
            value: string;
            name: string;
            label: string;
            detect: FateType;
        };
        normal: {
            command: string;
            value: string;
            name: string;
            label: string;
        };
        indent: {
            command: string;
            name: string;
        };
        outdent: {
            command: string;
            name: string;
        };
        ordered: {
            command: string;
            name: string;
            detect: FateType;
        };
        unordered: {
            command: string;
            name: string;
            detect: FateType;
        };
        center: {
            command: string;
            name: string;
            detect: FateType;
        };
        justify: {
            command: string;
            name: string;
            detect: FateType;
        };
        left: {
            command: string;
            name: string;
            detect: FateType;
        };
        right: {
            command: string;
            name: string;
            detect: FateType;
        };
        undo: {
            command: string;
            name: string;
        };
        redo: {
            command: string;
            name: string;
        };
        clean: {
            command: string;
            name: string;
        };
        link: {
            command: string;
            undo: string;
            name: string;
            detect: FateType;
            dropdown: typeof FateLinkDropdownComponent;
        };
    };
    registerAction(name: string, action: any): void;
    getAction(actionName: any): boolean | any;
    protected inlineActionMapping: any;
    registerInlineAction(name: string, action: any): void;
    getInlineAction(context: string): boolean | any;
    protected commandsPipe: {
        default: Subject<FateCommand>;
    };
    protected enabledActions: {
        default: Subject<any>;
    };
    constructor();
    channel(channelId: any): any;
    enabled(channelId: any): any;
    enableActions(channelId: any, nodes: any): void;
    do(channel: any, action: any, value?: any): void;
    doInline(channel: any, action: any, value?: any): void;
    undo(channel: any, action: any, value?: any): void;
}
