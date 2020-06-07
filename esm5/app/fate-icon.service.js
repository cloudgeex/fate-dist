import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
var FateIconService = /** @class */ (function () {
    function FateIconService() {
        // font awesome
        this.iconMapping = {
            bold: 'bold',
            italic: 'italic',
            underline: 'underline',
            strike: 'strikethrough',
            subscript: 'subscript',
            superscript: 'superscript',
            indent: 'indent',
            outdent: 'outdent',
            ordered: 'list-ol',
            unordered: 'list-ul',
            center: 'align-center',
            justify: 'align-justify',
            left: 'align-left',
            right: 'align-right',
            undo: 'undo-alt',
            redo: 'redo-alt',
            clean: 'eraser',
            link: 'link'
        };
    }
    FateIconService.prototype.getIcon = function (actionName) {
        return this.iconMapping[actionName];
    };
    FateIconService.ɵprov = i0.ɵɵdefineInjectable({ factory: function FateIconService_Factory() { return new FateIconService(); }, token: FateIconService, providedIn: "root" });
    FateIconService = __decorate([
        Injectable({
            providedIn: 'root'
        })
    ], FateIconService);
    return FateIconService;
}());
export { FateIconService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmF0ZS1pY29uLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9mYXRlLWVkaXRvci8iLCJzb3VyY2VzIjpbImFwcC9mYXRlLWljb24uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFPM0M7SUFBQTtRQUNFLGVBQWU7UUFDTCxnQkFBVyxHQUFRO1lBQzNCLElBQUksRUFBRSxNQUFNO1lBQ1osTUFBTSxFQUFFLFFBQVE7WUFDaEIsU0FBUyxFQUFFLFdBQVc7WUFDdEIsTUFBTSxFQUFFLGVBQWU7WUFDdkIsU0FBUyxFQUFFLFdBQVc7WUFDdEIsV0FBVyxFQUFFLGFBQWE7WUFDMUIsTUFBTSxFQUFFLFFBQVE7WUFDaEIsT0FBTyxFQUFFLFNBQVM7WUFDbEIsT0FBTyxFQUFFLFNBQVM7WUFDbEIsU0FBUyxFQUFFLFNBQVM7WUFDcEIsTUFBTSxFQUFFLGNBQWM7WUFDdEIsT0FBTyxFQUFFLGVBQWU7WUFDeEIsSUFBSSxFQUFFLFlBQVk7WUFDbEIsS0FBSyxFQUFFLGFBQWE7WUFDcEIsSUFBSSxFQUFFLFVBQVU7WUFDaEIsSUFBSSxFQUFFLFVBQVU7WUFDaEIsS0FBSyxFQUFFLFFBQVE7WUFDZixJQUFJLEVBQUUsTUFBTTtTQUNiLENBQUM7S0FLSDtJQUhRLGlDQUFPLEdBQWQsVUFBZSxVQUFVO1FBQ3ZCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN0QyxDQUFDOztJQXpCVSxlQUFlO1FBSDNCLFVBQVUsQ0FBQztZQUNWLFVBQVUsRUFBRSxNQUFNO1NBQ25CLENBQUM7T0FDVyxlQUFlLENBMEIzQjswQkFqQ0Q7Q0FpQ0MsQUExQkQsSUEwQkM7U0ExQlksZUFBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRmF0ZUljb24gfSBmcm9tICcuL2ZhdGUtaWNvbi5pbnRlcmZhY2UnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBGYXRlSWNvblNlcnZpY2UgaW1wbGVtZW50cyBGYXRlSWNvbiB7XG4gIC8vIGZvbnQgYXdlc29tZVxuICBwcm90ZWN0ZWQgaWNvbk1hcHBpbmc6IGFueSA9IHtcbiAgICBib2xkOiAnYm9sZCcsXG4gICAgaXRhbGljOiAnaXRhbGljJyxcbiAgICB1bmRlcmxpbmU6ICd1bmRlcmxpbmUnLFxuICAgIHN0cmlrZTogJ3N0cmlrZXRocm91Z2gnLFxuICAgIHN1YnNjcmlwdDogJ3N1YnNjcmlwdCcsXG4gICAgc3VwZXJzY3JpcHQ6ICdzdXBlcnNjcmlwdCcsXG4gICAgaW5kZW50OiAnaW5kZW50JyxcbiAgICBvdXRkZW50OiAnb3V0ZGVudCcsXG4gICAgb3JkZXJlZDogJ2xpc3Qtb2wnLFxuICAgIHVub3JkZXJlZDogJ2xpc3QtdWwnLFxuICAgIGNlbnRlcjogJ2FsaWduLWNlbnRlcicsXG4gICAganVzdGlmeTogJ2FsaWduLWp1c3RpZnknLFxuICAgIGxlZnQ6ICdhbGlnbi1sZWZ0JyxcbiAgICByaWdodDogJ2FsaWduLXJpZ2h0JyxcbiAgICB1bmRvOiAndW5kby1hbHQnLFxuICAgIHJlZG86ICdyZWRvLWFsdCcsXG4gICAgY2xlYW46ICdlcmFzZXInLFxuICAgIGxpbms6ICdsaW5rJ1xuICB9O1xuXG4gIHB1YmxpYyBnZXRJY29uKGFjdGlvbk5hbWUpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmljb25NYXBwaW5nW2FjdGlvbk5hbWVdO1xuICB9XG59XG4iXX0=