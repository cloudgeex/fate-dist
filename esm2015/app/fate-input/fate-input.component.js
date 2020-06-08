var FateInputComponent_1;
import { __decorate, __param } from "tslib";
import { Component, Input, Output, ViewChild, ElementRef, ViewRef, ViewContainerRef, ComponentFactoryResolver, OnInit, OnChanges, AfterViewInit, OnDestroy, EventEmitter, Renderer2, SimpleChanges, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FateControllerService } from '../fate-controller.service';
import { FateHtmlParserService } from '../fate-html-parser.service';
import { FateParserService } from '../fate-parser.service';
let FateInputComponent = FateInputComponent_1 = class FateInputComponent {
    constructor(el, controller, htmlParser, parser, sanitizer, factoryResolver, renderer, document) {
        this.el = el;
        this.controller = controller;
        this.htmlParser = htmlParser;
        this.parser = parser;
        this.sanitizer = sanitizer;
        this.factoryResolver = factoryResolver;
        this.renderer = renderer;
        this.document = document;
        this.uiId = 'default';
        this.placeholder = '';
        this.initialFocus = false;
        this.focus = new EventEmitter();
        this.blur = new EventEmitter();
        this.empty = true;
        this.isFocused = false;
        this._unlisteners = [];
        // implentation of ControlValueAccessor:
        this.changed = new Array();
    }
    set editTargetElementRef(elementRef) {
        this.editTarget = elementRef.nativeElement;
    }
    set unlisteners(handler) {
        this._unlisteners.push(handler);
    }
    unlisten() {
        for (const handler of this._unlisteners) {
            handler();
        }
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
        if (this.row) {
            this.computeHeight();
        }
        this.unlisteners = this.renderer.listen(this.editTarget, 'click', (event) => {
            console.debug('click');
            // On click we save the text Selection
            this.saveSelection();
            // We check if there is a dropdown matching this context
            this.checkForDropdownContext();
        });
        this.unlisteners = this.renderer.listen(this.editTarget, 'keyup', (event) => {
            console.debug('keypressed');
            // On click we save the text Selection
            this.saveSelection();
            // We check if there is a dropdown matching this context
            this.checkForDropdownContext();
        });
        this.unlisteners = this.renderer.listen(this.editTarget, 'focus', (event) => {
            console.debug('(' + this.uiId + ') focus');
            // On focus we restore it
            this.restoreSelection();
            this.isFocused = true;
            this.focus.emit();
        });
        this.unlisteners = this.renderer.listen(this.editTarget, 'blur', (event) => {
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
        this.unlisteners = this.renderer.listen(this.editTarget, 'keydown', (event) => {
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
        this.unlisteners = this.renderer.listen(this.editTarget, 'input', (event) => {
            console.debug('value changed');
            this.checkEmpty();
            this.reactToChanges();
        });
        // const style: CSSStyleDeclaration = window.getComputedStyle(this.editTarget);
        this.renderer.setStyle(this.editTarget, 'min-height', this.getHeight(2));
        if (this.initialFocus) {
            Promise.resolve(null).then(() => this.editTarget.focus());
        }
    }
    ngOnChanges(changes) {
        if (changes.uiId) {
            this.subscribeToUi(this.uiId);
        }
        if (changes.row) {
            if (this.editTarget) {
                this.computeHeight();
            }
        }
    }
    ngOnDestroy() {
        if (this.uiSubscription) {
            this.uiSubscription.unsubscribe();
        }
        this.unlisten();
    }
    computeHeight() {
        this.renderer.setStyle(this.editTarget, 'height', this.getHeight(this.row));
    }
    checkEmpty() {
        if (this.editTarget.innerHTML === '') {
            this.renderer.setAttribute(this.editTarget, 'innerHTML', '<br>');
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
        let height = parseInt(style.lineHeight, 10) * rowCount;
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
            // if input is not on focus we save current focused element:
            const activeElement = this.document.activeElement;
            console.debug('(' + uiId + ') got command ' + command.name + '/' + command.value);
            this.restoreSelection();
            if (command.name === 'insertHTML' && this.selectionRange) {
                // If something is selected we assume that the goal is to replace it,
                // so first we delete the content
                this.selectionRange.deleteContents();
                // insertHtml seems quite broken so we do it ourseleves
                this.selectionRange.insertNode(this.document.createRange().createContextualFragment(command.value));
                // move cusor to the end of the newly inserted element
                this.selectionRange.collapse(false);
                // Force the update of the model
                this.checkEmpty();
                this.reactToChanges();
            }
            else {
                this.document.execCommand(command.name, false, command.value);
            }
            this.saveSelection();
            if (activeElement instanceof HTMLElement) {
                activeElement.focus();
            }
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
    { type: ComponentFactoryResolver },
    { type: Renderer2 },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
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
__decorate([
    ViewChild('editTarget', { static: true })
], FateInputComponent.prototype, "editTargetElementRef", null);
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
      #editTarget
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
    }),
    __param(7, Inject(DOCUMENT))
], FateInputComponent);
export { FateInputComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmF0ZS1pbnB1dC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9mYXRlLWVkaXRvci8iLCJzb3VyY2VzIjpbImFwcC9mYXRlLWlucHV0L2ZhdGUtaW5wdXQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFNBQVMsRUFDVCxVQUFVLEVBQ1YsT0FBTyxFQUNQLGdCQUFnQixFQUNoQix3QkFBd0IsRUFDeEIsTUFBTSxFQUNOLFNBQVMsRUFDVCxhQUFhLEVBQ2IsU0FBUyxFQUNULFlBQVksRUFDWixTQUFTLEVBQ1QsYUFBYSxFQUNiLE1BQU0sRUFDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUFFLGlCQUFpQixFQUF3QixNQUFNLGdCQUFnQixDQUFDO0FBQ3pFLE9BQU8sRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFJbkUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDbkUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDcEUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUErRDNELElBQWEsa0JBQWtCLDBCQUEvQixNQUFhLGtCQUFrQjtJQW1EN0IsWUFDWSxFQUFjLEVBQ2QsVUFBaUMsRUFDakMsVUFBaUMsRUFDakMsTUFBeUIsRUFDekIsU0FBdUIsRUFDdkIsZUFBeUMsRUFDM0MsUUFBbUIsRUFDRCxRQUFhO1FBUDdCLE9BQUUsR0FBRixFQUFFLENBQVk7UUFDZCxlQUFVLEdBQVYsVUFBVSxDQUF1QjtRQUNqQyxlQUFVLEdBQVYsVUFBVSxDQUF1QjtRQUNqQyxXQUFNLEdBQU4sTUFBTSxDQUFtQjtRQUN6QixjQUFTLEdBQVQsU0FBUyxDQUFjO1FB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dURBQ3dCO0FBR2hDO0lBREMsS0FBSyxFQUFFO3dEQUM2QjtBQUdyQztJQURDLE1BQU0sRUFBRTtpREFDK0I7QUFHeEM7SUFEQyxNQUFNLEVBQUU7Z0RBQzhCO0FBWXZDO0lBSkMsU0FBUyxDQUFDLFVBQVUsRUFBRTtRQUNyQixJQUFJLEVBQUUsZ0JBQWdCO1FBQ3RCLE1BQU0sRUFBRSxJQUFJO0tBQ2IsQ0FBQzs0REFDaUM7QUFHbkM7SUFEQyxTQUFTLENBQUMsWUFBWSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDOzhEQUd6QztBQXRDVSxrQkFBa0I7SUE3RDlCLFNBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxZQUFZO1FBQ3RCLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBa0JUO1FBcUNELFNBQVMsRUFBRTtZQUNULEVBQUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFdBQVcsRUFBRSxvQkFBa0IsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFO1NBQzdFO2lCQXJDQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBaUNDO0tBS0osQ0FBQztJQTRERyxXQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTtHQTNEUixrQkFBa0IsQ0E2Z0I5QjtTQTdnQlksa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBWaWV3Q2hpbGQsXG4gIEVsZW1lbnRSZWYsXG4gIFZpZXdSZWYsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgT25Jbml0LFxuICBPbkNoYW5nZXMsXG4gIEFmdGVyVmlld0luaXQsXG4gIE9uRGVzdHJveSxcbiAgRXZlbnRFbWl0dGVyLFxuICBSZW5kZXJlcjIsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIEluamVjdFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5HX1ZBTFVFX0FDQ0VTU09SLCBDb250cm9sVmFsdWVBY2Nlc3NvciB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IERvbVNhbml0aXplciwgU2FmZUh0bWwgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcblxuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IEZhdGVDb250cm9sbGVyU2VydmljZSB9IGZyb20gJy4uL2ZhdGUtY29udHJvbGxlci5zZXJ2aWNlJztcbmltcG9ydCB7IEZhdGVIdG1sUGFyc2VyU2VydmljZSB9IGZyb20gJy4uL2ZhdGUtaHRtbC1wYXJzZXIuc2VydmljZSc7XG5pbXBvcnQgeyBGYXRlUGFyc2VyU2VydmljZSB9IGZyb20gJy4uL2ZhdGUtcGFyc2VyLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdmYXRlLWlucHV0JyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2XG4gICAgICBjbGFzcz1cImZhdGUtaW5saW5lLWRyb3Bkb3duXCJcbiAgICAgIFtjbGFzcy5oaWRkZW5dPVwiIWlubGluZUFjdGlvblwiXG4gICAgICBbY2xhc3MuY29udGV4dHVhbF09XCJpbmxpbmVBY3Rpb24/LmRpc3BsYXkgPT09ICdjb250ZXh0dWFsJ1wiXG4gICAgICBbc3R5bGUudG9wXT1cImRyb3Bkb3duUG9zdGlvblRvcFwiXG4gICAgICBbc3R5bGUubGVmdF09XCJkcm9wZG93blBvc3Rpb25MZWZ0XCJcbiAgICA+XG4gICAgICA8bmctdGVtcGxhdGUgI2Ryb3Bkb3duPjwvbmctdGVtcGxhdGU+XG4gICAgPC9kaXY+XG4gICAgPGRpdlxuICAgICAgI2VkaXRUYXJnZXRcbiAgICAgIFtjbGFzc109XCInZmF0ZS1lZGl0LXRhcmdldCAnICsgY3VzdG9tQ2xhc3NcIlxuICAgICAgW25nQ2xhc3NdPVwieyBlbXB0eTogZW1wdHkgfVwiXG4gICAgICBjb250ZW50ZWRpdGFibGU9XCJ0cnVlXCJcbiAgICAgIFt0aXRsZV09XCJwbGFjZWhvbGRlclwiXG4gICAgICBbaW5uZXJIdG1sXT1cImNvbnRlbnRcIlxuICAgID48L2Rpdj5cbiAgYCxcbiAgc3R5bGVzOiBbXG4gICAgYFxuICAgICAgOmhvc3QgZGl2LmZhdGUtZWRpdC10YXJnZXQge1xuICAgICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgICAgcGFkZGluZzogMTBweDtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgI2RkZDtcbiAgICAgICAgb3V0bGluZTogMDtcbiAgICAgICAgcmVzaXplOiB2ZXJ0aWNhbDtcbiAgICAgICAgb3ZlcmZsb3c6IGF1dG87XG4gICAgICAgIGJhY2tncm91bmQ6ICNmZmY7XG4gICAgICAgIGNvbG9yOiAjMDAwO1xuICAgICAgICBvdmVyZmxvdzogdmlzaWJsZTtcbiAgICAgIH1cbiAgICAgIDpob3N0IGRpdi5mYXRlLWVkaXQtdGFyZ2V0LmVtcHR5Om5vdCg6Zm9jdXMpOmJlZm9yZSB7XG4gICAgICAgIGNvbnRlbnQ6IGF0dHIodGl0bGUpO1xuICAgICAgICBjb2xvcjogIzYzNmM3MjtcbiAgICAgIH1cbiAgICAgIC5mYXRlLWlubGluZS1kcm9wZG93biB7XG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNkZGQ7XG4gICAgICAgIGJvcmRlci1ib3R0b206IDA7XG4gICAgICB9XG4gICAgICAuZmF0ZS1pbmxpbmUtZHJvcGRvd24uaGlkZGVuIHtcbiAgICAgICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICAgICAgfVxuICAgICAgLmZhdGUtaW5saW5lLWRyb3Bkb3duLmNvbnRleHR1YWwge1xuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgIGJhY2tncm91bmQ6ICNmZmY7XG4gICAgICAgIGJveC1zaGFkb3c6IDAgNXB4IDMwcHggLTEwcHggcmdiYSgwLCAwLCAwLCAwLjQpO1xuICAgICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2NjYztcbiAgICAgIH1cbiAgICAgIDpob3N0IHtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMTBweDtcbiAgICAgICAgLypwb3NpdGlvbjogcmVsYXRpdmU7Ki9cbiAgICAgIH1cbiAgICBgXG4gIF0sXG4gIHByb3ZpZGVyczogW1xuICAgIHsgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsIHVzZUV4aXN0aW5nOiBGYXRlSW5wdXRDb21wb25lbnQsIG11bHRpOiB0cnVlIH1cbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBGYXRlSW5wdXRDb21wb25lbnRcbiAgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciwgT25DaGFuZ2VzLCBPbkluaXQsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgpXG4gIHB1YmxpYyB1aUlkOiBzdHJpbmcgPSAnZGVmYXVsdCc7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHJvdzogbnVtYmVyO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBjdXN0b21DbGFzczogc3RyaW5nO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBwbGFjZWhvbGRlcjogc3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgcHVibGljIGluaXRpYWxGb2N1czogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIEBPdXRwdXQoKVxuICBwdWJsaWMgZm9jdXMgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgQE91dHB1dCgpXG4gIHB1YmxpYyBibHVyID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIHB1YmxpYyBkcm9wZG93blBvc3Rpb25Ub3A6IHN0cmluZztcbiAgcHVibGljIGRyb3Bkb3duUG9zdGlvbkxlZnQ6IHN0cmluZztcbiAgcHVibGljIGlubGluZUFjdGlvbjogYW55O1xuICBwdWJsaWMgY29udGVudDogU2FmZUh0bWw7XG4gIHB1YmxpYyBlbXB0eTogYm9vbGVhbiA9IHRydWU7XG5cbiAgQFZpZXdDaGlsZCgnZHJvcGRvd24nLCB7XG4gICAgcmVhZDogVmlld0NvbnRhaW5lclJlZixcbiAgICBzdGF0aWM6IHRydWVcbiAgfSlcbiAgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZjtcblxuICBAVmlld0NoaWxkKCdlZGl0VGFyZ2V0JywgeyBzdGF0aWM6IHRydWUgfSlcbiAgcHJvdGVjdGVkIHNldCBlZGl0VGFyZ2V0RWxlbWVudFJlZihlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50Pikge1xuICAgIHRoaXMuZWRpdFRhcmdldCA9IGVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgfVxuXG4gIHByb3RlY3RlZCBkcm9wZG93bkNvbXBvbmVudDogVmlld1JlZjtcbiAgcHJvdGVjdGVkIGRyb3Bkb3duSW5zdGFuY2U6IGFueTtcbiAgcHJvdGVjdGVkIGVkaXRUYXJnZXQ6IEhUTUxFbGVtZW50O1xuXG4gIHByb3RlY3RlZCBpc0ZvY3VzZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBwcml2YXRlIF91bmxpc3RlbmVyczogKCgpID0+IHZvaWQpW10gPSBbXTtcbiAgcHJpdmF0ZSBzZXQgdW5saXN0ZW5lcnMoaGFuZGxlcjogKCkgPT4gdm9pZCkge1xuICAgIHRoaXMuX3VubGlzdGVuZXJzLnB1c2goaGFuZGxlcik7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgZWw6IEVsZW1lbnRSZWYsXG4gICAgcHJvdGVjdGVkIGNvbnRyb2xsZXI6IEZhdGVDb250cm9sbGVyU2VydmljZSxcbiAgICBwcm90ZWN0ZWQgaHRtbFBhcnNlcjogRmF0ZUh0bWxQYXJzZXJTZXJ2aWNlLFxuICAgIHByb3RlY3RlZCBwYXJzZXI6IEZhdGVQYXJzZXJTZXJ2aWNlLFxuICAgIHByb3RlY3RlZCBzYW5pdGl6ZXI6IERvbVNhbml0aXplcixcbiAgICBwcm90ZWN0ZWQgZmFjdG9yeVJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQ6IGFueVxuICApIHt9XG5cbiAgcHJpdmF0ZSB1bmxpc3RlbigpIHtcbiAgICBmb3IgKGNvbnN0IGhhbmRsZXIgb2YgdGhpcy5fdW5saXN0ZW5lcnMpIHtcbiAgICAgIGhhbmRsZXIoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlYWN0VG9DaGFuZ2VzKCkge1xuICAgIGNvbnN0IHRyZWUgPSB0aGlzLmh0bWxQYXJzZXIucGFyc2VFbGVtZW50KHRoaXMuZWRpdFRhcmdldCk7XG4gICAgY29uc3Qgc2VyaWFsaXplZFRyZWUgPSB0aGlzLnBhcnNlci5zZXJpYWxpemUodHJlZSk7XG4gICAgdGhpcy5jaGFuZ2VkLmZvckVhY2goZiA9PiBmKHNlcmlhbGl6ZWRUcmVlKSk7XG4gIH1cblxuICBwdWJsaWMgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5zdWJzY3JpYmVUb1VpKHRoaXMudWlJZCk7XG4gIH1cblxuICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGlmICh0aGlzLnJvdykge1xuICAgICAgdGhpcy5jb21wdXRlSGVpZ2h0KCk7XG4gICAgfVxuXG4gICAgdGhpcy51bmxpc3RlbmVycyA9IHRoaXMucmVuZGVyZXIubGlzdGVuKFxuICAgICAgdGhpcy5lZGl0VGFyZ2V0LFxuICAgICAgJ2NsaWNrJyxcbiAgICAgIChldmVudDogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICBjb25zb2xlLmRlYnVnKCdjbGljaycpO1xuICAgICAgICAvLyBPbiBjbGljayB3ZSBzYXZlIHRoZSB0ZXh0IFNlbGVjdGlvblxuICAgICAgICB0aGlzLnNhdmVTZWxlY3Rpb24oKTtcbiAgICAgICAgLy8gV2UgY2hlY2sgaWYgdGhlcmUgaXMgYSBkcm9wZG93biBtYXRjaGluZyB0aGlzIGNvbnRleHRcbiAgICAgICAgdGhpcy5jaGVja0ZvckRyb3Bkb3duQ29udGV4dCgpO1xuICAgICAgfVxuICAgICk7XG5cbiAgICB0aGlzLnVubGlzdGVuZXJzID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oXG4gICAgICB0aGlzLmVkaXRUYXJnZXQsXG4gICAgICAna2V5dXAnLFxuICAgICAgKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoJ2tleXByZXNzZWQnKTtcbiAgICAgICAgLy8gT24gY2xpY2sgd2Ugc2F2ZSB0aGUgdGV4dCBTZWxlY3Rpb25cbiAgICAgICAgdGhpcy5zYXZlU2VsZWN0aW9uKCk7XG4gICAgICAgIC8vIFdlIGNoZWNrIGlmIHRoZXJlIGlzIGEgZHJvcGRvd24gbWF0Y2hpbmcgdGhpcyBjb250ZXh0XG4gICAgICAgIHRoaXMuY2hlY2tGb3JEcm9wZG93bkNvbnRleHQoKTtcbiAgICAgIH1cbiAgICApO1xuXG4gICAgdGhpcy51bmxpc3RlbmVycyA9IHRoaXMucmVuZGVyZXIubGlzdGVuKFxuICAgICAgdGhpcy5lZGl0VGFyZ2V0LFxuICAgICAgJ2ZvY3VzJyxcbiAgICAgIChldmVudDogRm9jdXNFdmVudCkgPT4ge1xuICAgICAgICBjb25zb2xlLmRlYnVnKCcoJyArIHRoaXMudWlJZCArICcpIGZvY3VzJyk7XG4gICAgICAgIC8vIE9uIGZvY3VzIHdlIHJlc3RvcmUgaXRcbiAgICAgICAgdGhpcy5yZXN0b3JlU2VsZWN0aW9uKCk7XG4gICAgICAgIHRoaXMuaXNGb2N1c2VkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5mb2N1cy5lbWl0KCk7XG4gICAgICB9XG4gICAgKTtcbiAgICB0aGlzLnVubGlzdGVuZXJzID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oXG4gICAgICB0aGlzLmVkaXRUYXJnZXQsXG4gICAgICAnYmx1cicsXG4gICAgICAoZXZlbnQ6IEZvY3VzRXZlbnQpID0+IHtcbiAgICAgICAgY29uc29sZS5kZWJ1ZygnKCcgKyB0aGlzLnVpSWQgKyAnKSBibHVyJyk7XG4gICAgICAgIHRoaXMuaXNGb2N1c2VkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYmx1ci5lbWl0KCk7XG4gICAgICAgIHRoaXMuc2F2ZVNlbGVjdGlvbigpO1xuXG4gICAgICAgIGlmICh0aGlzLmRyb3Bkb3duQ29tcG9uZW50KSB7XG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmlubGluZUFjdGlvbiA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmRyb3Bkb3duQ29tcG9uZW50LmRlc3Ryb3koKTtcbiAgICAgICAgICB9LCAzMDApO1xuICAgICAgICAgIC8vIHRoaXMuaW5saW5lQWN0aW9uID0gbnVsbDtcbiAgICAgICAgICAvLyB0aGlzLmRyb3Bkb3duQ29tcG9uZW50LmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICk7XG5cbiAgICB0aGlzLnVubGlzdGVuZXJzID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oXG4gICAgICB0aGlzLmVkaXRUYXJnZXQsXG4gICAgICAna2V5ZG93bicsXG4gICAgICAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAgICAgY29uc29sZS5kZWJ1Zygna2V5ZG93bicsIGV2ZW50KTtcbiAgICAgICAgY29uc3Qgc3RvcERlZmF1bHQgPSAoKSA9PiB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3Qgc3RvcERlZmF1bHRBbmRGb3JjZVVwZGF0ZSA9ICgpID0+IHtcbiAgICAgICAgICBzdG9wRGVmYXVsdCgpO1xuICAgICAgICAgIHRoaXMuY2hlY2tFbXB0eSgpO1xuICAgICAgICAgIHRoaXMucmVhY3RUb0NoYW5nZXMoKTtcbiAgICAgICAgfTtcbiAgICAgICAgLy8gVGhpcyBpcyBuZWVkZWQgYmVjYXVzZSwgaWYgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIGlzIHBhcnRcbiAgICAgICAgLy8gb2YgYSBub24tZWRpdGFibGUgY2hpbGQgb2YgdGhlIGlucHV0LCB0aGUgZGVmYXVsdCBkZWxldGUgd29uJ3RcbiAgICAgICAgLy8gd29yay5cbiAgICAgICAgLy8gVGhpcyBjYXNlIGNhbiBoYXBwZW4gaWYgdGhlcmUgaXMgYSBjdXRvbSBlbGVtZW50IHRoYXRcbiAgICAgICAgLy8gd2FzIGluc2VydGVkIGJ5IHNvbWUgY3VzdG9tIGNvbnRyb2xsZXIuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIFNvbWUgY29uc3RyYWludHMgZm9yIGEgY3VzdG9tIGJsb2NrIHRvIHdvcmsgb24gdG9wIG9mIGNvbnRlbnRlZGl0YWJsZT1mYWxzZTpcbiAgICAgICAgLy8gLW1vei11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAgICAgLy8gLXdlYmtpdC11c2VyLW1vZGlmeTogcmVhZC1vbmx5O1xuICAgICAgICAvL1xuICAgICAgICAvLyBOb3RlOiBJdCBtYXkgbWFrZSBzZW5zZSB0byBkZWxldGUgdGhlIHNlbGVjdGlvbiBmb3Igbm9ybWFsIHRleHRcbiAgICAgICAgLy8gaW5wdXQgdG9vIGJ1dCBmb3Igbm93IHdlIG9ubHkgZG8gaXQgb24gZGVsZXRpb24uXG4gICAgICAgIGlmIChcbiAgICAgICAgICBldmVudC5rZXkgPT09ICdCYWNrc3BhY2UnIHx8XG4gICAgICAgICAgKGV2ZW50LmtleSA9PT0gJ0RlbGV0ZScgJiYgdGhpcy5zZWxlY3Rpb25SYW5nZSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuc2VsZWN0aW9uUmFuZ2UuY29tbW9uQW5jZXN0b3JDb250YWluZXI7XG4gICAgICAgICAgY29uc29sZS5kZWJ1ZygnRGVsZXRpb24nLCBub2RlKTtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBub2RlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiZcbiAgICAgICAgICAgICEobm9kZSBhcyBIVE1MRWxlbWVudCkuaXNDb250ZW50RWRpdGFibGVcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIC8vIHRoaXMgaXMgdGhlIGNhc2Ugb24gZmlyZWZveFxuICAgICAgICAgICAgY29uc29sZS5kZWJ1ZygnZGVsZXRpbmcgaW5zaWRlIHVuLWVkaXRhYmxlIGJsb2NrIGRldGVjdGVkJyk7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLnNlbGVjdE5vZGUobm9kZSk7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLmRlbGV0ZUNvbnRlbnRzKCk7XG4gICAgICAgICAgICBzdG9wRGVmYXVsdEFuZEZvcmNlVXBkYXRlKCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgIG5vZGUubm9kZU5hbWUgPT09ICcjdGV4dCcgJiZcbiAgICAgICAgICAgICFub2RlLnBhcmVudEVsZW1lbnQuaXNDb250ZW50RWRpdGFibGVcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIC8vIHRoaXMgaXMgdGhlIGNhc2Ugb24gd2Via2l0XG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdkZWxldGluZyBpbnNpZGUgdW4tZWRpdGFibGUgYmxvY2sgZGV0ZWN0ZWQnKTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2Uuc2VsZWN0Tm9kZShub2RlLnBhcmVudEVsZW1lbnQpO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5kZWxldGVDb250ZW50cygpO1xuICAgICAgICAgICAgc3RvcERlZmF1bHRBbmRGb3JjZVVwZGF0ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBUaGlzIGlzIG5lZWRlZCBiZWNhdXNlLCB0aGVyZSBpcyBhIGJ1ZyBpbiBGaXJlZm94IHRoYXQgcHJldmVudFxuICAgICAgICAvLyBkZWxldGluZyBhIHVuZWRpdGFibGUgZWxlbWVudCBpbnNpZGUgYW4gZWRpdGFibGUgZWxlbWVudC4gU28gd2VcbiAgICAgICAgLy8gcmVpbXBsZW1lbnQgdGhlIHdob2xlIGZ1bmN0aW9uIGZvciBhbGwgYnJvd3NlcnMuXG4gICAgICAgIGlmIChldmVudC5rZXkgPT09ICdCYWNrc3BhY2UnICYmIHRoaXMuc2VsZWN0aW9uUmFuZ2UpIHtcbiAgICAgICAgICBjb25zdCBub2RlID0gdGhpcy5zZWxlY3Rpb25SYW5nZS5jb21tb25BbmNlc3RvckNvbnRhaW5lcjtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLmNvbGxhcHNlZCA9PT0gdHJ1ZSAmJlxuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5zdGFydE9mZnNldCA9PT0gMCAmJlxuICAgICAgICAgICAgbm9kZS5wcmV2aW91c1NpYmxpbmcgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJlxuICAgICAgICAgICAgIShub2RlLnByZXZpb3VzU2libGluZyBhcyBIVE1MRWxlbWVudCkuaXNDb250ZW50RWRpdGFibGVcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIG5vZGUucHJldmlvdXNTaWJsaW5nLnJlbW92ZSgpO1xuICAgICAgICAgICAgc3RvcERlZmF1bHRBbmRGb3JjZVVwZGF0ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChldmVudC5rZXkgPT09ICdEZWxldGUnICYmIHRoaXMuc2VsZWN0aW9uUmFuZ2UpIHtcbiAgICAgICAgICBjb25zdCBub2RlID0gdGhpcy5zZWxlY3Rpb25SYW5nZS5jb21tb25BbmNlc3RvckNvbnRhaW5lcjtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLmNvbGxhcHNlZCA9PT0gdHJ1ZSAmJlxuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5lbmRDb250YWluZXIubm9kZU5hbWUgPT09ICcjdGV4dCcgJiZcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2UuZW5kT2Zmc2V0ID09PVxuICAgICAgICAgICAgICAodGhpcy5zZWxlY3Rpb25SYW5nZS5lbmRDb250YWluZXIgYXMgVGV4dCkubGVuZ3RoICYmXG4gICAgICAgICAgICBub2RlLm5leHRTaWJsaW5nIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiZcbiAgICAgICAgICAgICEobm9kZS5uZXh0U2libGluZyBhcyBIVE1MRWxlbWVudCkuaXNDb250ZW50RWRpdGFibGVcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIG5vZGUubmV4dFNpYmxpbmcucmVtb3ZlKCk7XG4gICAgICAgICAgICBzdG9wRGVmYXVsdEFuZEZvcmNlVXBkYXRlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIElmIGEgZHJvcGRvd24gaXMgY3VycmVudGx5IGJlaW5nIGRpc3BsYXllZCB3ZSB1c2UgdGhlIHVwL2Rvd25cbiAgICAgICAgLy8ga2V5IHRvIG5hdmlnYXRlIGl0cyBjb250ZW50IGFuZCByZXR1cm4gdG8gc2VsZWN0IHRoZSBzZWxlY3RlZFxuICAgICAgICAvLyBlbGVtZW50XG4gICAgICAgIGlmICh0aGlzLmlubGluZUFjdGlvbikge1xuICAgICAgICAgIGlmIChldmVudC5rZXkgPT09ICdVcCcgfHwgZXZlbnQua2V5ID09PSAnQXJyb3dVcCcpIHtcbiAgICAgICAgICAgIHN0b3BEZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLmRyb3Bkb3duSW5zdGFuY2Uuc2VsZWNQcmV2aW91cygpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQua2V5ID09PSAnRG93bicgfHwgZXZlbnQua2V5ID09PSAnQXJyb3dEb3duJykge1xuICAgICAgICAgICAgc3RvcERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMuZHJvcGRvd25JbnN0YW5jZS5zZWxlY3ROZXh0KCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChldmVudC5rZXkgPT09ICdFbnRlcicpIHtcbiAgICAgICAgICAgIHN0b3BEZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLmRyb3Bkb3duSW5zdGFuY2UuY29uZmlybVNlbGVjdGlvbigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICk7XG5cbiAgICB0aGlzLnVubGlzdGVuZXJzID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oXG4gICAgICB0aGlzLmVkaXRUYXJnZXQsXG4gICAgICAnaW5wdXQnLFxuICAgICAgKGV2ZW50OiBJbnB1dEV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoJ3ZhbHVlIGNoYW5nZWQnKTtcbiAgICAgICAgdGhpcy5jaGVja0VtcHR5KCk7XG4gICAgICAgIHRoaXMucmVhY3RUb0NoYW5nZXMoKTtcbiAgICAgIH1cbiAgICApO1xuXG4gICAgLy8gY29uc3Qgc3R5bGU6IENTU1N0eWxlRGVjbGFyYXRpb24gPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVkaXRUYXJnZXQpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lZGl0VGFyZ2V0LCAnbWluLWhlaWdodCcsIHRoaXMuZ2V0SGVpZ2h0KDIpKTtcblxuICAgIGlmICh0aGlzLmluaXRpYWxGb2N1cykge1xuICAgICAgUHJvbWlzZS5yZXNvbHZlKG51bGwpLnRoZW4oKCkgPT4gdGhpcy5lZGl0VGFyZ2V0LmZvY3VzKCkpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXMudWlJZCkge1xuICAgICAgdGhpcy5zdWJzY3JpYmVUb1VpKHRoaXMudWlJZCk7XG4gICAgfVxuICAgIGlmIChjaGFuZ2VzLnJvdykge1xuICAgICAgaWYgKHRoaXMuZWRpdFRhcmdldCkge1xuICAgICAgICB0aGlzLmNvbXB1dGVIZWlnaHQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMudWlTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMudWlTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgdGhpcy51bmxpc3RlbigpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGNvbXB1dGVIZWlnaHQoKSB7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVkaXRUYXJnZXQsICdoZWlnaHQnLCB0aGlzLmdldEhlaWdodCh0aGlzLnJvdykpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGNoZWNrRW1wdHkoKSB7XG4gICAgaWYgKHRoaXMuZWRpdFRhcmdldC5pbm5lckhUTUwgPT09ICcnKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZSh0aGlzLmVkaXRUYXJnZXQsICdpbm5lckhUTUwnLCAnPGJyPicpO1xuICAgICAgdGhpcy5lbXB0eSA9IHRydWU7XG4gICAgfSBlbHNlIGlmICh0aGlzLmVkaXRUYXJnZXQuaW5uZXJIVE1MID09PSAnPGJyPicpIHtcbiAgICAgIHRoaXMuZW1wdHkgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVtcHR5ID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGdldEhlaWdodChyb3dDb3VudDogbnVtYmVyKSB7XG4gICAgY29uc3Qgc3R5bGU6IENTU1N0eWxlRGVjbGFyYXRpb24gPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVkaXRUYXJnZXQpO1xuICAgIGxldCBoZWlnaHQgPSBwYXJzZUludChzdHlsZS5saW5lSGVpZ2h0LCAxMCkgKiByb3dDb3VudDtcblxuICAgIGlmIChzdHlsZS5ib3hTaXppbmcgPT09ICdib3JkZXItYm94Jykge1xuICAgICAgaGVpZ2h0ICs9XG4gICAgICAgIHBhcnNlSW50KHN0eWxlLnBhZGRpbmdUb3AsIDEwKSArXG4gICAgICAgIHBhcnNlSW50KHN0eWxlLnBhZGRpbmdCb3R0b20sIDEwKSArXG4gICAgICAgIHBhcnNlSW50KHN0eWxlLmJvcmRlclRvcFdpZHRoLCAxMCkgK1xuICAgICAgICBwYXJzZUludChzdHlsZS5ib3JkZXJCb3R0b21XaWR0aCwgMTApO1xuICAgIH1cbiAgICByZXR1cm4gaGVpZ2h0ICsgJ3B4JztcbiAgfVxuXG4gIHByb3RlY3RlZCB1aVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBwcm90ZWN0ZWQgc3Vic2NyaWJlVG9VaSh1aUlkOiBzdHJpbmcpIHtcbiAgICBjb25zb2xlLmRlYnVnKCdzdWJzY3JpYmluZyB0byAnICsgdWlJZCwgdGhpcy51aVN1YnNjcmlwdGlvbik7XG4gICAgaWYgKHRoaXMudWlTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMudWlTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgdGhpcy51aVN1YnNjcmlwdGlvbiA9IHRoaXMuY29udHJvbGxlci5jaGFubmVsKHVpSWQpLnN1YnNjcmliZShjb21tYW5kID0+IHtcbiAgICAgIC8vIGlmIGlucHV0IGlzIG5vdCBvbiBmb2N1cyB3ZSBzYXZlIGN1cnJlbnQgZm9jdXNlZCBlbGVtZW50OlxuICAgICAgY29uc3QgYWN0aXZlRWxlbWVudDogRWxlbWVudCA9IHRoaXMuZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICAgIGNvbnNvbGUuZGVidWcoXG4gICAgICAgICcoJyArIHVpSWQgKyAnKSBnb3QgY29tbWFuZCAnICsgY29tbWFuZC5uYW1lICsgJy8nICsgY29tbWFuZC52YWx1ZVxuICAgICAgKTtcblxuICAgICAgdGhpcy5yZXN0b3JlU2VsZWN0aW9uKCk7XG4gICAgICBpZiAoY29tbWFuZC5uYW1lID09PSAnaW5zZXJ0SFRNTCcgJiYgdGhpcy5zZWxlY3Rpb25SYW5nZSkge1xuICAgICAgICAvLyBJZiBzb21ldGhpbmcgaXMgc2VsZWN0ZWQgd2UgYXNzdW1lIHRoYXQgdGhlIGdvYWwgaXMgdG8gcmVwbGFjZSBpdCxcbiAgICAgICAgLy8gc28gZmlyc3Qgd2UgZGVsZXRlIHRoZSBjb250ZW50XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2UuZGVsZXRlQ29udGVudHMoKTtcbiAgICAgICAgLy8gaW5zZXJ0SHRtbCBzZWVtcyBxdWl0ZSBicm9rZW4gc28gd2UgZG8gaXQgb3Vyc2VsZXZlc1xuICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLmluc2VydE5vZGUoXG4gICAgICAgICAgdGhpcy5kb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChjb21tYW5kLnZhbHVlKVxuICAgICAgICApO1xuICAgICAgICAvLyBtb3ZlIGN1c29yIHRvIHRoZSBlbmQgb2YgdGhlIG5ld2x5IGluc2VydGVkIGVsZW1lbnRcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5jb2xsYXBzZShmYWxzZSk7XG4gICAgICAgIC8vIEZvcmNlIHRoZSB1cGRhdGUgb2YgdGhlIG1vZGVsXG4gICAgICAgIHRoaXMuY2hlY2tFbXB0eSgpO1xuICAgICAgICB0aGlzLnJlYWN0VG9DaGFuZ2VzKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRvY3VtZW50LmV4ZWNDb21tYW5kKGNvbW1hbmQubmFtZSwgZmFsc2UsIGNvbW1hbmQudmFsdWUpO1xuICAgICAgfVxuICAgICAgdGhpcy5zYXZlU2VsZWN0aW9uKCk7XG4gICAgICBpZiAoYWN0aXZlRWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgIGFjdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8vIFNhdmVzIHRoZSBjdXJyZW50IHRleHQgc2VsZWN0aW9uXG4gIHByb3RlY3RlZCBzZWxlY3Rpb25SYW5nZTogUmFuZ2U7XG4gIHByb3RlY3RlZCBzYXZlU2VsZWN0aW9uKCkge1xuICAgIGlmICh0aGlzLnNlbGVjdGlvbkluRWRpdGFibGVUYXJnZXQoKSkge1xuICAgICAgY29uc3Qgc2VsID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xuICAgICAgaWYgKHNlbC5nZXRSYW5nZUF0ICYmIHNlbC5yYW5nZUNvdW50KSB7XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2UgPSBzZWwuZ2V0UmFuZ2VBdCgwKTtcbiAgICAgICAgY29uc29sZS5kZWJ1ZygnKCcgKyB0aGlzLnVpSWQgKyAnKSBzYXZlU2VsZWN0aW9uJywgdGhpcy5zZWxlY3Rpb25SYW5nZSk7XG4gICAgICAgIHRoaXMuZGV0ZWN0U3R5bGUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLy8gUmVzdG9ycyB0aGUgY3VycmVudCB0ZXh0IHNlbGVjdGlvblxuICBwcm90ZWN0ZWQgcmVzdG9yZVNlbGVjdGlvbigpIHtcbiAgICBpZiAodGhpcy5zZWxlY3Rpb25JbkVkaXRhYmxlVGFyZ2V0KCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc29sZS5kZWJ1ZygnKCcgKyB0aGlzLnVpSWQgKyAnKSByZXN0b3JlU2VsZWN0aW9uJywgdGhpcy5zZWxlY3Rpb25SYW5nZSk7XG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uUmFuZ2UpIHtcbiAgICAgIGNvbnN0IHNlbCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcbiAgICAgIHNlbC5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICAgIHNlbC5hZGRSYW5nZSh0aGlzLnNlbGVjdGlvblJhbmdlKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgc2VsZWN0aW9uSW5FZGl0YWJsZVRhcmdldCgpIHtcbiAgICBjb25zdCBzZWwgPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk7XG4gICAgY29uc3Qgbm9kZSA9XG4gICAgICBzZWwuZ2V0UmFuZ2VBdCAmJlxuICAgICAgc2VsLnJhbmdlQ291bnQgJiZcbiAgICAgIHNlbC5nZXRSYW5nZUF0KDApICYmXG4gICAgICBzZWwuZ2V0UmFuZ2VBdCgwKS5jb21tb25BbmNlc3RvckNvbnRhaW5lcjtcbiAgICByZXR1cm4gKFxuICAgICAgbm9kZSAmJlxuICAgICAgKG5vZGUgPT09IHRoaXMuZWRpdFRhcmdldCB8fFxuICAgICAgICAobm9kZS5wYXJlbnRFbGVtZW50LmNsb3Nlc3QoJy5mYXRlLWVkaXQtdGFyZ2V0JykgJiZcbiAgICAgICAgICBub2RlLnBhcmVudEVsZW1lbnQuY2xvc2VzdCgnLmZhdGUtZWRpdC10YXJnZXQnKSA9PT0gdGhpcy5lZGl0VGFyZ2V0KSlcbiAgICApO1xuICB9XG5cbiAgcHJvdGVjdGVkIGRldGVjdFN0eWxlKCkge1xuICAgIGxldCBub2RlID0gdGhpcy5zZWxlY3Rpb25SYW5nZS5jb21tb25BbmNlc3RvckNvbnRhaW5lcjtcbiAgICBpZiAoXG4gICAgICAhbm9kZSB8fFxuICAgICAgIShcbiAgICAgICAgbm9kZS5wYXJlbnRFbGVtZW50LmNsb3Nlc3QoJy5mYXRlLWVkaXQtdGFyZ2V0JykgJiZcbiAgICAgICAgbm9kZSAhPT0gdGhpcy5lZGl0VGFyZ2V0XG4gICAgICApXG4gICAgKSB7XG4gICAgICAvLyBUaGUgY3VycmVudCBzZWxlY3Rpb24gaXMgbm90IGNvbnRhaW5lZCBpbiB0aGUgZWRpdGFibGUgem9uZS5cbiAgICAgIC8vIHRoaXMgaXMgbW9zdCBsaWtlbHkgZHVlIHRvIHRoZSBpbnB1dCBiZWluZyBlbXB0eS5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gc3BlY2lhbCBjYXNlcyBmb3IgRkYgd2hlbiBzZWxlY3Rpb24gaXMgb2J0YWluZWQgYnkgZG91YmxlIGNsaWNrOlxuICAgIGlmIChcbiAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2UuZW5kT2Zmc2V0ID09PSAwICYmXG4gICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLnN0YXJ0Q29udGFpbmVyLm5vZGVWYWx1ZSAmJlxuICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5zdGFydE9mZnNldCA9PT1cbiAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5zdGFydENvbnRhaW5lci5ub2RlVmFsdWUubGVuZ3RoXG4gICAgKSB7XG4gICAgICBub2RlID0gdGhpcy5zZWxlY3Rpb25SYW5nZS5zdGFydENvbnRhaW5lci5uZXh0U2libGluZztcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5lbmRPZmZzZXQgPT09IDAgJiZcbiAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2Uuc3RhcnRPZmZzZXQgPT09IDBcbiAgICApIHtcbiAgICAgIG5vZGUgPSB0aGlzLnNlbGVjdGlvblJhbmdlLnN0YXJ0Q29udGFpbmVyLnBhcmVudEVsZW1lbnQ7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2UuY29tbW9uQW5jZXN0b3JDb250YWluZXIgPT09IHRoaXMuZWRpdFRhcmdldCAmJlxuICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5zdGFydENvbnRhaW5lciA9PT0gdGhpcy5lZGl0VGFyZ2V0ICYmXG4gICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLmVuZENvbnRhaW5lciA9PT0gdGhpcy5lZGl0VGFyZ2V0XG4gICAgKSB7XG4gICAgICBub2RlID0gdGhpcy5zZWxlY3Rpb25SYW5nZS5jb21tb25BbmNlc3RvckNvbnRhaW5lci5jaGlsZE5vZGVzW1xuICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLnN0YXJ0T2Zmc2V0XG4gICAgICBdO1xuICAgIH1cbiAgICBpZiAobm9kZSAmJiBub2RlICE9PSB0aGlzLmVkaXRUYXJnZXQpIHtcbiAgICAgIGNvbnN0IG5vZGVzID0gdGhpcy5odG1sUGFyc2VyLmZpbmRQYXJlbnROb2Rlcyhub2RlLCB0aGlzLmVkaXRUYXJnZXQpO1xuICAgICAgY29uc29sZS5kZWJ1ZygnICAtPiBkZXRlY3RlZCBhY3Rpb25zOiAnLCBub2Rlcyk7XG4gICAgICB0aGlzLmNvbnRyb2xsZXIuZW5hYmxlQWN0aW9ucyh0aGlzLnVpSWQsIG5vZGVzKTtcbiAgICB9XG4gIH1cblxuICAvLyBpbXBsZW50YXRpb24gb2YgQ29udHJvbFZhbHVlQWNjZXNzb3I6XG4gIHByb3RlY3RlZCBjaGFuZ2VkID0gbmV3IEFycmF5PCh2YWx1ZTogc3RyaW5nKSA9PiB2b2lkPigpO1xuXG4gIHB1YmxpYyB3cml0ZVZhbHVlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMuY29udGVudCA9IHRoaXMuc2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RIdG1sKFxuICAgICAgICB0aGlzLmh0bWxQYXJzZXIuc2VyaWFsaXplKHRoaXMucGFyc2VyLnBhcnNlKHZhbHVlKSlcbiAgICAgICk7XG4gICAgICB0aGlzLmVtcHR5ID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY29udGVudCA9IHRoaXMuc2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RIdG1sKCc8YnI+Jyk7XG4gICAgICB0aGlzLmVtcHR5ID0gdHJ1ZTtcbiAgICB9XG4gICAgdGhpcy5zZWxlY3Rpb25SYW5nZSA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHB1YmxpYyByZWdpc3Rlck9uQ2hhbmdlKGZuOiAodmFsdWU6IHN0cmluZykgPT4gdm9pZCkge1xuICAgIHRoaXMuY2hhbmdlZC5wdXNoKGZuKTtcbiAgfVxuXG4gIHB1YmxpYyByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gdm9pZCkge31cblxuICBwcm90ZWN0ZWQgY2hlY2tGb3JEcm9wZG93bkNvbnRleHQoKSB7XG4gICAgY29uc3Qgc3RhcnRQb3MgPSBNYXRoLm1heCh0aGlzLnNlbGVjdGlvblJhbmdlLnN0YXJ0T2Zmc2V0IC0gMjAsIDApO1xuICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMuc2VsZWN0aW9uUmFuZ2Uuc3RhcnRPZmZzZXQgLSBzdGFydFBvcztcbiAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5zZWxlY3Rpb25SYW5nZS5zdGFydENvbnRhaW5lci50ZXh0Q29udGVudC5zdWJzdHIoXG4gICAgICBzdGFydFBvcyxcbiAgICAgIGxlbmd0aFxuICAgICk7XG5cbiAgICBjb25zdCBpbmxpbmVBY3Rpb24gPSB0aGlzLmNvbnRyb2xsZXIuZ2V0SW5saW5lQWN0aW9uKGNvbnRleHQpO1xuICAgIGlmIChpbmxpbmVBY3Rpb24pIHtcbiAgICAgIGlmIChcbiAgICAgICAgIXRoaXMuaW5saW5lQWN0aW9uIHx8XG4gICAgICAgIHRoaXMuaW5saW5lQWN0aW9uLmRyb3Bkb3duICE9PSBpbmxpbmVBY3Rpb24uZHJvcGRvd25cbiAgICAgICkge1xuICAgICAgICB0aGlzLmlubGluZUFjdGlvbiA9IGlubGluZUFjdGlvbjtcbiAgICAgICAgdGhpcy5pbml0RHJvcGRvd24oXG4gICAgICAgICAgaW5saW5lQWN0aW9uLFxuICAgICAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2UuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaW5saW5lQWN0aW9uID0gaW5saW5lQWN0aW9uO1xuICAgICAgICB0aGlzLnVwZGF0ZURyb3Bkb3duKGlubGluZUFjdGlvbi5tYXRjaGVkKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMuZHJvcGRvd25Db21wb25lbnQpIHtcbiAgICAgIHRoaXMuaW5saW5lQWN0aW9uID0gbnVsbDtcbiAgICAgIHRoaXMuZHJvcGRvd25Db21wb25lbnQuZGVzdHJveSgpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBpbml0RHJvcGRvd24oYWN0aW9uQ29tcG9uZW50LCBwb3NpdGlvbikge1xuICAgIC8vIHNldCB0aGUgZHJvcGRvd24gY29tcG9uZW50XG4gICAgaWYgKHRoaXMuZHJvcGRvd25Db21wb25lbnQpIHtcbiAgICAgIHRoaXMuZHJvcGRvd25Db21wb25lbnQuZGVzdHJveSgpO1xuICAgIH1cbiAgICBjb25zdCBmYWN0b3J5ID0gdGhpcy5mYWN0b3J5UmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkoXG4gICAgICBhY3Rpb25Db21wb25lbnQuZHJvcGRvd25cbiAgICApO1xuICAgIGNvbnN0IGNvbXBvbmVudDogYW55ID0gZmFjdG9yeS5jcmVhdGUodGhpcy52aWV3Q29udGFpbmVyUmVmLnBhcmVudEluamVjdG9yKTtcbiAgICBpZiAoY29tcG9uZW50Lmluc3RhbmNlLnZhbHVlQ2hhbmdlKSB7XG4gICAgICBjb21wb25lbnQuaW5zdGFuY2UudmFsdWUgPSBhY3Rpb25Db21wb25lbnQubWF0Y2hlZDtcbiAgICAgIGNvbXBvbmVudC5pbnN0YW5jZS52YWx1ZUNoYW5nZS5zdWJzY3JpYmUodmFsdWUgPT4ge1xuICAgICAgICB0aGlzLmVkaXRUYXJnZXQuZm9jdXMoKTtcbiAgICAgICAgY29uc3QgZW5kID0gdGhpcy5zZWxlY3Rpb25SYW5nZS5lbmRPZmZzZXQ7XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2Uuc2V0U3RhcnQoXG4gICAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5lbmRDb250YWluZXIsXG4gICAgICAgICAgZW5kIC0gYWN0aW9uQ29tcG9uZW50Lm1hdGNoZWQubGVuZ3RoXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuY29udHJvbGxlci5kb0lubGluZSh0aGlzLnVpSWQsIHRoaXMuaW5saW5lQWN0aW9uLCB2YWx1ZSk7XG4gICAgICAgIC8vIGRlbGV0ZSB0aGUgZHJvcGRvd25cbiAgICAgICAgdGhpcy5pbmxpbmVBY3Rpb24gPSBudWxsO1xuICAgICAgICB0aGlzLmRyb3Bkb3duQ29tcG9uZW50LmRlc3Ryb3koKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5kcm9wZG93bkNvbXBvbmVudCA9IHRoaXMudmlld0NvbnRhaW5lclJlZi5pbnNlcnQoY29tcG9uZW50Lmhvc3RWaWV3KTtcbiAgICAgIHRoaXMuZHJvcGRvd25JbnN0YW5jZSA9IGNvbXBvbmVudC5pbnN0YW5jZTtcbiAgICAgIHRoaXMudXBkYXRlRHJvcGRvd25Qb3NpdGlvbigpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdUaGUgY29tcG9uZW50IHVzZWQgYXMgYSBkcm9wZG93biBkb2VzblxcJ3QgY29udGFpbiBhIHZhbHVlQ2hhbmdlIGVtbWl0ZXIhJ1xuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgdXBkYXRlRHJvcGRvd24odmFsdWUpIHtcbiAgICB0aGlzLmRyb3Bkb3duSW5zdGFuY2UudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLnVwZGF0ZURyb3Bkb3duUG9zaXRpb24oKTtcbiAgfVxuXG4gIHByb3RlY3RlZCB1cGRhdGVEcm9wZG93blBvc2l0aW9uKCkge1xuICAgIGlmICh0aGlzLmlubGluZUFjdGlvbi5kaXNwbGF5ID09PSAnY29udGV4dHVhbCcpIHtcbiAgICAgIC8vIGNyZWF0ZSBhIHNlbGVjdGlvbiB0byBnZXQgdGhlIHNpemUgb2YgdGhlIG1hdGNoaW5nIHRleHRcbiAgICAgIGNvbnN0IHBhcmVudE9mZnNldEJCID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50Lm9mZnNldFBhcmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIGNvbnN0IHJhbmdlID0gdGhpcy5zZWxlY3Rpb25SYW5nZS5jbG9uZVJhbmdlKCk7XG4gICAgICBjb25zdCBlbmQgPSByYW5nZS5lbmRPZmZzZXQ7XG4gICAgICByYW5nZS5zZXRTdGFydChcbiAgICAgICAgcmFuZ2UuZW5kQ29udGFpbmVyLFxuICAgICAgICBlbmQgLSB0aGlzLmlubGluZUFjdGlvbi5tYXRjaGVkLmxlbmd0aFxuICAgICAgKTtcbiAgICAgIGNvbnN0IGJvdW5kaW5nQm94ID0gcmFuZ2UuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICB0aGlzLmRyb3Bkb3duUG9zdGlvblRvcCA9XG4gICAgICAgIGJvdW5kaW5nQm94LnRvcCArIGJvdW5kaW5nQm94LmhlaWdodCAtIHBhcmVudE9mZnNldEJCLnRvcCArICdweCc7XG4gICAgICB0aGlzLmRyb3Bkb3duUG9zdGlvbkxlZnQgPSBib3VuZGluZ0JveC5sZWZ0IC0gcGFyZW50T2Zmc2V0QkIubGVmdCArICdweCc7XG4gICAgfVxuICB9XG59XG4iXX0=