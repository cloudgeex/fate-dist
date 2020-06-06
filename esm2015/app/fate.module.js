import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FateUiComponent } from './fate-ui/fate-ui.component';
import { FateInputComponent } from './fate-input/fate-input.component';
import { FateBootstrapComponent } from './fate-bootstrap/fate-bootstrap.component';
import { FateMaterialComponent } from './fate-material/fate-material.component';
import { FateLinkDropdownComponent } from './fate-link-dropdown/fate-link-dropdown.component';
export { FateUiComponent } from './fate-ui/fate-ui.component';
export { FateInputComponent } from './fate-input/fate-input.component';
export { FateLinkDropdownComponent } from './fate-link-dropdown/fate-link-dropdown.component';
export { FateIconService } from './fate-icon.service';
export { FateMaterialIconService } from './fate-material-icon.service';
export { FateFontawsomeLegacyIconService } from './fate-fontawsome-legacy-icon.service';
export { FateParserService } from './fate-parser.service';
export { FateControllerService } from './fate-controller.service';
export { FateHtmlParserService } from './fate-html-parser.service';
export { FateNode } from './fate-node';
export { FateType } from './fate-type.enum';
let FateModule = class FateModule {
};
FateModule = __decorate([
    NgModule({
        declarations: [
            FateInputComponent,
            FateUiComponent,
            FateBootstrapComponent,
            FateLinkDropdownComponent,
        ],
        imports: [
            CommonModule,
            FormsModule,
            MatFormFieldModule,
        ],
        exports: [
            FateUiComponent,
            FateInputComponent,
            FateBootstrapComponent,
            FateLinkDropdownComponent
        ],
    })
], FateModule);
export { FateModule };
let FateMaterialModule = class FateMaterialModule {
};
FateMaterialModule = __decorate([
    NgModule({
        declarations: [
            FateMaterialComponent,
        ],
        imports: [
            CommonModule,
            FormsModule,
            MatFormFieldModule,
            FateModule
        ],
        exports: [
            FateMaterialComponent,
        ]
    })
], FateMaterialModule);
export { FateMaterialModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmF0ZS5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9mYXRlLWVkaXRvci8iLCJzb3VyY2VzIjpbImFwcC9mYXRlLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBRWxFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUM5RCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUN2RSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUNuRixPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx5Q0FBeUMsQ0FBQztBQUNoRixPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxtREFBbUQsQ0FBQztBQUs5RixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDOUQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDdkUsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sbURBQW1ELENBQUM7QUFDOUYsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3RELE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ3ZFLE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQ3hGLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzFELE9BQU8sRUFBRSxxQkFBcUIsRUFBZSxNQUFNLDJCQUEyQixDQUFDO0FBQy9FLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ25FLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDdkMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBcUI1QyxJQUFhLFVBQVUsR0FBdkIsTUFBYSxVQUFVO0NBQUksQ0FBQTtBQUFkLFVBQVU7SUFuQnRCLFFBQVEsQ0FBQztRQUNSLFlBQVksRUFBRTtZQUNaLGtCQUFrQjtZQUNsQixlQUFlO1lBQ2Ysc0JBQXNCO1lBQ3RCLHlCQUF5QjtTQUMxQjtRQUNELE9BQU8sRUFBRTtZQUNQLFlBQVk7WUFDWixXQUFXO1lBQ1gsa0JBQWtCO1NBQ25CO1FBQ0QsT0FBTyxFQUFFO1lBQ1AsZUFBZTtZQUNmLGtCQUFrQjtZQUNsQixzQkFBc0I7WUFDdEIseUJBQXlCO1NBQzFCO0tBQ0YsQ0FBQztHQUNXLFVBQVUsQ0FBSTtTQUFkLFVBQVU7QUFnQnZCLElBQWEsa0JBQWtCLEdBQS9CLE1BQWEsa0JBQWtCO0NBQUksQ0FBQTtBQUF0QixrQkFBa0I7SUFkOUIsUUFBUSxDQUFDO1FBQ1IsWUFBWSxFQUFFO1lBQ1oscUJBQXFCO1NBQ3RCO1FBQ0QsT0FBTyxFQUFFO1lBQ1AsWUFBWTtZQUNaLFdBQVc7WUFDWCxrQkFBa0I7WUFDbEIsVUFBVTtTQUNYO1FBQ0QsT0FBTyxFQUFFO1lBQ1AscUJBQXFCO1NBQ3RCO0tBQ0YsQ0FBQztHQUNXLGtCQUFrQixDQUFJO1NBQXRCLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBNYXRGb3JtRmllbGRNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9mb3JtLWZpZWxkJztcblxuaW1wb3J0IHsgRmF0ZVVpQ29tcG9uZW50IH0gZnJvbSAnLi9mYXRlLXVpL2ZhdGUtdWkuY29tcG9uZW50JztcbmltcG9ydCB7IEZhdGVJbnB1dENvbXBvbmVudCB9IGZyb20gJy4vZmF0ZS1pbnB1dC9mYXRlLWlucHV0LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBGYXRlQm9vdHN0cmFwQ29tcG9uZW50IH0gZnJvbSAnLi9mYXRlLWJvb3RzdHJhcC9mYXRlLWJvb3RzdHJhcC5jb21wb25lbnQnO1xuaW1wb3J0IHsgRmF0ZU1hdGVyaWFsQ29tcG9uZW50IH0gZnJvbSAnLi9mYXRlLW1hdGVyaWFsL2ZhdGUtbWF0ZXJpYWwuY29tcG9uZW50JztcbmltcG9ydCB7IEZhdGVMaW5rRHJvcGRvd25Db21wb25lbnQgfSBmcm9tICcuL2ZhdGUtbGluay1kcm9wZG93bi9mYXRlLWxpbmstZHJvcGRvd24uY29tcG9uZW50JztcblxuZXhwb3J0IHsgRmF0ZVBhcnNlciB9IGZyb20gJy4vZmF0ZS1wYXJzZXIuaW50ZXJmYWNlJztcbmV4cG9ydCB7IEZhdGVJY29uIH0gZnJvbSAnLi9mYXRlLWljb24uaW50ZXJmYWNlJztcbmV4cG9ydCB7IEZhdGVEcm9wZG93biB9IGZyb20gJy4vZmF0ZS1kcm9wZG93bi5pbnRlcmZhY2UnO1xuZXhwb3J0IHsgRmF0ZVVpQ29tcG9uZW50IH0gZnJvbSAnLi9mYXRlLXVpL2ZhdGUtdWkuY29tcG9uZW50JztcbmV4cG9ydCB7IEZhdGVJbnB1dENvbXBvbmVudCB9IGZyb20gJy4vZmF0ZS1pbnB1dC9mYXRlLWlucHV0LmNvbXBvbmVudCc7XG5leHBvcnQgeyBGYXRlTGlua0Ryb3Bkb3duQ29tcG9uZW50IH0gZnJvbSAnLi9mYXRlLWxpbmstZHJvcGRvd24vZmF0ZS1saW5rLWRyb3Bkb3duLmNvbXBvbmVudCc7XG5leHBvcnQgeyBGYXRlSWNvblNlcnZpY2UgfSBmcm9tICcuL2ZhdGUtaWNvbi5zZXJ2aWNlJztcbmV4cG9ydCB7IEZhdGVNYXRlcmlhbEljb25TZXJ2aWNlIH0gZnJvbSAnLi9mYXRlLW1hdGVyaWFsLWljb24uc2VydmljZSc7XG5leHBvcnQgeyBGYXRlRm9udGF3c29tZUxlZ2FjeUljb25TZXJ2aWNlIH0gZnJvbSAnLi9mYXRlLWZvbnRhd3NvbWUtbGVnYWN5LWljb24uc2VydmljZSc7XG5leHBvcnQgeyBGYXRlUGFyc2VyU2VydmljZSB9IGZyb20gJy4vZmF0ZS1wYXJzZXIuc2VydmljZSc7XG5leHBvcnQgeyBGYXRlQ29udHJvbGxlclNlcnZpY2UsIEZhdGVDb21tYW5kIH0gZnJvbSAnLi9mYXRlLWNvbnRyb2xsZXIuc2VydmljZSc7XG5leHBvcnQgeyBGYXRlSHRtbFBhcnNlclNlcnZpY2UgfSBmcm9tICcuL2ZhdGUtaHRtbC1wYXJzZXIuc2VydmljZSc7XG5leHBvcnQgeyBGYXRlTm9kZSB9IGZyb20gJy4vZmF0ZS1ub2RlJztcbmV4cG9ydCB7IEZhdGVUeXBlIH0gZnJvbSAnLi9mYXRlLXR5cGUuZW51bSc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1xuICAgIEZhdGVJbnB1dENvbXBvbmVudCxcbiAgICBGYXRlVWlDb21wb25lbnQsXG4gICAgRmF0ZUJvb3RzdHJhcENvbXBvbmVudCxcbiAgICBGYXRlTGlua0Ryb3Bkb3duQ29tcG9uZW50LFxuICBdLFxuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlLFxuICAgIEZvcm1zTW9kdWxlLFxuICAgIE1hdEZvcm1GaWVsZE1vZHVsZSxcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIEZhdGVVaUNvbXBvbmVudCxcbiAgICBGYXRlSW5wdXRDb21wb25lbnQsXG4gICAgRmF0ZUJvb3RzdHJhcENvbXBvbmVudCxcbiAgICBGYXRlTGlua0Ryb3Bkb3duQ29tcG9uZW50XG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIEZhdGVNb2R1bGUgeyB9XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1xuICAgIEZhdGVNYXRlcmlhbENvbXBvbmVudCxcbiAgXSxcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZSxcbiAgICBGb3Jtc01vZHVsZSxcbiAgICBNYXRGb3JtRmllbGRNb2R1bGUsXG4gICAgRmF0ZU1vZHVsZVxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgRmF0ZU1hdGVyaWFsQ29tcG9uZW50LFxuICBdXG59KVxuZXhwb3J0IGNsYXNzIEZhdGVNYXRlcmlhbE1vZHVsZSB7IH0iXX0=