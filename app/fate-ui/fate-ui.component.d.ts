import { ElementRef, OnChanges, AfterViewInit, ComponentFactoryResolver, ViewContainerRef, ViewRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { FateControllerService } from '../fate-controller.service';
import { FateParserService } from '../fate-parser.service';
import { FateIconService } from '../fate-icon.service';
export declare const defaultButtons: string[];
export declare class FateUiComponent implements OnChanges, AfterViewInit {
    protected el: ElementRef;
    controller: FateControllerService;
    icon: FateIconService;
    protected parser: FateParserService;
    protected factoryResolver: ComponentFactoryResolver;
    uiId: string;
    buttons: Array<string>;
    enabled: any;
    dropdownAction: boolean | string;
    dropdownValue: string;
    protected dropdownComponent: ViewRef;
    protected inputSubscription: Subscription;
    constructor(el: ElementRef, controller: FateControllerService, icon: FateIconService, parser: FateParserService, factoryResolver: ComponentFactoryResolver);
    mouseDown(event: any): void;
    keyUp(event: any): void;
    viewContainerRef: ViewContainerRef;
    do(event: any, action: any): void;
    protected getOffset(element: any): {
        top: number;
        left: number;
    };
    protected initDropdown(actionComponent: any, value: any): void;
    ngOnChanges(changes: any): void;
    ngAfterViewInit(): void;
}
