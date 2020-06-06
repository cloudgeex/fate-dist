import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { FateIconService } from './fate-icon.service';
import * as i0 from "@angular/core";
let FateMaterialIconService = class FateMaterialIconService extends FateIconService {
    constructor() {
        super(...arguments);
        this.iconMapping = {
            'bold': '<i class="material-icons">format_bold</i>',
            'italic': '<i class="material-icons">format_italic</i>',
            'underline': '<i class="material-icons">format_underlined</i>',
            'strike': '<i class="material-icons">format_strikethrough</i>',
            'subscript': 'x<sub>2</sub>',
            'superscript': 'x<sup>2</sup>',
            'indent': '<i class="material-icons">format_indent_increase</i>',
            'outdent': '<i class="material-icons">format_indent_decrease</i>',
            'ordered': '<i class="material-icons">format_list_numbered</i>',
            'unordered': '<i class="material-icons">format_list_bulleted</i>',
            'center': '<i class="material-icons">format_align_center</i>',
            'justify': '<i class="material-icons">format_align_justify</i>',
            'left': '<i class="material-icons">format_align_left</i>',
            'right': '<i class="material-icons">format_align_right</i>',
            'undo': '<i class="material-icons">undo</i>',
            'redo': '<i class="material-icons">redo</i>',
            'clean': '<i class="material-icons">format_clear</i>',
            'link': '<i class="material-icons">link</i>',
        };
    }
};
FateMaterialIconService.ɵprov = i0.ɵɵdefineInjectable({ factory: function FateMaterialIconService_Factory() { return new FateMaterialIconService(); }, token: FateMaterialIconService, providedIn: "root" });
FateMaterialIconService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], FateMaterialIconService);
export { FateMaterialIconService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmF0ZS1tYXRlcmlhbC1pY29uLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9mYXRlLWVkaXRvci8iLCJzb3VyY2VzIjpbImFwcC9mYXRlLW1hdGVyaWFsLWljb24uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0scUJBQXFCLENBQUM7O0FBS3RELElBQWEsdUJBQXVCLEdBQXBDLE1BQWEsdUJBQXdCLFNBQVEsZUFBZTtJQUE1RDs7UUFFWSxnQkFBVyxHQUFHO1lBQ3RCLE1BQU0sRUFBRywyQ0FBMkM7WUFDcEQsUUFBUSxFQUFHLDZDQUE2QztZQUN4RCxXQUFXLEVBQUcsaURBQWlEO1lBQy9ELFFBQVEsRUFBRyxvREFBb0Q7WUFDL0QsV0FBVyxFQUFJLGVBQWU7WUFDOUIsYUFBYSxFQUFHLGVBQWU7WUFDL0IsUUFBUSxFQUFHLHNEQUFzRDtZQUNqRSxTQUFTLEVBQUcsc0RBQXNEO1lBQ2xFLFNBQVMsRUFBRyxvREFBb0Q7WUFDaEUsV0FBVyxFQUFHLG9EQUFvRDtZQUNsRSxRQUFRLEVBQUcsbURBQW1EO1lBQzlELFNBQVMsRUFBRyxvREFBb0Q7WUFDaEUsTUFBTSxFQUFHLGlEQUFpRDtZQUMxRCxPQUFPLEVBQUcsa0RBQWtEO1lBQzVELE1BQU0sRUFBRyxvQ0FBb0M7WUFDN0MsTUFBTSxFQUFHLG9DQUFvQztZQUM3QyxPQUFPLEVBQUcsNENBQTRDO1lBQ3RELE1BQU0sRUFBRyxvQ0FBb0M7U0FDOUMsQ0FBQztLQUNIO0NBQUEsQ0FBQTs7QUF0QlksdUJBQXVCO0lBSG5DLFVBQVUsQ0FBQztRQUNWLFVBQVUsRUFBRSxNQUFNO0tBQ25CLENBQUM7R0FDVyx1QkFBdUIsQ0FzQm5DO1NBdEJZLHVCQUF1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRmF0ZUljb25TZXJ2aWNlIH0gZnJvbSAnLi9mYXRlLWljb24uc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIEZhdGVNYXRlcmlhbEljb25TZXJ2aWNlIGV4dGVuZHMgRmF0ZUljb25TZXJ2aWNlIHtcblxuICBwcm90ZWN0ZWQgaWNvbk1hcHBpbmcgPSB7XG4gICAgJ2JvbGQnIDogJzxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIj5mb3JtYXRfYm9sZDwvaT4nLFxuICAgICdpdGFsaWMnIDogJzxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIj5mb3JtYXRfaXRhbGljPC9pPicsXG4gICAgJ3VuZGVybGluZScgOiAnPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiPmZvcm1hdF91bmRlcmxpbmVkPC9pPicsXG4gICAgJ3N0cmlrZScgOiAnPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiPmZvcm1hdF9zdHJpa2V0aHJvdWdoPC9pPicsXG4gICAgJ3N1YnNjcmlwdCcgOiAgJ3g8c3ViPjI8L3N1Yj4nLFxuICAgICdzdXBlcnNjcmlwdCcgOiAneDxzdXA+Mjwvc3VwPicsXG4gICAgJ2luZGVudCcgOiAnPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiPmZvcm1hdF9pbmRlbnRfaW5jcmVhc2U8L2k+JyxcbiAgICAnb3V0ZGVudCcgOiAnPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiPmZvcm1hdF9pbmRlbnRfZGVjcmVhc2U8L2k+JyxcbiAgICAnb3JkZXJlZCcgOiAnPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiPmZvcm1hdF9saXN0X251bWJlcmVkPC9pPicsXG4gICAgJ3Vub3JkZXJlZCcgOiAnPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiPmZvcm1hdF9saXN0X2J1bGxldGVkPC9pPicsXG4gICAgJ2NlbnRlcicgOiAnPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiPmZvcm1hdF9hbGlnbl9jZW50ZXI8L2k+JyxcbiAgICAnanVzdGlmeScgOiAnPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiPmZvcm1hdF9hbGlnbl9qdXN0aWZ5PC9pPicsXG4gICAgJ2xlZnQnIDogJzxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIj5mb3JtYXRfYWxpZ25fbGVmdDwvaT4nLFxuICAgICdyaWdodCcgOiAnPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiPmZvcm1hdF9hbGlnbl9yaWdodDwvaT4nLFxuICAgICd1bmRvJyA6ICc8aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCI+dW5kbzwvaT4nLFxuICAgICdyZWRvJyA6ICc8aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCI+cmVkbzwvaT4nLFxuICAgICdjbGVhbicgOiAnPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiPmZvcm1hdF9jbGVhcjwvaT4nLFxuICAgICdsaW5rJyA6ICc8aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCI+bGluazwvaT4nLFxuICB9O1xufVxuIl19