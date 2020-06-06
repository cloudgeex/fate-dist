import { __decorate, __extends } from "tslib";
import { Injectable } from '@angular/core';
import { FateIconService } from './fate-icon.service';
import * as i0 from "@angular/core";
var FateFontawsomeLegacyIconService = /** @class */ (function (_super) {
    __extends(FateFontawsomeLegacyIconService, _super);
    function FateFontawsomeLegacyIconService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.iconMapping = {
            'bold': '<i class="fa fa-bold"></i>',
            'italic': '<i class="fa fa-italic"></i>',
            'underline': '<i class="fa fa-underline"></i>',
            'strike': '<i class="fa fa-strikethrough"></i>',
            'subscript': '<i class="fa fa-subscript"></i>',
            'superscript': '<i class="fa fa-superscript"></i>',
            'indent': '<i class="fa fa-indent"></i>',
            'outdent': '<i class="fa fa-outdent"></i>',
            'ordered': '<i class="fa fa-list-ol"></i>',
            'unordered': '<i class="fa fa-list-ul"></i>',
            'center': '<i class="fa fa-align-center"></i>',
            'justify': '<i class="fa fa-align-justify"></i>',
            'left': '<i class="fa fa-align-left"></i>',
            'right': '<i class="fa fa-align-right"></i>',
            'undo': '<i class="fa fa-undo"></i>',
            'redo': '<i class="fa fa-repeat"></i>',
            'clean': '<i class="fa fa-eraser"></i>',
            'link': '<i class="fa fa-link"></i>',
        };
        return _this;
    }
    FateFontawsomeLegacyIconService.ɵprov = i0.ɵɵdefineInjectable({ factory: function FateFontawsomeLegacyIconService_Factory() { return new FateFontawsomeLegacyIconService(); }, token: FateFontawsomeLegacyIconService, providedIn: "root" });
    FateFontawsomeLegacyIconService = __decorate([
        Injectable({
            providedIn: 'root'
        })
    ], FateFontawsomeLegacyIconService);
    return FateFontawsomeLegacyIconService;
}(FateIconService));
export { FateFontawsomeLegacyIconService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmF0ZS1mb250YXdzb21lLWxlZ2FjeS1pY29uLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9mYXRlLWVkaXRvci8iLCJzb3VyY2VzIjpbImFwcC9mYXRlLWZvbnRhd3NvbWUtbGVnYWN5LWljb24uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0scUJBQXFCLENBQUM7O0FBS3REO0lBQXFELG1EQUFlO0lBQXBFO1FBQUEscUVBc0JDO1FBcEJXLGlCQUFXLEdBQUc7WUFDdEIsTUFBTSxFQUFHLDRCQUE0QjtZQUNyQyxRQUFRLEVBQUcsOEJBQThCO1lBQ3pDLFdBQVcsRUFBRyxpQ0FBaUM7WUFDL0MsUUFBUSxFQUFHLHFDQUFxQztZQUNoRCxXQUFXLEVBQUksaUNBQWlDO1lBQ2hELGFBQWEsRUFBRyxtQ0FBbUM7WUFDbkQsUUFBUSxFQUFHLDhCQUE4QjtZQUN6QyxTQUFTLEVBQUcsK0JBQStCO1lBQzNDLFNBQVMsRUFBRywrQkFBK0I7WUFDM0MsV0FBVyxFQUFHLCtCQUErQjtZQUM3QyxRQUFRLEVBQUcsb0NBQW9DO1lBQy9DLFNBQVMsRUFBRyxxQ0FBcUM7WUFDakQsTUFBTSxFQUFHLGtDQUFrQztZQUMzQyxPQUFPLEVBQUcsbUNBQW1DO1lBQzdDLE1BQU0sRUFBRyw0QkFBNEI7WUFDckMsTUFBTSxFQUFHLDhCQUE4QjtZQUN2QyxPQUFPLEVBQUcsOEJBQThCO1lBQ3hDLE1BQU0sRUFBRyw0QkFBNEI7U0FDdEMsQ0FBQzs7S0FDSDs7SUF0QlksK0JBQStCO1FBSDNDLFVBQVUsQ0FBQztZQUNWLFVBQVUsRUFBRSxNQUFNO1NBQ25CLENBQUM7T0FDVywrQkFBK0IsQ0FzQjNDOzBDQTdCRDtDQTZCQyxBQXRCRCxDQUFxRCxlQUFlLEdBc0JuRTtTQXRCWSwrQkFBK0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IEZhdGVJY29uU2VydmljZSB9IGZyb20gJy4vZmF0ZS1pY29uLnNlcnZpY2UnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBGYXRlRm9udGF3c29tZUxlZ2FjeUljb25TZXJ2aWNlIGV4dGVuZHMgRmF0ZUljb25TZXJ2aWNlIHtcblxuICBwcm90ZWN0ZWQgaWNvbk1hcHBpbmcgPSB7XG4gICAgJ2JvbGQnIDogJzxpIGNsYXNzPVwiZmEgZmEtYm9sZFwiPjwvaT4nLFxuICAgICdpdGFsaWMnIDogJzxpIGNsYXNzPVwiZmEgZmEtaXRhbGljXCI+PC9pPicsXG4gICAgJ3VuZGVybGluZScgOiAnPGkgY2xhc3M9XCJmYSBmYS11bmRlcmxpbmVcIj48L2k+JyxcbiAgICAnc3RyaWtlJyA6ICc8aSBjbGFzcz1cImZhIGZhLXN0cmlrZXRocm91Z2hcIj48L2k+JyxcbiAgICAnc3Vic2NyaXB0JyA6ICAnPGkgY2xhc3M9XCJmYSBmYS1zdWJzY3JpcHRcIj48L2k+JyxcbiAgICAnc3VwZXJzY3JpcHQnIDogJzxpIGNsYXNzPVwiZmEgZmEtc3VwZXJzY3JpcHRcIj48L2k+JyxcbiAgICAnaW5kZW50JyA6ICc8aSBjbGFzcz1cImZhIGZhLWluZGVudFwiPjwvaT4nLFxuICAgICdvdXRkZW50JyA6ICc8aSBjbGFzcz1cImZhIGZhLW91dGRlbnRcIj48L2k+JyxcbiAgICAnb3JkZXJlZCcgOiAnPGkgY2xhc3M9XCJmYSBmYS1saXN0LW9sXCI+PC9pPicsXG4gICAgJ3Vub3JkZXJlZCcgOiAnPGkgY2xhc3M9XCJmYSBmYS1saXN0LXVsXCI+PC9pPicsXG4gICAgJ2NlbnRlcicgOiAnPGkgY2xhc3M9XCJmYSBmYS1hbGlnbi1jZW50ZXJcIj48L2k+JyxcbiAgICAnanVzdGlmeScgOiAnPGkgY2xhc3M9XCJmYSBmYS1hbGlnbi1qdXN0aWZ5XCI+PC9pPicsXG4gICAgJ2xlZnQnIDogJzxpIGNsYXNzPVwiZmEgZmEtYWxpZ24tbGVmdFwiPjwvaT4nLFxuICAgICdyaWdodCcgOiAnPGkgY2xhc3M9XCJmYSBmYS1hbGlnbi1yaWdodFwiPjwvaT4nLFxuICAgICd1bmRvJyA6ICc8aSBjbGFzcz1cImZhIGZhLXVuZG9cIj48L2k+JyxcbiAgICAncmVkbycgOiAnPGkgY2xhc3M9XCJmYSBmYS1yZXBlYXRcIj48L2k+JyxcbiAgICAnY2xlYW4nIDogJzxpIGNsYXNzPVwiZmEgZmEtZXJhc2VyXCI+PC9pPicsXG4gICAgJ2xpbmsnIDogJzxpIGNsYXNzPVwiZmEgZmEtbGlua1wiPjwvaT4nLFxuICB9O1xufVxuIl19