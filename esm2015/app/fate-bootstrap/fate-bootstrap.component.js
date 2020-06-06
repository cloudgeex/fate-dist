var FateBootstrapComponent_1;
import { __decorate } from "tslib";
import { Component, Input, ElementRef, HostListener, ComponentFactoryResolver } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { defaultButtons } from '../fate-ui/fate-ui.component';
import { FateControllerService } from '../fate-controller.service';
import { FateParserService } from '../fate-parser.service';
import { FateIconService } from '../fate-icon.service';
let instanceCounter = 0;
let FateBootstrapComponent = FateBootstrapComponent_1 = class FateBootstrapComponent {
    constructor(el, controller, parser, icon, factoryResolver) {
        this.buttons = defaultButtons;
        // implentation of ControlValueAccessor:
        this.changed = new Array();
        this.clickOngoing = false;
        this.uiId = 'bootstrap-' + (instanceCounter++);
    }
    blur(event) {
        if (!this.clickOngoing) {
            this.uiVisible = false;
        }
    }
    mousedown(event) {
        this.clickOngoing = true;
    }
    mouseup(event) {
        this.clickOngoing = false;
    }
    focus(event) {
        this.uiVisible = true;
        console.info('boostrap focus!');
    }
    writeValue(value) {
        this.passthrough = value;
    }
    registerOnChange(fn) {
        this.changed.push(fn);
    }
    registerOnTouched(fn) { }
    // change callback
    onChange(value) {
        this.passthrough = value;
        this.changed.forEach(f => f(value));
    }
};
FateBootstrapComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: FateControllerService },
    { type: FateParserService },
    { type: FateIconService },
    { type: ComponentFactoryResolver }
];
__decorate([
    Input()
], FateBootstrapComponent.prototype, "row", void 0);
__decorate([
    Input()
], FateBootstrapComponent.prototype, "placeholder", void 0);
__decorate([
    Input()
], FateBootstrapComponent.prototype, "buttons", void 0);
__decorate([
    HostListener('focusout', ['$event'])
], FateBootstrapComponent.prototype, "blur", null);
__decorate([
    HostListener('mousedown', ['$event'])
], FateBootstrapComponent.prototype, "mousedown", null);
__decorate([
    HostListener('mouseup', ['$event'])
], FateBootstrapComponent.prototype, "mouseup", null);
__decorate([
    HostListener('focusin', ['$event'])
], FateBootstrapComponent.prototype, "focus", null);
FateBootstrapComponent = FateBootstrapComponent_1 = __decorate([
    Component({
        selector: 'fate-bootstrap',
        template: "<fate-input customClass=\"form-control\" [uiId]=\"uiId\" [row]=\"row\" [placeholder]=\"placeholder\" [ngModel]=\"passthrough\" (ngModelChange)=\"onChange($event)\"></fate-input>\n<fate-ui [uiId]=\"uiId\" [buttons]=\"buttons\" [ngClass]=\"{'visible': uiVisible}\" class=\"tooltip tooltip-inner\"></fate-ui>\n",
        providers: [
            { provide: NG_VALUE_ACCESSOR, useExisting: FateBootstrapComponent_1, multi: true }
        ],
        styles: [":host{margin-bottom:10px;display:block;position:relative}:host fate-ui{display:block;position:absolute;opacity:0;pointer-events:none;transition:opacity .3s;text-align:left;background:#222;color:#eee;max-width:100%}:host fate-ui.visible{opacity:1;pointer-events:all}:host fate-ui ::ng-deep .fate-ui-button{color:#eee}:host fate-ui ::ng-deep .fate-ui-button.enabled,:host fate-ui ::ng-deep .fate-ui-button.with-dropdown,:host fate-ui ::ng-deep .fate-ui-button:active{background-color:#555}:host fate-ui ::ng-deep .fate-ui-button:focus,:host fate-ui ::ng-deep .fate-ui-button:hover{background-color:#666}:host fate-ui ::ng-deep .fate-ui-separator{background-color:#666!important}:host fate-ui ::ng-deep .fate-ui-dropdown{background-color:#555;border-color:#666}:host fate-input ::ng-deep .fate-edit-target{resize:vertical;padding:.375rem .75rem}:host fate-input ::ng-deep .fate-inline-dropdown{display:block;transition:opacity .3s;background:#222;color:#eee;border-radius:.25rem;z-index:1080}"]
    })
], FateBootstrapComponent);
export { FateBootstrapComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmF0ZS1ib290c3RyYXAuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vZmF0ZS1lZGl0b3IvIiwic291cmNlcyI6WyJhcHAvZmF0ZS1ib290c3RyYXAvZmF0ZS1ib290c3RyYXAuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSx3QkFBd0IsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNyRyxPQUFPLEVBQUUsaUJBQWlCLEVBQXdCLE1BQU0sZ0JBQWdCLENBQUM7QUFFekUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQzlELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ25FLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQzNELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUV2RCxJQUFJLGVBQWUsR0FBRyxDQUFDLENBQUM7QUFVeEIsSUFBYSxzQkFBc0IsOEJBQW5DLE1BQWEsc0JBQXNCO0lBMkNqQyxZQUFZLEVBQWMsRUFBRSxVQUFpQyxFQUFFLE1BQXlCLEVBQUUsSUFBcUIsRUFBRSxlQUF5QztRQWxDbkosWUFBTyxHQUFrQixjQUFjLENBQUM7UUFFL0Msd0NBQXdDO1FBQzlCLFlBQU8sR0FBRyxJQUFJLEtBQUssRUFBMkIsQ0FBQztRQUMvQyxpQkFBWSxHQUFZLEtBQUssQ0FBQztRQStCdEMsSUFBSSxDQUFDLElBQUksR0FBRyxZQUFZLEdBQUcsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUF4Qk0sSUFBSSxDQUFFLEtBQVU7UUFDckIsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDdEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7U0FDeEI7SUFDSCxDQUFDO0lBR00sU0FBUyxDQUFFLEtBQVU7UUFDMUIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7SUFDM0IsQ0FBQztJQUdNLE9BQU8sQ0FBRSxLQUFVO1FBQ3hCLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO0lBQzVCLENBQUM7SUFHTSxLQUFLLENBQUUsS0FBVTtRQUN0QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUN0QixPQUFPLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUE7SUFDakMsQ0FBQztJQU1NLFVBQVUsQ0FBQyxLQUFhO1FBQzdCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0lBQzNCLENBQUM7SUFFTSxnQkFBZ0IsQ0FBQyxFQUEyQjtRQUNqRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN4QixDQUFDO0lBRU0saUJBQWlCLENBQUMsRUFBYyxJQUFHLENBQUM7SUFFM0Msa0JBQWtCO0lBQ1gsUUFBUSxDQUFDLEtBQUs7UUFDbkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7UUFDekIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN0QyxDQUFDO0NBQ0YsQ0FBQTs7WUFuQmlCLFVBQVU7WUFBYyxxQkFBcUI7WUFBVSxpQkFBaUI7WUFBUSxlQUFlO1lBQW1CLHdCQUF3Qjs7QUF4QzFKO0lBREMsS0FBSyxFQUFFO21EQUNJO0FBR1o7SUFEQyxLQUFLLEVBQUU7MkRBQ1k7QUFHcEI7SUFEQyxLQUFLLEVBQUU7dURBQ3VDO0FBWS9DO0lBREMsWUFBWSxDQUFDLFVBQVUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2tEQUtwQztBQUdEO0lBREMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDO3VEQUdyQztBQUdEO0lBREMsWUFBWSxDQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDO3FEQUduQztBQUdEO0lBREMsWUFBWSxDQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDO21EQUluQztBQXpDVSxzQkFBc0I7SUFSbEMsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLGdCQUFnQjtRQUMxQiwrVEFBOEM7UUFFOUMsU0FBUyxFQUFFO1lBQ1QsRUFBQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsV0FBVyxFQUFFLHdCQUFzQixFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUM7U0FDL0U7O0tBQ0YsQ0FBQztHQUNXLHNCQUFzQixDQThEbEM7U0E5RFksc0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgRWxlbWVudFJlZiwgSG9zdExpc3RlbmVyLCBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5HX1ZBTFVFX0FDQ0VTU09SLCBDb250cm9sVmFsdWVBY2Nlc3NvciB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHsgZGVmYXVsdEJ1dHRvbnMgfSBmcm9tICcuLi9mYXRlLXVpL2ZhdGUtdWkuY29tcG9uZW50JztcbmltcG9ydCB7IEZhdGVDb250cm9sbGVyU2VydmljZSB9IGZyb20gJy4uL2ZhdGUtY29udHJvbGxlci5zZXJ2aWNlJztcbmltcG9ydCB7IEZhdGVQYXJzZXJTZXJ2aWNlIH0gZnJvbSAnLi4vZmF0ZS1wYXJzZXIuc2VydmljZSc7XG5pbXBvcnQgeyBGYXRlSWNvblNlcnZpY2UgfSBmcm9tICcuLi9mYXRlLWljb24uc2VydmljZSc7XG5cbmxldCBpbnN0YW5jZUNvdW50ZXIgPSAwO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdmYXRlLWJvb3RzdHJhcCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9mYXRlLWJvb3RzdHJhcC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2ZhdGUtYm9vdHN0cmFwLmNvbXBvbmVudC5zY3NzJ10sXG4gIHByb3ZpZGVyczogW1xuICAgIHtwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUiwgdXNlRXhpc3Rpbmc6IEZhdGVCb290c3RyYXBDb21wb25lbnQsIG11bHRpOiB0cnVlfVxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBGYXRlQm9vdHN0cmFwQ29tcG9uZW50IGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuXG4gIEBJbnB1dCgpXG4gIHJvdzogbnVtYmVyO1xuXG4gIEBJbnB1dCgpXG4gIHBsYWNlaG9sZGVyOiBzdHJpbmc7XG5cbiAgQElucHV0KClcbiAgcHVibGljIGJ1dHRvbnM6IEFycmF5PHN0cmluZz4gPSBkZWZhdWx0QnV0dG9ucztcblxuICAvLyBpbXBsZW50YXRpb24gb2YgQ29udHJvbFZhbHVlQWNjZXNzb3I6XG4gIHByb3RlY3RlZCBjaGFuZ2VkID0gbmV3IEFycmF5PCh2YWx1ZTogc3RyaW5nKSA9PiB2b2lkPigpO1xuICBwcm90ZWN0ZWQgY2xpY2tPbmdvaW5nOiBib29sZWFuID0gZmFsc2U7XG5cbiAgcHVibGljIHBhc3N0aHJvdWdoOiBzdHJpbmc7XG4gIHB1YmxpYyB1aUlkO1xuICBwdWJsaWMgdWlWaXNpYmxlO1xuXG5cbiAgQEhvc3RMaXN0ZW5lcignZm9jdXNvdXQnLCBbJyRldmVudCddKVxuICBwdWJsaWMgYmx1ciAoZXZlbnQ6IGFueSnCoHtcbiAgICBpZiAoIXRoaXMuY2xpY2tPbmdvaW5nKcKge1xuICAgICAgdGhpcy51aVZpc2libGUgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdtb3VzZWRvd24nLCBbJyRldmVudCddKVxuICBwdWJsaWMgbW91c2Vkb3duIChldmVudDogYW55KcKge1xuICAgIHRoaXMuY2xpY2tPbmdvaW5nID0gdHJ1ZTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNldXAnLCBbJyRldmVudCddKVxuICBwdWJsaWMgbW91c2V1cCAoZXZlbnQ6IGFueSnCoHtcbiAgICB0aGlzLmNsaWNrT25nb2luZyA9IGZhbHNlO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignZm9jdXNpbicsIFsnJGV2ZW50J10pXG4gIHB1YmxpYyBmb2N1cyAoZXZlbnQ6IGFueSnCoHtcbiAgICB0aGlzLnVpVmlzaWJsZSA9IHRydWU7XG4gICAgY29uc29sZS5pbmZvKCdib29zdHJhcCBmb2N1cyEnKVxuICB9XG5cbiAgY29uc3RydWN0b3IoZWw6IEVsZW1lbnRSZWYsIGNvbnRyb2xsZXI6IEZhdGVDb250cm9sbGVyU2VydmljZSwgcGFyc2VyOiBGYXRlUGFyc2VyU2VydmljZSwgaWNvbjogRmF0ZUljb25TZXJ2aWNlLCBmYWN0b3J5UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcikge1xuICAgIHRoaXMudWlJZCA9ICdib290c3RyYXAtJyArIChpbnN0YW5jZUNvdW50ZXIrKyk7XG4gIH1cblxuICBwdWJsaWMgd3JpdGVWYWx1ZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5wYXNzdGhyb3VnaCA9IHZhbHVlO1xuICB9XG5cbiAgcHVibGljIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogc3RyaW5nKSA9PiB2b2lkKSB7XG4gICAgdGhpcy5jaGFuZ2VkLnB1c2goZm4pO1xuICB9XG5cbiAgcHVibGljIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiB2b2lkKSB7fVxuXG4gIC8vIGNoYW5nZSBjYWxsYmFja1xuICBwdWJsaWMgb25DaGFuZ2UodmFsdWUpIHtcbiAgICB0aGlzLnBhc3N0aHJvdWdoID0gdmFsdWU7XG4gICAgdGhpcy5jaGFuZ2VkLmZvckVhY2goZiA9PiBmKHZhbHVlKSk7XG4gIH1cbn1cbiJdfQ==