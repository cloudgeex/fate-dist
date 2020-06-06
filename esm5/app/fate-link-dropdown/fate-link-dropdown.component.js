import { __decorate } from "tslib";
import { Component, Input, Output, EventEmitter } from '@angular/core';
var FateLinkDropdownComponent = /** @class */ (function () {
    function FateLinkDropdownComponent() {
        this.valueChange = new EventEmitter();
    }
    FateLinkDropdownComponent.prototype.changeValue = function (value) {
        this.value = value;
        this.valueChange.emit(value);
    };
    FateLinkDropdownComponent.prototype.selectNext = function () { };
    ;
    FateLinkDropdownComponent.prototype.selecPrevious = function () { };
    ;
    FateLinkDropdownComponent.prototype.confirmSelection = function () { };
    ;
    __decorate([
        Input()
    ], FateLinkDropdownComponent.prototype, "value", void 0);
    __decorate([
        Output()
    ], FateLinkDropdownComponent.prototype, "valueChange", void 0);
    FateLinkDropdownComponent = __decorate([
        Component({
            selector: 'fate-link-dropdown',
            template: "<input type=\"text\" [ngModel]=\"value\" (ngModelChange)=\"changeValue($event)\" placeholder=\"http://\">\n",
            styles: [""]
        })
    ], FateLinkDropdownComponent);
    return FateLinkDropdownComponent;
}());
export { FateLinkDropdownComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmF0ZS1saW5rLWRyb3Bkb3duLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2ZhdGUtZWRpdG9yLyIsInNvdXJjZXMiOlsiYXBwL2ZhdGUtbGluay1kcm9wZG93bi9mYXRlLWxpbmstZHJvcGRvd24uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBU3ZFO0lBQUE7UUFNUyxnQkFBVyxHQUFHLElBQUksWUFBWSxFQUFVLENBQUM7SUFVbEQsQ0FBQztJQVJRLCtDQUFXLEdBQWxCLFVBQW9CLEtBQUs7UUFDdkIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVNLDhDQUFVLEdBQWpCLGNBQXNCLENBQUM7SUFBQSxDQUFDO0lBQ2pCLGlEQUFhLEdBQXBCLGNBQXlCLENBQUM7SUFBQSxDQUFDO0lBQ3BCLG9EQUFnQixHQUF2QixjQUE0QixDQUFDO0lBQUEsQ0FBQztJQVo5QjtRQURDLEtBQUssRUFBRTs0REFDYTtJQUdyQjtRQURDLE1BQU0sRUFBRTtrRUFDdUM7SUFOckMseUJBQXlCO1FBTHJDLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxvQkFBb0I7WUFDOUIsdUhBQWtEOztTQUVuRCxDQUFDO09BQ1cseUJBQXlCLENBZ0JyQztJQUFELGdDQUFDO0NBQUEsQUFoQkQsSUFnQkM7U0FoQlkseUJBQXlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRmF0ZURyb3Bkb3duIH0gZnJvbSAnLi4vZmF0ZS1kcm9wZG93bi5pbnRlcmZhY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdmYXRlLWxpbmstZHJvcGRvd24nLFxuICB0ZW1wbGF0ZVVybDogJy4vZmF0ZS1saW5rLWRyb3Bkb3duLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vZmF0ZS1saW5rLWRyb3Bkb3duLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgRmF0ZUxpbmtEcm9wZG93bkNvbXBvbmVudCBpbXBsZW1lbnRzIEZhdGVEcm9wZG93biB7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHZhbHVlOiBzdHJpbmc7XG5cbiAgQE91dHB1dCgpXG4gIHB1YmxpYyB2YWx1ZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xuXG4gIHB1YmxpYyBjaGFuZ2VWYWx1ZSAodmFsdWUpIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy52YWx1ZUNoYW5nZS5lbWl0KHZhbHVlKTtcbiAgfVxuXG4gIHB1YmxpYyBzZWxlY3ROZXh0ICgpIHt9O1xuICBwdWJsaWMgc2VsZWNQcmV2aW91cyAoKSB7fTtcbiAgcHVibGljIGNvbmZpcm1TZWxlY3Rpb24gKCkge307XG59XG4iXX0=