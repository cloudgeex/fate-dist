var FateMaterialComponent_1;
import { __decorate, __param } from "tslib";
import { Component, Input, HostBinding, HostListener, Optional, Self, ElementRef, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { defaultButtons } from '../fate-ui/fate-ui.component';
import { FateControllerService } from '../fate-controller.service';
import { FateParserService } from '../fate-parser.service';
import { FateIconService } from '../fate-icon.service';
import { FateMaterialIconService } from '../fate-material-icon.service';
import { Subject } from 'rxjs';
let instanceCounter = 0;
let FateMaterialComponent = FateMaterialComponent_1 = class FateMaterialComponent {
    constructor(controller, parser, icon, el, ngControl) {
        this.ngControl = ngControl;
        this.buttons = defaultButtons;
        this.id = `${this.uiId}`;
        this.clickOngoing = false;
        this.uiVisible = false;
        this._required = false;
        this._disabled = false;
        this.errorState = false;
        this.controlType = 'fate-material';
        this.describedBy = '';
        this.stateChanges = new Subject();
        this.focused = false;
        this.changed = new Array();
        this.uiId = 'material-' + (instanceCounter++);
        // Setting the value accessor directly (instead of using
        // the providers) to avoid running into a circular import.
        if (this.ngControl != null) {
            this.ngControl.valueAccessor = this;
        }
    }
    get value() {
        return this.passthrough;
    }
    set value(value) {
        this.stateChanges.next();
        this.passthrough = value;
        this.changed.forEach(f => f(value));
    }
    get placeholder() {
        return this._placeholder;
    }
    set placeholder(placeholder) {
        this._placeholder = placeholder;
        this.stateChanges.next();
    }
    blur() {
        this.focused = false;
        this.stateChanges.next();
        if (!this.clickOngoing) {
            this.uiVisible = false;
        }
    }
    focus() {
        this.focused = true;
        this.uiVisible = true;
        this.stateChanges.next();
    }
    mousedown(event) {
        this.clickOngoing = true;
    }
    mouseup(event) {
        this.clickOngoing = false;
    }
    get empty() {
        return !this.passthrough || this.passthrough === '';
    }
    get shouldLabelFloat() {
        return this.focused || !this.empty;
    }
    get required() {
        return this._required;
    }
    set required(req) {
        this._required = coerceBooleanProperty(req);
        this.stateChanges.next();
    }
    get disabled() {
        return this._disabled;
    }
    set disabled(dis) {
        this._disabled = coerceBooleanProperty(dis);
        this.stateChanges.next();
    }
    setDescribedByIds(ids) {
        this.describedBy = ids.join(' ');
    }
    onContainerClick(event) { }
    onChange(value) {
        this.passthrough = value;
        this.changed.forEach(f => f(value));
        this.stateChanges.next();
    }
    ngOnDestroy() {
        this.stateChanges.complete();
    }
    writeValue(value) {
        this.passthrough = value;
        this.stateChanges.next();
    }
    registerOnChange(fn) {
        this.changed.push(fn);
    }
    registerOnTouched(fn) { }
};
FateMaterialComponent.ctorParameters = () => [
    { type: FateControllerService },
    { type: FateParserService },
    { type: FateIconService },
    { type: ElementRef },
    { type: NgControl, decorators: [{ type: Optional }, { type: Self }] }
];
__decorate([
    Input()
], FateMaterialComponent.prototype, "row", void 0);
__decorate([
    Input()
], FateMaterialComponent.prototype, "buttons", void 0);
__decorate([
    Input()
], FateMaterialComponent.prototype, "value", null);
__decorate([
    Input()
], FateMaterialComponent.prototype, "placeholder", null);
__decorate([
    HostBinding()
], FateMaterialComponent.prototype, "id", void 0);
__decorate([
    HostListener('focusout')
], FateMaterialComponent.prototype, "blur", null);
__decorate([
    HostListener('focusin')
], FateMaterialComponent.prototype, "focus", null);
__decorate([
    HostListener('mousedown', ['$event'])
], FateMaterialComponent.prototype, "mousedown", null);
__decorate([
    HostListener('mouseup', ['$event'])
], FateMaterialComponent.prototype, "mouseup", null);
__decorate([
    Input()
], FateMaterialComponent.prototype, "required", null);
__decorate([
    Input()
], FateMaterialComponent.prototype, "disabled", null);
__decorate([
    HostBinding('attr.aria-describedby')
], FateMaterialComponent.prototype, "describedBy", void 0);
FateMaterialComponent = FateMaterialComponent_1 = __decorate([
    Component({
        selector: 'fate-material',
        template: "<fate-input customClass=\"\" [uiId]=\"uiId\" [row]=\"row\" [ngModel]=\"passthrough\" (ngModelChange)=\"onChange($event)\"></fate-input>\n<fate-ui class=\"mat-select-panel\" [uiId]=\"uiId\" [buttons]=\"buttons\" [ngClass]=\"{'visible': uiVisible}\"></fate-ui>\n",
        providers: [
            { provide: MatFormFieldControl, useExisting: FateMaterialComponent_1 },
            { provide: FateIconService, useClass: FateMaterialIconService }
        ],
        styles: [":host{display:block;position:relative}:host fate-ui{display:block;position:absolute;opacity:0;pointer-events:none;transition:opacity .3s;text-align:left;box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);background:#fff;z-index:1;transform:translateY(10px);max-width:100%;padding:0}:host fate-ui.visible{opacity:1;pointer-events:all}:host fate-ui ::ng-deep .fate-ui-button{height:40px;line-height:23px;padding:7px 0 11px;width:40px;border-radius:0;margin-right:-4px;margin-bottom:0;vertical-align:middle}:host fate-ui ::ng-deep .fate-ui-button.enabled,:host fate-ui ::ng-deep .fate-ui-button.with-dropdown,:host fate-ui ::ng-deep .fate-ui-button:active{background-color:#eee}:host fate-ui ::ng-deep .fate-ui-button:focus,:host fate-ui ::ng-deep .fate-ui-button:hover{background-color:#dfdfdf}:host fate-ui ::ng-deep .fate-ui-dropdown{background-color:#eee}:host fate-ui ::ng-deep .fate-ui-separator{height:36px;border-radius:0;width:1px;vertical-align:middle;background-color:#dfdfdf;margin:2px -4px 2px -1px}:host fate-input ::ng-deep div.fate-edit-target{border:none;background:0 0;color:inherit;padding:0;outline:0;font:inherit;resize:vertical;margin-bottom:0}:host fate-input ::ng-deep .fate-inline-dropdown{display:block;position:absolute;transition:opacity .3s;box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);background:#fff;z-index:2;padding:0}"]
    }),
    __param(4, Optional()), __param(4, Self())
], FateMaterialComponent);
export { FateMaterialComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmF0ZS1tYXRlcmlhbC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9mYXRlLWVkaXRvci8iLCJzb3VyY2VzIjpbImFwcC9mYXRlLW1hdGVyaWFsL2ZhdGUtbWF0ZXJpYWwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkgsT0FBTyxFQUFFLG9CQUFvQixFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ2pFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ25FLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRTlELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUM5RCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUNuRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUMzRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDdkQsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFFeEUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUUvQixJQUFJLGVBQWUsR0FBRyxDQUFDLENBQUM7QUFXeEIsSUFBYSxxQkFBcUIsNkJBQWxDLE1BQWEscUJBQXFCO0lBMkdoQyxZQUFZLFVBQWlDLEVBQUUsTUFBeUIsRUFBRSxJQUFxQixFQUFFLEVBQWMsRUFBNkIsU0FBb0I7UUFBcEIsY0FBUyxHQUFULFNBQVMsQ0FBVztRQXJHekosWUFBTyxHQUFrQixjQUFjLENBQUM7UUF5Qi9DLE9BQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxJ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RTt3REFHUDtBQVNEO0lBREMsV0FBVyxFQUFFO2lEQUNNO0FBR3BCO0lBREMsWUFBWSxDQUFDLFVBQVUsQ0FBQztpREFPeEI7QUFHRDtJQURDLFlBQVksQ0FBQyxTQUFTLENBQUM7a0RBS3ZCO0FBR0Q7SUFEQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7c0RBR3JDO0FBR0Q7SUFEQyxZQUFZLENBQUMsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7b0RBR25DO0FBYUQ7SUFEQyxLQUFLLEVBQUU7cURBR1A7QUFRRDtJQURDLEtBQUssRUFBRTtxREFHUDtBQVlEO0lBREMsV0FBVyxDQUFDLHVCQUF1QixDQUFDOzBEQUNwQjtBQTlGTixxQkFBcUI7SUFUakMsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLGVBQWU7UUFDekIsZ1JBQTZDO1FBRTdDLFNBQVMsRUFBRTtZQUNULEVBQUUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLFdBQVcsRUFBRSx1QkFBcUIsRUFBRTtZQUNwRSxFQUFFLE9BQU8sRUFBRSxlQUFlLEVBQUUsUUFBUSxFQUFFLHVCQUF1QixFQUFFO1NBQ2hFOztLQUNGLENBQUM7SUE0R2tILFdBQUEsUUFBUSxFQUFFLENBQUEsRUFBRSxXQUFBLElBQUksRUFBRSxDQUFBO0dBM0d6SCxxQkFBcUIsQ0F3SWpDO1NBeElZLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIEhvc3RCaW5kaW5nLCBIb3N0TGlzdGVuZXIsIE9wdGlvbmFsLCBTZWxmLCBFbGVtZW50UmVmLCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOZ0NvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBNYXRGb3JtRmllbGRDb250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZCc7XG5pbXBvcnQgeyBjb2VyY2VCb29sZWFuUHJvcGVydHkgfSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuXG5pbXBvcnQgeyBkZWZhdWx0QnV0dG9ucyB9IGZyb20gJy4uL2ZhdGUtdWkvZmF0ZS11aS5jb21wb25lbnQnO1xuaW1wb3J0IHsgRmF0ZUNvbnRyb2xsZXJTZXJ2aWNlIH0gZnJvbSAnLi4vZmF0ZS1jb250cm9sbGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgRmF0ZVBhcnNlclNlcnZpY2UgfSBmcm9tICcuLi9mYXRlLXBhcnNlci5zZXJ2aWNlJztcbmltcG9ydCB7IEZhdGVJY29uU2VydmljZSB9IGZyb20gJy4uL2ZhdGUtaWNvbi5zZXJ2aWNlJztcbmltcG9ydCB7IEZhdGVNYXRlcmlhbEljb25TZXJ2aWNlIH0gZnJvbSAnLi4vZmF0ZS1tYXRlcmlhbC1pY29uLnNlcnZpY2UnO1xuXG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbmxldCBpbnN0YW5jZUNvdW50ZXIgPSAwO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdmYXRlLW1hdGVyaWFsJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2ZhdGUtbWF0ZXJpYWwuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9mYXRlLW1hdGVyaWFsLmNvbXBvbmVudC5zY3NzJ10sXG4gIHByb3ZpZGVyczogW1xuICAgIHsgcHJvdmlkZTogTWF0Rm9ybUZpZWxkQ29udHJvbCwgdXNlRXhpc3Rpbmc6IEZhdGVNYXRlcmlhbENvbXBvbmVudCB9LFxuICAgIHsgcHJvdmlkZTogRmF0ZUljb25TZXJ2aWNlLCB1c2VDbGFzczogRmF0ZU1hdGVyaWFsSWNvblNlcnZpY2UgfVxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBGYXRlTWF0ZXJpYWxDb21wb25lbnQgaW1wbGVtZW50cyAgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE9uRGVzdHJveSwgTWF0Rm9ybUZpZWxkQ29udHJvbDxzdHJpbmc+ICB7XG5cbiAgQElucHV0KClcbiAgcm93OiBudW1iZXI7XG5cbiAgQElucHV0KClcbiAgcHVibGljIGJ1dHRvbnM6IEFycmF5PHN0cmluZz4gPSBkZWZhdWx0QnV0dG9ucztcblxuICBASW5wdXQoKVxuICBwdWJsaWMgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMucGFzc3Rocm91Z2g7XG4gIH1cbiAgcHVibGljIHNldCB2YWx1ZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgIHRoaXMucGFzc3Rocm91Z2ggPSB2YWx1ZTtcbiAgICB0aGlzLmNoYW5nZWQuZm9yRWFjaChmID0+IGYodmFsdWUpKTtcbiAgfVxuICBwdWJsaWMgcGFzc3Rocm91Z2g6IHN0cmluZztcblxuICBASW5wdXQoKVxuICBnZXQgcGxhY2Vob2xkZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3BsYWNlaG9sZGVyO1xuICB9XG4gIHNldCBwbGFjZWhvbGRlcihwbGFjZWhvbGRlcikge1xuICAgIHRoaXMuX3BsYWNlaG9sZGVyID0gcGxhY2Vob2xkZXI7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG4gIHByb3RlY3RlZCBfcGxhY2Vob2xkZXI6IHN0cmluZztcblxuICBwdWJsaWMgdWlJZDtcbiAgQEhvc3RCaW5kaW5nKClcbiAgaWQgPSBgJHt0aGlzLnVpSWR9YDtcblxuICBASG9zdExpc3RlbmVyKCdmb2N1c291dCcpXG4gIHB1YmxpYyBibHVyKCkge1xuICAgIHRoaXMuZm9jdXNlZCA9IGZhbHNlO1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICBpZiAoIXRoaXMuY2xpY2tPbmdvaW5nKcKge1xuICAgICAgdGhpcy51aVZpc2libGUgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdmb2N1c2luJylcbiAgcHVibGljIGZvY3VzKCkge1xuICAgIHRoaXMuZm9jdXNlZCA9IHRydWU7XG4gICAgdGhpcy51aVZpc2libGUgPSB0cnVlO1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlZG93bicsIFsnJGV2ZW50J10pXG4gIHB1YmxpYyBtb3VzZWRvd24gKGV2ZW50OiBhbnkpwqB7XG4gICAgdGhpcy5jbGlja09uZ29pbmcgPSB0cnVlO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignbW91c2V1cCcsIFsnJGV2ZW50J10pXG4gIHB1YmxpYyBtb3VzZXVwIChldmVudDogYW55KcKge1xuICAgIHRoaXMuY2xpY2tPbmdvaW5nID0gZmFsc2U7XG4gIH1cbiAgcHVibGljIGNsaWNrT25nb2luZyA9IGZhbHNlO1xuICBwdWJsaWMgdWlWaXNpYmxlID0gZmFsc2U7XG5cbiAgZ2V0IGVtcHR5KCkge1xuICAgIHJldHVybiAhdGhpcy5wYXNzdGhyb3VnaCB8fCB0aGlzLnBhc3N0aHJvdWdoID09PSAnJztcbiAgfVxuXG4gIGdldCBzaG91bGRMYWJlbEZsb2F0KCkge1xuICAgIHJldHVybiB0aGlzLmZvY3VzZWQgfHwgIXRoaXMuZW1wdHk7XG4gIH1cblxuICBASW5wdXQoKVxuICBnZXQgcmVxdWlyZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JlcXVpcmVkO1xuICB9XG4gIHNldCByZXF1aXJlZChyZXEpIHtcbiAgICB0aGlzLl9yZXF1aXJlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eShyZXEpO1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuICBwcm90ZWN0ZWQgX3JlcXVpcmVkID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVkKCkge1xuICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZDtcbiAgfVxuICBzZXQgZGlzYWJsZWQoZGlzKSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkoZGlzKTtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cbiAgcHJvdGVjdGVkIF9kaXNhYmxlZCA9IGZhbHNlO1xuXG4gIHB1YmxpYyBlcnJvclN0YXRlID0gZmFsc2U7XG5cbiAgcHVibGljIGNvbnRyb2xUeXBlID0gJ2ZhdGUtbWF0ZXJpYWwnO1xuXG4gIEBIb3N0QmluZGluZygnYXR0ci5hcmlhLWRlc2NyaWJlZGJ5JylcbiAgZGVzY3JpYmVkQnkgPSAnJztcblxuICBwdWJsaWMgc2V0RGVzY3JpYmVkQnlJZHMoaWRzOiBzdHJpbmdbXSkge1xuICAgIHRoaXMuZGVzY3JpYmVkQnkgPSBpZHMuam9pbignICcpO1xuICB9XG5cbiAgcHVibGljIG9uQ29udGFpbmVyQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpIHt9XG5cbiAgcHVibGljIHN0YXRlQ2hhbmdlcyA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gIHB1YmxpYyBmb2N1c2VkID0gZmFsc2U7XG5cbiAgcHJvdGVjdGVkIGNoYW5nZWQgPSBuZXcgQXJyYXk8KHZhbHVlOiBzdHJpbmcpID0+IHZvaWQ+KCk7XG5cbiAgY29uc3RydWN0b3IoY29udHJvbGxlcjogRmF0ZUNvbnRyb2xsZXJTZXJ2aWNlLCBwYXJzZXI6IEZhdGVQYXJzZXJTZXJ2aWNlLCBpY29uOiBGYXRlSWNvblNlcnZpY2UsIGVsOiBFbGVtZW50UmVmLCBAT3B0aW9uYWwoKSBAU2VsZigpIHB1YmxpYyBuZ0NvbnRyb2w6IE5nQ29udHJvbCkge1xuICAgIHRoaXMudWlJZCA9ICdtYXRlcmlhbC0nICsgKGluc3RhbmNlQ291bnRlcisrKTtcbiAgICAvLyBTZXR0aW5nIHRoZSB2YWx1ZSBhY2Nlc3NvciBkaXJlY3RseSAoaW5zdGVhZCBvZiB1c2luZ1xuICAgIC8vIHRoZSBwcm92aWRlcnMpIHRvIGF2b2lkIHJ1bm5pbmcgaW50byBhIGNpcmN1bGFyIGltcG9ydC5cbiAgICBpZiAodGhpcy5uZ0NvbnRyb2wgIT0gbnVsbCkge1xuICAgICAgdGhpcy5uZ0NvbnRyb2wudmFsdWVBY2Nlc3NvciA9IHRoaXM7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uQ2hhbmdlKHZhbHVlKSB7XG4gICAgdGhpcy5wYXNzdGhyb3VnaCA9IHZhbHVlO1xuICAgIHRoaXMuY2hhbmdlZC5mb3JFYWNoKGYgPT4gZih2YWx1ZSkpO1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuXG4gIHB1YmxpYyBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5jb21wbGV0ZSgpO1xuICB9XG5cbiAgcHVibGljIHdyaXRlVmFsdWUodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMucGFzc3Rocm91Z2ggPSB2YWx1ZTtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBzdHJpbmcpID0+IHZvaWQpIHtcbiAgICB0aGlzLmNoYW5nZWQucHVzaChmbik7XG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IHZvaWQpIHt9XG59XG4iXX0=