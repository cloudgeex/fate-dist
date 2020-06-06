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
            if (event.key === 'Backspace' || event.key === 'Delete' && this.selectionRange) {
                const node = this.selectionRange.commonAncestorContainer;
                console.debug('Deletion', node);
                if (node instanceof HTMLElement && !node.isContentEditable) {
                    // this is the case on firefox
                    console.debug('deleting inside un-editable block detected');
                    this.selectionRange.selectNode(node);
                    this.selectionRange.deleteContents();
                    stopDefaultAndForceUpdate();
                }
                else if (node.nodeName === '#text' && !node.parentElement.isContentEditable) {
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
                    this.selectionRange.endOffset === this.selectionRange.endContainer.length &&
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
        let height = this.editTarget.style.height = (parseInt(style.lineHeight, 10) * rowCount);
        if (style.boxSizing === 'border-box') {
            height += parseInt(style.paddingTop, 10) + parseInt(style.paddingBottom, 10) + parseInt(style.borderTopWidth, 10) + parseInt(style.borderBottomWidth, 10);
        }
        return height + 'px';
    }
    subscribeToUi(uiId) {
        console.debug('subscribing to ' + uiId, this.uiSubscription);
        if (this.uiSubscription) {
            this.uiSubscription.unsubscribe();
        }
        this.uiSubscription = this.controller.channel(uiId).subscribe((command) => {
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
        const node = sel.getRangeAt && sel.rangeCount && sel.getRangeAt(0) && sel.getRangeAt(0).commonAncestorContainer;
        return node && (node === this.editTarget || (node.parentElement.closest('.fate-edit-target') && (node.parentElement.closest('.fate-edit-target') === this.editTarget)));
    }
    detectStyle() {
        let node = this.selectionRange.commonAncestorContainer;
        if (!node || (!(node.parentElement.closest('.fate-edit-target') && node !== this.editTarget))) {
            // The current selection is not contained in the editable zone.
            // this is most likely due to the input being empty.
            return;
        }
        // special cases for FF when selection is obtained by double click:
        if ((this.selectionRange.endOffset === 0) &&
            (this.selectionRange.startContainer.nodeValue) &&
            (this.selectionRange.startOffset === this.selectionRange.startContainer.nodeValue.length)) {
            node = this.selectionRange.startContainer.nextSibling;
        }
        else if ((this.selectionRange.endOffset === 0) &&
            (this.selectionRange.startOffset === 0)) {
            node = this.selectionRange.startContainer.parentElement;
        }
        else if ((this.selectionRange.commonAncestorContainer === this.editTarget) &&
            (this.selectionRange.startContainer === this.editTarget) &&
            (this.selectionRange.endContainer === this.editTarget)) {
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
            if (!this.inlineAction || this.inlineAction.dropdown !== inlineAction.dropdown) {
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
            component.instance.valueChange.subscribe((value) => {
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
            this.dropdownPostionTop = (boundingBox.top + boundingBox.height - parentOffsetBB.top) + 'px';
            this.dropdownPostionLeft = (boundingBox.left - parentOffsetBB.left) + 'px';
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
    Output()
], FateInputComponent.prototype, "focus", void 0);
__decorate([
    Output()
], FateInputComponent.prototype, "blur", void 0);
__decorate([
    ViewChild('dropdown', {
        read: ViewContainerRef,
        static: true,
    })
], FateInputComponent.prototype, "viewContainerRef", void 0);
FateInputComponent = FateInputComponent_1 = __decorate([
    Component({
        selector: 'fate-input',
        template: `
    <div class="fate-inline-dropdown"
         [class.hidden]="!inlineAction"
         [class.contextual]="inlineAction?.display === 'contextual'"
         [style.top]="dropdownPostionTop"
         [style.left]="dropdownPostionLeft">
      <ng-template #dropdown></ng-template>
    </div>
    <div [class]="'fate-edit-target ' + customClass"
         [ngClass]="{empty: empty}"
         contenteditable="true"
         [title]="placeholder"
         [innerHtml]="content"></div>
  `,
        providers: [
            { provide: NG_VALUE_ACCESSOR, useExisting: FateInputComponent_1, multi: true }
        ],
        styles: [`
    :host div.fate-edit-target {
      display: block;
      padding: 10px;
      border: 1px solid #DDD;
      outline: 0;
      resize: vertical;
      overflow: auto;
      background: #FFF;
      color: #000;
      overflow: visible;
    }
    :host div.fate-edit-target.empty:not(:focus):before {
      content:attr(title);
      color: #636c72;
    }
    .fate-inline-dropdown {
      border: 1px solid #DDD;
      border-bottom: 0;
    }
    .fate-inline-dropdown.hidden {
      display: none !important;
    }
    .fate-inline-dropdown.contextual {
      position: absolute;
      background: #FFF;
      box-shadow: 0 5px 30px -10px rgba(0,0,0,0.4);
      border-bottom: 1px solid #CCC;
    }
    :host {
      margin-bottom: 10px;
      /*position: relative;*/
    }
  `]
    })
], FateInputComponent);
export { FateInputComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmF0ZS1pbnB1dC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9mYXRlLWVkaXRvci8iLCJzb3VyY2VzIjpbImFwcC9mYXRlLWlucHV0L2ZhdGUtaW5wdXQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLHdCQUF3QixFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDaE0sT0FBTyxFQUFFLGlCQUFpQixFQUF3QixNQUFNLGdCQUFnQixDQUFDO0FBQ3pFLE9BQU8sRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFJbkUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDbkUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDcEUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUF3RDNELElBQWEsa0JBQWtCLDBCQUEvQixNQUFhLGtCQUFrQjtJQW9DN0IsWUFBc0IsRUFBYyxFQUFZLFVBQWlDLEVBQVksVUFBaUMsRUFBWSxNQUF5QixFQUFZLFNBQXVCLEVBQVksZUFBeUM7UUFBck8sT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUFZLGVBQVUsR0FBVixVQUFVLENBQXVCO1FBQVksZUFBVSxHQUFWLFVBQVUsQ0FBdUI7UUFBWSxXQUFNLEdBQU4sTUFBTSxDQUFtQjtRQUFZLGNBQVMsR0FBVCxTQUFTLENBQWM7UUFBWSxvQkFBZSxHQUFmLGVBQWUsQ0FBMEI7UUFqQ3BQLFNBQUksR0FBVyxTQUFTLENBQUM7UUFTekIsZ0JBQVcsR0FBVyxFQUFFLENBQUM7UUFHekIsVUFBSyxHQUFHLElBQUksWUFB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M1A7SUFEQyxLQUFLLEVBQUU7Z0RBQ3dCO0FBR2hDO0lBREMsS0FBSyxFQUFFOytDQUNXO0FBR25CO0lBREMsS0FBSyxFQUFFO3VEQUNtQjtBQUczQjtJQURDLEtBQUssRUFBRTt1REFDd0I7QUFHaEM7SUFEQyxNQUFNLEVBQUU7aURBQytCO0FBR3hDO0lBREMsTUFBTSxFQUFFO2dEQUM4QjtBQU12QztJQUpDLFNBQVMsQ0FBQyxVQUFVLEVBQUU7UUFDckIsSUFBSSxFQUFFLGdCQUFnQjtRQUN0QixNQUFNLEVBQUUsSUFBSTtLQUNiLENBQUM7NERBQ2dDO0FBeEJ2QixrQkFBa0I7SUF0RDlCLFNBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxZQUFZO1FBQ3RCLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7OztHQWFUO1FBbUNELFNBQVMsRUFBRTtZQUNULEVBQUMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFdBQVcsRUFBRSxvQkFBa0IsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDO1NBQzNFO2lCQXBDUTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUNSO0tBSUYsQ0FBQztHQUNXLGtCQUFrQixDQTJZOUI7U0EzWVksa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT3V0cHV0LCBWaWV3Q2hpbGQsIEVsZW1lbnRSZWYsIFZpZXdSZWYsIFZpZXdDb250YWluZXJSZWYsIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgT25Jbml0LCBPbkNoYW5nZXMsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOR19WQUxVRV9BQ0NFU1NPUiwgQ29udHJvbFZhbHVlQWNjZXNzb3IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBEb21TYW5pdGl6ZXIsIFNhZmVIdG1sIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5cbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBGYXRlQ29udHJvbGxlclNlcnZpY2UgfSBmcm9tICcuLi9mYXRlLWNvbnRyb2xsZXIuc2VydmljZSc7XG5pbXBvcnQgeyBGYXRlSHRtbFBhcnNlclNlcnZpY2UgfSBmcm9tICcuLi9mYXRlLWh0bWwtcGFyc2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgRmF0ZVBhcnNlclNlcnZpY2UgfSBmcm9tICcuLi9mYXRlLXBhcnNlci5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZmF0ZS1pbnB1dCcsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBjbGFzcz1cImZhdGUtaW5saW5lLWRyb3Bkb3duXCJcbiAgICAgICAgIFtjbGFzcy5oaWRkZW5dPVwiIWlubGluZUFjdGlvblwiXG4gICAgICAgICBbY2xhc3MuY29udGV4dHVhbF09XCJpbmxpbmVBY3Rpb24/LmRpc3BsYXkgPT09ICdjb250ZXh0dWFsJ1wiXG4gICAgICAgICBbc3R5bGUudG9wXT1cImRyb3Bkb3duUG9zdGlvblRvcFwiXG4gICAgICAgICBbc3R5bGUubGVmdF09XCJkcm9wZG93blBvc3Rpb25MZWZ0XCI+XG4gICAgICA8bmctdGVtcGxhdGUgI2Ryb3Bkb3duPjwvbmctdGVtcGxhdGU+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBbY2xhc3NdPVwiJ2ZhdGUtZWRpdC10YXJnZXQgJyArIGN1c3RvbUNsYXNzXCJcbiAgICAgICAgIFtuZ0NsYXNzXT1cIntlbXB0eTogZW1wdHl9XCJcbiAgICAgICAgIGNvbnRlbnRlZGl0YWJsZT1cInRydWVcIlxuICAgICAgICAgW3RpdGxlXT1cInBsYWNlaG9sZGVyXCJcbiAgICAgICAgIFtpbm5lckh0bWxdPVwiY29udGVudFwiPjwvZGl2PlxuICBgLFxuICBzdHlsZXM6IFtgXG4gICAgOmhvc3QgZGl2LmZhdGUtZWRpdC10YXJnZXQge1xuICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICBwYWRkaW5nOiAxMHB4O1xuICAgICAgYm9yZGVyOiAxcHggc29saWQgI0RERDtcbiAgICAgIG91dGxpbmU6IDA7XG4gICAgICByZXNpemU6IHZlcnRpY2FsO1xuICAgICAgb3ZlcmZsb3c6IGF1dG87XG4gICAgICBiYWNrZ3JvdW5kOiAjRkZGO1xuICAgICAgY29sb3I6ICMwMDA7XG4gICAgICBvdmVyZmxvdzogdmlzaWJsZTtcbiAgICB9XG4gICAgOmhvc3QgZGl2LmZhdGUtZWRpdC10YXJnZXQuZW1wdHk6bm90KDpmb2N1cyk6YmVmb3JlIHtcbiAgICAgIGNvbnRlbnQ6YXR0cih0aXRsZSk7XG4gICAgICBjb2xvcjogIzYzNmM3MjtcbiAgICB9XG4gICAgLmZhdGUtaW5saW5lLWRyb3Bkb3duIHtcbiAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNEREQ7XG4gICAgICBib3JkZXItYm90dG9tOiAwO1xuICAgIH1cbiAgICAuZmF0ZS1pbmxpbmUtZHJvcGRvd24uaGlkZGVuIHtcbiAgICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgICB9XG4gICAgLmZhdGUtaW5saW5lLWRyb3Bkb3duLmNvbnRleHR1YWwge1xuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgYmFja2dyb3VuZDogI0ZGRjtcbiAgICAgIGJveC1zaGFkb3c6IDAgNXB4IDMwcHggLTEwcHggcmdiYSgwLDAsMCwwLjQpO1xuICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNDQ0M7XG4gICAgfVxuICAgIDpob3N0IHtcbiAgICAgIG1hcmdpbi1ib3R0b206IDEwcHg7XG4gICAgICAvKnBvc2l0aW9uOiByZWxhdGl2ZTsqL1xuICAgIH1cbiAgYF0sXG4gIHByb3ZpZGVyczogW1xuICAgIHtwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUiwgdXNlRXhpc3Rpbmc6IEZhdGVJbnB1dENvbXBvbmVudCwgbXVsdGk6IHRydWV9XG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIEZhdGVJbnB1dENvbXBvbmVudCBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBPbkNoYW5nZXMsIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgdWlJZDogc3RyaW5nID0gJ2RlZmF1bHQnO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyByb3c6IG51bWJlcjtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgY3VzdG9tQ2xhc3M6IHN0cmluZztcblxuICBASW5wdXQoKVxuICBwdWJsaWMgcGxhY2Vob2xkZXI6IHN0cmluZyA9ICcnO1xuXG4gIEBPdXRwdXQoKVxuICBwdWJsaWMgZm9jdXMgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgQE91dHB1dCgpXG4gIHB1YmxpYyBibHVyID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIEBWaWV3Q2hpbGQoJ2Ryb3Bkb3duJywge1xuICAgIHJlYWQ6IFZpZXdDb250YWluZXJSZWYsXG4gICAgc3RhdGljOiB0cnVlLFxuICB9KVxuICB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmXG4gIHByb3RlY3RlZCBkcm9wZG93bkNvbXBvbmVudDogVmlld1JlZjtcbiAgcHJvdGVjdGVkIGRyb3Bkb3duSW5zdGFuY2U6IGFueTtcbiAgcHVibGljIGRyb3Bkb3duUG9zdGlvblRvcDogc3RyaW5nO1xuICBwdWJsaWMgZHJvcGRvd25Qb3N0aW9uTGVmdDogc3RyaW5nO1xuICBwdWJsaWMgaW5saW5lQWN0aW9uOiBhbnk7XG5cbiAgcHVibGljIGNvbnRlbnQ6IFNhZmVIdG1sO1xuICBwdWJsaWMgZW1wdHk6IGJvb2xlYW4gPSB0cnVlO1xuICBwcm90ZWN0ZWQgZWRpdFRhcmdldDogYW55O1xuICBwcm90ZWN0ZWQgaXNGb2N1c2VkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGVsOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgY29udHJvbGxlcjogRmF0ZUNvbnRyb2xsZXJTZXJ2aWNlLCBwcm90ZWN0ZWQgaHRtbFBhcnNlcjogRmF0ZUh0bWxQYXJzZXJTZXJ2aWNlLCBwcm90ZWN0ZWQgcGFyc2VyOiBGYXRlUGFyc2VyU2VydmljZSwgcHJvdGVjdGVkIHNhbml0aXplcjogRG9tU2FuaXRpemVyLCBwcm90ZWN0ZWQgZmFjdG9yeVJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIpIHt9XG5cbiAgcHJpdmF0ZSByZWFjdFRvQ2hhbmdlcygpIHtcbiAgICBjb25zdCB0cmVlID0gdGhpcy5odG1sUGFyc2VyLnBhcnNlRWxlbWVudCh0aGlzLmVkaXRUYXJnZXQpO1xuICAgIGNvbnN0IHNlcmlhbGl6ZWRUcmVlID0gdGhpcy5wYXJzZXIuc2VyaWFsaXplKHRyZWUpO1xuICAgIHRoaXMuY2hhbmdlZC5mb3JFYWNoKGYgPT4gZihzZXJpYWxpemVkVHJlZSkpO1xuICB9XG5cbiAgcHVibGljIG5nT25Jbml0KCkge1xuICAgIHRoaXMuc3Vic2NyaWJlVG9VaSh0aGlzLnVpSWQpO1xuICB9XG5cbiAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLmVkaXRUYXJnZXQgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmZhdGUtZWRpdC10YXJnZXQnKTtcbiAgICBpZiAodGhpcy5yb3cpIHtcbiAgICAgIHRoaXMuY29tcHV0ZUhlaWdodCgpO1xuICAgIH1cblxuICAgIHRoaXMuZWRpdFRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudDogYW55KcKgPT4ge1xuICAgICAgY29uc29sZS5kZWJ1ZygnY2xpY2snKTtcbiAgICAgIC8vIE9uIGNsaWNrIHdlIHNhdmUgdGhlIHRleHQgU2VsZWN0aW9uXG4gICAgICB0aGlzLnNhdmVTZWxlY3Rpb24oKTtcbiAgICAgIC8vIFdlIGNoZWNrIGlmIHRoZXJlIGlzIGEgZHJvcGRvd24gbWF0Y2hpbmcgdGhpcyBjb250ZXh0XG4gICAgICB0aGlzLmNoZWNrRm9yRHJvcGRvd25Db250ZXh0KCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmVkaXRUYXJnZXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoZXZlbnQ6IGFueSnCoD0+IHtcbiAgICAgIGNvbnNvbGUuZGVidWcoJ2tleXByZXNzZWQnKTtcbiAgICAgIC8vIE9uIGNsaWNrIHdlIHNhdmUgdGhlIHRleHQgU2VsZWN0aW9uXG4gICAgICB0aGlzLnNhdmVTZWxlY3Rpb24oKTtcbiAgICAgIC8vIFdlIGNoZWNrIGlmIHRoZXJlIGlzIGEgZHJvcGRvd24gbWF0Y2hpbmcgdGhpcyBjb250ZXh0XG4gICAgICB0aGlzLmNoZWNrRm9yRHJvcGRvd25Db250ZXh0KCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmVkaXRUYXJnZXQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCAoZXZlbnQ6IGFueSnCoD0+IHtcbiAgICAgIGNvbnNvbGUuZGVidWcoJygnICsgdGhpcy51aUlkICsgJykgZm9jdXMnKTtcbiAgICAgIC8vIE9uIGZvY3VzIHdlIHJlc3RvcmUgaXRcbiAgICAgIHRoaXMucmVzdG9yZVNlbGVjdGlvbigpO1xuICAgICAgdGhpcy5pc0ZvY3VzZWQgPSB0cnVlO1xuICAgICAgdGhpcy5mb2N1cy5lbWl0KCk7XG4gICAgfSk7XG4gICAgdGhpcy5lZGl0VGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCAoZXZlbnQ6IGFueSnCoD0+IHtcbiAgICAgIGNvbnNvbGUuZGVidWcoJygnICsgdGhpcy51aUlkICsgJykgYmx1cicpO1xuICAgICAgdGhpcy5pc0ZvY3VzZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuYmx1ci5lbWl0KCk7XG4gICAgICB0aGlzLnNhdmVTZWxlY3Rpb24oKTtcblxuICAgICAgaWYgKHRoaXMuZHJvcGRvd25Db21wb25lbnQpIHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5pbmxpbmVBY3Rpb24gPSBudWxsO1xuICAgICAgICAgIHRoaXMuZHJvcGRvd25Db21wb25lbnQuZGVzdHJveSgpO1xuICAgICAgICB9LCAzMDApO1xuICAgICAgICAvLyB0aGlzLmlubGluZUFjdGlvbiA9IG51bGw7XG4gICAgICAgIC8vIHRoaXMuZHJvcGRvd25Db21wb25lbnQuZGVzdHJveSgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5lZGl0VGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQ6IGFueSnCoD0+IHtcbiAgICAgIGNvbnNvbGUuZGVidWcoJ2tleWRvd24nLCBldmVudCk7XG4gICAgICBjb25zdCBzdG9wRGVmYXVsdCA9ICgpID0+IHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9XG4gICAgICBjb25zdCBzdG9wRGVmYXVsdEFuZEZvcmNlVXBkYXRlID0gKCkgPT4ge1xuICAgICAgICBzdG9wRGVmYXVsdCgpO1xuICAgICAgICB0aGlzLmNoZWNrRW1wdHkoKTtcbiAgICAgICAgdGhpcy5yZWFjdFRvQ2hhbmdlcygpO1xuICAgICAgfVxuICAgICAgLy8gVGhpcyBpcyBuZWVkZWQgYmVjYXVzZSwgaWYgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIGlzIHBhcnRcbiAgICAgIC8vIG9mIGEgbm9uLWVkaXRhYmxlIGNoaWxkIG9mIHRoZSBpbnB1dCwgdGhlIGRlZmF1bHQgZGVsZXRlIHdvbid0XG4gICAgICAvLyB3b3JrLlxuICAgICAgLy8gVGhpcyBjYXNlIGNhbiBoYXBwZW4gaWYgdGhlcmUgaXMgYSBjdXRvbSBlbGVtZW50IHRoYXRcbiAgICAgIC8vIHdhcyBpbnNlcnRlZCBieSBzb21lIGN1c3RvbSBjb250cm9sbGVyLlxuICAgICAgLy9cbiAgICAgIC8vIFNvbWUgY29uc3RyYWludHMgZm9yIGEgY3VzdG9tIGJsb2NrIHRvIHdvcmsgb24gdG9wIG9mIGNvbnRlbnRlZGl0YWJsZT1mYWxzZTpcbiAgICAgIC8vIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgICAvLyAtd2Via2l0LXVzZXItbW9kaWZ5OiByZWFkLW9ubHk7XG4gICAgICAvL1xuICAgICAgLy8gTm90ZTogSXQgbWF5IG1ha2Ugc2Vuc2UgdG8gZGVsZXRlIHRoZSBzZWxlY3Rpb24gZm9yIG5vcm1hbCB0ZXh0XG4gICAgICAvLyBpbnB1dCB0b28gYnV0IGZvciBub3cgd2Ugb25seSBkbyBpdCBvbiBkZWxldGlvbi5cbiAgICAgIGlmIChldmVudC5rZXkgPT09ICdCYWNrc3BhY2UnIHx8IGV2ZW50LmtleSA9PT0gJ0RlbGV0ZScgJiYgdGhpcy5zZWxlY3Rpb25SYW5nZSkge1xuICAgICAgICBjb25zdCBub2RlID0gdGhpcy5zZWxlY3Rpb25SYW5nZS5jb21tb25BbmNlc3RvckNvbnRhaW5lcjtcbiAgICAgICAgY29uc29sZS5kZWJ1ZygnRGVsZXRpb24nLCBub2RlKTtcbiAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJiAhKG5vZGUgYXMgSFRNTEVsZW1lbnQpLmlzQ29udGVudEVkaXRhYmxlKSB7XG4gICAgICAgICAgLy8gdGhpcyBpcyB0aGUgY2FzZSBvbiBmaXJlZm94XG4gICAgICAgICAgY29uc29sZS5kZWJ1ZygnZGVsZXRpbmcgaW5zaWRlIHVuLWVkaXRhYmxlIGJsb2NrIGRldGVjdGVkJyk7XG4gICAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5zZWxlY3ROb2RlKG5vZGUpO1xuICAgICAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2UuZGVsZXRlQ29udGVudHMoKTtcbiAgICAgICAgICBzdG9wRGVmYXVsdEFuZEZvcmNlVXBkYXRlKCk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZS5ub2RlTmFtZSA9PT0gJyN0ZXh0JyAmJiAhbm9kZS5wYXJlbnRFbGVtZW50LmlzQ29udGVudEVkaXRhYmxlKSB7XG4gICAgICAgICAgLy8gdGhpcyBpcyB0aGUgY2FzZSBvbiB3ZWJraXRcbiAgICAgICAgICBjb25zb2xlLmRlYnVnKCdkZWxldGluZyBpbnNpZGUgdW4tZWRpdGFibGUgYmxvY2sgZGV0ZWN0ZWQnKTtcbiAgICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLnNlbGVjdE5vZGUobm9kZS5wYXJlbnRFbGVtZW50KTtcbiAgICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLmRlbGV0ZUNvbnRlbnRzKCk7XG4gICAgICAgICAgc3RvcERlZmF1bHRBbmRGb3JjZVVwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBUaGlzIGlzIG5lZWRlZCBiZWNhdXNlLCB0aGVyZSBpcyBhIGJ1ZyBpbiBGaXJlZm94IHRoYXQgcHJldmVudFxuICAgICAgLy8gZGVsZXRpbmcgYSB1bmVkaXRhYmxlIGVsZW1lbnQgaW5zaWRlIGFuIGVkaXRhYmxlIGVsZW1lbnQuIFNvIHdlXG4gICAgICAvLyByZWltcGxlbWVudCB0aGUgd2hvbGUgZnVuY3Rpb24gZm9yIGFsbCBicm93c2Vycy5cbiAgICAgIGlmIChldmVudC5rZXkgPT09ICdCYWNrc3BhY2UnICYmIHRoaXMuc2VsZWN0aW9uUmFuZ2UpIHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuc2VsZWN0aW9uUmFuZ2UuY29tbW9uQW5jZXN0b3JDb250YWluZXI7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGlvblJhbmdlLmNvbGxhcHNlZCA9PT0gdHJ1ZSAmJlxuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5zdGFydE9mZnNldCA9PT0gMCAmJlxuICAgICAgICAgICAgbm9kZS5wcmV2aW91c1NpYmxpbmcgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJlxuICAgICAgICAgICAgIShub2RlLnByZXZpb3VzU2libGluZyBhcyBIVE1MRWxlbWVudCkuaXNDb250ZW50RWRpdGFibGUgKSB7XG4gICAgICAgICAgbm9kZS5wcmV2aW91c1NpYmxpbmcucmVtb3ZlKCk7XG4gICAgICAgICAgc3RvcERlZmF1bHRBbmRGb3JjZVVwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGV2ZW50LmtleSA9PT0gJ0RlbGV0ZScgJiYgdGhpcy5zZWxlY3Rpb25SYW5nZSkge1xuICAgICAgICBjb25zdCBub2RlID0gdGhpcy5zZWxlY3Rpb25SYW5nZS5jb21tb25BbmNlc3RvckNvbnRhaW5lcjtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uUmFuZ2UuY29sbGFwc2VkID09PSB0cnVlICYmXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLmVuZENvbnRhaW5lci5ub2RlTmFtZSA9PT0gJyN0ZXh0JyAmJlxuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5lbmRPZmZzZXQgPT09ICh0aGlzLnNlbGVjdGlvblJhbmdlLmVuZENvbnRhaW5lciBhcyBUZXh0KS5sZW5ndGggJiZcbiAgICAgICAgICAgIG5vZGUubmV4dFNpYmxpbmcgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJlxuICAgICAgICAgICAgIShub2RlLm5leHRTaWJsaW5nIGFzIEhUTUxFbGVtZW50KS5pc0NvbnRlbnRFZGl0YWJsZSApIHtcbiAgICAgICAgICBub2RlLm5leHRTaWJsaW5nLnJlbW92ZSgpO1xuICAgICAgICAgIHN0b3BEZWZhdWx0QW5kRm9yY2VVcGRhdGUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gSWYgYSBkcm9wZG93biBpcyBjdXJyZW50bHkgYmVpbmcgZGlzcGxheWVkIHdlIHVzZSB0aGUgdXAvZG93blxuICAgICAgLy8ga2V5IHRvIG5hdmlnYXRlIGl0cyBjb250ZW50IGFuZCByZXR1cm4gdG8gc2VsZWN0IHRoZSBzZWxlY3RlZFxuICAgICAgLy8gZWxlbWVudFxuICAgICAgaWYgKHRoaXMuaW5saW5lQWN0aW9uKSB7XG4gICAgICAgIGlmIChldmVudC5rZXkgPT09ICdVcCcgfHwgZXZlbnQua2V5ID09PSAnQXJyb3dVcCcpIHtcbiAgICAgICAgICBzdG9wRGVmYXVsdCgpO1xuICAgICAgICAgIHRoaXMuZHJvcGRvd25JbnN0YW5jZS5zZWxlY1ByZXZpb3VzKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQua2V5ID09PSAnRG93bicgfHwgZXZlbnQua2V5ID09PSAnQXJyb3dEb3duJykge1xuICAgICAgICAgIHN0b3BEZWZhdWx0KCk7XG4gICAgICAgICAgdGhpcy5kcm9wZG93bkluc3RhbmNlLnNlbGVjdE5leHQoKTtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudC5rZXkgPT09ICdFbnRlcicpIHtcbiAgICAgICAgICBzdG9wRGVmYXVsdCgpO1xuICAgICAgICAgIHRoaXMuZHJvcGRvd25JbnN0YW5jZS5jb25maXJtU2VsZWN0aW9uKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuZWRpdFRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChldmVudDogYW55KcKgPT4ge1xuICAgICAgY29uc29sZS5kZWJ1ZygndmFsdWUgY2hhbmdlZCcpO1xuICAgICAgdGhpcy5jaGVja0VtcHR5KCk7XG4gICAgICB0aGlzLnJlYWN0VG9DaGFuZ2VzKCk7XG4gICAgfSk7XG4gICAgY29uc3Qgc3R5bGU6IGFueSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMuZWRpdFRhcmdldCk7XG4gICAgdGhpcy5lZGl0VGFyZ2V0LnN0eWxlLm1pbkhlaWdodCA9IHRoaXMuZ2V0SGVpZ2h0KDIpO1xuICB9XG5cbiAgcHVibGljIG5nT25DaGFuZ2VzKGNoYW5nZXMpIHtcbiAgICBpZiAoY2hhbmdlc1sndWlJZCddKSB7XG4gICAgICB0aGlzLnN1YnNjcmliZVRvVWkodGhpcy51aUlkKTtcbiAgICB9XG4gICAgaWYgKGNoYW5nZXNbJ3JvdyddKSB7XG4gICAgICBpZiAodGhpcy5lZGl0VGFyZ2V0KSB7XG4gICAgICAgIHRoaXMuY29tcHV0ZUhlaWdodCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy51aVN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy51aVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBjb21wdXRlSGVpZ2h0KCkge1xuICAgIHRoaXMuZWRpdFRhcmdldC5zdHlsZS5oZWlnaHQgPSB0aGlzLmdldEhlaWdodCh0aGlzLnJvdyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgY2hlY2tFbXB0eSgpIHtcbiAgICBpZiAodGhpcy5lZGl0VGFyZ2V0LmlubmVySFRNTCA9PT0gJycpIHtcbiAgICAgIHRoaXMuZWRpdFRhcmdldC5pbm5lckhUTUwgPSAnPGJyPic7XG4gICAgICB0aGlzLmVtcHR5ID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZWRpdFRhcmdldC5pbm5lckhUTUwgPT09ICc8YnI+Jykge1xuICAgICAgdGhpcy5lbXB0eSA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZW1wdHkgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0SGVpZ2h0KHJvd0NvdW50KSB7XG4gICAgY29uc3Qgc3R5bGU6IGFueSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMuZWRpdFRhcmdldCk7XG4gICAgbGV0IGhlaWdodCA9IHRoaXMuZWRpdFRhcmdldC5zdHlsZS5oZWlnaHQgPSAocGFyc2VJbnQoc3R5bGUubGluZUhlaWdodCwgMTApICogcm93Q291bnQpO1xuICAgIGlmIChzdHlsZS5ib3hTaXppbmcgPT09ICdib3JkZXItYm94Jykge1xuICAgICAgaGVpZ2h0ICs9IHBhcnNlSW50KHN0eWxlLnBhZGRpbmdUb3AsIDEwKSArIHBhcnNlSW50KHN0eWxlLnBhZGRpbmdCb3R0b20sIDEwKSArIHBhcnNlSW50KHN0eWxlLmJvcmRlclRvcFdpZHRoLCAxMCkgKyBwYXJzZUludChzdHlsZS5ib3JkZXJCb3R0b21XaWR0aCwgMTApO1xuICAgIH1cbiAgICByZXR1cm4gaGVpZ2h0ICsgJ3B4JztcbiAgfVxuXG4gIHByb3RlY3RlZCB1aVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBwcm90ZWN0ZWQgc3Vic2NyaWJlVG9VaSh1aUlkKSB7XG4gICAgY29uc29sZS5kZWJ1Zygnc3Vic2NyaWJpbmcgdG8gJyArIHVpSWQsIHRoaXMudWlTdWJzY3JpcHRpb24pO1xuICAgIGlmICh0aGlzLnVpU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnVpU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIHRoaXMudWlTdWJzY3JpcHRpb24gPSB0aGlzLmNvbnRyb2xsZXIuY2hhbm5lbCh1aUlkKS5zdWJzY3JpYmUoKGNvbW1hbmQpID0+IHtcbiAgICAgIC8vIGlmIGlucHV0IGlzIG5vdCBvbiBmb2N1cyB3ZSBzYXZlIGN1cnJlbnQgZm9jdXM6XG4gICAgICBjb25zdCBmb2N1cyA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgICBjb25zb2xlLmRlYnVnKCcoJyArIHVpSWQgKyAnKSBnb3QgY29tbWFuZCAnICsgY29tbWFuZC5uYW1lICsgJy8nICsgY29tbWFuZC52YWx1ZSk7XG5cbiAgICAgIHRoaXMucmVzdG9yZVNlbGVjdGlvbigpO1xuICAgICAgaWYgKGNvbW1hbmQubmFtZSA9PT0gJ2luc2VydEhUTUwnICYmIHRoaXMuc2VsZWN0aW9uUmFuZ2UpIHtcbiAgICAgICAgLy8gSWYgc29tZXRoaW5nIGlzIHNlbGVjdGVkIHdlIGFzc3VtZSB0aGF0IHRoZSBnb2FsIGlzIHRvIHJlcGxhY2UgaXQsXG4gICAgICAgIC8vIHNvIGZpcnN0IHdlIGRlbGV0ZSB0aGUgY29udGVudFxuICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLmRlbGV0ZUNvbnRlbnRzKCk7XG4gICAgICAgIC8vIGluc2VydEh0bWwgc2VlbXMgcXVpdGUgYnJva2VuIHNvIHdlIGRvIGl0IG91cnNlbGV2ZXNcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5pbnNlcnROb2RlKGRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KGNvbW1hbmQudmFsdWUpKTtcbiAgICAgICAgLy8gbW92ZSBjdXNvciB0byB0aGUgZW5kIG9mIHRoZSBuZXdseSBpbnNlcnRlZCBlbGVtZW50XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2UuY29sbGFwc2UoZmFsc2UpO1xuICAgICAgICAvLyBGb3JjZSB0aGUgdXBkYXRlIG9mIHRoZSBtb2RlbFxuICAgICAgICB0aGlzLmNoZWNrRW1wdHkoKTtcbiAgICAgICAgdGhpcy5yZWFjdFRvQ2hhbmdlcygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoY29tbWFuZC5uYW1lLCBmYWxzZSwgY29tbWFuZC52YWx1ZSk7XG4gICAgICB9XG4gICAgICB0aGlzLnNhdmVTZWxlY3Rpb24oKTtcbiAgICAgIChmb2N1cyBhcyBhbnkpLmZvY3VzKCk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBTYXZlcyB0aGUgY3VycmVudCB0ZXh0IHNlbGVjdGlvblxuICBwcm90ZWN0ZWQgc2VsZWN0aW9uUmFuZ2U6IFJhbmdlO1xuICBwcm90ZWN0ZWQgc2F2ZVNlbGVjdGlvbigpIHtcbiAgICBpZiAodGhpcy5zZWxlY3Rpb25JbkVkaXRhYmxlVGFyZ2V0KCkpIHtcbiAgICAgIGNvbnN0IHNlbCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcbiAgICAgIGlmIChzZWwuZ2V0UmFuZ2VBdCAmJiBzZWwucmFuZ2VDb3VudCkge1xuICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlID0gc2VsLmdldFJhbmdlQXQoMCk7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoJygnICsgdGhpcy51aUlkICsgJykgc2F2ZVNlbGVjdGlvbicsIHRoaXMuc2VsZWN0aW9uUmFuZ2UpO1xuICAgICAgICB0aGlzLmRldGVjdFN0eWxlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8vIFJlc3RvcnMgdGhlIGN1cnJlbnQgdGV4dCBzZWxlY3Rpb25cbiAgcHJvdGVjdGVkIHJlc3RvcmVTZWxlY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uSW5FZGl0YWJsZVRhcmdldCgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnNvbGUuZGVidWcoJygnICsgdGhpcy51aUlkICsgJykgcmVzdG9yZVNlbGVjdGlvbicsIHRoaXMuc2VsZWN0aW9uUmFuZ2UpO1xuICAgIGlmICh0aGlzLnNlbGVjdGlvblJhbmdlKSB7XG4gICAgICBjb25zdCBzZWwgPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk7XG4gICAgICBzZWwucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgICBzZWwuYWRkUmFuZ2UodGhpcy5zZWxlY3Rpb25SYW5nZSk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIHNlbGVjdGlvbkluRWRpdGFibGVUYXJnZXQoKSB7XG4gICAgY29uc3Qgc2VsID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xuICAgIGNvbnN0IG5vZGUgPSBzZWwuZ2V0UmFuZ2VBdCAmJiBzZWwucmFuZ2VDb3VudCAmJiBzZWwuZ2V0UmFuZ2VBdCgwKSAmJiBzZWwuZ2V0UmFuZ2VBdCgwKS5jb21tb25BbmNlc3RvckNvbnRhaW5lcjtcbiAgICByZXR1cm4gbm9kZSAmJiAobm9kZSA9PT0gdGhpcy5lZGl0VGFyZ2V0IHx8IChub2RlLnBhcmVudEVsZW1lbnQuY2xvc2VzdCgnLmZhdGUtZWRpdC10YXJnZXQnKSAmJiAobm9kZS5wYXJlbnRFbGVtZW50LmNsb3Nlc3QoJy5mYXRlLWVkaXQtdGFyZ2V0JykgPT09IHRoaXMuZWRpdFRhcmdldCkpKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBkZXRlY3RTdHlsZSgpIHtcbiAgICBsZXQgbm9kZSA9IHRoaXMuc2VsZWN0aW9uUmFuZ2UuY29tbW9uQW5jZXN0b3JDb250YWluZXI7XG4gICAgaWYgKCFub2RlIHx8ICghKG5vZGUucGFyZW50RWxlbWVudC5jbG9zZXN0KCcuZmF0ZS1lZGl0LXRhcmdldCcpICYmIG5vZGUgIT09IHRoaXMuZWRpdFRhcmdldCkpKcKge1xuICAgICAgLy8gVGhlIGN1cnJlbnQgc2VsZWN0aW9uIGlzIG5vdCBjb250YWluZWQgaW4gdGhlIGVkaXRhYmxlIHpvbmUuXG4gICAgICAvLyB0aGlzIGlzIG1vc3QgbGlrZWx5IGR1ZSB0byB0aGUgaW5wdXQgYmVpbmcgZW1wdHkuXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIHNwZWNpYWwgY2FzZXMgZm9yIEZGIHdoZW4gc2VsZWN0aW9uIGlzIG9idGFpbmVkIGJ5IGRvdWJsZSBjbGljazpcbiAgICBpZiAoKHRoaXMuc2VsZWN0aW9uUmFuZ2UuZW5kT2Zmc2V0ID09PSAwKSAmJlxuICAgICAgICAodGhpcy5zZWxlY3Rpb25SYW5nZS5zdGFydENvbnRhaW5lci5ub2RlVmFsdWUpICYmXG4gICAgICAgICh0aGlzLnNlbGVjdGlvblJhbmdlLnN0YXJ0T2Zmc2V0ID09PSB0aGlzLnNlbGVjdGlvblJhbmdlLnN0YXJ0Q29udGFpbmVyLm5vZGVWYWx1ZS5sZW5ndGgpKSB7XG4gICAgICBub2RlID0gdGhpcy5zZWxlY3Rpb25SYW5nZS5zdGFydENvbnRhaW5lci5uZXh0U2libGluZztcbiAgICB9IGVsc2UgaWYgKCh0aGlzLnNlbGVjdGlvblJhbmdlLmVuZE9mZnNldCA9PT0gMCkgJiZcbiAgICAgICAgKHRoaXMuc2VsZWN0aW9uUmFuZ2Uuc3RhcnRPZmZzZXQgPT09IDApKSB7XG4gICAgICBub2RlID0gdGhpcy5zZWxlY3Rpb25SYW5nZS5zdGFydENvbnRhaW5lci5wYXJlbnRFbGVtZW50O1xuICAgIH0gZWxzZSBpZiAoKHRoaXMuc2VsZWN0aW9uUmFuZ2UuY29tbW9uQW5jZXN0b3JDb250YWluZXIgPT09IHRoaXMuZWRpdFRhcmdldCkgJiZcbiAgICAgICAgICAgICAgICh0aGlzLnNlbGVjdGlvblJhbmdlLnN0YXJ0Q29udGFpbmVyID09PSB0aGlzLmVkaXRUYXJnZXQpICYmXG4gICAgICAgICAgICAgICAodGhpcy5zZWxlY3Rpb25SYW5nZS5lbmRDb250YWluZXIgPT09IHRoaXMuZWRpdFRhcmdldCkpIHtcbiAgICAgIG5vZGUgPSB0aGlzLnNlbGVjdGlvblJhbmdlLmNvbW1vbkFuY2VzdG9yQ29udGFpbmVyLmNoaWxkTm9kZXNbdGhpcy5zZWxlY3Rpb25SYW5nZS5zdGFydE9mZnNldF07XG4gICAgfVxuICAgIGlmIChub2RlICYmIG5vZGUgIT09IHRoaXMuZWRpdFRhcmdldCkge1xuICAgICAgY29uc3Qgbm9kZXMgPSB0aGlzLmh0bWxQYXJzZXIuZmluZFBhcmVudE5vZGVzKG5vZGUsIHRoaXMuZWRpdFRhcmdldCk7XG4gICAgICBjb25zb2xlLmRlYnVnKCcgIC0+IGRldGVjdGVkIGFjdGlvbnM6ICcsIG5vZGVzKTtcbiAgICAgIHRoaXMuY29udHJvbGxlci5lbmFibGVBY3Rpb25zKHRoaXMudWlJZCwgbm9kZXMpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGltcGxlbnRhdGlvbiBvZiBDb250cm9sVmFsdWVBY2Nlc3NvcjpcbiAgcHJvdGVjdGVkIGNoYW5nZWQgPSBuZXcgQXJyYXk8KHZhbHVlOiBzdHJpbmcpID0+IHZvaWQ+KCk7XG5cbiAgcHVibGljIHdyaXRlVmFsdWUodmFsdWU6IHN0cmluZykge1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5jb250ZW50ID0gdGhpcy5zYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdEh0bWwodGhpcy5odG1sUGFyc2VyLnNlcmlhbGl6ZSh0aGlzLnBhcnNlci5wYXJzZSh2YWx1ZSkpKTtcbiAgICAgIHRoaXMuZW1wdHkgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jb250ZW50ID0gdGhpcy5zYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdEh0bWwoJzxicj4nKTtcbiAgICAgIHRoaXMuZW1wdHkgPSB0cnVlO1xuICAgIH1cbiAgICB0aGlzLnNlbGVjdGlvblJhbmdlID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgcHVibGljIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogc3RyaW5nKSA9PiB2b2lkKSB7XG4gICAgdGhpcy5jaGFuZ2VkLnB1c2goZm4pO1xuICB9XG5cbiAgcHVibGljIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiB2b2lkKSB7fVxuXG4gIHByb3RlY3RlZCBjaGVja0ZvckRyb3Bkb3duQ29udGV4dCgpIHtcbiAgICBjb25zdCBzdGFydFBvcyA9IE1hdGgubWF4KHRoaXMuc2VsZWN0aW9uUmFuZ2Uuc3RhcnRPZmZzZXQgLSAyMCwgMCk7XG4gICAgY29uc3QgbGVuZ3RoID0gdGhpcy5zZWxlY3Rpb25SYW5nZS5zdGFydE9mZnNldCAtIHN0YXJ0UG9zO1xuICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzLnNlbGVjdGlvblJhbmdlLnN0YXJ0Q29udGFpbmVyLnRleHRDb250ZW50LnN1YnN0cihzdGFydFBvcywgbGVuZ3RoKTtcblxuICAgIGNvbnN0IGlubGluZUFjdGlvbiA9IHRoaXMuY29udHJvbGxlci5nZXRJbmxpbmVBY3Rpb24oY29udGV4dCk7XG4gICAgaWYgKGlubGluZUFjdGlvbikge1xuICAgICAgaWYgKCF0aGlzLmlubGluZUFjdGlvbiB8fCB0aGlzLmlubGluZUFjdGlvbi5kcm9wZG93biAhPT0gaW5saW5lQWN0aW9uLmRyb3Bkb3duKSB7XG4gICAgICAgIHRoaXMuaW5saW5lQWN0aW9uID0gaW5saW5lQWN0aW9uO1xuICAgICAgICB0aGlzLmluaXREcm9wZG93bihpbmxpbmVBY3Rpb24sIHRoaXMuc2VsZWN0aW9uUmFuZ2UuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5pbmxpbmVBY3Rpb24gPSBpbmxpbmVBY3Rpb247XG4gICAgICAgIHRoaXMudXBkYXRlRHJvcGRvd24oaW5saW5lQWN0aW9uLm1hdGNoZWQpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5kcm9wZG93bkNvbXBvbmVudCkge1xuICAgICAgdGhpcy5pbmxpbmVBY3Rpb24gPSBudWxsO1xuICAgICAgdGhpcy5kcm9wZG93bkNvbXBvbmVudC5kZXN0cm95KCk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGluaXREcm9wZG93bihhY3Rpb25Db21wb25lbnQsIHBvc2l0aW9uKSB7XG4gICAgLy8gc2V0IHRoZSBkcm9wZG93biBjb21wb25lbnRcbiAgICBpZiAodGhpcy5kcm9wZG93bkNvbXBvbmVudCkge1xuICAgICAgdGhpcy5kcm9wZG93bkNvbXBvbmVudC5kZXN0cm95KCk7XG4gICAgfVxuICAgIGNvbnN0IGZhY3RvcnkgPSB0aGlzLmZhY3RvcnlSZXNvbHZlci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShhY3Rpb25Db21wb25lbnQuZHJvcGRvd24pO1xuICAgIGNvbnN0IGNvbXBvbmVudDogYW55ID0gZmFjdG9yeS5jcmVhdGUodGhpcy52aWV3Q29udGFpbmVyUmVmLnBhcmVudEluamVjdG9yKTtcbiAgICBpZiAoY29tcG9uZW50Lmluc3RhbmNlLnZhbHVlQ2hhbmdlKSB7XG4gICAgICBjb21wb25lbnQuaW5zdGFuY2UudmFsdWUgPSBhY3Rpb25Db21wb25lbnQubWF0Y2hlZDtcbiAgICAgIGNvbXBvbmVudC5pbnN0YW5jZS52YWx1ZUNoYW5nZS5zdWJzY3JpYmUoKHZhbHVlKSA9PiB7XG4gICAgICAgIHRoaXMuZWRpdFRhcmdldC5mb2N1cygpO1xuICAgICAgICBjb25zdCBlbmQgPSB0aGlzLnNlbGVjdGlvblJhbmdlLmVuZE9mZnNldDtcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5zZXRTdGFydCh0aGlzLnNlbGVjdGlvblJhbmdlLmVuZENvbnRhaW5lciwgZW5kIC0gYWN0aW9uQ29tcG9uZW50Lm1hdGNoZWQubGVuZ3RoKTtcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLmRvSW5saW5lKHRoaXMudWlJZCwgdGhpcy5pbmxpbmVBY3Rpb24sIHZhbHVlKTtcbiAgICAgICAgLy8gZGVsZXRlIHRoZSBkcm9wZG93blxuICAgICAgICB0aGlzLmlubGluZUFjdGlvbiA9IG51bGw7XG4gICAgICAgIHRoaXMuZHJvcGRvd25Db21wb25lbnQuZGVzdHJveSgpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLmRyb3Bkb3duQ29tcG9uZW50ID0gdGhpcy52aWV3Q29udGFpbmVyUmVmLmluc2VydChjb21wb25lbnQuaG9zdFZpZXcpO1xuICAgICAgdGhpcy5kcm9wZG93bkluc3RhbmNlID0gY29tcG9uZW50Lmluc3RhbmNlO1xuICAgICAgdGhpcy51cGRhdGVEcm9wZG93blBvc2l0aW9uKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIGNvbXBvbmVudCB1c2VkIGFzIGEgZHJvcGRvd24gZG9lc25cXCd0IGNvbnRhaW4gYSB2YWx1ZUNoYW5nZSBlbW1pdGVyIScpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCB1cGRhdGVEcm9wZG93bih2YWx1ZSkge1xuICAgIHRoaXMuZHJvcGRvd25JbnN0YW5jZS52YWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMudXBkYXRlRHJvcGRvd25Qb3NpdGlvbigpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHVwZGF0ZURyb3Bkb3duUG9zaXRpb24oKSB7XG4gICAgaWYgKHRoaXMuaW5saW5lQWN0aW9uLmRpc3BsYXkgPT09ICdjb250ZXh0dWFsJykge1xuICAgICAgLy8gY3JlYXRlIGEgc2VsZWN0aW9uIHRvIGdldCB0aGUgc2l6ZSBvZiB0aGUgbWF0Y2hpbmcgdGV4dFxuICAgICAgY29uc3QgcGFyZW50T2Zmc2V0QkIgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQub2Zmc2V0UGFyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgY29uc3QgcmFuZ2UgPSB0aGlzLnNlbGVjdGlvblJhbmdlLmNsb25lUmFuZ2UoKTtcbiAgICAgIGNvbnN0IGVuZCA9IHJhbmdlLmVuZE9mZnNldDtcbiAgICAgIHJhbmdlLnNldFN0YXJ0KHJhbmdlLmVuZENvbnRhaW5lciwgZW5kIC0gdGhpcy5pbmxpbmVBY3Rpb24ubWF0Y2hlZC5sZW5ndGgpO1xuICAgICAgY29uc3QgYm91bmRpbmdCb3ggPSByYW5nZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIHRoaXMuZHJvcGRvd25Qb3N0aW9uVG9wID0gKGJvdW5kaW5nQm94LnRvcCArIGJvdW5kaW5nQm94LmhlaWdodCAtIHBhcmVudE9mZnNldEJCLnRvcCkgKyAncHgnO1xuICAgICAgdGhpcy5kcm9wZG93blBvc3Rpb25MZWZ0ID0gKGJvdW5kaW5nQm94LmxlZnQgLSBwYXJlbnRPZmZzZXRCQi5sZWZ0KSArICdweCc7XG4gICAgfVxuICB9XG59XG4iXX0=