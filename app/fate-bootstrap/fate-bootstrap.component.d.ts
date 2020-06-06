import { ElementRef, ComponentFactoryResolver } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { FateControllerService } from '../fate-controller.service';
import { FateParserService } from '../fate-parser.service';
import { FateIconService } from '../fate-icon.service';
export declare class FateBootstrapComponent implements ControlValueAccessor {
    row: number;
    placeholder: string;
    buttons: Array<string>;
    protected changed: ((value: string) => void)[];
    protected clickOngoing: boolean;
    passthrough: string;
    uiId: any;
    uiVisible: any;
    blur(event: any): void;
    mousedown(event: any): void;
    mouseup(event: any): void;
    focus(event: any): void;
    constructor(el: ElementRef, controller: FateControllerService, parser: FateParserService, icon: FateIconService, factoryResolver: ComponentFactoryResolver);
    writeValue(value: string): void;
    registerOnChange(fn: (value: string) => void): void;
    registerOnTouched(fn: () => void): void;
    onChange(value: any): void;
}
