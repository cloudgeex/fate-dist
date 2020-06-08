var FateInputComponent_1;
import { __decorate } from "tslib";
import { Component, Input, Output, ViewChild, ElementRef, ViewRef, ViewContainerRef, ComponentFactoryResolver, OnInit, OnChanges, AfterViewInit, OnDestroy, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FateControllerService } from '../fate-controller.service';
import { FateHtmlParserService } from '../fate-html-parser.service';
import { FateParserService } from '../fate-parser.service';
let FateInputComponent = FateInputComponent_1 = class FateInputComponent {
    constructor(el, controller, htmlParser, parser, sanitizer, factoryResolver) {
        this.el = el;
        this.controller = controller;
        this.htmlParser = htmlParser;
        this.parser = parser;
        this.sanitizer = sanitizer;
        this.factoryResolver = factoryResolver;
        this.uiId = 'default';
        this.placeholder = '';
        this.initialFocus = false;
        this.focus = new EventEmitter();
        this.blur = new EventEmitter();
        this.empty = true;
        this.isFocused = false;
        // implentation of ControlValueAccessor:
        this.changed = new Array();
    }
    reactToChanges() {
        const tree = this.htmlParser.parseElement(this.editTarget);
        const serializedTree = this.parser.serialize(tree);
        this.changed.forEach(f => f(serializedTree));
    }
    ngOnInit() {
        this.subscribeToUi(this.uiId);
    }
    ngAfterViewInit() {
        this.editTarget = this.el.nativeElement.querySelector('.fate-edit-target');
        if (this.row) {
            this.computeHeight();
        }
        this.editTarget.addEventListener('click', (event) => {
            console.debug('click');
            // On click we save the text Selection
            this.saveSelection();
            // We check if there is a dropdown matching this context
            this.checkForDropdownContext();
        });
        this.editTarget.addEventListener('keyup', (event) => {
            console.debug('keypressed');
            // On click we save the text Selection
            this.saveSelection();
            // We check if there is a dropdown matching this context
            this.checkForDropdownContext();
        });
        this.editTarget.addEventListener('focus', (event) => {
            console.debug('(' + this.uiId + ') focus');
            // On focus we restore it
            this.restoreSelection();
            this.isFocused = true;
            this.focus.emit();
        });
        this.editTarget.addEventListener('blur', (event) => {
            console.debug('(' + this.uiId + ') blur');
            this.isFocused = false;
            this.blur.emit();
            this.saveSelection();
            if (this.dropdownComponent) {
                setTimeout(() => {
                    this.inlineAction = null;
                    this.dropdownComponent.destroy();
                }, 300);
                // this.inlineAction = null;
                // this.dropdownComponent.destroy();
            }
        });
        this.editTarget.addEventListener('keydown', (event) => {
            console.debug('keydown', event);
            const stopDefault = () => {
                event.preventDefault();
                event.stopPropagation();
            };
            const stopDefaultAndForceUpdate = () => {
                stopDefault();
                this.checkEmpty();
                this.reactToChanges();
            };
            // This is needed because, if the current selection is part
            // of a non-editable child of the input, the default delete won't
            // work.
            // This case can happen if there is a cutom element that
            // was inserted by some custom controller.
            //
            // Some constraints for a custom block to work on top of contenteditable=false:
            // -moz-user-select: none;
            // -webkit-user-modify: read-only;
            //
            // Note: It may make sense to delete the selection for normal text
            // input too but for now we only do it on deletion.
            if (event.key === 'Backspace' ||
                (event.key === 'Delete' && this.selectionRange)) {
                const node = this.selectionRange.commonAncestorContainer;
                console.debug('Deletion', node);
                if (node instanceof HTMLElement &&
                    !node.isContentEditable) {
                    // this is the case on firefox
                    console.debug('deleting inside un-editable block detected');
                    this.selectionRange.selectNode(node);
                    this.selectionRange.deleteContents();
                    stopDefaultAndForceUpdate();
                }
                else if (node.nodeName === '#text' &&
                    !node.parentElement.isContentEditable) {
                    // this is the case on webkit
                    console.debug('deleting inside un-editable block detected');
                    this.selectionRange.selectNode(node.parentElement);
                    this.selectionRange.deleteContents();
                    stopDefaultAndForceUpdate();
                }
            }
            // This is needed because, there is a bug in Firefox that prevent
            // deleting a uneditable element inside an editable element. So we
            // reimplement the whole function for all browsers.
            if (event.key === 'Backspace' && this.selectionRange) {
                const node = this.selectionRange.commonAncestorContainer;
                if (this.selectionRange.collapsed === true &&
                    this.selectionRange.startOffset === 0 &&
                    node.previousSibling instanceof HTMLElement &&
                    !node.previousSibling.isContentEditable) {
                    node.previousSibling.remove();
                    stopDefaultAndForceUpdate();
                }
            }
            else if (event.key === 'Delete' && this.selectionRange) {
                const node = this.selectionRange.commonAncestorContainer;
                if (this.selectionRange.collapsed === true &&
                    this.selectionRange.endContainer.nodeName === '#text' &&
                    this.selectionRange.endOffset ===
                        this.selectionRange.endContainer.length &&
                    node.nextSibling instanceof HTMLElement &&
                    !node.nextSibling.isContentEditable) {
                    node.nextSibling.remove();
                    stopDefaultAndForceUpdate();
                }
            }
            // If a dropdown is currently being displayed we use the up/down
            // key to navigate its content and return to select the selected
            // element
            if (this.inlineAction) {
                if (event.key === 'Up' || event.key === 'ArrowUp') {
                    stopDefault();
                    this.dropdownInstance.selecPrevious();
                }
                else if (event.key === 'Down' || event.key === 'ArrowDown') {
                    stopDefault();
                    this.dropdownInstance.selectNext();
                }
                else if (event.key === 'Enter') {
                    stopDefault();
                    this.dropdownInstance.confirmSelection();
                }
            }
        });
        this.editTarget.addEventListener('input', (event) => {
            console.debug('value changed');
            this.checkEmpty();
            this.reactToChanges();
        });
        const style = window.getComputedStyle(this.editTarget);
        this.editTarget.style.minHeight = this.getHeight(2);
        if (this.initialFocus) {
            this.editTarget.focus();
        }
    }
    ngOnChanges(changes) {
        if (changes['uiId']) {
            this.subscribeToUi(this.uiId);
        }
        if (changes['row']) {
            if (this.editTarget) {
                this.computeHeight();
            }
        }
    }
    ngOnDestroy() {
        if (this.uiSubscription) {
            this.uiSubscription.unsubscribe();
        }
    }
    computeHeight() {
        this.editTarget.style.height = this.getHeight(this.row);
    }
    checkEmpty() {
        if (this.editTarget.innerHTML === '') {
            this.editTarget.innerHTML = '<br>';
            this.empty = true;
        }
        else if (this.editTarget.innerHTML === '<br>') {
            this.empty = true;
        }
        else {
            this.empty = false;
        }
    }
    getHeight(rowCount) {
        const style = window.getComputedStyle(this.editTarget);
        let height = (this.editTarget.style.height =
            parseInt(style.lineHeight, 10) * rowCount);
        if (style.boxSizing === 'border-box') {
            height +=
                parseInt(style.paddingTop, 10) +
                    parseInt(style.paddingBottom, 10) +
                    parseInt(style.borderTopWidth, 10) +
                    parseInt(style.borderBottomWidth, 10);
        }
        return height + 'px';
    }
    subscribeToUi(uiId) {
        console.debug('subscribing to ' + uiId, this.uiSubscription);
        if (this.uiSubscription) {
            this.uiSubscription.unsubscribe();
        }
        this.uiSubscription = this.controller.channel(uiId).subscribe(command => {
            // if input is not on focus we save current focus:
            const focus = document.activeElement;
            console.debug('(' + uiId + ') got command ' + command.name + '/' + command.value);
            this.restoreSelection();
            if (command.name === 'insertHTML' && this.selectionRange) {
                // If something is selected we assume that the goal is to replace it,
                // so first we delete the content
                this.selectionRange.deleteContents();
                // insertHtml seems quite broken so we do it ourseleves
                this.selectionRange.insertNode(document.createRange().createContextualFragment(command.value));
                // move cusor to the end of the newly inserted element
                this.selectionRange.collapse(false);
                // Force the update of the model
                this.checkEmpty();
                this.reactToChanges();
            }
            else {
                document.execCommand(command.name, false, command.value);
            }
            this.saveSelection();
            focus.focus();
        });
    }
    saveSelection() {
        if (this.selectionInEditableTarget()) {
            const sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                this.selectionRange = sel.getRangeAt(0);
                console.debug('(' + this.uiId + ') saveSelection', this.selectionRange);
                this.detectStyle();
            }
        }
    }
    // Restors the current text selection
    restoreSelection() {
        if (this.selectionInEditableTarget()) {
            return;
        }
        console.debug('(' + this.uiId + ') restoreSelection', this.selectionRange);
        if (this.selectionRange) {
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(this.selectionRange);
        }
    }
    selectionInEditableTarget() {
        const sel = window.getSelection();
        const node = sel.getRangeAt &&
            sel.rangeCount &&
            sel.getRangeAt(0) &&
            sel.getRangeAt(0).commonAncestorContainer;
        return (node &&
            (node === this.editTarget ||
                (node.parentElement.closest('.fate-edit-target') &&
                    node.parentElement.closest('.fate-edit-target') === this.editTarget)));
    }
    detectStyle() {
        let node = this.selectionRange.commonAncestorContainer;
        if (!node ||
            !(node.parentElement.closest('.fate-edit-target') &&
                node !== this.editTarget)) {
            // The current selection is not contained in the editable zone.
            // this is most likely due to the input being empty.
            return;
        }
        // special cases for FF when selection is obtained by double click:
        if (this.selectionRange.endOffset === 0 &&
            this.selectionRange.startContainer.nodeValue &&
            this.selectionRange.startOffset ===
                this.selectionRange.startContainer.nodeValue.length) {
            node = this.selectionRange.startContainer.nextSibling;
        }
        else if (this.selectionRange.endOffset === 0 &&
            this.selectionRange.startOffset === 0) {
            node = this.selectionRange.startContainer.parentElement;
        }
        else if (this.selectionRange.commonAncestorContainer === this.editTarget &&
            this.selectionRange.startContainer === this.editTarget &&
            this.selectionRange.endContainer === this.editTarget) {
            node = this.selectionRange.commonAncestorContainer.childNodes[this.selectionRange.startOffset];
        }
        if (node && node !== this.editTarget) {
            const nodes = this.htmlParser.findParentNodes(node, this.editTarget);
            console.debug('  -> detected actions: ', nodes);
            this.controller.enableActions(this.uiId, nodes);
        }
    }
    writeValue(value) {
        if (value) {
            this.content = this.sanitizer.bypassSecurityTrustHtml(this.htmlParser.serialize(this.parser.parse(value)));
            this.empty = false;
        }
        else {
            this.content = this.sanitizer.bypassSecurityTrustHtml('<br>');
            this.empty = true;
        }
        this.selectionRange = undefined;
    }
    registerOnChange(fn) {
        this.changed.push(fn);
    }
    registerOnTouched(fn) { }
    checkForDropdownContext() {
        const startPos = Math.max(this.selectionRange.startOffset - 20, 0);
        const length = this.selectionRange.startOffset - startPos;
        const context = this.selectionRange.startContainer.textContent.substr(startPos, length);
        const inlineAction = this.controller.getInlineAction(context);
        if (inlineAction) {
            if (!this.inlineAction ||
                this.inlineAction.dropdown !== inlineAction.dropdown) {
                this.inlineAction = inlineAction;
                this.initDropdown(inlineAction, this.selectionRange.getBoundingClientRect());
            }
            else {
                this.inlineAction = inlineAction;
                this.updateDropdown(inlineAction.matched);
            }
        }
        else if (this.dropdownComponent) {
            this.inlineAction = null;
            this.dropdownComponent.destroy();
        }
    }
    initDropdown(actionComponent, position) {
        // set the dropdown component
        if (this.dropdownComponent) {
            this.dropdownComponent.destroy();
        }
        const factory = this.factoryResolver.resolveComponentFactory(actionComponent.dropdown);
        const component = factory.create(this.viewContainerRef.parentInjector);
        if (component.instance.valueChange) {
            component.instance.value = actionComponent.matched;
            component.instance.valueChange.subscribe(value => {
                this.editTarget.focus();
                const end = this.selectionRange.endOffset;
                this.selectionRange.setStart(this.selectionRange.endContainer, end - actionComponent.matched.length);
                this.controller.doInline(this.uiId, this.inlineAction, value);
                // delete the dropdown
                this.inlineAction = null;
                this.dropdownComponent.destroy();
            });
            this.dropdownComponent = this.viewContainerRef.insert(component.hostView);
            this.dropdownInstance = component.instance;
            this.updateDropdownPosition();
        }
        else {
            throw new Error('The component used as a dropdown doesn\'t contain a valueChange emmiter!');
        }
    }
    updateDropdown(value) {
        this.dropdownInstance.value = value;
        this.updateDropdownPosition();
    }
    updateDropdownPosition() {
        if (this.inlineAction.display === 'contextual') {
            // create a selection to get the size of the matching text
            const parentOffsetBB = this.el.nativeElement.offsetParent.getBoundingClientRect();
            const range = this.selectionRange.cloneRange();
            const end = range.endOffset;
            range.setStart(range.endContainer, end - this.inlineAction.matched.length);
            const boundingBox = range.getBoundingClientRect();
            this.dropdownPostionTop =
                boundingBox.top + boundingBox.height - parentOffsetBB.top + 'px';
            this.dropdownPostionLeft = boundingBox.left - parentOffsetBB.left + 'px';
        }
    }
};
FateInputComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: FateControllerService },
    { type: FateHtmlParserService },
    { type: FateParserService },
    { type: DomSanitizer },
    { type: ComponentFactoryResolver }
];
__decorate([
    Input()
], FateInputComponent.prototype, "uiId", void 0);
__decorate([
    Input()
], FateInputComponent.prototype, "row", void 0);
__decorate([
    Input()
], FateInputComponent.prototype, "customClass", void 0);
__decorate([
    Input()
], FateInputComponent.prototype, "placeholder", void 0);
__decorate([
    Input()
], FateInputComponent.prototype, "initialFocus", void 0);
__decorate([
    Output()
], FateInputComponent.prototype, "focus", void 0);
__decorate([
    Output()
], FateInputComponent.prototype, "blur", void 0);
__decorate([
    ViewChild('dropdown', {
        read: ViewContainerRef,
        static: true
    })
], FateInputComponent.prototype, "viewContainerRef", void 0);
FateInputComponent = FateInputComponent_1 = __decorate([
    Component({
        selector: 'fate-input',
        template: `
    <div
      class="fate-inline-dropdown"
      [class.hidden]="!inlineAction"
      [class.contextual]="inlineAction?.display === 'contextual'"
      [style.top]="dropdownPostionTop"
      [style.left]="dropdownPostionLeft"
    >
      <ng-template #dropdown></ng-template>
    </div>
    <div
      [class]="'fate-edit-target ' + customClass"
      [ngClass]="{ empty: empty }"
      contenteditable="true"
      [title]="placeholder"
      [innerHtml]="content"
    ></div>
  `,
        providers: [
            { provide: NG_VALUE_ACCESSOR, useExisting: FateInputComponent_1, multi: true }
        ],
        styles: [`
      :host div.fate-edit-target {
        display: block;
        padding: 10px;
        border: 1px solid #ddd;
        outline: 0;
        resize: vertical;
        overflow: auto;
        background: #fff;
        color: #000;
        overflow: visible;
      }
      :host div.fate-edit-target.empty:not(:focus):before {
        content: attr(title);
        color: #636c72;
      }
      .fate-inline-dropdown {
        border: 1px solid #ddd;
        border-bottom: 0;
      }
      .fate-inline-dropdown.hidden {
        display: none !important;
      }
      .fate-inline-dropdown.contextual {
        position: absolute;
        background: #fff;
        box-shadow: 0 5px 30px -10px rgba(0, 0, 0, 0.4);
        border-bottom: 1px solid #ccc;
      }
      :host {
        margin-bottom: 10px;
        /*position: relative;*/
      }
    `]
    })
], FateInputComponent);
export { FateInputComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmF0ZS1pbnB1dC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9mYXRlLWVkaXRvci8iLCJzb3VyY2VzIjpbImFwcC9mYXRlLWlucHV0L2ZhdGUtaW5wdXQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFNBQVMsRUFDVCxVQUFVLEVBQ1YsT0FBTyxFQUNQLGdCQUFnQixFQUNoQix3QkFBd0IsRUFDeEIsTUFBTSxFQUNOLFNBQVMsRUFDVCxhQUFhLEVBQ2IsU0FBUyxFQUNULFlBQVksRUFDYixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsaUJBQWlCLEVBQXdCLE1BQU0sZ0JBQWdCLENBQUM7QUFDekUsT0FBTyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUluRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUNuRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUNwRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQThEM0QsSUFBYSxrQkFBa0IsMEJBQS9CLE1BQWEsa0JBQWtCO0lBdUM3QixZQUNZLEVBQWMsRUFDZCxVQUFpQyxFQUNqQyxVQUFpQyxFQUNqQyxNQUF5QixFQUN6QixTQUF1QixFQUN2QixlQUF5QztRQUx6QyxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQ2QsZUFBVSxHQUFWLFVBQVUsQ0FBdUI7UUFDakMsZUFBVSxHQUFWLFVBQVUsQ0FBdUI7UUFDakMsV0FBTSxHQUFOLE1BQU0sQ0FBbUI7UUFDekIsY0FBUyxHQUFULFNBQVMsQ0FBYztRQUN2QixvQkFBZSxHQUFmLGVBQWUsQ0FBMEI7UUExQzlDLFNBQUksR0FBVyxTQUFTLENBQUM7UUFTekIsZ0JBQVcsR0FBVyxFQUFFLENBQUM7UUFHekIsaUJBQVksR0FB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LGlCQUFpQjtZQUNkLFlBQVk7WUFDTix3QkFBd0I7O0FBMUNyRDtJQURDLEtBQUssRUFBRTtnREFDd0I7QUFHaEM7SUFEQyxLQUFLLEVBQUU7K0NBQ1c7QUFHbkI7SUFEQyxLQUFLLEVBQUU7dURBQ21CO0FBRzNCO0lBREMsS0FBSyxFQUFFO3VEQUN3QjtBQUdoQztJQURDLEtBQUssRUFBRTt3REFDNkI7QUFHckM7SUFEQyxNQUFNLEVBQUU7aURBQytCO0FBR3hDO0lBREMsTUFBTSxFQUFFO2dEQUM4QjtBQU12QztJQUpDLFNBQVMsQ0FBQyxVQUFVLEVBQUU7UUFDckIsSUFBSSxFQUFFLGdCQUFnQjtRQUN0QixNQUFNLEVBQUUsSUFBSTtLQUNiLENBQUM7NERBQ2lDO0FBM0J4QixrQkFBa0I7SUE1RDlCLFNBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxZQUFZO1FBQ3RCLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQlQ7UUFxQ0QsU0FBUyxFQUFFO1lBQ1QsRUFBRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsV0FBVyxFQUFFLG9CQUFrQixFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7U0FDN0U7aUJBckNDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7S0FpQ0M7S0FLSixDQUFDO0dBQ1csa0JBQWtCLENBOGQ5QjtTQTlkWSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIFZpZXdDaGlsZCxcbiAgRWxlbWVudFJlZixcbiAgVmlld1JlZixcbiAgVmlld0NvbnRhaW5lclJlZixcbiAgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICBPbkluaXQsXG4gIE9uQ2hhbmdlcyxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgT25EZXN0cm95LFxuICBFdmVudEVtaXR0ZXJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOR19WQUxVRV9BQ0NFU1NPUiwgQ29udHJvbFZhbHVlQWNjZXNzb3IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBEb21TYW5pdGl6ZXIsIFNhZmVIdG1sIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5cbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBGYXRlQ29udHJvbGxlclNlcnZpY2UgfSBmcm9tICcuLi9mYXRlLWNvbnRyb2xsZXIuc2VydmljZSc7XG5pbXBvcnQgeyBGYXRlSHRtbFBhcnNlclNlcnZpY2UgfSBmcm9tICcuLi9mYXRlLWh0bWwtcGFyc2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgRmF0ZVBhcnNlclNlcnZpY2UgfSBmcm9tICcuLi9mYXRlLXBhcnNlci5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZmF0ZS1pbnB1dCcsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdlxuICAgICAgY2xhc3M9XCJmYXRlLWlubGluZS1kcm9wZG93blwiXG4gICAgICBbY2xhc3MuaGlkZGVuXT1cIiFpbmxpbmVBY3Rpb25cIlxuICAgICAgW2NsYXNzLmNvbnRleHR1YWxdPVwiaW5saW5lQWN0aW9uPy5kaXNwbGF5ID09PSAnY29udGV4dHVhbCdcIlxuICAgICAgW3N0eWxlLnRvcF09XCJkcm9wZG93blBvc3Rpb25Ub3BcIlxuICAgICAgW3N0eWxlLmxlZnRdPVwiZHJvcGRvd25Qb3N0aW9uTGVmdFwiXG4gICAgPlxuICAgICAgPG5nLXRlbXBsYXRlICNkcm9wZG93bj48L25nLXRlbXBsYXRlPlxuICAgIDwvZGl2PlxuICAgIDxkaXZcbiAgICAgIFtjbGFzc109XCInZmF0ZS1lZGl0LXRhcmdldCAnICsgY3VzdG9tQ2xhc3NcIlxuICAgICAgW25nQ2xhc3NdPVwieyBlbXB0eTogZW1wdHkgfVwiXG4gICAgICBjb250ZW50ZWRpdGFibGU9XCJ0cnVlXCJcbiAgICAgIFt0aXRsZV09XCJwbGFjZWhvbGRlclwiXG4gICAgICBbaW5uZXJIdG1sXT1cImNvbnRlbnRcIlxuICAgID48L2Rpdj5cbiAgYCxcbiAgc3R5bGVzOiBbXG4gICAgYFxuICAgICAgOmhvc3QgZGl2LmZhdGUtZWRpdC10YXJnZXQge1xuICAgICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgICAgcGFkZGluZzogMTBweDtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgI2RkZDtcbiAgICAgICAgb3V0bGluZTogMDtcbiAgICAgICAgcmVzaXplOiB2ZXJ0aWNhbDtcbiAgICAgICAgb3ZlcmZsb3c6IGF1dG87XG4gICAgICAgIGJhY2tncm91bmQ6ICNmZmY7XG4gICAgICAgIGNvbG9yOiAjMDAwO1xuICAgICAgICBvdmVyZmxvdzogdmlzaWJsZTtcbiAgICAgIH1cbiAgICAgIDpob3N0IGRpdi5mYXRlLWVkaXQtdGFyZ2V0LmVtcHR5Om5vdCg6Zm9jdXMpOmJlZm9yZSB7XG4gICAgICAgIGNvbnRlbnQ6IGF0dHIodGl0bGUpO1xuICAgICAgICBjb2xvcjogIzYzNmM3MjtcbiAgICAgIH1cbiAgICAgIC5mYXRlLWlubGluZS1kcm9wZG93biB7XG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNkZGQ7XG4gICAgICAgIGJvcmRlci1ib3R0b206IDA7XG4gICAgICB9XG4gICAgICAuZmF0ZS1pbmxpbmUtZHJvcGRvd24uaGlkZGVuIHtcbiAgICAgICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICAgICAgfVxuICAgICAgLmZhdGUtaW5saW5lLWRyb3Bkb3duLmNvbnRleHR1YWwge1xuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgIGJhY2tncm91bmQ6ICNmZmY7XG4gICAgICAgIGJveC1zaGFkb3c6IDAgNXB4IDMwcHggLTEwcHggcmdiYSgwLCAwLCAwLCAwLjQpO1xuICAgICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2NjYztcbiAgICAgIH1cbiAgICAgIDpob3N0IHtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMTBweDtcbiAgICAgICAgLypwb3NpdGlvbjogcmVsYXRpdmU7Ki9cbiAgICAgIH1cbiAgICBgXG4gIF0sXG4gIHByb3ZpZGVyczogW1xuICAgIHsgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsIHVzZUV4aXN0aW5nOiBGYXRlSW5wdXRDb21wb25lbnQsIG11bHRpOiB0cnVlIH1cbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBGYXRlSW5wdXRDb21wb25lbnRcbiAgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciwgT25DaGFuZ2VzLCBPbkluaXQsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgpXG4gIHB1YmxpYyB1aUlkOiBzdHJpbmcgPSAnZGVmYXVsdCc7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHJvdzogbnVtYmVyO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBjdXN0b21DbGFzczogc3RyaW5nO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBwbGFjZWhvbGRlcjogc3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgcHVibGljIGluaXRpYWxGb2N1czogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIEBPdXRwdXQoKVxuICBwdWJsaWMgZm9jdXMgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgQE91dHB1dCgpXG4gIHB1YmxpYyBibHVyID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIEBWaWV3Q2hpbGQoJ2Ryb3Bkb3duJywge1xuICAgIHJlYWQ6IFZpZXdDb250YWluZXJSZWYsXG4gICAgc3RhdGljOiB0cnVlXG4gIH0pXG4gIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWY7XG4gIHByb3RlY3RlZCBkcm9wZG93bkNvbXBvbmVudDogVmlld1JlZjtcbiAgcHJvdGVjdGVkIGRyb3Bkb3duSW5zdGFuY2U6IGFueTtcbiAgcHVibGljIGRyb3Bkb3duUG9zdGlvblRvcDogc3RyaW5nO1xuICBwdWJsaWMgZHJvcGRvd25Qb3N0aW9uTGVmdDogc3RyaW5nO1xuICBwdWJsaWMgaW5saW5lQWN0aW9uOiBhbnk7XG5cbiAgcHVibGljIGNvbnRlbnQ6IFNhZmVIdG1sO1xuICBwdWJsaWMgZW1wdHk6IGJvb2xlYW4gPSB0cnVlO1xuICBwcm90ZWN0ZWQgZWRpdFRhcmdldDogYW55O1xuICBwcm90ZWN0ZWQgaXNGb2N1c2VkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGVsOiBFbGVtZW50UmVmLFxuICAgIHByb3RlY3RlZCBjb250cm9sbGVyOiBGYXRlQ29udHJvbGxlclNlcnZpY2UsXG4gICAgcHJvdGVjdGVkIGh0bWxQYXJzZXI6IEZhdGVIdG1sUGFyc2VyU2VydmljZSxcbiAgICBwcm90ZWN0ZWQgcGFyc2VyOiBGYXRlUGFyc2VyU2VydmljZSxcbiAgICBwcm90ZWN0ZWQgc2FuaXRpemVyOiBEb21TYW5pdGl6ZXIsXG4gICAgcHJvdGVjdGVkIGZhY3RvcnlSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyXG4gICkge31cblxuICBwcml2YXRlIHJlYWN0VG9DaGFuZ2VzKCkge1xuICAgIGNvbnN0IHRyZWUgPSB0aGlzLmh0bWxQYXJzZXIucGFyc2VFbGVtZW50KHRoaXMuZWRpdFRhcmdldCk7XG4gICAgY29uc3Qgc2VyaWFsaXplZFRyZWUgPSB0aGlzLnBhcnNlci5zZXJpYWxpemUodHJlZSk7XG4gICAgdGhpcy5jaGFuZ2VkLmZvckVhY2goZiA9PiBmKHNlcmlhbGl6ZWRUcmVlKSk7XG4gIH1cblxuICBwdWJsaWMgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5zdWJzY3JpYmVUb1VpKHRoaXMudWlJZCk7XG4gIH1cblxuICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuZWRpdFRhcmdldCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZmF0ZS1lZGl0LXRhcmdldCcpO1xuICAgIGlmICh0aGlzLnJvdykge1xuICAgICAgdGhpcy5jb21wdXRlSGVpZ2h0KCk7XG4gICAgfVxuXG4gICAgdGhpcy5lZGl0VGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50OiBhbnkpID0+IHtcbiAgICAgIGNvbnNvbGUuZGVidWcoJ2NsaWNrJyk7XG4gICAgICAvLyBPbiBjbGljayB3ZSBzYXZlIHRoZSB0ZXh0IFNlbGVjdGlvblxuICAgICAgdGhpcy5zYXZlU2VsZWN0aW9uKCk7XG4gICAgICAvLyBXZSBjaGVjayBpZiB0aGVyZSBpcyBhIGRyb3Bkb3duIG1hdGNoaW5nIHRoaXMgY29udGV4dFxuICAgICAgdGhpcy5jaGVja0ZvckRyb3Bkb3duQ29udGV4dCgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5lZGl0VGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgKGV2ZW50OiBhbnkpID0+IHtcbiAgICAgIGNvbnNvbGUuZGVidWcoJ2tleXByZXNzZWQnKTtcbiAgICAgIC8vIE9uIGNsaWNrIHdlIHNhdmUgdGhlIHRleHQgU2VsZWN0aW9uXG4gICAgICB0aGlzLnNhdmVTZWxlY3Rpb24oKTtcbiAgICAgIC8vIFdlIGNoZWNrIGlmIHRoZXJlIGlzIGEgZHJvcGRvd24gbWF0Y2hpbmcgdGhpcyBjb250ZXh0XG4gICAgICB0aGlzLmNoZWNrRm9yRHJvcGRvd25Db250ZXh0KCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmVkaXRUYXJnZXQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCAoZXZlbnQ6IGFueSkgPT4ge1xuICAgICAgY29uc29sZS5kZWJ1ZygnKCcgKyB0aGlzLnVpSWQgKyAnKSBmb2N1cycpO1xuICAgICAgLy8gT24gZm9jdXMgd2UgcmVzdG9yZSBpdFxuICAgICAgdGhpcy5yZXN0b3JlU2VsZWN0aW9uKCk7XG4gICAgICB0aGlzLmlzRm9jdXNlZCA9IHRydWU7XG4gICAgICB0aGlzLmZvY3VzLmVtaXQoKTtcbiAgICB9KTtcbiAgICB0aGlzLmVkaXRUYXJnZXQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIChldmVudDogYW55KSA9PiB7XG4gICAgICBjb25zb2xlLmRlYnVnKCcoJyArIHRoaXMudWlJZCArICcpIGJsdXInKTtcbiAgICAgIHRoaXMuaXNGb2N1c2VkID0gZmFsc2U7XG4gICAgICB0aGlzLmJsdXIuZW1pdCgpO1xuICAgICAgdGhpcy5zYXZlU2VsZWN0aW9uKCk7XG5cbiAgICAgIGlmICh0aGlzLmRyb3Bkb3duQ29tcG9uZW50KSB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuaW5saW5lQWN0aW9uID0gbnVsbDtcbiAgICAgICAgICB0aGlzLmRyb3Bkb3duQ29tcG9uZW50LmRlc3Ryb3koKTtcbiAgICAgICAgfSwgMzAwKTtcbiAgICAgICAgLy8gdGhpcy5pbmxpbmVBY3Rpb24gPSBudWxsO1xuICAgICAgICAvLyB0aGlzLmRyb3Bkb3duQ29tcG9uZW50LmRlc3Ryb3koKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuZWRpdFRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50OiBhbnkpID0+IHtcbiAgICAgIGNvbnNvbGUuZGVidWcoJ2tleWRvd24nLCBldmVudCk7XG4gICAgICBjb25zdCBzdG9wRGVmYXVsdCA9ICgpID0+IHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9O1xuICAgICAgY29uc3Qgc3RvcERlZmF1bHRBbmRGb3JjZVVwZGF0ZSA9ICgpID0+IHtcbiAgICAgICAgc3RvcERlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5jaGVja0VtcHR5KCk7XG4gICAgICAgIHRoaXMucmVhY3RUb0NoYW5nZXMoKTtcbiAgICAgIH07XG4gICAgICAvLyBUaGlzIGlzIG5lZWRlZCBiZWNhdXNlLCBpZiB0aGUgY3VycmVudCBzZWxlY3Rpb24gaXMgcGFydFxuICAgICAgLy8gb2YgYSBub24tZWRpdGFibGUgY2hpbGQgb2YgdGhlIGlucHV0LCB0aGUgZGVmYXVsdCBkZWxldGUgd29uJ3RcbiAgICAgIC8vIHdvcmsuXG4gICAgICAvLyBUaGlzIGNhc2UgY2FuIGhhcHBlbiBpZiB0aGVyZSBpcyBhIGN1dG9tIGVsZW1lbnQgdGhhdFxuICAgICAgLy8gd2FzIGluc2VydGVkIGJ5IHNvbWUgY3VzdG9tIGNvbnRyb2xsZXIuXG4gICAgICAvL1xuICAgICAgLy8gU29tZSBjb25zdHJhaW50cyBmb3IgYSBjdXN0b20gYmxvY2sgdG8gd29yayBvbiB0b3Agb2YgY29udGVudGVkaXRhYmxlPWZhbHNlOlxuICAgICAgLy8gLW1vei11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAgIC8vIC13ZWJraXQtdXNlci1tb2RpZnk6IHJlYWQtb25seTtcbiAgICAgIC8vXG4gICAgICAvLyBOb3RlOiBJdCBtYXkgbWFrZSBzZW5zZSB0byBkZWxldGUgdGhlIHNlbGVjdGlvbiBmb3Igbm9ybWFsIHRleHRcbiAgICAgIC8vIGlucHV0IHRvbyBidXQgZm9yIG5vdyB3ZSBvbmx5IGRvIGl0IG9uIGRlbGV0aW9uLlxuICAgICAgaWYgKFxuICAgICAgICBldmVudC5rZXkgPT09ICdCYWNrc3BhY2UnIHx8XG4gICAgICAgIChldmVudC5rZXkgPT09ICdEZWxldGUnICYmIHRoaXMuc2VsZWN0aW9uUmFuZ2UpXG4gICAgICApIHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuc2VsZWN0aW9uUmFuZ2UuY29tbW9uQW5jZXN0b3JDb250YWluZXI7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoJ0RlbGV0aW9uJywgbm9kZSk7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBub2RlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiZcbiAgICAgICAgICAhKG5vZGUgYXMgSFRNTEVsZW1lbnQpLmlzQ29udGVudEVkaXRhYmxlXG4gICAgICAgICkge1xuICAgICAgICAgIC8vIHRoaXMgaXMgdGhlIGNhc2Ugb24gZmlyZWZveFxuICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ2RlbGV0aW5nIGluc2lkZSB1bi1lZGl0YWJsZSBibG9jayBkZXRlY3RlZCcpO1xuICAgICAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2Uuc2VsZWN0Tm9kZShub2RlKTtcbiAgICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLmRlbGV0ZUNvbnRlbnRzKCk7XG4gICAgICAgICAgc3RvcERlZmF1bHRBbmRGb3JjZVVwZGF0ZSgpO1xuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgIG5vZGUubm9kZU5hbWUgPT09ICcjdGV4dCcgJiZcbiAgICAgICAgICAhbm9kZS5wYXJlbnRFbGVtZW50LmlzQ29udGVudEVkaXRhYmxlXG4gICAgICAgICkge1xuICAgICAgICAgIC8vIHRoaXMgaXMgdGhlIGNhc2Ugb24gd2Via2l0XG4gICAgICAgICAgY29uc29sZS5kZWJ1ZygnZGVsZXRpbmcgaW5zaWRlIHVuLWVkaXRhYmxlIGJsb2NrIGRldGVjdGVkJyk7XG4gICAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5zZWxlY3ROb2RlKG5vZGUucGFyZW50RWxlbWVudCk7XG4gICAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5kZWxldGVDb250ZW50cygpO1xuICAgICAgICAgIHN0b3BEZWZhdWx0QW5kRm9yY2VVcGRhdGUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gVGhpcyBpcyBuZWVkZWQgYmVjYXVzZSwgdGhlcmUgaXMgYSBidWcgaW4gRmlyZWZveCB0aGF0IHByZXZlbnRcbiAgICAgIC8vIGRlbGV0aW5nIGEgdW5lZGl0YWJsZSBlbGVtZW50IGluc2lkZSBhbiBlZGl0YWJsZSBlbGVtZW50LiBTbyB3ZVxuICAgICAgLy8gcmVpbXBsZW1lbnQgdGhlIHdob2xlIGZ1bmN0aW9uIGZvciBhbGwgYnJvd3NlcnMuXG4gICAgICBpZiAoZXZlbnQua2V5ID09PSAnQmFja3NwYWNlJyAmJiB0aGlzLnNlbGVjdGlvblJhbmdlKSB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLnNlbGVjdGlvblJhbmdlLmNvbW1vbkFuY2VzdG9yQ29udGFpbmVyO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5jb2xsYXBzZWQgPT09IHRydWUgJiZcbiAgICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLnN0YXJ0T2Zmc2V0ID09PSAwICYmXG4gICAgICAgICAgbm9kZS5wcmV2aW91c1NpYmxpbmcgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJlxuICAgICAgICAgICEobm9kZS5wcmV2aW91c1NpYmxpbmcgYXMgSFRNTEVsZW1lbnQpLmlzQ29udGVudEVkaXRhYmxlXG4gICAgICAgICkge1xuICAgICAgICAgIG5vZGUucHJldmlvdXNTaWJsaW5nLnJlbW92ZSgpO1xuICAgICAgICAgIHN0b3BEZWZhdWx0QW5kRm9yY2VVcGRhdGUoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChldmVudC5rZXkgPT09ICdEZWxldGUnICYmIHRoaXMuc2VsZWN0aW9uUmFuZ2UpIHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuc2VsZWN0aW9uUmFuZ2UuY29tbW9uQW5jZXN0b3JDb250YWluZXI7XG4gICAgICAgIGlmIChcbiAgICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLmNvbGxhcHNlZCA9PT0gdHJ1ZSAmJlxuICAgICAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2UuZW5kQ29udGFpbmVyLm5vZGVOYW1lID09PSAnI3RleHQnICYmXG4gICAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5lbmRPZmZzZXQgPT09XG4gICAgICAgICAgICAodGhpcy5zZWxlY3Rpb25SYW5nZS5lbmRDb250YWluZXIgYXMgVGV4dCkubGVuZ3RoICYmXG4gICAgICAgICAgbm9kZS5uZXh0U2libGluZyBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmXG4gICAgICAgICAgIShub2RlLm5leHRTaWJsaW5nIGFzIEhUTUxFbGVtZW50KS5pc0NvbnRlbnRFZGl0YWJsZVxuICAgICAgICApIHtcbiAgICAgICAgICBub2RlLm5leHRTaWJsaW5nLnJlbW92ZSgpO1xuICAgICAgICAgIHN0b3BEZWZhdWx0QW5kRm9yY2VVcGRhdGUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gSWYgYSBkcm9wZG93biBpcyBjdXJyZW50bHkgYmVpbmcgZGlzcGxheWVkIHdlIHVzZSB0aGUgdXAvZG93blxuICAgICAgLy8ga2V5IHRvIG5hdmlnYXRlIGl0cyBjb250ZW50IGFuZCByZXR1cm4gdG8gc2VsZWN0IHRoZSBzZWxlY3RlZFxuICAgICAgLy8gZWxlbWVudFxuICAgICAgaWYgKHRoaXMuaW5saW5lQWN0aW9uKSB7XG4gICAgICAgIGlmIChldmVudC5rZXkgPT09ICdVcCcgfHwgZXZlbnQua2V5ID09PSAnQXJyb3dVcCcpIHtcbiAgICAgICAgICBzdG9wRGVmYXVsdCgpO1xuICAgICAgICAgIHRoaXMuZHJvcGRvd25JbnN0YW5jZS5zZWxlY1ByZXZpb3VzKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQua2V5ID09PSAnRG93bicgfHwgZXZlbnQua2V5ID09PSAnQXJyb3dEb3duJykge1xuICAgICAgICAgIHN0b3BEZWZhdWx0KCk7XG4gICAgICAgICAgdGhpcy5kcm9wZG93bkluc3RhbmNlLnNlbGVjdE5leHQoKTtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudC5rZXkgPT09ICdFbnRlcicpIHtcbiAgICAgICAgICBzdG9wRGVmYXVsdCgpO1xuICAgICAgICAgIHRoaXMuZHJvcGRvd25JbnN0YW5jZS5jb25maXJtU2VsZWN0aW9uKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuZWRpdFRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChldmVudDogYW55KSA9PiB7XG4gICAgICBjb25zb2xlLmRlYnVnKCd2YWx1ZSBjaGFuZ2VkJyk7XG4gICAgICB0aGlzLmNoZWNrRW1wdHkoKTtcbiAgICAgIHRoaXMucmVhY3RUb0NoYW5nZXMoKTtcbiAgICB9KTtcbiAgICBjb25zdCBzdHlsZTogYW55ID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5lZGl0VGFyZ2V0KTtcbiAgICB0aGlzLmVkaXRUYXJnZXQuc3R5bGUubWluSGVpZ2h0ID0gdGhpcy5nZXRIZWlnaHQoMik7XG5cbiAgICBpZiAodGhpcy5pbml0aWFsRm9jdXMpIHtcbiAgICAgIHRoaXMuZWRpdFRhcmdldC5mb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBuZ09uQ2hhbmdlcyhjaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXNbJ3VpSWQnXSkge1xuICAgICAgdGhpcy5zdWJzY3JpYmVUb1VpKHRoaXMudWlJZCk7XG4gICAgfVxuICAgIGlmIChjaGFuZ2VzWydyb3cnXSkge1xuICAgICAgaWYgKHRoaXMuZWRpdFRhcmdldCkge1xuICAgICAgICB0aGlzLmNvbXB1dGVIZWlnaHQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMudWlTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMudWlTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgY29tcHV0ZUhlaWdodCgpIHtcbiAgICB0aGlzLmVkaXRUYXJnZXQuc3R5bGUuaGVpZ2h0ID0gdGhpcy5nZXRIZWlnaHQodGhpcy5yb3cpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGNoZWNrRW1wdHkoKSB7XG4gICAgaWYgKHRoaXMuZWRpdFRhcmdldC5pbm5lckhUTUwgPT09ICcnKSB7XG4gICAgICB0aGlzLmVkaXRUYXJnZXQuaW5uZXJIVE1MID0gJzxicj4nO1xuICAgICAgdGhpcy5lbXB0eSA9IHRydWU7XG4gICAgfSBlbHNlIGlmICh0aGlzLmVkaXRUYXJnZXQuaW5uZXJIVE1MID09PSAnPGJyPicpIHtcbiAgICAgIHRoaXMuZW1wdHkgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVtcHR5ID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGdldEhlaWdodChyb3dDb3VudCkge1xuICAgIGNvbnN0IHN0eWxlOiBhbnkgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVkaXRUYXJnZXQpO1xuICAgIGxldCBoZWlnaHQgPSAodGhpcy5lZGl0VGFyZ2V0LnN0eWxlLmhlaWdodCA9XG4gICAgICBwYXJzZUludChzdHlsZS5saW5lSGVpZ2h0LCAxMCkgKiByb3dDb3VudCk7XG4gICAgaWYgKHN0eWxlLmJveFNpemluZyA9PT0gJ2JvcmRlci1ib3gnKSB7XG4gICAgICBoZWlnaHQgKz1cbiAgICAgICAgcGFyc2VJbnQoc3R5bGUucGFkZGluZ1RvcCwgMTApICtcbiAgICAgICAgcGFyc2VJbnQoc3R5bGUucGFkZGluZ0JvdHRvbSwgMTApICtcbiAgICAgICAgcGFyc2VJbnQoc3R5bGUuYm9yZGVyVG9wV2lkdGgsIDEwKSArXG4gICAgICAgIHBhcnNlSW50KHN0eWxlLmJvcmRlckJvdHRvbVdpZHRoLCAxMCk7XG4gICAgfVxuICAgIHJldHVybiBoZWlnaHQgKyAncHgnO1xuICB9XG5cbiAgcHJvdGVjdGVkIHVpU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByb3RlY3RlZCBzdWJzY3JpYmVUb1VpKHVpSWQpIHtcbiAgICBjb25zb2xlLmRlYnVnKCdzdWJzY3JpYmluZyB0byAnICsgdWlJZCwgdGhpcy51aVN1YnNjcmlwdGlvbik7XG4gICAgaWYgKHRoaXMudWlTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMudWlTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgdGhpcy51aVN1YnNjcmlwdGlvbiA9IHRoaXMuY29udHJvbGxlci5jaGFubmVsKHVpSWQpLnN1YnNjcmliZShjb21tYW5kID0+IHtcbiAgICAgIC8vIGlmIGlucHV0IGlzIG5vdCBvbiBmb2N1cyB3ZSBzYXZlIGN1cnJlbnQgZm9jdXM6XG4gICAgICBjb25zdCBmb2N1cyA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgICBjb25zb2xlLmRlYnVnKFxuICAgICAgICAnKCcgKyB1aUlkICsgJykgZ290IGNvbW1hbmQgJyArIGNvbW1hbmQubmFtZSArICcvJyArIGNvbW1hbmQudmFsdWVcbiAgICAgICk7XG5cbiAgICAgIHRoaXMucmVzdG9yZVNlbGVjdGlvbigpO1xuICAgICAgaWYgKGNvbW1hbmQubmFtZSA9PT0gJ2luc2VydEhUTUwnICYmIHRoaXMuc2VsZWN0aW9uUmFuZ2UpIHtcbiAgICAgICAgLy8gSWYgc29tZXRoaW5nIGlzIHNlbGVjdGVkIHdlIGFzc3VtZSB0aGF0IHRoZSBnb2FsIGlzIHRvIHJlcGxhY2UgaXQsXG4gICAgICAgIC8vIHNvIGZpcnN0IHdlIGRlbGV0ZSB0aGUgY29udGVudFxuICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLmRlbGV0ZUNvbnRlbnRzKCk7XG4gICAgICAgIC8vIGluc2VydEh0bWwgc2VlbXMgcXVpdGUgYnJva2VuIHNvIHdlIGRvIGl0IG91cnNlbGV2ZXNcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5pbnNlcnROb2RlKFxuICAgICAgICAgIGRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KGNvbW1hbmQudmFsdWUpXG4gICAgICAgICk7XG4gICAgICAgIC8vIG1vdmUgY3Vzb3IgdG8gdGhlIGVuZCBvZiB0aGUgbmV3bHkgaW5zZXJ0ZWQgZWxlbWVudFxuICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLmNvbGxhcHNlKGZhbHNlKTtcbiAgICAgICAgLy8gRm9yY2UgdGhlIHVwZGF0ZSBvZiB0aGUgbW9kZWxcbiAgICAgICAgdGhpcy5jaGVja0VtcHR5KCk7XG4gICAgICAgIHRoaXMucmVhY3RUb0NoYW5nZXMoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKGNvbW1hbmQubmFtZSwgZmFsc2UsIGNvbW1hbmQudmFsdWUpO1xuICAgICAgfVxuICAgICAgdGhpcy5zYXZlU2VsZWN0aW9uKCk7XG4gICAgICAoZm9jdXMgYXMgYW55KS5mb2N1cygpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gU2F2ZXMgdGhlIGN1cnJlbnQgdGV4dCBzZWxlY3Rpb25cbiAgcHJvdGVjdGVkIHNlbGVjdGlvblJhbmdlOiBSYW5nZTtcbiAgcHJvdGVjdGVkIHNhdmVTZWxlY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uSW5FZGl0YWJsZVRhcmdldCgpKSB7XG4gICAgICBjb25zdCBzZWwgPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk7XG4gICAgICBpZiAoc2VsLmdldFJhbmdlQXQgJiYgc2VsLnJhbmdlQ291bnQpIHtcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZSA9IHNlbC5nZXRSYW5nZUF0KDApO1xuICAgICAgICBjb25zb2xlLmRlYnVnKCcoJyArIHRoaXMudWlJZCArICcpIHNhdmVTZWxlY3Rpb24nLCB0aGlzLnNlbGVjdGlvblJhbmdlKTtcbiAgICAgICAgdGhpcy5kZXRlY3RTdHlsZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvLyBSZXN0b3JzIHRoZSBjdXJyZW50IHRleHQgc2VsZWN0aW9uXG4gIHByb3RlY3RlZCByZXN0b3JlU2VsZWN0aW9uKCkge1xuICAgIGlmICh0aGlzLnNlbGVjdGlvbkluRWRpdGFibGVUYXJnZXQoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zb2xlLmRlYnVnKCcoJyArIHRoaXMudWlJZCArICcpIHJlc3RvcmVTZWxlY3Rpb24nLCB0aGlzLnNlbGVjdGlvblJhbmdlKTtcbiAgICBpZiAodGhpcy5zZWxlY3Rpb25SYW5nZSkge1xuICAgICAgY29uc3Qgc2VsID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xuICAgICAgc2VsLnJlbW92ZUFsbFJhbmdlcygpO1xuICAgICAgc2VsLmFkZFJhbmdlKHRoaXMuc2VsZWN0aW9uUmFuZ2UpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBzZWxlY3Rpb25JbkVkaXRhYmxlVGFyZ2V0KCkge1xuICAgIGNvbnN0IHNlbCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcbiAgICBjb25zdCBub2RlID1cbiAgICAgIHNlbC5nZXRSYW5nZUF0ICYmXG4gICAgICBzZWwucmFuZ2VDb3VudCAmJlxuICAgICAgc2VsLmdldFJhbmdlQXQoMCkgJiZcbiAgICAgIHNlbC5nZXRSYW5nZUF0KDApLmNvbW1vbkFuY2VzdG9yQ29udGFpbmVyO1xuICAgIHJldHVybiAoXG4gICAgICBub2RlICYmXG4gICAgICAobm9kZSA9PT0gdGhpcy5lZGl0VGFyZ2V0IHx8XG4gICAgICAgIChub2RlLnBhcmVudEVsZW1lbnQuY2xvc2VzdCgnLmZhdGUtZWRpdC10YXJnZXQnKSAmJlxuICAgICAgICAgIG5vZGUucGFyZW50RWxlbWVudC5jbG9zZXN0KCcuZmF0ZS1lZGl0LXRhcmdldCcpID09PSB0aGlzLmVkaXRUYXJnZXQpKVxuICAgICk7XG4gIH1cblxuICBwcm90ZWN0ZWQgZGV0ZWN0U3R5bGUoKSB7XG4gICAgbGV0IG5vZGUgPSB0aGlzLnNlbGVjdGlvblJhbmdlLmNvbW1vbkFuY2VzdG9yQ29udGFpbmVyO1xuICAgIGlmIChcbiAgICAgICFub2RlIHx8XG4gICAgICAhKFxuICAgICAgICBub2RlLnBhcmVudEVsZW1lbnQuY2xvc2VzdCgnLmZhdGUtZWRpdC10YXJnZXQnKSAmJlxuICAgICAgICBub2RlICE9PSB0aGlzLmVkaXRUYXJnZXRcbiAgICAgIClcbiAgICApIHtcbiAgICAgIC8vIFRoZSBjdXJyZW50IHNlbGVjdGlvbiBpcyBub3QgY29udGFpbmVkIGluIHRoZSBlZGl0YWJsZSB6b25lLlxuICAgICAgLy8gdGhpcyBpcyBtb3N0IGxpa2VseSBkdWUgdG8gdGhlIGlucHV0IGJlaW5nIGVtcHR5LlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBzcGVjaWFsIGNhc2VzIGZvciBGRiB3aGVuIHNlbGVjdGlvbiBpcyBvYnRhaW5lZCBieSBkb3VibGUgY2xpY2s6XG4gICAgaWYgKFxuICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5lbmRPZmZzZXQgPT09IDAgJiZcbiAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2Uuc3RhcnRDb250YWluZXIubm9kZVZhbHVlICYmXG4gICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLnN0YXJ0T2Zmc2V0ID09PVxuICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLnN0YXJ0Q29udGFpbmVyLm5vZGVWYWx1ZS5sZW5ndGhcbiAgICApIHtcbiAgICAgIG5vZGUgPSB0aGlzLnNlbGVjdGlvblJhbmdlLnN0YXJ0Q29udGFpbmVyLm5leHRTaWJsaW5nO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLmVuZE9mZnNldCA9PT0gMCAmJlxuICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5zdGFydE9mZnNldCA9PT0gMFxuICAgICkge1xuICAgICAgbm9kZSA9IHRoaXMuc2VsZWN0aW9uUmFuZ2Uuc3RhcnRDb250YWluZXIucGFyZW50RWxlbWVudDtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5jb21tb25BbmNlc3RvckNvbnRhaW5lciA9PT0gdGhpcy5lZGl0VGFyZ2V0ICYmXG4gICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLnN0YXJ0Q29udGFpbmVyID09PSB0aGlzLmVkaXRUYXJnZXQgJiZcbiAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2UuZW5kQ29udGFpbmVyID09PSB0aGlzLmVkaXRUYXJnZXRcbiAgICApIHtcbiAgICAgIG5vZGUgPSB0aGlzLnNlbGVjdGlvblJhbmdlLmNvbW1vbkFuY2VzdG9yQ29udGFpbmVyLmNoaWxkTm9kZXNbXG4gICAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2Uuc3RhcnRPZmZzZXRcbiAgICAgIF07XG4gICAgfVxuICAgIGlmIChub2RlICYmIG5vZGUgIT09IHRoaXMuZWRpdFRhcmdldCkge1xuICAgICAgY29uc3Qgbm9kZXMgPSB0aGlzLmh0bWxQYXJzZXIuZmluZFBhcmVudE5vZGVzKG5vZGUsIHRoaXMuZWRpdFRhcmdldCk7XG4gICAgICBjb25zb2xlLmRlYnVnKCcgIC0+IGRldGVjdGVkIGFjdGlvbnM6ICcsIG5vZGVzKTtcbiAgICAgIHRoaXMuY29udHJvbGxlci5lbmFibGVBY3Rpb25zKHRoaXMudWlJZCwgbm9kZXMpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGltcGxlbnRhdGlvbiBvZiBDb250cm9sVmFsdWVBY2Nlc3NvcjpcbiAgcHJvdGVjdGVkIGNoYW5nZWQgPSBuZXcgQXJyYXk8KHZhbHVlOiBzdHJpbmcpID0+IHZvaWQ+KCk7XG5cbiAgcHVibGljIHdyaXRlVmFsdWUodmFsdWU6IHN0cmluZykge1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5jb250ZW50ID0gdGhpcy5zYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdEh0bWwoXG4gICAgICAgIHRoaXMuaHRtbFBhcnNlci5zZXJpYWxpemUodGhpcy5wYXJzZXIucGFyc2UodmFsdWUpKVxuICAgICAgKTtcbiAgICAgIHRoaXMuZW1wdHkgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jb250ZW50ID0gdGhpcy5zYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdEh0bWwoJzxicj4nKTtcbiAgICAgIHRoaXMuZW1wdHkgPSB0cnVlO1xuICAgIH1cbiAgICB0aGlzLnNlbGVjdGlvblJhbmdlID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgcHVibGljIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogc3RyaW5nKSA9PiB2b2lkKSB7XG4gICAgdGhpcy5jaGFuZ2VkLnB1c2goZm4pO1xuICB9XG5cbiAgcHVibGljIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiB2b2lkKSB7fVxuXG4gIHByb3RlY3RlZCBjaGVja0ZvckRyb3Bkb3duQ29udGV4dCgpIHtcbiAgICBjb25zdCBzdGFydFBvcyA9IE1hdGgubWF4KHRoaXMuc2VsZWN0aW9uUmFuZ2Uuc3RhcnRPZmZzZXQgLSAyMCwgMCk7XG4gICAgY29uc3QgbGVuZ3RoID0gdGhpcy5zZWxlY3Rpb25SYW5nZS5zdGFydE9mZnNldCAtIHN0YXJ0UG9zO1xuICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzLnNlbGVjdGlvblJhbmdlLnN0YXJ0Q29udGFpbmVyLnRleHRDb250ZW50LnN1YnN0cihcbiAgICAgIHN0YXJ0UG9zLFxuICAgICAgbGVuZ3RoXG4gICAgKTtcblxuICAgIGNvbnN0IGlubGluZUFjdGlvbiA9IHRoaXMuY29udHJvbGxlci5nZXRJbmxpbmVBY3Rpb24oY29udGV4dCk7XG4gICAgaWYgKGlubGluZUFjdGlvbikge1xuICAgICAgaWYgKFxuICAgICAgICAhdGhpcy5pbmxpbmVBY3Rpb24gfHxcbiAgICAgICAgdGhpcy5pbmxpbmVBY3Rpb24uZHJvcGRvd24gIT09IGlubGluZUFjdGlvbi5kcm9wZG93blxuICAgICAgKSB7XG4gICAgICAgIHRoaXMuaW5saW5lQWN0aW9uID0gaW5saW5lQWN0aW9uO1xuICAgICAgICB0aGlzLmluaXREcm9wZG93bihcbiAgICAgICAgICBpbmxpbmVBY3Rpb24sXG4gICAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5pbmxpbmVBY3Rpb24gPSBpbmxpbmVBY3Rpb247XG4gICAgICAgIHRoaXMudXBkYXRlRHJvcGRvd24oaW5saW5lQWN0aW9uLm1hdGNoZWQpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5kcm9wZG93bkNvbXBvbmVudCkge1xuICAgICAgdGhpcy5pbmxpbmVBY3Rpb24gPSBudWxsO1xuICAgICAgdGhpcy5kcm9wZG93bkNvbXBvbmVudC5kZXN0cm95KCk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGluaXREcm9wZG93bihhY3Rpb25Db21wb25lbnQsIHBvc2l0aW9uKSB7XG4gICAgLy8gc2V0IHRoZSBkcm9wZG93biBjb21wb25lbnRcbiAgICBpZiAodGhpcy5kcm9wZG93bkNvbXBvbmVudCkge1xuICAgICAgdGhpcy5kcm9wZG93bkNvbXBvbmVudC5kZXN0cm95KCk7XG4gICAgfVxuICAgIGNvbnN0IGZhY3RvcnkgPSB0aGlzLmZhY3RvcnlSZXNvbHZlci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShcbiAgICAgIGFjdGlvbkNvbXBvbmVudC5kcm9wZG93blxuICAgICk7XG4gICAgY29uc3QgY29tcG9uZW50OiBhbnkgPSBmYWN0b3J5LmNyZWF0ZSh0aGlzLnZpZXdDb250YWluZXJSZWYucGFyZW50SW5qZWN0b3IpO1xuICAgIGlmIChjb21wb25lbnQuaW5zdGFuY2UudmFsdWVDaGFuZ2UpIHtcbiAgICAgIGNvbXBvbmVudC5pbnN0YW5jZS52YWx1ZSA9IGFjdGlvbkNvbXBvbmVudC5tYXRjaGVkO1xuICAgICAgY29tcG9uZW50Lmluc3RhbmNlLnZhbHVlQ2hhbmdlLnN1YnNjcmliZSh2YWx1ZSA9PiB7XG4gICAgICAgIHRoaXMuZWRpdFRhcmdldC5mb2N1cygpO1xuICAgICAgICBjb25zdCBlbmQgPSB0aGlzLnNlbGVjdGlvblJhbmdlLmVuZE9mZnNldDtcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5zZXRTdGFydChcbiAgICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLmVuZENvbnRhaW5lcixcbiAgICAgICAgICBlbmQgLSBhY3Rpb25Db21wb25lbnQubWF0Y2hlZC5sZW5ndGhcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLmRvSW5saW5lKHRoaXMudWlJZCwgdGhpcy5pbmxpbmVBY3Rpb24sIHZhbHVlKTtcbiAgICAgICAgLy8gZGVsZXRlIHRoZSBkcm9wZG93blxuICAgICAgICB0aGlzLmlubGluZUFjdGlvbiA9IG51bGw7XG4gICAgICAgIHRoaXMuZHJvcGRvd25Db21wb25lbnQuZGVzdHJveSgpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLmRyb3Bkb3duQ29tcG9uZW50ID0gdGhpcy52aWV3Q29udGFpbmVyUmVmLmluc2VydChjb21wb25lbnQuaG9zdFZpZXcpO1xuICAgICAgdGhpcy5kcm9wZG93bkluc3RhbmNlID0gY29tcG9uZW50Lmluc3RhbmNlO1xuICAgICAgdGhpcy51cGRhdGVEcm9wZG93blBvc2l0aW9uKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ1RoZSBjb21wb25lbnQgdXNlZCBhcyBhIGRyb3Bkb3duIGRvZXNuXFwndCBjb250YWluIGEgdmFsdWVDaGFuZ2UgZW1taXRlciEnXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCB1cGRhdGVEcm9wZG93bih2YWx1ZSkge1xuICAgIHRoaXMuZHJvcGRvd25JbnN0YW5jZS52YWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMudXBkYXRlRHJvcGRvd25Qb3NpdGlvbigpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHVwZGF0ZURyb3Bkb3duUG9zaXRpb24oKSB7XG4gICAgaWYgKHRoaXMuaW5saW5lQWN0aW9uLmRpc3BsYXkgPT09ICdjb250ZXh0dWFsJykge1xuICAgICAgLy8gY3JlYXRlIGEgc2VsZWN0aW9uIHRvIGdldCB0aGUgc2l6ZSBvZiB0aGUgbWF0Y2hpbmcgdGV4dFxuICAgICAgY29uc3QgcGFyZW50T2Zmc2V0QkIgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQub2Zmc2V0UGFyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgY29uc3QgcmFuZ2UgPSB0aGlzLnNlbGVjdGlvblJhbmdlLmNsb25lUmFuZ2UoKTtcbiAgICAgIGNvbnN0IGVuZCA9IHJhbmdlLmVuZE9mZnNldDtcbiAgICAgIHJhbmdlLnNldFN0YXJ0KFxuICAgICAgICByYW5nZS5lbmRDb250YWluZXIsXG4gICAgICAgIGVuZCAtIHRoaXMuaW5saW5lQWN0aW9uLm1hdGNoZWQubGVuZ3RoXG4gICAgICApO1xuICAgICAgY29uc3QgYm91bmRpbmdCb3ggPSByYW5nZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIHRoaXMuZHJvcGRvd25Qb3N0aW9uVG9wID1cbiAgICAgICAgYm91bmRpbmdCb3gudG9wICsgYm91bmRpbmdCb3guaGVpZ2h0IC0gcGFyZW50T2Zmc2V0QkIudG9wICsgJ3B4JztcbiAgICAgIHRoaXMuZHJvcGRvd25Qb3N0aW9uTGVmdCA9IGJvdW5kaW5nQm94LmxlZnQgLSBwYXJlbnRPZmZzZXRCQi5sZWZ0ICsgJ3B4JztcbiAgICB9XG4gIH1cbn1cbiJdfQ==