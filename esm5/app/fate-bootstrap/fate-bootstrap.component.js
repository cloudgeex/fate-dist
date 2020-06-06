import { __decorate } from "tslib";
import { Component, Input, ElementRef, HostListener, ComponentFactoryResolver } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { defaultButtons } from '../fate-ui/fate-ui.component';
import { FateControllerService } from '../fate-controller.service';
import { FateParserService } from '../fate-parser.service';
import { FateIconService } from '../fate-icon.service';
var instanceCounter = 0;
var FateBootstrapComponent = /** @class */ (function () {
    function FateBootstrapComponent(el, controller, parser, icon, factoryResolver) {
        this.buttons = defaultButtons;
        // implentation of ControlValueAccessor:
        this.changed = new Array();
        this.clickOngoing = false;
        this.uiId = 'bootstrap-' + (instanceCounter++);
    }
    FateBootstrapComponent_1 = FateBootstrapComponent;
    FateBootstrapComponent.prototype.blur = function (event) {
        if (!this.clickOngoing) {
            this.uiVisible = false;
        }
    };
    FateBootstrapComponent.prototype.mousedown = function (event) {
        this.clickOngoing = true;
    };
    FateBootstrapComponent.prototype.mouseup = function (event) {
        this.clickOngoing = false;
    };
    FateBootstrapComponent.prototype.focus = function (event) {
        this.uiVisible = true;
        console.info('boostrap focus!');
    };
    FateBootstrapComponent.prototype.writeValue = function (value) {
        this.passthrough = value;
    };
    FateBootstrapComponent.prototype.registerOnChange = function (fn) {
        this.changed.push(fn);
    };
    FateBootstrapComponent.prototype.registerOnTouched = function (fn) { };
    // change callback
    FateBootstrapComponent.prototype.onChange = function (value) {
        this.passthrough = value;
        this.changed.forEach(function (f) { return f(value); });
    };
    var FateBootstrapComponent_1;
    FateBootstrapComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: FateControllerService },
        { type: FateParserService },
        { type: FateIconService },
        { type: ComponentFactoryResolver }
    ]; };
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
    return FateBootstrapComponent;
}());
export { FateBootstrapComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmF0ZS1ib290c3RyYXAuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vZmF0ZS1lZGl0b3IvIiwic291cmNlcyI6WyJhcHAvZmF0ZS1ib290c3RyYXAvZmF0ZS1ib290c3RyYXAuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLHdCQUF3QixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JHLE9BQU8sRUFBRSxpQkFBaUIsRUFBd0IsTUFBTSxnQkFBZ0IsQ0FBQztBQUV6RSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDOUQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDbkUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDM0QsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRXZELElBQUksZUFBZSxHQUFHLENBQUMsQ0FBQztBQVV4QjtJQTJDRSxnQ0FBWSxFQUFjLEVBQUUsVUFBaUMsRUFBRSxNQUF5QixFQUFFLElBQXFCLEVBQUUsZUFBeUM7UUFsQ25KLFlBQU8sR0FBa0IsY0FBYyxDQUFDO1FBRS9DLHdDQUF3QztRQUM5QixZQUFPLEdBQUcsSUFBSSxLQUFLLEVBQTJCLENBQUM7UUFDL0MsaUJBQVksR0FBWSxLQUFLLENBQUM7UUErQnRDLElBQUksQ0FBQyxJQUFJLEdBQUcsWUFBWSxHQUFHLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQztJQUNqRCxDQUFDOytCQTdDVSxzQkFBc0I7SUFxQjFCLHFDQUFJLEdBQVgsVUFBYSxLQUFVO1FBQ3JCLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3RCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1NBQ3hCO0lBQ0gsQ0FBQztJQUdNLDBDQUFTLEdBQWhCLFVBQWtCLEtBQVU7UUFDMUIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7SUFDM0IsQ0FBQztJQUdNLHdDQUFPLEdBQWQsVUFBZ0IsS0FBVTtRQUN4QixJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztJQUM1QixDQUFDO0lBR00sc0NBQUssR0FBWixVQUFjLEtBQVU7UUFDdEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDdEIsT0FBTyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO0lBQ2pDLENBQUM7SUFNTSwyQ0FBVSxHQUFqQixVQUFrQixLQUFhO1FBQzdCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0lBQzNCLENBQUM7SUFFTSxpREFBZ0IsR0FBdkIsVUFBd0IsRUFBMkI7UUFDakQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDeEIsQ0FBQztJQUVNLGtEQUFpQixHQUF4QixVQUF5QixFQUFjLElBQUcsQ0FBQztJQUUzQyxrQkFBa0I7SUFDWCx5Q0FBUSxHQUFmLFVBQWdCLEtBQUs7UUFDbkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7UUFDekIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQVIsQ0FBUSxDQUFDLENBQUM7SUFDdEMsQ0FBQzs7O2dCQWxCZSxVQUFVO2dCQUFjLHFCQUFxQjtnQkFBVSxpQkFBaUI7Z0JBQVEsZUFBZTtnQkFBbUIsd0JBQXdCOztJQXhDMUo7UUFEQyxLQUFLLEVBQUU7dURBQ0k7SUFHWjtRQURDLEtBQUssRUFBRTsrREFDWTtJQUdwQjtRQURDLEtBQUssRUFBRTsyREFDdUM7SUFZL0M7UUFEQyxZQUFZLENBQUMsVUFBVSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7c0RBS3BDO0lBR0Q7UUFEQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7MkRBR3JDO0lBR0Q7UUFEQyxZQUFZLENBQUMsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7eURBR25DO0lBR0Q7UUFEQyxZQUFZLENBQUMsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7dURBSW5DO0lBekNVLHNCQUFzQjtRQVJsQyxTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsZ0JBQWdCO1lBQzFCLCtUQUE4QztZQUU5QyxTQUFTLEVBQUU7Z0JBQ1QsRUFBQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsV0FBVyxFQUFFLHdCQUFzQixFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUM7YUFDL0U7O1NBQ0YsQ0FBQztPQUNXLHNCQUFzQixDQThEbEM7SUFBRCw2QkFBQztDQUFBLEFBOURELElBOERDO1NBOURZLHNCQUFzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIEVsZW1lbnRSZWYsIEhvc3RMaXN0ZW5lciwgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOR19WQUxVRV9BQ0NFU1NPUiwgQ29udHJvbFZhbHVlQWNjZXNzb3IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7IGRlZmF1bHRCdXR0b25zIH0gZnJvbSAnLi4vZmF0ZS11aS9mYXRlLXVpLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBGYXRlQ29udHJvbGxlclNlcnZpY2UgfSBmcm9tICcuLi9mYXRlLWNvbnRyb2xsZXIuc2VydmljZSc7XG5pbXBvcnQgeyBGYXRlUGFyc2VyU2VydmljZSB9IGZyb20gJy4uL2ZhdGUtcGFyc2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgRmF0ZUljb25TZXJ2aWNlIH0gZnJvbSAnLi4vZmF0ZS1pY29uLnNlcnZpY2UnO1xuXG5sZXQgaW5zdGFuY2VDb3VudGVyID0gMDtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZmF0ZS1ib290c3RyYXAnLFxuICB0ZW1wbGF0ZVVybDogJy4vZmF0ZS1ib290c3RyYXAuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9mYXRlLWJvb3RzdHJhcC5jb21wb25lbnQuc2NzcyddLFxuICBwcm92aWRlcnM6IFtcbiAgICB7cHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsIHVzZUV4aXN0aW5nOiBGYXRlQm9vdHN0cmFwQ29tcG9uZW50LCBtdWx0aTogdHJ1ZX1cbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgRmF0ZUJvb3RzdHJhcENvbXBvbmVudCBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcblxuICBASW5wdXQoKVxuICByb3c6IG51bWJlcjtcblxuICBASW5wdXQoKVxuICBwbGFjZWhvbGRlcjogc3RyaW5nO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBidXR0b25zOiBBcnJheTxzdHJpbmc+ID0gZGVmYXVsdEJ1dHRvbnM7XG5cbiAgLy8gaW1wbGVudGF0aW9uIG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yOlxuICBwcm90ZWN0ZWQgY2hhbmdlZCA9IG5ldyBBcnJheTwodmFsdWU6IHN0cmluZykgPT4gdm9pZD4oKTtcbiAgcHJvdGVjdGVkIGNsaWNrT25nb2luZzogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHB1YmxpYyBwYXNzdGhyb3VnaDogc3RyaW5nO1xuICBwdWJsaWMgdWlJZDtcbiAgcHVibGljIHVpVmlzaWJsZTtcblxuXG4gIEBIb3N0TGlzdGVuZXIoJ2ZvY3Vzb3V0JywgWyckZXZlbnQnXSlcbiAgcHVibGljIGJsdXIgKGV2ZW50OiBhbnkpwqB7XG4gICAgaWYgKCF0aGlzLmNsaWNrT25nb2luZynCoHtcbiAgICAgIHRoaXMudWlWaXNpYmxlID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignbW91c2Vkb3duJywgWyckZXZlbnQnXSlcbiAgcHVibGljIG1vdXNlZG93biAoZXZlbnQ6IGFueSnCoHtcbiAgICB0aGlzLmNsaWNrT25nb2luZyA9IHRydWU7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdtb3VzZXVwJywgWyckZXZlbnQnXSlcbiAgcHVibGljIG1vdXNldXAgKGV2ZW50OiBhbnkpwqB7XG4gICAgdGhpcy5jbGlja09uZ29pbmcgPSBmYWxzZTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2ZvY3VzaW4nLCBbJyRldmVudCddKVxuICBwdWJsaWMgZm9jdXMgKGV2ZW50OiBhbnkpwqB7XG4gICAgdGhpcy51aVZpc2libGUgPSB0cnVlO1xuICAgIGNvbnNvbGUuaW5mbygnYm9vc3RyYXAgZm9jdXMhJylcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGVsOiBFbGVtZW50UmVmLCBjb250cm9sbGVyOiBGYXRlQ29udHJvbGxlclNlcnZpY2UsIHBhcnNlcjogRmF0ZVBhcnNlclNlcnZpY2UsIGljb246IEZhdGVJY29uU2VydmljZSwgZmFjdG9yeVJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIpIHtcbiAgICB0aGlzLnVpSWQgPSAnYm9vdHN0cmFwLScgKyAoaW5zdGFuY2VDb3VudGVyKyspO1xuICB9XG5cbiAgcHVibGljIHdyaXRlVmFsdWUodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMucGFzc3Rocm91Z2ggPSB2YWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyByZWdpc3Rlck9uQ2hhbmdlKGZuOiAodmFsdWU6IHN0cmluZykgPT4gdm9pZCkge1xuICAgIHRoaXMuY2hhbmdlZC5wdXNoKGZuKTtcbiAgfVxuXG4gIHB1YmxpYyByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gdm9pZCkge31cblxuICAvLyBjaGFuZ2UgY2FsbGJhY2tcbiAgcHVibGljIG9uQ2hhbmdlKHZhbHVlKSB7XG4gICAgdGhpcy5wYXNzdGhyb3VnaCA9IHZhbHVlO1xuICAgIHRoaXMuY2hhbmdlZC5mb3JFYWNoKGYgPT4gZih2YWx1ZSkpO1xuICB9XG59XG4iXX0=