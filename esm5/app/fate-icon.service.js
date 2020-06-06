import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
var FateIconService = /** @class */ (function () {
    function FateIconService() {
        this.iconMapping = {
            'bold': '<i class="fas fa-bold"></i>',
            'italic': '<i class="fas fa-italic"></i>',
            'underline': '<i class="fas fa-underline"></i>',
            'strike': '<i class="fas fa-strikethrough"></i>',
            'subscript': '<i class="fas fa-subscript"></i>',
            'superscript': '<i class="fas fa-superscript"></i>',
            'indent': '<i class="fas fa-indent"></i>',
            'outdent': '<i class="fas fa-outdent"></i>',
            'ordered': '<i class="fas fa-list-ol"></i>',
            'unordered': '<i class="fas fa-list-ul"></i>',
            'center': '<i class="fas fa-align-center"></i>',
            'justify': '<i class="fas fa-align-justify"></i>',
            'left': '<i class="fas fa-align-left"></i>',
            'right': '<i class="fas fa-align-right"></i>',
            'undo': '<i class="fas fa-undo-alt"></i>',
            'redo': '<i class="fas fa-redo-alt"></i>',
            'clean': '<i class="fas fa-eraser"></i>',
            'link': '<i class="fas fa-link"></i>',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmF0ZS1pY29uLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9mYXRlLWVkaXRvci8iLCJzb3VyY2VzIjpbImFwcC9mYXRlLWljb24uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFPM0M7SUFBQTtRQUVZLGdCQUFXLEdBQVE7WUFDM0IsTUFBTSxFQUFHLDZCQUE2QjtZQUN0QyxRQUFRLEVBQUcsK0JBQStCO1lBQzFDLFdBQVcsRUFBRyxrQ0FBa0M7WUFDaEQsUUFBUSxFQUFHLHNDQUFzQztZQUNqRCxXQUFXLEVBQUksa0NBQWtDO1lBQ2pELGFBQWEsRUFBRyxvQ0FBb0M7WUFDcEQsUUFBUSxFQUFHLCtCQUErQjtZQUMxQyxTQUFTLEVBQUcsZ0NBQWdDO1lBQzVDLFNBQVMsRUFBRyxnQ0FBZ0M7WUFDNUMsV0FBVyxFQUFHLGdDQUFnQztZQUM5QyxRQUFRLEVBQUcscUNBQXFDO1lBQ2hELFNBQVMsRUFBRyxzQ0FBc0M7WUFDbEQsTUFBTSxFQUFHLG1DQUFtQztZQUM1QyxPQUFPLEVBQUcsb0NBQW9DO1lBQzlDLE1BQU0sRUFBRyxpQ0FBaUM7WUFDMUMsTUFBTSxFQUFHLGlDQUFpQztZQUMxQyxPQUFPLEVBQUcsK0JBQStCO1lBQ3pDLE1BQU0sRUFBRyw2QkFBNkI7U0FDdkMsQ0FBQztLQUtIO0lBSFEsaUNBQU8sR0FBZCxVQUFlLFVBQVU7UUFDdkIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7O0lBekJVLGVBQWU7UUFIM0IsVUFBVSxDQUFDO1lBQ1YsVUFBVSxFQUFFLE1BQU07U0FDbkIsQ0FBQztPQUNXLGVBQWUsQ0EwQjNCOzBCQWpDRDtDQWlDQyxBQTFCRCxJQTBCQztTQTFCWSxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBGYXRlSWNvbiB9IGZyb20gJy4vZmF0ZS1pY29uLmludGVyZmFjZSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIEZhdGVJY29uU2VydmljZSBpbXBsZW1lbnRzIEZhdGVJY29uIHtcblxuICBwcm90ZWN0ZWQgaWNvbk1hcHBpbmc6IGFueSA9IHtcbiAgICAnYm9sZCcgOiAnPGkgY2xhc3M9XCJmYXMgZmEtYm9sZFwiPjwvaT4nLFxuICAgICdpdGFsaWMnIDogJzxpIGNsYXNzPVwiZmFzIGZhLWl0YWxpY1wiPjwvaT4nLFxuICAgICd1bmRlcmxpbmUnIDogJzxpIGNsYXNzPVwiZmFzIGZhLXVuZGVybGluZVwiPjwvaT4nLFxuICAgICdzdHJpa2UnIDogJzxpIGNsYXNzPVwiZmFzIGZhLXN0cmlrZXRocm91Z2hcIj48L2k+JyxcbiAgICAnc3Vic2NyaXB0JyA6ICAnPGkgY2xhc3M9XCJmYXMgZmEtc3Vic2NyaXB0XCI+PC9pPicsXG4gICAgJ3N1cGVyc2NyaXB0JyA6ICc8aSBjbGFzcz1cImZhcyBmYS1zdXBlcnNjcmlwdFwiPjwvaT4nLFxuICAgICdpbmRlbnQnIDogJzxpIGNsYXNzPVwiZmFzIGZhLWluZGVudFwiPjwvaT4nLFxuICAgICdvdXRkZW50JyA6ICc8aSBjbGFzcz1cImZhcyBmYS1vdXRkZW50XCI+PC9pPicsXG4gICAgJ29yZGVyZWQnIDogJzxpIGNsYXNzPVwiZmFzIGZhLWxpc3Qtb2xcIj48L2k+JyxcbiAgICAndW5vcmRlcmVkJyA6ICc8aSBjbGFzcz1cImZhcyBmYS1saXN0LXVsXCI+PC9pPicsXG4gICAgJ2NlbnRlcicgOiAnPGkgY2xhc3M9XCJmYXMgZmEtYWxpZ24tY2VudGVyXCI+PC9pPicsXG4gICAgJ2p1c3RpZnknIDogJzxpIGNsYXNzPVwiZmFzIGZhLWFsaWduLWp1c3RpZnlcIj48L2k+JyxcbiAgICAnbGVmdCcgOiAnPGkgY2xhc3M9XCJmYXMgZmEtYWxpZ24tbGVmdFwiPjwvaT4nLFxuICAgICdyaWdodCcgOiAnPGkgY2xhc3M9XCJmYXMgZmEtYWxpZ24tcmlnaHRcIj48L2k+JyxcbiAgICAndW5kbycgOiAnPGkgY2xhc3M9XCJmYXMgZmEtdW5kby1hbHRcIj48L2k+JyxcbiAgICAncmVkbycgOiAnPGkgY2xhc3M9XCJmYXMgZmEtcmVkby1hbHRcIj48L2k+JyxcbiAgICAnY2xlYW4nIDogJzxpIGNsYXNzPVwiZmFzIGZhLWVyYXNlclwiPjwvaT4nLFxuICAgICdsaW5rJyA6ICc8aSBjbGFzcz1cImZhcyBmYS1saW5rXCI+PC9pPicsXG4gIH07XG5cbiAgcHVibGljIGdldEljb24oYWN0aW9uTmFtZSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuaWNvbk1hcHBpbmdbYWN0aW9uTmFtZV07XG4gIH1cbn1cbiJdfQ==