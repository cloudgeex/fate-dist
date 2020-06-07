import { __decorate } from "tslib";
import { Component, Input, ElementRef, HostListener, OnChanges, AfterViewInit, ComponentFactoryResolver, ViewChild, ViewContainerRef, ViewRef } from '@angular/core';
import { FateControllerService } from '../fate-controller.service';
import { FateParserService } from '../fate-parser.service';
import { FateIconService } from '../fate-icon.service';
export const defaultButtons = [
    'bold',
    'italic',
    'underline',
    'strike',
    'separator',
    'subscript',
    'superscript',
    'link',
    'separator',
    'heading1',
    'heading2',
    'heading3',
    'heading4',
    'heading5',
    'heading6',
    'normal',
    'separator',
    'indent',
    'outdent',
    'ordered',
    'unordered',
    'separator',
    'center',
    'justify',
    'left',
    'right',
    'separator',
    'undo',
    'redo',
    'clean'
];
let FateUiComponent = class FateUiComponent {
    constructor(el, controller, icon, parser, factoryResolver) {
        this.el = el;
        this.controller = controller;
        this.icon = icon;
        this.parser = parser;
        this.factoryResolver = factoryResolver;
        this.uiId = 'default';
        this.buttons = defaultButtons;
        this.enabled = {};
        this.dropdownAction = false;
    }
    mouseDown(event) {
        if (!event.target.closest('.fate-ui-dropdown')) {
            event.preventDefault();
        }
    }
    keyUp(event) {
        if (event.key === 'Enter') {
            const name = event.target.name;
            if (name) {
                this.do(event, name);
            }
        }
    }
    do(event, action) {
        event.preventDefault();
        event.stopPropagation();
        if (this.controller.getAction(action).dropdown) {
            if (action === this.dropdownAction) {
                this.dropdownAction = false;
            }
            else {
                let button = event.target;
                if (!button.classList.contains('fate-ui-button')) {
                    button = button.closest('.fate-ui-button');
                }
                if (!button) {
                    return;
                }
                const dropdown = this.el.nativeElement.querySelector('.fate-ui-dropdown');
                // Enable the dropdown
                this.dropdownValue = this.enabled[action];
                console.debug('action has value', button, dropdown, this.dropdownValue);
                this.initDropdown(this.controller.getAction(action).dropdown, this.dropdownValue);
                // Postion the dropdown
                setTimeout(() => {
                    const buttonSize = button.getBoundingClientRect();
                    const dropdownSize = dropdown.getBoundingClientRect();
                    let leftPosition = button.offsetLeft + (buttonSize.width / 2) - (dropdownSize.width / 2);
                    // make sure the dropdown is not bleeding out of the viewport
                    if (buttonSize.left + window.pageXOffset + (buttonSize.width / 2) - (dropdownSize.width / 2) < 3) {
                        leftPosition = -buttonSize.left - window.pageXOffset + button.offsetLeft + 3;
                    }
                    else if (buttonSize.left + window.pageXOffset + (buttonSize.width / 2) + (dropdownSize.width / 2) > window.innerWidth - 3) {
                        leftPosition = window.innerWidth - buttonSize.left - window.pageXOffset + button.offsetLeft - dropdownSize.width - 3;
                    }
                    const topPosition = button.offsetTop + buttonSize.height - 3;
                    dropdown.style.left = leftPosition + 'px';
                    dropdown.style.top = topPosition + 'px';
                    // make the dropdown visible
                    this.dropdownAction = action;
                }, 0);
            }
        }
        else {
            this.dropdownAction = false;
            this.controller.do(this.uiId, action);
        }
    }
    getOffset(element) {
        let top = 0;
        let left = 0;
        do {
            top += element.offsetTop || 0;
            left += element.offsetLeft || 0;
            element = element.offsetParent;
        } while (element);
        return {
            top: top,
            left: left
        };
    }
    initDropdown(actionComponent, value) {
        if (this.dropdownComponent) {
            this.dropdownComponent.destroy();
        }
        const factory = this.factoryResolver.resolveComponentFactory(actionComponent);
        const component = factory.create(this.viewContainerRef.parentInjector);
        if (component.instance.valueChange) {
            component.instance.value = value;
            component.instance.valueChange.subscribe((newValue) => {
                this.dropdownValue = newValue;
                this.controller.do(this.uiId, this.dropdownAction, newValue);
            });
            this.dropdownComponent = this.viewContainerRef.insert(component.hostView);
        }
        else {
            throw new Error('The component used as a dropdown doesn\'t contain a valueChange emmiter!');
        }
    }
    ngOnChanges(changes) {
        if (changes['uiId']) {
            if (this.inputSubscription) {
                this.inputSubscription.unsubscribe();
            }
            this.inputSubscription = this.controller.enabled(this.uiId).subscribe((actions) => {
                this.enabled = {};
                for (const action of actions) {
                    this.enabled[action.action] = action.value || true;
                }
            });
        }
    }
    ngAfterViewInit() {
        const handle = window.addEventListener('mousedown', (event) => {
            if (!event.target.closest('.fate-ui-dropdown')) {
                this.dropdownAction = false;
            }
        });
    }
};
FateUiComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: FateControllerService },
    { type: FateIconService },
    { type: FateParserService },
    { type: ComponentFactoryResolver }
];
__decorate([
    Input()
], FateUiComponent.prototype, "uiId", void 0);
__decorate([
    Input()
], FateUiComponent.prototype, "buttons", void 0);
__decorate([
    HostListener('mousedown', ['$event'])
], FateUiComponent.prototype, "mouseDown", null);
__decorate([
    HostListener('keyup', ['$event'])
], FateUiComponent.prototype, "keyUp", null);
__decorate([
    ViewChild('dropdown', {
        read: ViewContainerRef,
        static: true,
    })
], FateUiComponent.prototype, "viewContainerRef", void 0);
FateUiComponent = __decorate([
    Component({
        selector: 'fate-ui',
        template: "<div>\n  <ng-container *ngFor=\"let button of buttons\">\n    <a *ngIf=\"button !== 'separator'\" tabindex=\"0\" class=\"fate-ui-button\" [name]=\"button\" [ngClass]=\"{enabled: enabled[button], 'with-dropdown': dropdownAction === button}\" (click)=\"do($event, button)\">\n      <span *ngIf=\"icon.getIcon(button) as iconName\" >\n        <fa-icon [icon]=\"['fas', iconName]\"></fa-icon>\n      </span>\n      <span *ngIf=\"!icon.getIcon(button)\">{{controller.getAction(button).label}}</span>\n      <span class=\"reader\">{{controller.getAction(button).name}}</span>\n    </a>\n    <div *ngIf=\"button === 'separator'\" class=\"fate-ui-separator\"></div>\n  </ng-container>\n  <div class=\"fate-ui-dropdown\" [ngClass]=\"{visible: dropdownAction}\">\n    <ng-template #dropdown></ng-template>\n  </div>\n</div>\n",
        styles: [":host{border:1px solid #ddd;border-bottom:0;display:block;box-sizing:border-box;padding:5px;background:#fff;color:#333;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;position:relative;overflow:visible}.fate-ui-separator{display:inline-block;width:2px;height:14px;vertical-align:middle;background-color:#ddd;border-radius:2px}.fate-ui-button{display:inline-block;height:25px;width:25px;text-align:center;line-height:25px;margin-bottom:3px;vertical-align:middle;cursor:pointer;font-size:14px;box-sizing:border-box;transition:background .3s;border-radius:3px;color:#333}.fate-ui-button.enabled,.fate-ui-button.with-dropdown,.fate-ui-button:active{background-color:#e5e5e5}.fate-ui-button:focus,.fate-ui-button:hover{background-color:#ccc}.fate-ui-button span.reader{display:none}.fate-ui-dropdown{opacity:0;pointer-events:none;z-index:1;font-size:14px;-webkit-user-select:all;-moz-user-select:all;-ms-user-select:all;user-select:all;box-sizing:border-box;border-radius:3px;background-color:#e5e5e5;position:absolute;padding:10px;border-bottom:1px solid #ccc;box-shadow:0 10px 10px -10px rgba(0,0,0,.3)}.fate-ui-dropdown.visible{opacity:1;pointer-events:all}"]
    })
], FateUiComponent);
export { FateUiComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmF0ZS11aS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9mYXRlLWVkaXRvci8iLCJzb3VyY2VzIjpbImFwcC9mYXRlLXVpL2ZhdGUtdWkuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUUsd0JBQXdCLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFLE9BQU8sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUlySyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUNuRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUMzRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFFdkQsTUFBTSxDQUFDLE1BQU0sY0FBYyxHQUFHO0lBQzVCLE1BQU07SUFDTixRQUFRO0lBQ1IsV0FBVztJQUNYLFFBQVE7SUFDUixXQUFXO0lBQ1gsV0FBVztJQUNYLGFBQWE7SUFDYixNQUFNO0lBQ04sV0FBVztJQUNYLFVBQVU7SUFDVixVQUFVO0lBQ1YsVUFBVTtJQUNWLFVBQVU7SUFDVixVQUFVO0lBQ1YsVUFBVTtJQUNWLFFBQVE7SUFDUixXQUFXO0lBQ1gsUUFBUTtJQUNSLFNBQVM7SUFDVCxTQUFTO0lBQ1QsV0FBVztJQUNYLFdBQVc7SUFDWCxRQUFRO0lBQ1IsU0FBUztJQUNULE1BQU07SUFDTixPQUFPO0lBQ1AsV0FBVztJQUNYLE1BQU07SUFDTixNQUFNO0lBQ04sT0FBTztDQUNSLENBQUM7QUFPRixJQUFhLGVBQWUsR0FBNUIsTUFBYSxlQUFlO0lBZTFCLFlBQXNCLEVBQWMsRUFBUyxVQUFpQyxFQUFTLElBQXFCLEVBQVksTUFBeUIsRUFBWSxlQUF5QztRQUFoTCxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQVMsZUFBVSxHQUFWLFVBQVUsQ0FBdUI7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LENBQUMsVUFBVSxFQUFFO1FBQ3JCLElBQUksRUFBRSxnQkFBZ0I7UUFDdEIsTUFBTSxFQUFFLElBQUk7S0FDYixDQUFDO3lEQUNnQztBQXRDdkIsZUFBZTtJQUwzQixTQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsU0FBUztRQUNuQiwyekJBQXVDOztLQUV4QyxDQUFDO0dBQ1csZUFBZSxDQTRJM0I7U0E1SVksZUFBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIEVsZW1lbnRSZWYsIEhvc3RMaXN0ZW5lciwgT25DaGFuZ2VzLCBBZnRlclZpZXdJbml0LCBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsIFZpZXdDaGlsZCwgVmlld0NvbnRhaW5lclJlZiwgVmlld1JlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgRmF0ZUNvbnRyb2xsZXJTZXJ2aWNlIH0gZnJvbSAnLi4vZmF0ZS1jb250cm9sbGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgRmF0ZVBhcnNlclNlcnZpY2UgfSBmcm9tICcuLi9mYXRlLXBhcnNlci5zZXJ2aWNlJztcbmltcG9ydCB7IEZhdGVJY29uU2VydmljZSB9IGZyb20gJy4uL2ZhdGUtaWNvbi5zZXJ2aWNlJztcblxuZXhwb3J0IGNvbnN0IGRlZmF1bHRCdXR0b25zID0gW1xuICAnYm9sZCcsXG4gICdpdGFsaWMnLFxuICAndW5kZXJsaW5lJyxcbiAgJ3N0cmlrZScsXG4gICdzZXBhcmF0b3InLFxuICAnc3Vic2NyaXB0JyxcbiAgJ3N1cGVyc2NyaXB0JyxcbiAgJ2xpbmsnLFxuICAnc2VwYXJhdG9yJyxcbiAgJ2hlYWRpbmcxJyxcbiAgJ2hlYWRpbmcyJyxcbiAgJ2hlYWRpbmczJyxcbiAgJ2hlYWRpbmc0JyxcbiAgJ2hlYWRpbmc1JyxcbiAgJ2hlYWRpbmc2JyxcbiAgJ25vcm1hbCcsXG4gICdzZXBhcmF0b3InLFxuICAnaW5kZW50JyxcbiAgJ291dGRlbnQnLFxuICAnb3JkZXJlZCcsXG4gICd1bm9yZGVyZWQnLFxuICAnc2VwYXJhdG9yJyxcbiAgJ2NlbnRlcicsXG4gICdqdXN0aWZ5JyxcbiAgJ2xlZnQnLFxuICAncmlnaHQnLFxuICAnc2VwYXJhdG9yJyxcbiAgJ3VuZG8nLFxuICAncmVkbycsXG4gICdjbGVhbidcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2ZhdGUtdWknLFxuICB0ZW1wbGF0ZVVybDogJy4vZmF0ZS11aS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2ZhdGUtdWkuY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBGYXRlVWlDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMsIEFmdGVyVmlld0luaXQge1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyB1aUlkOiBzdHJpbmcgPSAnZGVmYXVsdCc7XG5cbiAgQElucHV0KClcbiAgcHVibGljIGJ1dHRvbnM6IEFycmF5PHN0cmluZz4gPSBkZWZhdWx0QnV0dG9ucztcblxuICBwdWJsaWMgZW5hYmxlZDogYW55ID0ge307XG4gIHB1YmxpYyBkcm9wZG93bkFjdGlvbjogYm9vbGVhbiB8IHN0cmluZyA9IGZhbHNlO1xuICBwdWJsaWMgZHJvcGRvd25WYWx1ZTogc3RyaW5nO1xuICBwcm90ZWN0ZWQgZHJvcGRvd25Db21wb25lbnQ6IFZpZXdSZWY7XG5cbiAgcHJvdGVjdGVkIGlucHV0U3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGVsOiBFbGVtZW50UmVmLCBwdWJsaWMgY29udHJvbGxlcjogRmF0ZUNvbnRyb2xsZXJTZXJ2aWNlLCBwdWJsaWMgaWNvbjogRmF0ZUljb25TZXJ2aWNlLCBwcm90ZWN0ZWQgcGFyc2VyOiBGYXRlUGFyc2VyU2VydmljZSwgcHJvdGVjdGVkIGZhY3RvcnlSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyKSB7IH1cblxuICBASG9zdExpc3RlbmVyKCdtb3VzZWRvd24nLCBbJyRldmVudCddKVxuICBwdWJsaWMgbW91c2VEb3duKGV2ZW50KSB7XG4gICAgaWYgKCFldmVudC50YXJnZXQuY2xvc2VzdCgnLmZhdGUtdWktZHJvcGRvd24nKSkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdrZXl1cCcsIFsnJGV2ZW50J10pXG4gIHB1YmxpYyBrZXlVcChldmVudCkge1xuICAgIGlmIChldmVudC5rZXkgPT09ICdFbnRlcicpIHtcbiAgICAgIGNvbnN0IG5hbWUgPSBldmVudC50YXJnZXQubmFtZTtcbiAgICAgIGlmIChuYW1lKSB7XG4gICAgICAgIHRoaXMuZG8oZXZlbnQsIG5hbWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIEBWaWV3Q2hpbGQoJ2Ryb3Bkb3duJywge1xuICAgIHJlYWQ6IFZpZXdDb250YWluZXJSZWYsXG4gICAgc3RhdGljOiB0cnVlLFxuICB9KVxuICB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmXG5cbiAgcHVibGljIGRvKGV2ZW50LCBhY3Rpb24pIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGlmICh0aGlzLmNvbnRyb2xsZXIuZ2V0QWN0aW9uKGFjdGlvbikuZHJvcGRvd24pIHtcbiAgICAgIGlmIChhY3Rpb24gPT09IHRoaXMuZHJvcGRvd25BY3Rpb24pIHtcbiAgICAgICAgdGhpcy5kcm9wZG93bkFjdGlvbiA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGJ1dHRvbiA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgaWYgKCFidXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdmYXRlLXVpLWJ1dHRvbicpKSB7XG4gICAgICAgICAgYnV0dG9uID0gYnV0dG9uLmNsb3Nlc3QoJy5mYXRlLXVpLWJ1dHRvbicpO1xuICAgICAgICB9XG4gICAgICAgIGlmKCFidXR0b24pIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkcm9wZG93biA9ICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmZhdGUtdWktZHJvcGRvd24nKTtcblxuICAgICAgICAvLyBFbmFibGUgdGhlIGRyb3Bkb3duXG5cbiAgICAgICAgdGhpcy5kcm9wZG93blZhbHVlID0gdGhpcy5lbmFibGVkW2FjdGlvbl07XG4gICAgICAgIGNvbnNvbGUuZGVidWcoJ2FjdGlvbiBoYXMgdmFsdWUnLCBidXR0b24sIGRyb3Bkb3duLCB0aGlzLmRyb3Bkb3duVmFsdWUpO1xuICAgICAgICB0aGlzLmluaXREcm9wZG93bih0aGlzLmNvbnRyb2xsZXIuZ2V0QWN0aW9uKGFjdGlvbikuZHJvcGRvd24sIHRoaXMuZHJvcGRvd25WYWx1ZSk7XG5cbiAgICAgICAgLy8gUG9zdGlvbiB0aGUgZHJvcGRvd25cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgY29uc3QgYnV0dG9uU2l6ZSA9IGJ1dHRvbi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICBjb25zdCBkcm9wZG93blNpemUgPSAgZHJvcGRvd24uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgbGV0IGxlZnRQb3NpdGlvbiA9IGJ1dHRvbi5vZmZzZXRMZWZ0ICsgKGJ1dHRvblNpemUud2lkdGggLyAyKSAtIChkcm9wZG93blNpemUud2lkdGggLyAyKTtcbiAgICAgICAgICAvLyBtYWtlIHN1cmUgdGhlIGRyb3Bkb3duIGlzIG5vdCBibGVlZGluZyBvdXQgb2YgdGhlIHZpZXdwb3J0XG4gICAgICAgICAgaWYgKGJ1dHRvblNpemUubGVmdCArIHdpbmRvdy5wYWdlWE9mZnNldCArIChidXR0b25TaXplLndpZHRoIC8gMikgLSAoZHJvcGRvd25TaXplLndpZHRoIC8gMikgPCAzKSB7XG4gICAgICAgICAgICBsZWZ0UG9zaXRpb24gPSAtIGJ1dHRvblNpemUubGVmdCAtIHdpbmRvdy5wYWdlWE9mZnNldCArIGJ1dHRvbi5vZmZzZXRMZWZ0ICsgMztcbiAgICAgICAgICB9IGVsc2UgaWYgKGJ1dHRvblNpemUubGVmdCArIHdpbmRvdy5wYWdlWE9mZnNldCArIChidXR0b25TaXplLndpZHRoIC8gMikgKyAoZHJvcGRvd25TaXplLndpZHRoIC8gMikgPiB3aW5kb3cuaW5uZXJXaWR0aCAtIDMpIHtcbiAgICAgICAgICAgIGxlZnRQb3NpdGlvbiA9IHdpbmRvdy5pbm5lcldpZHRoIC0gYnV0dG9uU2l6ZS5sZWZ0IC0gd2luZG93LnBhZ2VYT2Zmc2V0ICsgYnV0dG9uLm9mZnNldExlZnQgLSBkcm9wZG93blNpemUud2lkdGggLSAzO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCB0b3BQb3NpdGlvbiA9IGJ1dHRvbi5vZmZzZXRUb3AgKyBidXR0b25TaXplLmhlaWdodCAtIDM7XG4gICAgICAgICAgZHJvcGRvd24uc3R5bGUubGVmdCA9IGxlZnRQb3NpdGlvbiArICdweCc7XG4gICAgICAgICAgZHJvcGRvd24uc3R5bGUudG9wID0gdG9wUG9zaXRpb24gKyAncHgnO1xuICAgICAgICAgIC8vIG1ha2UgdGhlIGRyb3Bkb3duIHZpc2libGVcbiAgICAgICAgICB0aGlzLmRyb3Bkb3duQWN0aW9uID0gYWN0aW9uO1xuICAgICAgICB9LCAwKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kcm9wZG93bkFjdGlvbiA9IGZhbHNlO1xuICAgICAgdGhpcy5jb250cm9sbGVyLmRvKHRoaXMudWlJZCwgYWN0aW9uKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0T2Zmc2V0KGVsZW1lbnQpIHtcbiAgICBsZXQgdG9wID0gMDtcbiAgICBsZXQgbGVmdCA9IDA7XG4gICAgZG8ge1xuICAgICAgICB0b3AgKz0gZWxlbWVudC5vZmZzZXRUb3AgIHx8IDA7XG4gICAgICAgIGxlZnQgKz0gZWxlbWVudC5vZmZzZXRMZWZ0IHx8IDA7XG4gICAgICAgIGVsZW1lbnQgPSBlbGVtZW50Lm9mZnNldFBhcmVudDtcbiAgICB9IHdoaWxlIChlbGVtZW50KTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHRvcDogdG9wLFxuICAgICAgICBsZWZ0OiBsZWZ0XG4gICAgfTtcbiAgfVxuXG4gIHByb3RlY3RlZCBpbml0RHJvcGRvd24oYWN0aW9uQ29tcG9uZW50LCB2YWx1ZSkge1xuICAgIGlmICh0aGlzLmRyb3Bkb3duQ29tcG9uZW50KSB7XG4gICAgICB0aGlzLmRyb3Bkb3duQ29tcG9uZW50LmRlc3Ryb3koKTtcbiAgICB9XG4gICAgY29uc3QgZmFjdG9yeSA9IHRoaXMuZmFjdG9yeVJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KGFjdGlvbkNvbXBvbmVudCk7XG4gICAgY29uc3QgY29tcG9uZW50OiBhbnkgPSBmYWN0b3J5LmNyZWF0ZSh0aGlzLnZpZXdDb250YWluZXJSZWYucGFyZW50SW5qZWN0b3IpO1xuICAgIGlmIChjb21wb25lbnQuaW5zdGFuY2UudmFsdWVDaGFuZ2UpIHtcbiAgICAgIGNvbXBvbmVudC5pbnN0YW5jZS52YWx1ZSA9IHZhbHVlO1xuICAgICAgY29tcG9uZW50Lmluc3RhbmNlLnZhbHVlQ2hhbmdlLnN1YnNjcmliZSgobmV3VmFsdWUpID0+IHtcbiAgICAgICAgdGhpcy5kcm9wZG93blZhbHVlID0gbmV3VmFsdWU7XG4gICAgICAgIHRoaXMuY29udHJvbGxlci5kbyh0aGlzLnVpSWQsIHRoaXMuZHJvcGRvd25BY3Rpb24sIG5ld1ZhbHVlKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5kcm9wZG93bkNvbXBvbmVudCA9IHRoaXMudmlld0NvbnRhaW5lclJlZi5pbnNlcnQoY29tcG9uZW50Lmhvc3RWaWV3KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgY29tcG9uZW50IHVzZWQgYXMgYSBkcm9wZG93biBkb2VzblxcJ3QgY29udGFpbiBhIHZhbHVlQ2hhbmdlIGVtbWl0ZXIhJyk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG5nT25DaGFuZ2VzKGNoYW5nZXMpIHtcbiAgICBpZiAoY2hhbmdlc1sndWlJZCddKSB7XG4gICAgICBpZiAodGhpcy5pbnB1dFN1YnNjcmlwdGlvbikge1xuICAgICAgICB0aGlzLmlucHV0U3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9XG4gICAgICB0aGlzLmlucHV0U3Vic2NyaXB0aW9uID0gdGhpcy5jb250cm9sbGVyLmVuYWJsZWQodGhpcy51aUlkKS5zdWJzY3JpYmUoKGFjdGlvbnM6IGFueSkgPT4ge1xuICAgICAgICB0aGlzLmVuYWJsZWQgPSB7fTtcbiAgICAgICAgZm9yIChjb25zdCBhY3Rpb24gb2YgYWN0aW9ucykge1xuICAgICAgICAgIHRoaXMuZW5hYmxlZFthY3Rpb24uYWN0aW9uXSA9IGFjdGlvbi52YWx1ZSB8fCB0cnVlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGNvbnN0IGhhbmRsZSA9IHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmICghKGV2ZW50LnRhcmdldCBhcyBFbGVtZW50KS5jbG9zZXN0KCcuZmF0ZS11aS1kcm9wZG93bicpKSB7XG4gICAgICAgIHRoaXMuZHJvcGRvd25BY3Rpb24gPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIl19