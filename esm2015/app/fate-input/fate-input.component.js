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
        this.focused = new EventEmitter();
        this.blured = new EventEmitter();
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
            this.focused.emit();
        });
        this.unlisteners = this.renderer.listen(this.editTarget, 'blur', (event) => {
            console.debug('(' + this.uiId + ') blur');
            this.isFocused = false;
            this.blured.emit();
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
            this.focus();
        }
    }
    focus() {
        Promise.resolve(null).then(() => this.editTarget.focus());
    }
    blur() {
        Promise.resolve(null).then(() => this.editTarget.blur());
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
], FateInputComponent.prototype, "focused", void 0);
__decorate([
    Output()
], FateInputComponent.prototype, "blured", void 0);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmF0ZS1pbnB1dC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9mYXRlLWVkaXRvci8iLCJzb3VyY2VzIjpbImFwcC9mYXRlLWlucHV0L2ZhdGUtaW5wdXQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFNBQVMsRUFDVCxVQUFVLEVBQ1YsT0FBTyxFQUNQLGdCQUFnQixFQUNoQix3QkFBd0IsRUFDeEIsTUFBTSxFQUNOLFNBQVMsRUFDVCxhQUFhLEVBQ2IsU0FBUyxFQUNULFlBQVksRUFDWixTQUFTLEVBQ1QsYUFBYSxFQUNiLE1BQU0sRUFDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUFFLGlCQUFpQixFQUF3QixNQUFNLGdCQUFnQixDQUFDO0FBQ3pFLE9BQU8sRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFJbkUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDbkUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDcEUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUErRDNELElBQWEsa0JBQWtCLDBCQUEvQixNQUFhLGtCQUFrQjtJQW1EN0IsWUFDWSxFQUFjLEVBQ2QsVUFBaUMsRUFDakMsVUFBaUMsRUFDakMsTUFBeUIsRUFDekIsU0FBdUIsRUFDdkIsZUFBeUMsRUFDM0MsUUFBbUIsRUFDRCxRQUFhO1FBUDdCLE9BQUUsR0FBRixFQUFFLENBQVk7UUFDZCxlQUFVLEdBQVYsVUFBVSxDQUF1QjtRQUNqQyxlQUFVLEdBQVYsVUFBVSxDQUF1QjtRQUNqQyxXQUFNLEdBQU4sTUFBTSxDQUFtQjtRQUN6QixjQUFTLEdBQVQsU0FBUyxDQUFjO1FB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QjtZQUN6QixpQkFBaUI7WUFDZCxZQUFZO1lBQ04sd0JBQXdCO1lBQ2pDLFNBQVM7NENBQzFCLE1BQU0sU0FBQyxRQUFROztBQXhEbEI7SUFEQyxLQUFLLEVBQUU7Z0RBQ3dCO0FBR2hDO0lBREMsS0FBSyxFQUFFOytDQUNXO0FBR25CO0lBREMsS0FBSyxFQUFFO3VEQUNtQjtBQUczQjtJQURDLEtBQUssRUFBRTt1REFDd0I7QUFHaEM7SUFEQyxLQUFLLEVBQUU7d0RBQzZCO0FBR3JDO0lBREMsTUFBTSxFQUFFO21EQUNpQztBQUcxQztJQURDLE1BQU0sRUFBRTtrREFDZ0M7QUFZekM7SUFKQyxTQUFTLENBQUMsVUFBVSxFQUFFO1FBQ3JCLElBQUksRUFBRSxnQkFBZ0I7UUFDdEIsTUFBTSxFQUFFLElBQUk7S0FDYixDQUFDOzREQUNpQztBQUduQztJQURDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUM7OERBR3pDO0FBdENVLGtCQUFrQjtJQTdEOUIsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLFlBQVk7UUFDdEIsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FrQlQ7UUFxQ0QsU0FBUyxFQUFFO1lBQ1QsRUFBRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsV0FBVyxFQUFFLG9CQUFrQixFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7U0FDN0U7aUJBckNDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7S0FpQ0M7S0FLSixDQUFDO0lBNERHLFdBQUEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0dBM0RSLGtCQUFrQixDQXFoQjlCO1NBcmhCWSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIFZpZXdDaGlsZCxcbiAgRWxlbWVudFJlZixcbiAgVmlld1JlZixcbiAgVmlld0NvbnRhaW5lclJlZixcbiAgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICBPbkluaXQsXG4gIE9uQ2hhbmdlcyxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgT25EZXN0cm95LFxuICBFdmVudEVtaXR0ZXIsXG4gIFJlbmRlcmVyMixcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgSW5qZWN0XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTkdfVkFMVUVfQUNDRVNTT1IsIENvbnRyb2xWYWx1ZUFjY2Vzc29yIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgRG9tU2FuaXRpemVyLCBTYWZlSHRtbCB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuXG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgRmF0ZUNvbnRyb2xsZXJTZXJ2aWNlIH0gZnJvbSAnLi4vZmF0ZS1jb250cm9sbGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgRmF0ZUh0bWxQYXJzZXJTZXJ2aWNlIH0gZnJvbSAnLi4vZmF0ZS1odG1sLXBhcnNlci5zZXJ2aWNlJztcbmltcG9ydCB7IEZhdGVQYXJzZXJTZXJ2aWNlIH0gZnJvbSAnLi4vZmF0ZS1wYXJzZXIuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2ZhdGUtaW5wdXQnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXZcbiAgICAgIGNsYXNzPVwiZmF0ZS1pbmxpbmUtZHJvcGRvd25cIlxuICAgICAgW2NsYXNzLmhpZGRlbl09XCIhaW5saW5lQWN0aW9uXCJcbiAgICAgIFtjbGFzcy5jb250ZXh0dWFsXT1cImlubGluZUFjdGlvbj8uZGlzcGxheSA9PT0gJ2NvbnRleHR1YWwnXCJcbiAgICAgIFtzdHlsZS50b3BdPVwiZHJvcGRvd25Qb3N0aW9uVG9wXCJcbiAgICAgIFtzdHlsZS5sZWZ0XT1cImRyb3Bkb3duUG9zdGlvbkxlZnRcIlxuICAgID5cbiAgICAgIDxuZy10ZW1wbGF0ZSAjZHJvcGRvd24+PC9uZy10ZW1wbGF0ZT5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2XG4gICAgICAjZWRpdFRhcmdldFxuICAgICAgW2NsYXNzXT1cIidmYXRlLWVkaXQtdGFyZ2V0ICcgKyBjdXN0b21DbGFzc1wiXG4gICAgICBbbmdDbGFzc109XCJ7IGVtcHR5OiBlbXB0eSB9XCJcbiAgICAgIGNvbnRlbnRlZGl0YWJsZT1cInRydWVcIlxuICAgICAgW3RpdGxlXT1cInBsYWNlaG9sZGVyXCJcbiAgICAgIFtpbm5lckh0bWxdPVwiY29udGVudFwiXG4gICAgPjwvZGl2PlxuICBgLFxuICBzdHlsZXM6IFtcbiAgICBgXG4gICAgICA6aG9zdCBkaXYuZmF0ZS1lZGl0LXRhcmdldCB7XG4gICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgICBwYWRkaW5nOiAxMHB4O1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjZGRkO1xuICAgICAgICBvdXRsaW5lOiAwO1xuICAgICAgICByZXNpemU6IHZlcnRpY2FsO1xuICAgICAgICBvdmVyZmxvdzogYXV0bztcbiAgICAgICAgYmFja2dyb3VuZDogI2ZmZjtcbiAgICAgICAgY29sb3I6ICMwMDA7XG4gICAgICAgIG92ZXJmbG93OiB2aXNpYmxlO1xuICAgICAgfVxuICAgICAgOmhvc3QgZGl2LmZhdGUtZWRpdC10YXJnZXQuZW1wdHk6bm90KDpmb2N1cyk6YmVmb3JlIHtcbiAgICAgICAgY29udGVudDogYXR0cih0aXRsZSk7XG4gICAgICAgIGNvbG9yOiAjNjM2YzcyO1xuICAgICAgfVxuICAgICAgLmZhdGUtaW5saW5lLWRyb3Bkb3duIHtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgI2RkZDtcbiAgICAgICAgYm9yZGVyLWJvdHRvbTogMDtcbiAgICAgIH1cbiAgICAgIC5mYXRlLWlubGluZS1kcm9wZG93bi5oaWRkZW4ge1xuICAgICAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gICAgICB9XG4gICAgICAuZmF0ZS1pbmxpbmUtZHJvcGRvd24uY29udGV4dHVhbCB7XG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgYmFja2dyb3VuZDogI2ZmZjtcbiAgICAgICAgYm94LXNoYWRvdzogMCA1cHggMzBweCAtMTBweCByZ2JhKDAsIDAsIDAsIDAuNCk7XG4gICAgICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjY2NjO1xuICAgICAgfVxuICAgICAgOmhvc3Qge1xuICAgICAgICBtYXJnaW4tYm90dG9tOiAxMHB4O1xuICAgICAgICAvKnBvc2l0aW9uOiByZWxhdGl2ZTsqL1xuICAgICAgfVxuICAgIGBcbiAgXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgeyBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUiwgdXNlRXhpc3Rpbmc6IEZhdGVJbnB1dENvbXBvbmVudCwgbXVsdGk6IHRydWUgfVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIEZhdGVJbnB1dENvbXBvbmVudFxuICBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBPbkNoYW5nZXMsIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgQElucHV0KClcbiAgcHVibGljIHVpSWQ6IHN0cmluZyA9ICdkZWZhdWx0JztcblxuICBASW5wdXQoKVxuICBwdWJsaWMgcm93OiBudW1iZXI7XG5cbiAgQElucHV0KClcbiAgcHVibGljIGN1c3RvbUNsYXNzOiBzdHJpbmc7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHBsYWNlaG9sZGVyOiBzdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICBwdWJsaWMgaW5pdGlhbEZvY3VzOiBib29sZWFuID0gZmFsc2U7XG5cbiAgQE91dHB1dCgpXG4gIHB1YmxpYyBmb2N1c2VkID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIEBPdXRwdXQoKVxuICBwdWJsaWMgYmx1cmVkID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIHB1YmxpYyBkcm9wZG93blBvc3Rpb25Ub3A6IHN0cmluZztcbiAgcHVibGljIGRyb3Bkb3duUG9zdGlvbkxlZnQ6IHN0cmluZztcbiAgcHVibGljIGlubGluZUFjdGlvbjogYW55O1xuICBwdWJsaWMgY29udGVudDogU2FmZUh0bWw7XG4gIHB1YmxpYyBlbXB0eTogYm9vbGVhbiA9IHRydWU7XG5cbiAgQFZpZXdDaGlsZCgnZHJvcGRvd24nLCB7XG4gICAgcmVhZDogVmlld0NvbnRhaW5lclJlZixcbiAgICBzdGF0aWM6IHRydWVcbiAgfSlcbiAgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZjtcblxuICBAVmlld0NoaWxkKCdlZGl0VGFyZ2V0JywgeyBzdGF0aWM6IHRydWUgfSlcbiAgcHJvdGVjdGVkIHNldCBlZGl0VGFyZ2V0RWxlbWVudFJlZihlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50Pikge1xuICAgIHRoaXMuZWRpdFRhcmdldCA9IGVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgfVxuXG4gIHByb3RlY3RlZCBkcm9wZG93bkNvbXBvbmVudDogVmlld1JlZjtcbiAgcHJvdGVjdGVkIGRyb3Bkb3duSW5zdGFuY2U6IGFueTtcbiAgcHJvdGVjdGVkIGVkaXRUYXJnZXQ6IEhUTUxFbGVtZW50O1xuXG4gIHByb3RlY3RlZCBpc0ZvY3VzZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBwcml2YXRlIF91bmxpc3RlbmVyczogKCgpID0+IHZvaWQpW10gPSBbXTtcbiAgcHJpdmF0ZSBzZXQgdW5saXN0ZW5lcnMoaGFuZGxlcjogKCkgPT4gdm9pZCkge1xuICAgIHRoaXMuX3VubGlzdGVuZXJzLnB1c2goaGFuZGxlcik7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgZWw6IEVsZW1lbnRSZWYsXG4gICAgcHJvdGVjdGVkIGNvbnRyb2xsZXI6IEZhdGVDb250cm9sbGVyU2VydmljZSxcbiAgICBwcm90ZWN0ZWQgaHRtbFBhcnNlcjogRmF0ZUh0bWxQYXJzZXJTZXJ2aWNlLFxuICAgIHByb3RlY3RlZCBwYXJzZXI6IEZhdGVQYXJzZXJTZXJ2aWNlLFxuICAgIHByb3RlY3RlZCBzYW5pdGl6ZXI6IERvbVNhbml0aXplcixcbiAgICBwcm90ZWN0ZWQgZmFjdG9yeVJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQ6IGFueVxuICApIHt9XG5cbiAgcHJpdmF0ZSB1bmxpc3RlbigpIHtcbiAgICBmb3IgKGNvbnN0IGhhbmRsZXIgb2YgdGhpcy5fdW5saXN0ZW5lcnMpIHtcbiAgICAgIGhhbmRsZXIoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlYWN0VG9DaGFuZ2VzKCkge1xuICAgIGNvbnN0IHRyZWUgPSB0aGlzLmh0bWxQYXJzZXIucGFyc2VFbGVtZW50KHRoaXMuZWRpdFRhcmdldCk7XG4gICAgY29uc3Qgc2VyaWFsaXplZFRyZWUgPSB0aGlzLnBhcnNlci5zZXJpYWxpemUodHJlZSk7XG4gICAgdGhpcy5jaGFuZ2VkLmZvckVhY2goZiA9PiBmKHNlcmlhbGl6ZWRUcmVlKSk7XG4gIH1cblxuICBwdWJsaWMgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5zdWJzY3JpYmVUb1VpKHRoaXMudWlJZCk7XG4gIH1cblxuICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGlmICh0aGlzLnJvdykge1xuICAgICAgdGhpcy5jb21wdXRlSGVpZ2h0KCk7XG4gICAgfVxuXG4gICAgdGhpcy51bmxpc3RlbmVycyA9IHRoaXMucmVuZGVyZXIubGlzdGVuKFxuICAgICAgdGhpcy5lZGl0VGFyZ2V0LFxuICAgICAgJ2NsaWNrJyxcbiAgICAgIChldmVudDogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICBjb25zb2xlLmRlYnVnKCdjbGljaycpO1xuICAgICAgICAvLyBPbiBjbGljayB3ZSBzYXZlIHRoZSB0ZXh0IFNlbGVjdGlvblxuICAgICAgICB0aGlzLnNhdmVTZWxlY3Rpb24oKTtcbiAgICAgICAgLy8gV2UgY2hlY2sgaWYgdGhlcmUgaXMgYSBkcm9wZG93biBtYXRjaGluZyB0aGlzIGNvbnRleHRcbiAgICAgICAgdGhpcy5jaGVja0ZvckRyb3Bkb3duQ29udGV4dCgpO1xuICAgICAgfVxuICAgICk7XG5cbiAgICB0aGlzLnVubGlzdGVuZXJzID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oXG4gICAgICB0aGlzLmVkaXRUYXJnZXQsXG4gICAgICAna2V5dXAnLFxuICAgICAgKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoJ2tleXByZXNzZWQnKTtcbiAgICAgICAgLy8gT24gY2xpY2sgd2Ugc2F2ZSB0aGUgdGV4dCBTZWxlY3Rpb25cbiAgICAgICAgdGhpcy5zYXZlU2VsZWN0aW9uKCk7XG4gICAgICAgIC8vIFdlIGNoZWNrIGlmIHRoZXJlIGlzIGEgZHJvcGRvd24gbWF0Y2hpbmcgdGhpcyBjb250ZXh0XG4gICAgICAgIHRoaXMuY2hlY2tGb3JEcm9wZG93bkNvbnRleHQoKTtcbiAgICAgIH1cbiAgICApO1xuXG4gICAgdGhpcy51bmxpc3RlbmVycyA9IHRoaXMucmVuZGVyZXIubGlzdGVuKFxuICAgICAgdGhpcy5lZGl0VGFyZ2V0LFxuICAgICAgJ2ZvY3VzJyxcbiAgICAgIChldmVudDogRm9jdXNFdmVudCkgPT4ge1xuICAgICAgICBjb25zb2xlLmRlYnVnKCcoJyArIHRoaXMudWlJZCArICcpIGZvY3VzJyk7XG4gICAgICAgIC8vIE9uIGZvY3VzIHdlIHJlc3RvcmUgaXRcbiAgICAgICAgdGhpcy5yZXN0b3JlU2VsZWN0aW9uKCk7XG4gICAgICAgIHRoaXMuaXNGb2N1c2VkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5mb2N1c2VkLmVtaXQoKTtcbiAgICAgIH1cbiAgICApO1xuICAgIHRoaXMudW5saXN0ZW5lcnMgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbihcbiAgICAgIHRoaXMuZWRpdFRhcmdldCxcbiAgICAgICdibHVyJyxcbiAgICAgIChldmVudDogRm9jdXNFdmVudCkgPT4ge1xuICAgICAgICBjb25zb2xlLmRlYnVnKCcoJyArIHRoaXMudWlJZCArICcpIGJsdXInKTtcbiAgICAgICAgdGhpcy5pc0ZvY3VzZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5ibHVyZWQuZW1pdCgpO1xuICAgICAgICB0aGlzLnNhdmVTZWxlY3Rpb24oKTtcblxuICAgICAgICBpZiAodGhpcy5kcm9wZG93bkNvbXBvbmVudCkge1xuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5pbmxpbmVBY3Rpb24gPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5kcm9wZG93bkNvbXBvbmVudC5kZXN0cm95KCk7XG4gICAgICAgICAgfSwgMzAwKTtcbiAgICAgICAgICAvLyB0aGlzLmlubGluZUFjdGlvbiA9IG51bGw7XG4gICAgICAgICAgLy8gdGhpcy5kcm9wZG93bkNvbXBvbmVudC5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApO1xuXG4gICAgdGhpcy51bmxpc3RlbmVycyA9IHRoaXMucmVuZGVyZXIubGlzdGVuKFxuICAgICAgdGhpcy5lZGl0VGFyZ2V0LFxuICAgICAgJ2tleWRvd24nLFxuICAgICAgKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoJ2tleWRvd24nLCBldmVudCk7XG4gICAgICAgIGNvbnN0IHN0b3BEZWZhdWx0ID0gKCkgPT4ge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHN0b3BEZWZhdWx0QW5kRm9yY2VVcGRhdGUgPSAoKSA9PiB7XG4gICAgICAgICAgc3RvcERlZmF1bHQoKTtcbiAgICAgICAgICB0aGlzLmNoZWNrRW1wdHkoKTtcbiAgICAgICAgICB0aGlzLnJlYWN0VG9DaGFuZ2VzKCk7XG4gICAgICAgIH07XG4gICAgICAgIC8vIFRoaXMgaXMgbmVlZGVkIGJlY2F1c2UsIGlmIHRoZSBjdXJyZW50IHNlbGVjdGlvbiBpcyBwYXJ0XG4gICAgICAgIC8vIG9mIGEgbm9uLWVkaXRhYmxlIGNoaWxkIG9mIHRoZSBpbnB1dCwgdGhlIGRlZmF1bHQgZGVsZXRlIHdvbid0XG4gICAgICAgIC8vIHdvcmsuXG4gICAgICAgIC8vIFRoaXMgY2FzZSBjYW4gaGFwcGVuIGlmIHRoZXJlIGlzIGEgY3V0b20gZWxlbWVudCB0aGF0XG4gICAgICAgIC8vIHdhcyBpbnNlcnRlZCBieSBzb21lIGN1c3RvbSBjb250cm9sbGVyLlxuICAgICAgICAvL1xuICAgICAgICAvLyBTb21lIGNvbnN0cmFpbnRzIGZvciBhIGN1c3RvbSBibG9jayB0byB3b3JrIG9uIHRvcCBvZiBjb250ZW50ZWRpdGFibGU9ZmFsc2U6XG4gICAgICAgIC8vIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgICAgIC8vIC13ZWJraXQtdXNlci1tb2RpZnk6IHJlYWQtb25seTtcbiAgICAgICAgLy9cbiAgICAgICAgLy8gTm90ZTogSXQgbWF5IG1ha2Ugc2Vuc2UgdG8gZGVsZXRlIHRoZSBzZWxlY3Rpb24gZm9yIG5vcm1hbCB0ZXh0XG4gICAgICAgIC8vIGlucHV0IHRvbyBidXQgZm9yIG5vdyB3ZSBvbmx5IGRvIGl0IG9uIGRlbGV0aW9uLlxuICAgICAgICBpZiAoXG4gICAgICAgICAgZXZlbnQua2V5ID09PSAnQmFja3NwYWNlJyB8fFxuICAgICAgICAgIChldmVudC5rZXkgPT09ICdEZWxldGUnICYmIHRoaXMuc2VsZWN0aW9uUmFuZ2UpXG4gICAgICAgICkge1xuICAgICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLnNlbGVjdGlvblJhbmdlLmNvbW1vbkFuY2VzdG9yQ29udGFpbmVyO1xuICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ0RlbGV0aW9uJywgbm9kZSk7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgbm9kZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmXG4gICAgICAgICAgICAhKG5vZGUgYXMgSFRNTEVsZW1lbnQpLmlzQ29udGVudEVkaXRhYmxlXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICAvLyB0aGlzIGlzIHRoZSBjYXNlIG9uIGZpcmVmb3hcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ2RlbGV0aW5nIGluc2lkZSB1bi1lZGl0YWJsZSBibG9jayBkZXRlY3RlZCcpO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5zZWxlY3ROb2RlKG5vZGUpO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5kZWxldGVDb250ZW50cygpO1xuICAgICAgICAgICAgc3RvcERlZmF1bHRBbmRGb3JjZVVwZGF0ZSgpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICBub2RlLm5vZGVOYW1lID09PSAnI3RleHQnICYmXG4gICAgICAgICAgICAhbm9kZS5wYXJlbnRFbGVtZW50LmlzQ29udGVudEVkaXRhYmxlXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICAvLyB0aGlzIGlzIHRoZSBjYXNlIG9uIHdlYmtpdFxuICAgICAgICAgICAgY29uc29sZS5kZWJ1ZygnZGVsZXRpbmcgaW5zaWRlIHVuLWVkaXRhYmxlIGJsb2NrIGRldGVjdGVkJyk7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLnNlbGVjdE5vZGUobm9kZS5wYXJlbnRFbGVtZW50KTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2UuZGVsZXRlQ29udGVudHMoKTtcbiAgICAgICAgICAgIHN0b3BEZWZhdWx0QW5kRm9yY2VVcGRhdGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gVGhpcyBpcyBuZWVkZWQgYmVjYXVzZSwgdGhlcmUgaXMgYSBidWcgaW4gRmlyZWZveCB0aGF0IHByZXZlbnRcbiAgICAgICAgLy8gZGVsZXRpbmcgYSB1bmVkaXRhYmxlIGVsZW1lbnQgaW5zaWRlIGFuIGVkaXRhYmxlIGVsZW1lbnQuIFNvIHdlXG4gICAgICAgIC8vIHJlaW1wbGVtZW50IHRoZSB3aG9sZSBmdW5jdGlvbiBmb3IgYWxsIGJyb3dzZXJzLlxuICAgICAgICBpZiAoZXZlbnQua2V5ID09PSAnQmFja3NwYWNlJyAmJiB0aGlzLnNlbGVjdGlvblJhbmdlKSB7XG4gICAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuc2VsZWN0aW9uUmFuZ2UuY29tbW9uQW5jZXN0b3JDb250YWluZXI7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5jb2xsYXBzZWQgPT09IHRydWUgJiZcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2Uuc3RhcnRPZmZzZXQgPT09IDAgJiZcbiAgICAgICAgICAgIG5vZGUucHJldmlvdXNTaWJsaW5nIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiZcbiAgICAgICAgICAgICEobm9kZS5wcmV2aW91c1NpYmxpbmcgYXMgSFRNTEVsZW1lbnQpLmlzQ29udGVudEVkaXRhYmxlXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBub2RlLnByZXZpb3VzU2libGluZy5yZW1vdmUoKTtcbiAgICAgICAgICAgIHN0b3BEZWZhdWx0QW5kRm9yY2VVcGRhdGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQua2V5ID09PSAnRGVsZXRlJyAmJiB0aGlzLnNlbGVjdGlvblJhbmdlKSB7XG4gICAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuc2VsZWN0aW9uUmFuZ2UuY29tbW9uQW5jZXN0b3JDb250YWluZXI7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5jb2xsYXBzZWQgPT09IHRydWUgJiZcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2UuZW5kQ29udGFpbmVyLm5vZGVOYW1lID09PSAnI3RleHQnICYmXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLmVuZE9mZnNldCA9PT1cbiAgICAgICAgICAgICAgKHRoaXMuc2VsZWN0aW9uUmFuZ2UuZW5kQ29udGFpbmVyIGFzIFRleHQpLmxlbmd0aCAmJlxuICAgICAgICAgICAgbm9kZS5uZXh0U2libGluZyBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmXG4gICAgICAgICAgICAhKG5vZGUubmV4dFNpYmxpbmcgYXMgSFRNTEVsZW1lbnQpLmlzQ29udGVudEVkaXRhYmxlXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBub2RlLm5leHRTaWJsaW5nLnJlbW92ZSgpO1xuICAgICAgICAgICAgc3RvcERlZmF1bHRBbmRGb3JjZVVwZGF0ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBJZiBhIGRyb3Bkb3duIGlzIGN1cnJlbnRseSBiZWluZyBkaXNwbGF5ZWQgd2UgdXNlIHRoZSB1cC9kb3duXG4gICAgICAgIC8vIGtleSB0byBuYXZpZ2F0ZSBpdHMgY29udGVudCBhbmQgcmV0dXJuIHRvIHNlbGVjdCB0aGUgc2VsZWN0ZWRcbiAgICAgICAgLy8gZWxlbWVudFxuICAgICAgICBpZiAodGhpcy5pbmxpbmVBY3Rpb24pIHtcbiAgICAgICAgICBpZiAoZXZlbnQua2V5ID09PSAnVXAnIHx8IGV2ZW50LmtleSA9PT0gJ0Fycm93VXAnKSB7XG4gICAgICAgICAgICBzdG9wRGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5kcm9wZG93bkluc3RhbmNlLnNlbGVjUHJldmlvdXMoKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmtleSA9PT0gJ0Rvd24nIHx8IGV2ZW50LmtleSA9PT0gJ0Fycm93RG93bicpIHtcbiAgICAgICAgICAgIHN0b3BEZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLmRyb3Bkb3duSW5zdGFuY2Uuc2VsZWN0TmV4dCgpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQua2V5ID09PSAnRW50ZXInKSB7XG4gICAgICAgICAgICBzdG9wRGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5kcm9wZG93bkluc3RhbmNlLmNvbmZpcm1TZWxlY3Rpb24oKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApO1xuXG4gICAgdGhpcy51bmxpc3RlbmVycyA9IHRoaXMucmVuZGVyZXIubGlzdGVuKFxuICAgICAgdGhpcy5lZGl0VGFyZ2V0LFxuICAgICAgJ2lucHV0JyxcbiAgICAgIChldmVudDogSW5wdXRFdmVudCkgPT4ge1xuICAgICAgICBjb25zb2xlLmRlYnVnKCd2YWx1ZSBjaGFuZ2VkJyk7XG4gICAgICAgIHRoaXMuY2hlY2tFbXB0eSgpO1xuICAgICAgICB0aGlzLnJlYWN0VG9DaGFuZ2VzKCk7XG4gICAgICB9XG4gICAgKTtcblxuICAgIC8vIGNvbnN0IHN0eWxlOiBDU1NTdHlsZURlY2xhcmF0aW9uID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5lZGl0VGFyZ2V0KTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWRpdFRhcmdldCwgJ21pbi1oZWlnaHQnLCB0aGlzLmdldEhlaWdodCgyKSk7XG5cbiAgICBpZiAodGhpcy5pbml0aWFsRm9jdXMpIHtcbiAgICAgIHRoaXMuZm9jdXMoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZm9jdXMoKSB7XG4gICAgUHJvbWlzZS5yZXNvbHZlKG51bGwpLnRoZW4oKCkgPT4gdGhpcy5lZGl0VGFyZ2V0LmZvY3VzKCkpO1xuICB9XG5cbiAgcHVibGljIGJsdXIoKSB7XG4gICAgUHJvbWlzZS5yZXNvbHZlKG51bGwpLnRoZW4oKCkgPT4gdGhpcy5lZGl0VGFyZ2V0LmJsdXIoKSk7XG4gIH1cblxuICBwdWJsaWMgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzLnVpSWQpIHtcbiAgICAgIHRoaXMuc3Vic2NyaWJlVG9VaSh0aGlzLnVpSWQpO1xuICAgIH1cbiAgICBpZiAoY2hhbmdlcy5yb3cpIHtcbiAgICAgIGlmICh0aGlzLmVkaXRUYXJnZXQpIHtcbiAgICAgICAgdGhpcy5jb21wdXRlSGVpZ2h0KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLnVpU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnVpU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIHRoaXMudW5saXN0ZW4oKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBjb21wdXRlSGVpZ2h0KCkge1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lZGl0VGFyZ2V0LCAnaGVpZ2h0JywgdGhpcy5nZXRIZWlnaHQodGhpcy5yb3cpKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBjaGVja0VtcHR5KCkge1xuICAgIGlmICh0aGlzLmVkaXRUYXJnZXQuaW5uZXJIVE1MID09PSAnJykge1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUodGhpcy5lZGl0VGFyZ2V0LCAnaW5uZXJIVE1MJywgJzxicj4nKTtcbiAgICAgIHRoaXMuZW1wdHkgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5lZGl0VGFyZ2V0LmlubmVySFRNTCA9PT0gJzxicj4nKSB7XG4gICAgICB0aGlzLmVtcHR5ID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbXB0eSA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRIZWlnaHQocm93Q291bnQ6IG51bWJlcikge1xuICAgIGNvbnN0IHN0eWxlOiBDU1NTdHlsZURlY2xhcmF0aW9uID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5lZGl0VGFyZ2V0KTtcbiAgICBsZXQgaGVpZ2h0ID0gcGFyc2VJbnQoc3R5bGUubGluZUhlaWdodCwgMTApICogcm93Q291bnQ7XG5cbiAgICBpZiAoc3R5bGUuYm94U2l6aW5nID09PSAnYm9yZGVyLWJveCcpIHtcbiAgICAgIGhlaWdodCArPVxuICAgICAgICBwYXJzZUludChzdHlsZS5wYWRkaW5nVG9wLCAxMCkgK1xuICAgICAgICBwYXJzZUludChzdHlsZS5wYWRkaW5nQm90dG9tLCAxMCkgK1xuICAgICAgICBwYXJzZUludChzdHlsZS5ib3JkZXJUb3BXaWR0aCwgMTApICtcbiAgICAgICAgcGFyc2VJbnQoc3R5bGUuYm9yZGVyQm90dG9tV2lkdGgsIDEwKTtcbiAgICB9XG4gICAgcmV0dXJuIGhlaWdodCArICdweCc7XG4gIH1cblxuICBwcm90ZWN0ZWQgdWlTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJvdGVjdGVkIHN1YnNjcmliZVRvVWkodWlJZDogc3RyaW5nKSB7XG4gICAgY29uc29sZS5kZWJ1Zygnc3Vic2NyaWJpbmcgdG8gJyArIHVpSWQsIHRoaXMudWlTdWJzY3JpcHRpb24pO1xuICAgIGlmICh0aGlzLnVpU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnVpU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIHRoaXMudWlTdWJzY3JpcHRpb24gPSB0aGlzLmNvbnRyb2xsZXIuY2hhbm5lbCh1aUlkKS5zdWJzY3JpYmUoY29tbWFuZCA9PiB7XG4gICAgICAvLyBpZiBpbnB1dCBpcyBub3Qgb24gZm9jdXMgd2Ugc2F2ZSBjdXJyZW50IGZvY3VzZWQgZWxlbWVudDpcbiAgICAgIGNvbnN0IGFjdGl2ZUVsZW1lbnQ6IEVsZW1lbnQgPSB0aGlzLmRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgICBjb25zb2xlLmRlYnVnKFxuICAgICAgICAnKCcgKyB1aUlkICsgJykgZ290IGNvbW1hbmQgJyArIGNvbW1hbmQubmFtZSArICcvJyArIGNvbW1hbmQudmFsdWVcbiAgICAgICk7XG5cbiAgICAgIHRoaXMucmVzdG9yZVNlbGVjdGlvbigpO1xuICAgICAgaWYgKGNvbW1hbmQubmFtZSA9PT0gJ2luc2VydEhUTUwnICYmIHRoaXMuc2VsZWN0aW9uUmFuZ2UpIHtcbiAgICAgICAgLy8gSWYgc29tZXRoaW5nIGlzIHNlbGVjdGVkIHdlIGFzc3VtZSB0aGF0IHRoZSBnb2FsIGlzIHRvIHJlcGxhY2UgaXQsXG4gICAgICAgIC8vIHNvIGZpcnN0IHdlIGRlbGV0ZSB0aGUgY29udGVudFxuICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLmRlbGV0ZUNvbnRlbnRzKCk7XG4gICAgICAgIC8vIGluc2VydEh0bWwgc2VlbXMgcXVpdGUgYnJva2VuIHNvIHdlIGRvIGl0IG91cnNlbGV2ZXNcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5pbnNlcnROb2RlKFxuICAgICAgICAgIHRoaXMuZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoY29tbWFuZC52YWx1ZSlcbiAgICAgICAgKTtcbiAgICAgICAgLy8gbW92ZSBjdXNvciB0byB0aGUgZW5kIG9mIHRoZSBuZXdseSBpbnNlcnRlZCBlbGVtZW50XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2UuY29sbGFwc2UoZmFsc2UpO1xuICAgICAgICAvLyBGb3JjZSB0aGUgdXBkYXRlIG9mIHRoZSBtb2RlbFxuICAgICAgICB0aGlzLmNoZWNrRW1wdHkoKTtcbiAgICAgICAgdGhpcy5yZWFjdFRvQ2hhbmdlcygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kb2N1bWVudC5leGVjQ29tbWFuZChjb21tYW5kLm5hbWUsIGZhbHNlLCBjb21tYW5kLnZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2F2ZVNlbGVjdGlvbigpO1xuICAgICAgaWYgKGFjdGl2ZUVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICBhY3RpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvLyBTYXZlcyB0aGUgY3VycmVudCB0ZXh0IHNlbGVjdGlvblxuICBwcm90ZWN0ZWQgc2VsZWN0aW9uUmFuZ2U6IFJhbmdlO1xuICBwcm90ZWN0ZWQgc2F2ZVNlbGVjdGlvbigpIHtcbiAgICBpZiAodGhpcy5zZWxlY3Rpb25JbkVkaXRhYmxlVGFyZ2V0KCkpIHtcbiAgICAgIGNvbnN0IHNlbCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcbiAgICAgIGlmIChzZWwuZ2V0UmFuZ2VBdCAmJiBzZWwucmFuZ2VDb3VudCkge1xuICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlID0gc2VsLmdldFJhbmdlQXQoMCk7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoJygnICsgdGhpcy51aUlkICsgJykgc2F2ZVNlbGVjdGlvbicsIHRoaXMuc2VsZWN0aW9uUmFuZ2UpO1xuICAgICAgICB0aGlzLmRldGVjdFN0eWxlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8vIFJlc3RvcnMgdGhlIGN1cnJlbnQgdGV4dCBzZWxlY3Rpb25cbiAgcHJvdGVjdGVkIHJlc3RvcmVTZWxlY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uSW5FZGl0YWJsZVRhcmdldCgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnNvbGUuZGVidWcoJygnICsgdGhpcy51aUlkICsgJykgcmVzdG9yZVNlbGVjdGlvbicsIHRoaXMuc2VsZWN0aW9uUmFuZ2UpO1xuICAgIGlmICh0aGlzLnNlbGVjdGlvblJhbmdlKSB7XG4gICAgICBjb25zdCBzZWwgPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk7XG4gICAgICBzZWwucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgICBzZWwuYWRkUmFuZ2UodGhpcy5zZWxlY3Rpb25SYW5nZSk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIHNlbGVjdGlvbkluRWRpdGFibGVUYXJnZXQoKSB7XG4gICAgY29uc3Qgc2VsID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xuICAgIGNvbnN0IG5vZGUgPVxuICAgICAgc2VsLmdldFJhbmdlQXQgJiZcbiAgICAgIHNlbC5yYW5nZUNvdW50ICYmXG4gICAgICBzZWwuZ2V0UmFuZ2VBdCgwKSAmJlxuICAgICAgc2VsLmdldFJhbmdlQXQoMCkuY29tbW9uQW5jZXN0b3JDb250YWluZXI7XG4gICAgcmV0dXJuIChcbiAgICAgIG5vZGUgJiZcbiAgICAgIChub2RlID09PSB0aGlzLmVkaXRUYXJnZXQgfHxcbiAgICAgICAgKG5vZGUucGFyZW50RWxlbWVudC5jbG9zZXN0KCcuZmF0ZS1lZGl0LXRhcmdldCcpICYmXG4gICAgICAgICAgbm9kZS5wYXJlbnRFbGVtZW50LmNsb3Nlc3QoJy5mYXRlLWVkaXQtdGFyZ2V0JykgPT09IHRoaXMuZWRpdFRhcmdldCkpXG4gICAgKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBkZXRlY3RTdHlsZSgpIHtcbiAgICBsZXQgbm9kZSA9IHRoaXMuc2VsZWN0aW9uUmFuZ2UuY29tbW9uQW5jZXN0b3JDb250YWluZXI7XG4gICAgaWYgKFxuICAgICAgIW5vZGUgfHxcbiAgICAgICEoXG4gICAgICAgIG5vZGUucGFyZW50RWxlbWVudC5jbG9zZXN0KCcuZmF0ZS1lZGl0LXRhcmdldCcpICYmXG4gICAgICAgIG5vZGUgIT09IHRoaXMuZWRpdFRhcmdldFxuICAgICAgKVxuICAgICkge1xuICAgICAgLy8gVGhlIGN1cnJlbnQgc2VsZWN0aW9uIGlzIG5vdCBjb250YWluZWQgaW4gdGhlIGVkaXRhYmxlIHpvbmUuXG4gICAgICAvLyB0aGlzIGlzIG1vc3QgbGlrZWx5IGR1ZSB0byB0aGUgaW5wdXQgYmVpbmcgZW1wdHkuXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIHNwZWNpYWwgY2FzZXMgZm9yIEZGIHdoZW4gc2VsZWN0aW9uIGlzIG9idGFpbmVkIGJ5IGRvdWJsZSBjbGljazpcbiAgICBpZiAoXG4gICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLmVuZE9mZnNldCA9PT0gMCAmJlxuICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5zdGFydENvbnRhaW5lci5ub2RlVmFsdWUgJiZcbiAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2Uuc3RhcnRPZmZzZXQgPT09XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2Uuc3RhcnRDb250YWluZXIubm9kZVZhbHVlLmxlbmd0aFxuICAgICkge1xuICAgICAgbm9kZSA9IHRoaXMuc2VsZWN0aW9uUmFuZ2Uuc3RhcnRDb250YWluZXIubmV4dFNpYmxpbmc7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2UuZW5kT2Zmc2V0ID09PSAwICYmXG4gICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLnN0YXJ0T2Zmc2V0ID09PSAwXG4gICAgKSB7XG4gICAgICBub2RlID0gdGhpcy5zZWxlY3Rpb25SYW5nZS5zdGFydENvbnRhaW5lci5wYXJlbnRFbGVtZW50O1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLmNvbW1vbkFuY2VzdG9yQ29udGFpbmVyID09PSB0aGlzLmVkaXRUYXJnZXQgJiZcbiAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2Uuc3RhcnRDb250YWluZXIgPT09IHRoaXMuZWRpdFRhcmdldCAmJlxuICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5lbmRDb250YWluZXIgPT09IHRoaXMuZWRpdFRhcmdldFxuICAgICkge1xuICAgICAgbm9kZSA9IHRoaXMuc2VsZWN0aW9uUmFuZ2UuY29tbW9uQW5jZXN0b3JDb250YWluZXIuY2hpbGROb2Rlc1tcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5zdGFydE9mZnNldFxuICAgICAgXTtcbiAgICB9XG4gICAgaWYgKG5vZGUgJiYgbm9kZSAhPT0gdGhpcy5lZGl0VGFyZ2V0KSB7XG4gICAgICBjb25zdCBub2RlcyA9IHRoaXMuaHRtbFBhcnNlci5maW5kUGFyZW50Tm9kZXMobm9kZSwgdGhpcy5lZGl0VGFyZ2V0KTtcbiAgICAgIGNvbnNvbGUuZGVidWcoJyAgLT4gZGV0ZWN0ZWQgYWN0aW9uczogJywgbm9kZXMpO1xuICAgICAgdGhpcy5jb250cm9sbGVyLmVuYWJsZUFjdGlvbnModGhpcy51aUlkLCBub2Rlcyk7XG4gICAgfVxuICB9XG5cbiAgLy8gaW1wbGVudGF0aW9uIG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yOlxuICBwcm90ZWN0ZWQgY2hhbmdlZCA9IG5ldyBBcnJheTwodmFsdWU6IHN0cmluZykgPT4gdm9pZD4oKTtcblxuICBwdWJsaWMgd3JpdGVWYWx1ZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLmNvbnRlbnQgPSB0aGlzLnNhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0SHRtbChcbiAgICAgICAgdGhpcy5odG1sUGFyc2VyLnNlcmlhbGl6ZSh0aGlzLnBhcnNlci5wYXJzZSh2YWx1ZSkpXG4gICAgICApO1xuICAgICAgdGhpcy5lbXB0eSA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNvbnRlbnQgPSB0aGlzLnNhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0SHRtbCgnPGJyPicpO1xuICAgICAgdGhpcy5lbXB0eSA9IHRydWU7XG4gICAgfVxuICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2UgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBzdHJpbmcpID0+IHZvaWQpIHtcbiAgICB0aGlzLmNoYW5nZWQucHVzaChmbik7XG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IHZvaWQpIHt9XG5cbiAgcHJvdGVjdGVkIGNoZWNrRm9yRHJvcGRvd25Db250ZXh0KCkge1xuICAgIGNvbnN0IHN0YXJ0UG9zID0gTWF0aC5tYXgodGhpcy5zZWxlY3Rpb25SYW5nZS5zdGFydE9mZnNldCAtIDIwLCAwKTtcbiAgICBjb25zdCBsZW5ndGggPSB0aGlzLnNlbGVjdGlvblJhbmdlLnN0YXJ0T2Zmc2V0IC0gc3RhcnRQb3M7XG4gICAgY29uc3QgY29udGV4dCA9IHRoaXMuc2VsZWN0aW9uUmFuZ2Uuc3RhcnRDb250YWluZXIudGV4dENvbnRlbnQuc3Vic3RyKFxuICAgICAgc3RhcnRQb3MsXG4gICAgICBsZW5ndGhcbiAgICApO1xuXG4gICAgY29uc3QgaW5saW5lQWN0aW9uID0gdGhpcy5jb250cm9sbGVyLmdldElubGluZUFjdGlvbihjb250ZXh0KTtcbiAgICBpZiAoaW5saW5lQWN0aW9uKSB7XG4gICAgICBpZiAoXG4gICAgICAgICF0aGlzLmlubGluZUFjdGlvbiB8fFxuICAgICAgICB0aGlzLmlubGluZUFjdGlvbi5kcm9wZG93biAhPT0gaW5saW5lQWN0aW9uLmRyb3Bkb3duXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5pbmxpbmVBY3Rpb24gPSBpbmxpbmVBY3Rpb247XG4gICAgICAgIHRoaXMuaW5pdERyb3Bkb3duKFxuICAgICAgICAgIGlubGluZUFjdGlvbixcbiAgICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmlubGluZUFjdGlvbiA9IGlubGluZUFjdGlvbjtcbiAgICAgICAgdGhpcy51cGRhdGVEcm9wZG93bihpbmxpbmVBY3Rpb24ubWF0Y2hlZCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0aGlzLmRyb3Bkb3duQ29tcG9uZW50KSB7XG4gICAgICB0aGlzLmlubGluZUFjdGlvbiA9IG51bGw7XG4gICAgICB0aGlzLmRyb3Bkb3duQ29tcG9uZW50LmRlc3Ryb3koKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgaW5pdERyb3Bkb3duKGFjdGlvbkNvbXBvbmVudCwgcG9zaXRpb24pIHtcbiAgICAvLyBzZXQgdGhlIGRyb3Bkb3duIGNvbXBvbmVudFxuICAgIGlmICh0aGlzLmRyb3Bkb3duQ29tcG9uZW50KSB7XG4gICAgICB0aGlzLmRyb3Bkb3duQ29tcG9uZW50LmRlc3Ryb3koKTtcbiAgICB9XG4gICAgY29uc3QgZmFjdG9yeSA9IHRoaXMuZmFjdG9yeVJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KFxuICAgICAgYWN0aW9uQ29tcG9uZW50LmRyb3Bkb3duXG4gICAgKTtcbiAgICBjb25zdCBjb21wb25lbnQ6IGFueSA9IGZhY3RvcnkuY3JlYXRlKHRoaXMudmlld0NvbnRhaW5lclJlZi5wYXJlbnRJbmplY3Rvcik7XG4gICAgaWYgKGNvbXBvbmVudC5pbnN0YW5jZS52YWx1ZUNoYW5nZSkge1xuICAgICAgY29tcG9uZW50Lmluc3RhbmNlLnZhbHVlID0gYWN0aW9uQ29tcG9uZW50Lm1hdGNoZWQ7XG4gICAgICBjb21wb25lbnQuaW5zdGFuY2UudmFsdWVDaGFuZ2Uuc3Vic2NyaWJlKHZhbHVlID0+IHtcbiAgICAgICAgdGhpcy5lZGl0VGFyZ2V0LmZvY3VzKCk7XG4gICAgICAgIGNvbnN0IGVuZCA9IHRoaXMuc2VsZWN0aW9uUmFuZ2UuZW5kT2Zmc2V0O1xuICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLnNldFN0YXJ0KFxuICAgICAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2UuZW5kQ29udGFpbmVyLFxuICAgICAgICAgIGVuZCAtIGFjdGlvbkNvbXBvbmVudC5tYXRjaGVkLmxlbmd0aFxuICAgICAgICApO1xuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuZG9JbmxpbmUodGhpcy51aUlkLCB0aGlzLmlubGluZUFjdGlvbiwgdmFsdWUpO1xuICAgICAgICAvLyBkZWxldGUgdGhlIGRyb3Bkb3duXG4gICAgICAgIHRoaXMuaW5saW5lQWN0aW9uID0gbnVsbDtcbiAgICAgICAgdGhpcy5kcm9wZG93bkNvbXBvbmVudC5kZXN0cm95KCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuZHJvcGRvd25Db21wb25lbnQgPSB0aGlzLnZpZXdDb250YWluZXJSZWYuaW5zZXJ0KGNvbXBvbmVudC5ob3N0Vmlldyk7XG4gICAgICB0aGlzLmRyb3Bkb3duSW5zdGFuY2UgPSBjb21wb25lbnQuaW5zdGFuY2U7XG4gICAgICB0aGlzLnVwZGF0ZURyb3Bkb3duUG9zaXRpb24oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnVGhlIGNvbXBvbmVudCB1c2VkIGFzIGEgZHJvcGRvd24gZG9lc25cXCd0IGNvbnRhaW4gYSB2YWx1ZUNoYW5nZSBlbW1pdGVyISdcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIHVwZGF0ZURyb3Bkb3duKHZhbHVlKSB7XG4gICAgdGhpcy5kcm9wZG93bkluc3RhbmNlLnZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy51cGRhdGVEcm9wZG93blBvc2l0aW9uKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgdXBkYXRlRHJvcGRvd25Qb3NpdGlvbigpIHtcbiAgICBpZiAodGhpcy5pbmxpbmVBY3Rpb24uZGlzcGxheSA9PT0gJ2NvbnRleHR1YWwnKSB7XG4gICAgICAvLyBjcmVhdGUgYSBzZWxlY3Rpb24gdG8gZ2V0IHRoZSBzaXplIG9mIHRoZSBtYXRjaGluZyB0ZXh0XG4gICAgICBjb25zdCBwYXJlbnRPZmZzZXRCQiA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5vZmZzZXRQYXJlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBjb25zdCByYW5nZSA9IHRoaXMuc2VsZWN0aW9uUmFuZ2UuY2xvbmVSYW5nZSgpO1xuICAgICAgY29uc3QgZW5kID0gcmFuZ2UuZW5kT2Zmc2V0O1xuICAgICAgcmFuZ2Uuc2V0U3RhcnQoXG4gICAgICAgIHJhbmdlLmVuZENvbnRhaW5lcixcbiAgICAgICAgZW5kIC0gdGhpcy5pbmxpbmVBY3Rpb24ubWF0Y2hlZC5sZW5ndGhcbiAgICAgICk7XG4gICAgICBjb25zdCBib3VuZGluZ0JveCA9IHJhbmdlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgdGhpcy5kcm9wZG93blBvc3Rpb25Ub3AgPVxuICAgICAgICBib3VuZGluZ0JveC50b3AgKyBib3VuZGluZ0JveC5oZWlnaHQgLSBwYXJlbnRPZmZzZXRCQi50b3AgKyAncHgnO1xuICAgICAgdGhpcy5kcm9wZG93blBvc3Rpb25MZWZ0ID0gYm91bmRpbmdCb3gubGVmdCAtIHBhcmVudE9mZnNldEJCLmxlZnQgKyAncHgnO1xuICAgIH1cbiAgfVxufVxuIl19