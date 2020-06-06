import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { FateIconService } from './fate-icon.service';
import * as i0 from "@angular/core";
let FateFontawsomeLegacyIconService = class FateFontawsomeLegacyIconService extends FateIconService {
    constructor() {
        super(...arguments);
        this.iconMapping = {
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
    }
};
FateFontawsomeLegacyIconService.ɵprov = i0.ɵɵdefineInjectable({ factory: function FateFontawsomeLegacyIconService_Factory() { return new FateFontawsomeLegacyIconService(); }, token: FateFontawsomeLegacyIconService, providedIn: "root" });
FateFontawsomeLegacyIconService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], FateFontawsomeLegacyIconService);
export { FateFontawsomeLegacyIconService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmF0ZS1mb250YXdzb21lLWxlZ2FjeS1pY29uLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9mYXRlLWVkaXRvci8iLCJzb3VyY2VzIjpbImFwcC9mYXRlLWZvbnRhd3NvbWUtbGVnYWN5LWljb24uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0scUJBQXFCLENBQUM7O0FBS3RELElBQWEsK0JBQStCLEdBQTVDLE1BQWEsK0JBQWdDLFNBQVEsZUFBZTtJQUFwRTs7UUFFWSxnQkFBVyxHQUFHO1lBQ3RCLE1BQU0sRUFBRyw0QkFBNEI7WUFDckMsUUFBUSxFQUFHLDhCQUE4QjtZQUN6QyxXQUFXLEVBQUcsaUNBQWlDO1lBQy9DLFFBQVEsRUFBRyxxQ0FBcUM7WUFDaEQsV0FBVyxFQUFJLGlDQUFpQztZQUNoRCxhQUFhLEVBQUcsbUNBQW1DO1lBQ25ELFFBQVEsRUFBRyw4QkFBOEI7WUFDekMsU0FBUyxFQUFHLCtCQUErQjtZQUMzQyxTQUFTLEVBQUcsK0JBQStCO1lBQzNDLFdBQVcsRUFBRywrQkFBK0I7WUFDN0MsUUFBUSxFQUFHLG9DQUFvQztZQUMvQyxTQUFTLEVBQUcscUNBQXFDO1lBQ2pELE1BQU0sRUFBRyxrQ0FBa0M7WUFDM0MsT0FBTyxFQUFHLG1DQUFtQztZQUM3QyxNQUFNLEVBQUcsNEJBQTRCO1lBQ3JDLE1BQU0sRUFBRyw4QkFBOEI7WUFDdkMsT0FBTyxFQUFHLDhCQUE4QjtZQUN4QyxNQUFNLEVBQUcsNEJBQTRCO1NBQ3RDLENBQUM7S0FDSDtDQUFBLENBQUE7O0FBdEJZLCtCQUErQjtJQUgzQyxVQUFVLENBQUM7UUFDVixVQUFVLEVBQUUsTUFBTTtLQUNuQixDQUFDO0dBQ1csK0JBQStCLENBc0IzQztTQXRCWSwrQkFBK0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IEZhdGVJY29uU2VydmljZSB9IGZyb20gJy4vZmF0ZS1pY29uLnNlcnZpY2UnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBGYXRlRm9udGF3c29tZUxlZ2FjeUljb25TZXJ2aWNlIGV4dGVuZHMgRmF0ZUljb25TZXJ2aWNlIHtcblxuICBwcm90ZWN0ZWQgaWNvbk1hcHBpbmcgPSB7XG4gICAgJ2JvbGQnIDogJzxpIGNsYXNzPVwiZmEgZmEtYm9sZFwiPjwvaT4nLFxuICAgICdpdGFsaWMnIDogJzxpIGNsYXNzPVwiZmEgZmEtaXRhbGljXCI+PC9pPicsXG4gICAgJ3VuZGVybGluZScgOiAnPGkgY2xhc3M9XCJmYSBmYS11bmRlcmxpbmVcIj48L2k+JyxcbiAgICAnc3RyaWtlJyA6ICc8aSBjbGFzcz1cImZhIGZhLXN0cmlrZXRocm91Z2hcIj48L2k+JyxcbiAgICAnc3Vic2NyaXB0JyA6ICAnPGkgY2xhc3M9XCJmYSBmYS1zdWJzY3JpcHRcIj48L2k+JyxcbiAgICAnc3VwZXJzY3JpcHQnIDogJzxpIGNsYXNzPVwiZmEgZmEtc3VwZXJzY3JpcHRcIj48L2k+JyxcbiAgICAnaW5kZW50JyA6ICc8aSBjbGFzcz1cImZhIGZhLWluZGVudFwiPjwvaT4nLFxuICAgICdvdXRkZW50JyA6ICc8aSBjbGFzcz1cImZhIGZhLW91dGRlbnRcIj48L2k+JyxcbiAgICAnb3JkZXJlZCcgOiAnPGkgY2xhc3M9XCJmYSBmYS1saXN0LW9sXCI+PC9pPicsXG4gICAgJ3Vub3JkZXJlZCcgOiAnPGkgY2xhc3M9XCJmYSBmYS1saXN0LXVsXCI+PC9pPicsXG4gICAgJ2NlbnRlcicgOiAnPGkgY2xhc3M9XCJmYSBmYS1hbGlnbi1jZW50ZXJcIj48L2k+JyxcbiAgICAnanVzdGlmeScgOiAnPGkgY2xhc3M9XCJmYSBmYS1hbGlnbi1qdXN0aWZ5XCI+PC9pPicsXG4gICAgJ2xlZnQnIDogJzxpIGNsYXNzPVwiZmEgZmEtYWxpZ24tbGVmdFwiPjwvaT4nLFxuICAgICdyaWdodCcgOiAnPGkgY2xhc3M9XCJmYSBmYS1hbGlnbi1yaWdodFwiPjwvaT4nLFxuICAgICd1bmRvJyA6ICc8aSBjbGFzcz1cImZhIGZhLXVuZG9cIj48L2k+JyxcbiAgICAncmVkbycgOiAnPGkgY2xhc3M9XCJmYSBmYS1yZXBlYXRcIj48L2k+JyxcbiAgICAnY2xlYW4nIDogJzxpIGNsYXNzPVwiZmEgZmEtZXJhc2VyXCI+PC9pPicsXG4gICAgJ2xpbmsnIDogJzxpIGNsYXNzPVwiZmEgZmEtbGlua1wiPjwvaT4nLFxuICB9O1xufVxuIl19