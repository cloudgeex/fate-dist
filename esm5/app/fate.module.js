import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
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
var FateModule = /** @class */ (function () {
    function FateModule() {
    }
    FateModule = __decorate([
        NgModule({
            declarations: [
                FateInputComponent,
                FateUiComponent,
                FateBootstrapComponent,
                FateLinkDropdownComponent
            ],
            imports: [CommonModule, FormsModule, MatFormFieldModule, FontAwesomeModule],
            exports: [
                FateUiComponent,
                FateInputComponent,
                FateBootstrapComponent,
                FateLinkDropdownComponent
            ]
        })
    ], FateModule);
    return FateModule;
}());
export { FateModule };
var FateMaterialModule = /** @class */ (function () {
    function FateMaterialModule() {
    }
    FateMaterialModule = __decorate([
        NgModule({
            declarations: [FateMaterialComponent],
            imports: [CommonModule, FormsModule, MatFormFieldModule, FateModule],
            exports: [FateMaterialComponent]
        })
    ], FateMaterialModule);
    return FateMaterialModule;
}());
export { FateMaterialModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmF0ZS5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9mYXRlLWVkaXRvci8iLCJzb3VyY2VzIjpbImFwcC9mYXRlLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ2xFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBRXJFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUM5RCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUN2RSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUNuRixPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx5Q0FBeUMsQ0FBQztBQUNoRixPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxtREFBbUQsQ0FBQztBQUs5RixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDOUQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDdkUsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sbURBQW1ELENBQUM7QUFDOUYsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3RELE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ3ZFLE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQ3hGLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzFELE9BQU8sRUFBRSxxQkFBcUIsRUFBZSxNQUFNLDJCQUEyQixDQUFDO0FBQy9FLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ25FLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDdkMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBaUI1QztJQUFBO0lBQXlCLENBQUM7SUFBYixVQUFVO1FBZnRCLFFBQVEsQ0FBQztZQUNSLFlBQVksRUFBRTtnQkFDWixrQkFBa0I7Z0JBQ2xCLGVBQWU7Z0JBQ2Ysc0JBQXNCO2dCQUN0Qix5QkFBeUI7YUFDMUI7WUFDRCxPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsV0FBVyxFQUFFLGtCQUFrQixFQUFFLGlCQUFpQixDQUFDO1lBQzNFLE9BQU8sRUFBRTtnQkFDUCxlQUFlO2dCQUNmLGtCQUFrQjtnQkFDbEIsc0JBQXNCO2dCQUN0Qix5QkFBeUI7YUFDMUI7U0FDRixDQUFDO09BQ1csVUFBVSxDQUFHO0lBQUQsaUJBQUM7Q0FBQSxBQUExQixJQUEwQjtTQUFiLFVBQVU7QUFPdkI7SUFBQTtJQUFpQyxDQUFDO0lBQXJCLGtCQUFrQjtRQUw5QixRQUFRLENBQUM7WUFDUixZQUFZLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQztZQUNyQyxPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsV0FBVyxFQUFFLGtCQUFrQixFQUFFLFVBQVUsQ0FBQztZQUNwRSxPQUFPLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQztTQUNqQyxDQUFDO09BQ1csa0JBQWtCLENBQUc7SUFBRCx5QkFBQztDQUFBLEFBQWxDLElBQWtDO1NBQXJCLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBNYXRGb3JtRmllbGRNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9mb3JtLWZpZWxkJztcbmltcG9ydCB7IEZvbnRBd2Vzb21lTW9kdWxlIH0gZnJvbSAnQGZvcnRhd2Vzb21lL2FuZ3VsYXItZm9udGF3ZXNvbWUnO1xuXG5pbXBvcnQgeyBGYXRlVWlDb21wb25lbnQgfSBmcm9tICcuL2ZhdGUtdWkvZmF0ZS11aS5jb21wb25lbnQnO1xuaW1wb3J0IHsgRmF0ZUlucHV0Q29tcG9uZW50IH0gZnJvbSAnLi9mYXRlLWlucHV0L2ZhdGUtaW5wdXQuY29tcG9uZW50JztcbmltcG9ydCB7IEZhdGVCb290c3RyYXBDb21wb25lbnQgfSBmcm9tICcuL2ZhdGUtYm9vdHN0cmFwL2ZhdGUtYm9vdHN0cmFwLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBGYXRlTWF0ZXJpYWxDb21wb25lbnQgfSBmcm9tICcuL2ZhdGUtbWF0ZXJpYWwvZmF0ZS1tYXRlcmlhbC5jb21wb25lbnQnO1xuaW1wb3J0IHsgRmF0ZUxpbmtEcm9wZG93bkNvbXBvbmVudCB9IGZyb20gJy4vZmF0ZS1saW5rLWRyb3Bkb3duL2ZhdGUtbGluay1kcm9wZG93bi5jb21wb25lbnQnO1xuXG5leHBvcnQgeyBGYXRlUGFyc2VyIH0gZnJvbSAnLi9mYXRlLXBhcnNlci5pbnRlcmZhY2UnO1xuZXhwb3J0IHsgRmF0ZUljb24gfSBmcm9tICcuL2ZhdGUtaWNvbi5pbnRlcmZhY2UnO1xuZXhwb3J0IHsgRmF0ZURyb3Bkb3duIH0gZnJvbSAnLi9mYXRlLWRyb3Bkb3duLmludGVyZmFjZSc7XG5leHBvcnQgeyBGYXRlVWlDb21wb25lbnQgfSBmcm9tICcuL2ZhdGUtdWkvZmF0ZS11aS5jb21wb25lbnQnO1xuZXhwb3J0IHsgRmF0ZUlucHV0Q29tcG9uZW50IH0gZnJvbSAnLi9mYXRlLWlucHV0L2ZhdGUtaW5wdXQuY29tcG9uZW50JztcbmV4cG9ydCB7IEZhdGVMaW5rRHJvcGRvd25Db21wb25lbnQgfSBmcm9tICcuL2ZhdGUtbGluay1kcm9wZG93bi9mYXRlLWxpbmstZHJvcGRvd24uY29tcG9uZW50JztcbmV4cG9ydCB7IEZhdGVJY29uU2VydmljZSB9IGZyb20gJy4vZmF0ZS1pY29uLnNlcnZpY2UnO1xuZXhwb3J0IHsgRmF0ZU1hdGVyaWFsSWNvblNlcnZpY2UgfSBmcm9tICcuL2ZhdGUtbWF0ZXJpYWwtaWNvbi5zZXJ2aWNlJztcbmV4cG9ydCB7IEZhdGVGb250YXdzb21lTGVnYWN5SWNvblNlcnZpY2UgfSBmcm9tICcuL2ZhdGUtZm9udGF3c29tZS1sZWdhY3ktaWNvbi5zZXJ2aWNlJztcbmV4cG9ydCB7IEZhdGVQYXJzZXJTZXJ2aWNlIH0gZnJvbSAnLi9mYXRlLXBhcnNlci5zZXJ2aWNlJztcbmV4cG9ydCB7IEZhdGVDb250cm9sbGVyU2VydmljZSwgRmF0ZUNvbW1hbmQgfSBmcm9tICcuL2ZhdGUtY29udHJvbGxlci5zZXJ2aWNlJztcbmV4cG9ydCB7IEZhdGVIdG1sUGFyc2VyU2VydmljZSB9IGZyb20gJy4vZmF0ZS1odG1sLXBhcnNlci5zZXJ2aWNlJztcbmV4cG9ydCB7IEZhdGVOb2RlIH0gZnJvbSAnLi9mYXRlLW5vZGUnO1xuZXhwb3J0IHsgRmF0ZVR5cGUgfSBmcm9tICcuL2ZhdGUtdHlwZS5lbnVtJztcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgRmF0ZUlucHV0Q29tcG9uZW50LFxuICAgIEZhdGVVaUNvbXBvbmVudCxcbiAgICBGYXRlQm9vdHN0cmFwQ29tcG9uZW50LFxuICAgIEZhdGVMaW5rRHJvcGRvd25Db21wb25lbnRcbiAgXSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgRm9ybXNNb2R1bGUsIE1hdEZvcm1GaWVsZE1vZHVsZSwgRm9udEF3ZXNvbWVNb2R1bGVdLFxuICBleHBvcnRzOiBbXG4gICAgRmF0ZVVpQ29tcG9uZW50LFxuICAgIEZhdGVJbnB1dENvbXBvbmVudCxcbiAgICBGYXRlQm9vdHN0cmFwQ29tcG9uZW50LFxuICAgIEZhdGVMaW5rRHJvcGRvd25Db21wb25lbnRcbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBGYXRlTW9kdWxlIHt9XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW0ZhdGVNYXRlcmlhbENvbXBvbmVudF0sXG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIEZvcm1zTW9kdWxlLCBNYXRGb3JtRmllbGRNb2R1bGUsIEZhdGVNb2R1bGVdLFxuICBleHBvcnRzOiBbRmF0ZU1hdGVyaWFsQ29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBGYXRlTWF0ZXJpYWxNb2R1bGUge31cbiJdfQ==