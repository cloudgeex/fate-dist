import { __decorate, __param, __values } from "tslib";
import { Component, Input, Output, ViewChild, ElementRef, ViewRef, ViewContainerRef, ComponentFactoryResolver, OnInit, OnChanges, AfterViewInit, OnDestroy, EventEmitter, Renderer2, SimpleChanges, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FateControllerService } from '../fate-controller.service';
import { FateHtmlParserService } from '../fate-html-parser.service';
import { FateParserService } from '../fate-parser.service';
var FateInputComponent = /** @class */ (function () {
    function FateInputComponent(el, controller, htmlParser, parser, sanitizer, factoryResolver, renderer, document) {
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
    FateInputComponent_1 = FateInputComponent;
    Object.defineProperty(FateInputComponent.prototype, "editTargetElementRef", {
        set: function (elementRef) {
            this.editTarget = elementRef.nativeElement;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FateInputComponent.prototype, "unlisteners", {
        set: function (handler) {
            this._unlisteners.push(handler);
        },
        enumerable: true,
        configurable: true
    });
    FateInputComponent.prototype.unlisten = function () {
        var e_1, _a;
        try {
            for (var _b = __values(this._unlisteners), _c = _b.next(); !_c.done; _c = _b.next()) {
                var handler = _c.value;
                handler();
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    FateInputComponent.prototype.reactToChanges = function () {
        var tree = this.htmlParser.parseElement(this.editTarget);
        var serializedTree = this.parser.serialize(tree);
        this.changed.forEach(function (f) { return f(serializedTree); });
    };
    FateInputComponent.prototype.ngOnInit = function () {
        this.subscribeToUi(this.uiId);
    };
    FateInputComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        if (this.row) {
            this.computeHeight();
        }
        this.unlisteners = this.renderer.listen(this.editTarget, 'click', function (event) {
            console.debug('click');
            // On click we save the text Selection
            _this.saveSelection();
            // We check if there is a dropdown matching this context
            _this.checkForDropdownContext();
        });
        this.unlisteners = this.renderer.listen(this.editTarget, 'keyup', function (event) {
            console.debug('keypressed');
            // On click we save the text Selection
            _this.saveSelection();
            // We check if there is a dropdown matching this context
            _this.checkForDropdownContext();
        });
        this.unlisteners = this.renderer.listen(this.editTarget, 'focus', function (event) {
            console.debug('(' + _this.uiId + ') focus');
            // On focus we restore it
            _this.restoreSelection();
            _this.isFocused = true;
            _this.focus.emit();
        });
        this.unlisteners = this.renderer.listen(this.editTarget, 'blur', function (event) {
            console.debug('(' + _this.uiId + ') blur');
            _this.isFocused = false;
            _this.blur.emit();
            _this.saveSelection();
            if (_this.dropdownComponent) {
                setTimeout(function () {
                    _this.inlineAction = null;
                    _this.dropdownComponent.destroy();
                }, 300);
                // this.inlineAction = null;
                // this.dropdownComponent.destroy();
            }
        });
        this.unlisteners = this.renderer.listen(this.editTarget, 'keydown', function (event) {
            console.debug('keydown', event);
            var stopDefault = function () {
                event.preventDefault();
                event.stopPropagation();
            };
            var stopDefaultAndForceUpdate = function () {
                stopDefault();
                _this.checkEmpty();
                _this.reactToChanges();
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
                (event.key === 'Delete' && _this.selectionRange)) {
                var node = _this.selectionRange.commonAncestorContainer;
                console.debug('Deletion', node);
                if (node instanceof HTMLElement &&
                    !node.isContentEditable) {
                    // this is the case on firefox
                    console.debug('deleting inside un-editable block detected');
                    _this.selectionRange.selectNode(node);
                    _this.selectionRange.deleteContents();
                    stopDefaultAndForceUpdate();
                }
                else if (node.nodeName === '#text' &&
                    !node.parentElement.isContentEditable) {
                    // this is the case on webkit
                    console.debug('deleting inside un-editable block detected');
                    _this.selectionRange.selectNode(node.parentElement);
                    _this.selectionRange.deleteContents();
                    stopDefaultAndForceUpdate();
                }
            }
            // This is needed because, there is a bug in Firefox that prevent
            // deleting a uneditable element inside an editable element. So we
            // reimplement the whole function for all browsers.
            if (event.key === 'Backspace' && _this.selectionRange) {
                var node = _this.selectionRange.commonAncestorContainer;
                if (_this.selectionRange.collapsed === true &&
                    _this.selectionRange.startOffset === 0 &&
                    node.previousSibling instanceof HTMLElement &&
                    !node.previousSibling.isContentEditable) {
                    node.previousSibling.remove();
                    stopDefaultAndForceUpdate();
                }
            }
            else if (event.key === 'Delete' && _this.selectionRange) {
                var node = _this.selectionRange.commonAncestorContainer;
                if (_this.selectionRange.collapsed === true &&
                    _this.selectionRange.endContainer.nodeName === '#text' &&
                    _this.selectionRange.endOffset ===
                        _this.selectionRange.endContainer.length &&
                    node.nextSibling instanceof HTMLElement &&
                    !node.nextSibling.isContentEditable) {
                    node.nextSibling.remove();
                    stopDefaultAndForceUpdate();
                }
            }
            // If a dropdown is currently being displayed we use the up/down
            // key to navigate its content and return to select the selected
            // element
            if (_this.inlineAction) {
                if (event.key === 'Up' || event.key === 'ArrowUp') {
                    stopDefault();
                    _this.dropdownInstance.selecPrevious();
                }
                else if (event.key === 'Down' || event.key === 'ArrowDown') {
                    stopDefault();
                    _this.dropdownInstance.selectNext();
                }
                else if (event.key === 'Enter') {
                    stopDefault();
                    _this.dropdownInstance.confirmSelection();
                }
            }
        });
        this.unlisteners = this.renderer.listen(this.editTarget, 'input', function (event) {
            console.debug('value changed');
            _this.checkEmpty();
            _this.reactToChanges();
        });
        // const style: CSSStyleDeclaration = window.getComputedStyle(this.editTarget);
        this.renderer.setStyle(this.editTarget, 'min-height', this.getHeight(2));
        if (this.initialFocus) {
            Promise.resolve(null).then(function () { return _this.editTarget.focus(); });
        }
    };
    FateInputComponent.prototype.ngOnChanges = function (changes) {
        if (changes.uiId) {
            this.subscribeToUi(this.uiId);
        }
        if (changes.row) {
            if (this.editTarget) {
                this.computeHeight();
            }
        }
    };
    FateInputComponent.prototype.ngOnDestroy = function () {
        if (this.uiSubscription) {
            this.uiSubscription.unsubscribe();
        }
        this.unlisten();
    };
    FateInputComponent.prototype.computeHeight = function () {
        this.renderer.setStyle(this.editTarget, 'height', this.getHeight(this.row));
    };
    FateInputComponent.prototype.checkEmpty = function () {
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
    };
    FateInputComponent.prototype.getHeight = function (rowCount) {
        var style = window.getComputedStyle(this.editTarget);
        var height = parseInt(style.lineHeight, 10) * rowCount;
        if (style.boxSizing === 'border-box') {
            height +=
                parseInt(style.paddingTop, 10) +
                    parseInt(style.paddingBottom, 10) +
                    parseInt(style.borderTopWidth, 10) +
                    parseInt(style.borderBottomWidth, 10);
        }
        return height + 'px';
    };
    FateInputComponent.prototype.subscribeToUi = function (uiId) {
        var _this = this;
        console.debug('subscribing to ' + uiId, this.uiSubscription);
        if (this.uiSubscription) {
            this.uiSubscription.unsubscribe();
        }
        this.uiSubscription = this.controller.channel(uiId).subscribe(function (command) {
            // if input is not on focus we save current focused element:
            var activeElement = _this.document.activeElement;
            console.debug('(' + uiId + ') got command ' + command.name + '/' + command.value);
            _this.restoreSelection();
            if (command.name === 'insertHTML' && _this.selectionRange) {
                // If something is selected we assume that the goal is to replace it,
                // so first we delete the content
                _this.selectionRange.deleteContents();
                // insertHtml seems quite broken so we do it ourseleves
                _this.selectionRange.insertNode(_this.document.createRange().createContextualFragment(command.value));
                // move cusor to the end of the newly inserted element
                _this.selectionRange.collapse(false);
                // Force the update of the model
                _this.checkEmpty();
                _this.reactToChanges();
            }
            else {
                _this.document.execCommand(command.name, false, command.value);
            }
            _this.saveSelection();
            if (activeElement instanceof HTMLElement) {
                activeElement.focus();
            }
        });
    };
    FateInputComponent.prototype.saveSelection = function () {
        if (this.selectionInEditableTarget()) {
            var sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                this.selectionRange = sel.getRangeAt(0);
                console.debug('(' + this.uiId + ') saveSelection', this.selectionRange);
                this.detectStyle();
            }
        }
    };
    // Restors the current text selection
    FateInputComponent.prototype.restoreSelection = function () {
        if (this.selectionInEditableTarget()) {
            return;
        }
        console.debug('(' + this.uiId + ') restoreSelection', this.selectionRange);
        if (this.selectionRange) {
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(this.selectionRange);
        }
    };
    FateInputComponent.prototype.selectionInEditableTarget = function () {
        var sel = window.getSelection();
        var node = sel.getRangeAt &&
            sel.rangeCount &&
            sel.getRangeAt(0) &&
            sel.getRangeAt(0).commonAncestorContainer;
        return (node &&
            (node === this.editTarget ||
                (node.parentElement.closest('.fate-edit-target') &&
                    node.parentElement.closest('.fate-edit-target') === this.editTarget)));
    };
    FateInputComponent.prototype.detectStyle = function () {
        var node = this.selectionRange.commonAncestorContainer;
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
            var nodes = this.htmlParser.findParentNodes(node, this.editTarget);
            console.debug('  -> detected actions: ', nodes);
            this.controller.enableActions(this.uiId, nodes);
        }
    };
    FateInputComponent.prototype.writeValue = function (value) {
        if (value) {
            this.content = this.sanitizer.bypassSecurityTrustHtml(this.htmlParser.serialize(this.parser.parse(value)));
            this.empty = false;
        }
        else {
            this.content = this.sanitizer.bypassSecurityTrustHtml('<br>');
            this.empty = true;
        }
        this.selectionRange = undefined;
    };
    FateInputComponent.prototype.registerOnChange = function (fn) {
        this.changed.push(fn);
    };
    FateInputComponent.prototype.registerOnTouched = function (fn) { };
    FateInputComponent.prototype.checkForDropdownContext = function () {
        var startPos = Math.max(this.selectionRange.startOffset - 20, 0);
        var length = this.selectionRange.startOffset - startPos;
        var context = this.selectionRange.startContainer.textContent.substr(startPos, length);
        var inlineAction = this.controller.getInlineAction(context);
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
    };
    FateInputComponent.prototype.initDropdown = function (actionComponent, position) {
        var _this = this;
        // set the dropdown component
        if (this.dropdownComponent) {
            this.dropdownComponent.destroy();
        }
        var factory = this.factoryResolver.resolveComponentFactory(actionComponent.dropdown);
        var component = factory.create(this.viewContainerRef.parentInjector);
        if (component.instance.valueChange) {
            component.instance.value = actionComponent.matched;
            component.instance.valueChange.subscribe(function (value) {
                _this.editTarget.focus();
                var end = _this.selectionRange.endOffset;
                _this.selectionRange.setStart(_this.selectionRange.endContainer, end - actionComponent.matched.length);
                _this.controller.doInline(_this.uiId, _this.inlineAction, value);
                // delete the dropdown
                _this.inlineAction = null;
                _this.dropdownComponent.destroy();
            });
            this.dropdownComponent = this.viewContainerRef.insert(component.hostView);
            this.dropdownInstance = component.instance;
            this.updateDropdownPosition();
        }
        else {
            throw new Error('The component used as a dropdown doesn\'t contain a valueChange emmiter!');
        }
    };
    FateInputComponent.prototype.updateDropdown = function (value) {
        this.dropdownInstance.value = value;
        this.updateDropdownPosition();
    };
    FateInputComponent.prototype.updateDropdownPosition = function () {
        if (this.inlineAction.display === 'contextual') {
            // create a selection to get the size of the matching text
            var parentOffsetBB = this.el.nativeElement.offsetParent.getBoundingClientRect();
            var range = this.selectionRange.cloneRange();
            var end = range.endOffset;
            range.setStart(range.endContainer, end - this.inlineAction.matched.length);
            var boundingBox = range.getBoundingClientRect();
            this.dropdownPostionTop =
                boundingBox.top + boundingBox.height - parentOffsetBB.top + 'px';
            this.dropdownPostionLeft = boundingBox.left - parentOffsetBB.left + 'px';
        }
    };
    var FateInputComponent_1;
    FateInputComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: FateControllerService },
        { type: FateHtmlParserService },
        { type: FateParserService },
        { type: DomSanitizer },
        { type: ComponentFactoryResolver },
        { type: Renderer2 },
        { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
    ]; };
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
            template: "\n    <div\n      class=\"fate-inline-dropdown\"\n      [class.hidden]=\"!inlineAction\"\n      [class.contextual]=\"inlineAction?.display === 'contextual'\"\n      [style.top]=\"dropdownPostionTop\"\n      [style.left]=\"dropdownPostionLeft\"\n    >\n      <ng-template #dropdown></ng-template>\n    </div>\n    <div\n      #editTarget\n      [class]=\"'fate-edit-target ' + customClass\"\n      [ngClass]=\"{ empty: empty }\"\n      contenteditable=\"true\"\n      [title]=\"placeholder\"\n      [innerHtml]=\"content\"\n    ></div>\n  ",
            providers: [
                { provide: NG_VALUE_ACCESSOR, useExisting: FateInputComponent_1, multi: true }
            ],
            styles: ["\n      :host div.fate-edit-target {\n        display: block;\n        padding: 10px;\n        border: 1px solid #ddd;\n        outline: 0;\n        resize: vertical;\n        overflow: auto;\n        background: #fff;\n        color: #000;\n        overflow: visible;\n      }\n      :host div.fate-edit-target.empty:not(:focus):before {\n        content: attr(title);\n        color: #636c72;\n      }\n      .fate-inline-dropdown {\n        border: 1px solid #ddd;\n        border-bottom: 0;\n      }\n      .fate-inline-dropdown.hidden {\n        display: none !important;\n      }\n      .fate-inline-dropdown.contextual {\n        position: absolute;\n        background: #fff;\n        box-shadow: 0 5px 30px -10px rgba(0, 0, 0, 0.4);\n        border-bottom: 1px solid #ccc;\n      }\n      :host {\n        margin-bottom: 10px;\n        /*position: relative;*/\n      }\n    "]
        }),
        __param(7, Inject(DOCUMENT))
    ], FateInputComponent);
    return FateInputComponent;
}());
export { FateInputComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmF0ZS1pbnB1dC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9mYXRlLWVkaXRvci8iLCJzb3VyY2VzIjpbImFwcC9mYXRlLWlucHV0L2ZhdGUtaW5wdXQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFDTCxNQUFNLEVBQ04sU0FBUyxFQUNULFVBQVUsRUFDVixPQUFPLEVBQ1AsZ0JBQWdCLEVBQ2hCLHdCQUF3QixFQUN4QixNQUFNLEVBQ04sU0FBUyxFQUNULGFBQWEsRUFDYixTQUFTLEVBQ1QsWUFBWSxFQUNaLFNBQVMsRUFDVCxhQUFhLEVBQ2IsTUFBTSxFQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBQUUsaUJBQWlCLEVBQXdCLE1BQU0sZ0JBQWdCLENBQUM7QUFDekUsT0FBTyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUluRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUNuRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUNwRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQStEM0Q7SUFtREUsNEJBQ1ksRUFBYyxFQUNkLFVBQWlDLEVBQ2pDLFVBQWlDLEVBQ2pDLE1BQXlCLEVBQ3pCLFNBQXVCLEVBQ3ZCLGVBQXlDLEVBQzNDLFFBQW1CLEVBQ0QsUUFBYTtRQVA3QixPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQ2QsZUFBVSxHQUFWLFVBQVUsQ0FBdUI7UUFDakMsZUFBVSxHQUFWLFVBQVUsQ0FBdUI7UUFDakMsV0FBTSxHQUFOLE1BQU0sQ0FBbUI7UUFDekIsY0FBUyxHQUFULFNBQVMsQ0FBYztRQUN2QixvQkFBZSxHQUFmLGVBQWUsQ0FBMEI7UUFDM0Ms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QkFDTix3QkFBd0I7Z0JBQ2pDLFNBQVM7Z0RBQzFCLE1BQU0sU0FBQyxRQUFROztJQXhEbEI7UUFEQyxLQUFLLEVBQUU7b0RBQ3dCO0lBR2hDO1FBREMsS0FBSyxFQUFFO21EQUNXO0lBR25CO1FBREMsS0FBSyxFQUFFOzJEQUNtQjtJQUczQjtRQURDLEtBQUssRUFBRTsyREFDd0I7SUFHaEM7UUFEQyxLQUFLLEVBQUU7NERBQzZCO0lBR3JDO1FBREMsTUFBTSxFQUFFO3FEQUMrQjtJQUd4QztRQURDLE1BQU0sRUFBRTtvREFDOEI7SUFZdkM7UUFKQyxTQUFTLENBQUMsVUFBVSxFQUFFO1lBQ3JCLElBQUksRUFBRSxnQkFBZ0I7WUFDdEIsTUFBTSxFQUFFLElBQUk7U0FDYixDQUFDO2dFQUNpQztJQUduQztRQURDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUM7a0VBR3pDO0lBdENVLGtCQUFrQjtRQTdEOUIsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLFlBQVk7WUFDdEIsUUFBUSxFQUFFLDRoQkFrQlQ7WUFxQ0QsU0FBUyxFQUFFO2dCQUNULEVBQUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFdBQVcsRUFBRSxvQkFBa0IsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFO2FBQzdFO3FCQXJDQyxxM0JBaUNDO1NBS0osQ0FBQztRQTRERyxXQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTtPQTNEUixrQkFBa0IsQ0E2Z0I5QjtJQUFELHlCQUFDO0NBQUEsQUE3Z0JELElBNmdCQztTQTdnQlksa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBWaWV3Q2hpbGQsXG4gIEVsZW1lbnRSZWYsXG4gIFZpZXdSZWYsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgT25Jbml0LFxuICBPbkNoYW5nZXMsXG4gIEFmdGVyVmlld0luaXQsXG4gIE9uRGVzdHJveSxcbiAgRXZlbnRFbWl0dGVyLFxuICBSZW5kZXJlcjIsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIEluamVjdFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5HX1ZBTFVFX0FDQ0VTU09SLCBDb250cm9sVmFsdWVBY2Nlc3NvciB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IERvbVNhbml0aXplciwgU2FmZUh0bWwgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcblxuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IEZhdGVDb250cm9sbGVyU2VydmljZSB9IGZyb20gJy4uL2ZhdGUtY29udHJvbGxlci5zZXJ2aWNlJztcbmltcG9ydCB7IEZhdGVIdG1sUGFyc2VyU2VydmljZSB9IGZyb20gJy4uL2ZhdGUtaHRtbC1wYXJzZXIuc2VydmljZSc7XG5pbXBvcnQgeyBGYXRlUGFyc2VyU2VydmljZSB9IGZyb20gJy4uL2ZhdGUtcGFyc2VyLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdmYXRlLWlucHV0JyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2XG4gICAgICBjbGFzcz1cImZhdGUtaW5saW5lLWRyb3Bkb3duXCJcbiAgICAgIFtjbGFzcy5oaWRkZW5dPVwiIWlubGluZUFjdGlvblwiXG4gICAgICBbY2xhc3MuY29udGV4dHVhbF09XCJpbmxpbmVBY3Rpb24/LmRpc3BsYXkgPT09ICdjb250ZXh0dWFsJ1wiXG4gICAgICBbc3R5bGUudG9wXT1cImRyb3Bkb3duUG9zdGlvblRvcFwiXG4gICAgICBbc3R5bGUubGVmdF09XCJkcm9wZG93blBvc3Rpb25MZWZ0XCJcbiAgICA+XG4gICAgICA8bmctdGVtcGxhdGUgI2Ryb3Bkb3duPjwvbmctdGVtcGxhdGU+XG4gICAgPC9kaXY+XG4gICAgPGRpdlxuICAgICAgI2VkaXRUYXJnZXRcbiAgICAgIFtjbGFzc109XCInZmF0ZS1lZGl0LXRhcmdldCAnICsgY3VzdG9tQ2xhc3NcIlxuICAgICAgW25nQ2xhc3NdPVwieyBlbXB0eTogZW1wdHkgfVwiXG4gICAgICBjb250ZW50ZWRpdGFibGU9XCJ0cnVlXCJcbiAgICAgIFt0aXRsZV09XCJwbGFjZWhvbGRlclwiXG4gICAgICBbaW5uZXJIdG1sXT1cImNvbnRlbnRcIlxuICAgID48L2Rpdj5cbiAgYCxcbiAgc3R5bGVzOiBbXG4gICAgYFxuICAgICAgOmhvc3QgZGl2LmZhdGUtZWRpdC10YXJnZXQge1xuICAgICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgICAgcGFkZGluZzogMTBweDtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgI2RkZDtcbiAgICAgICAgb3V0bGluZTogMDtcbiAgICAgICAgcmVzaXplOiB2ZXJ0aWNhbDtcbiAgICAgICAgb3ZlcmZsb3c6IGF1dG87XG4gICAgICAgIGJhY2tncm91bmQ6ICNmZmY7XG4gICAgICAgIGNvbG9yOiAjMDAwO1xuICAgICAgICBvdmVyZmxvdzogdmlzaWJsZTtcbiAgICAgIH1cbiAgICAgIDpob3N0IGRpdi5mYXRlLWVkaXQtdGFyZ2V0LmVtcHR5Om5vdCg6Zm9jdXMpOmJlZm9yZSB7XG4gICAgICAgIGNvbnRlbnQ6IGF0dHIodGl0bGUpO1xuICAgICAgICBjb2xvcjogIzYzNmM3MjtcbiAgICAgIH1cbiAgICAgIC5mYXRlLWlubGluZS1kcm9wZG93biB7XG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNkZGQ7XG4gICAgICAgIGJvcmRlci1ib3R0b206IDA7XG4gICAgICB9XG4gICAgICAuZmF0ZS1pbmxpbmUtZHJvcGRvd24uaGlkZGVuIHtcbiAgICAgICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICAgICAgfVxuICAgICAgLmZhdGUtaW5saW5lLWRyb3Bkb3duLmNvbnRleHR1YWwge1xuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgIGJhY2tncm91bmQ6ICNmZmY7XG4gICAgICAgIGJveC1zaGFkb3c6IDAgNXB4IDMwcHggLTEwcHggcmdiYSgwLCAwLCAwLCAwLjQpO1xuICAgICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2NjYztcbiAgICAgIH1cbiAgICAgIDpob3N0IHtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMTBweDtcbiAgICAgICAgLypwb3NpdGlvbjogcmVsYXRpdmU7Ki9cbiAgICAgIH1cbiAgICBgXG4gIF0sXG4gIHByb3ZpZGVyczogW1xuICAgIHsgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsIHVzZUV4aXN0aW5nOiBGYXRlSW5wdXRDb21wb25lbnQsIG11bHRpOiB0cnVlIH1cbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBGYXRlSW5wdXRDb21wb25lbnRcbiAgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciwgT25DaGFuZ2VzLCBPbkluaXQsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgpXG4gIHB1YmxpYyB1aUlkOiBzdHJpbmcgPSAnZGVmYXVsdCc7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHJvdzogbnVtYmVyO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBjdXN0b21DbGFzczogc3RyaW5nO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBwbGFjZWhvbGRlcjogc3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgcHVibGljIGluaXRpYWxGb2N1czogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIEBPdXRwdXQoKVxuICBwdWJsaWMgZm9jdXMgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgQE91dHB1dCgpXG4gIHB1YmxpYyBibHVyID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIHB1YmxpYyBkcm9wZG93blBvc3Rpb25Ub3A6IHN0cmluZztcbiAgcHVibGljIGRyb3Bkb3duUG9zdGlvbkxlZnQ6IHN0cmluZztcbiAgcHVibGljIGlubGluZUFjdGlvbjogYW55O1xuICBwdWJsaWMgY29udGVudDogU2FmZUh0bWw7XG4gIHB1YmxpYyBlbXB0eTogYm9vbGVhbiA9IHRydWU7XG5cbiAgQFZpZXdDaGlsZCgnZHJvcGRvd24nLCB7XG4gICAgcmVhZDogVmlld0NvbnRhaW5lclJlZixcbiAgICBzdGF0aWM6IHRydWVcbiAgfSlcbiAgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZjtcblxuICBAVmlld0NoaWxkKCdlZGl0VGFyZ2V0JywgeyBzdGF0aWM6IHRydWUgfSlcbiAgcHJvdGVjdGVkIHNldCBlZGl0VGFyZ2V0RWxlbWVudFJlZihlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50Pikge1xuICAgIHRoaXMuZWRpdFRhcmdldCA9IGVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgfVxuXG4gIHByb3RlY3RlZCBkcm9wZG93bkNvbXBvbmVudDogVmlld1JlZjtcbiAgcHJvdGVjdGVkIGRyb3Bkb3duSW5zdGFuY2U6IGFueTtcbiAgcHJvdGVjdGVkIGVkaXRUYXJnZXQ6IEhUTUxFbGVtZW50O1xuXG4gIHByb3RlY3RlZCBpc0ZvY3VzZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBwcml2YXRlIF91bmxpc3RlbmVyczogKCgpID0+IHZvaWQpW10gPSBbXTtcbiAgcHJpdmF0ZSBzZXQgdW5saXN0ZW5lcnMoaGFuZGxlcjogKCkgPT4gdm9pZCkge1xuICAgIHRoaXMuX3VubGlzdGVuZXJzLnB1c2goaGFuZGxlcik7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgZWw6IEVsZW1lbnRSZWYsXG4gICAgcHJvdGVjdGVkIGNvbnRyb2xsZXI6IEZhdGVDb250cm9sbGVyU2VydmljZSxcbiAgICBwcm90ZWN0ZWQgaHRtbFBhcnNlcjogRmF0ZUh0bWxQYXJzZXJTZXJ2aWNlLFxuICAgIHByb3RlY3RlZCBwYXJzZXI6IEZhdGVQYXJzZXJTZXJ2aWNlLFxuICAgIHByb3RlY3RlZCBzYW5pdGl6ZXI6IERvbVNhbml0aXplcixcbiAgICBwcm90ZWN0ZWQgZmFjdG9yeVJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQ6IGFueVxuICApIHt9XG5cbiAgcHJpdmF0ZSB1bmxpc3RlbigpIHtcbiAgICBmb3IgKGNvbnN0IGhhbmRsZXIgb2YgdGhpcy5fdW5saXN0ZW5lcnMpIHtcbiAgICAgIGhhbmRsZXIoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlYWN0VG9DaGFuZ2VzKCkge1xuICAgIGNvbnN0IHRyZWUgPSB0aGlzLmh0bWxQYXJzZXIucGFyc2VFbGVtZW50KHRoaXMuZWRpdFRhcmdldCk7XG4gICAgY29uc3Qgc2VyaWFsaXplZFRyZWUgPSB0aGlzLnBhcnNlci5zZXJpYWxpemUodHJlZSk7XG4gICAgdGhpcy5jaGFuZ2VkLmZvckVhY2goZiA9PiBmKHNlcmlhbGl6ZWRUcmVlKSk7XG4gIH1cblxuICBwdWJsaWMgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5zdWJzY3JpYmVUb1VpKHRoaXMudWlJZCk7XG4gIH1cblxuICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGlmICh0aGlzLnJvdykge1xuICAgICAgdGhpcy5jb21wdXRlSGVpZ2h0KCk7XG4gICAgfVxuXG4gICAgdGhpcy51bmxpc3RlbmVycyA9IHRoaXMucmVuZGVyZXIubGlzdGVuKFxuICAgICAgdGhpcy5lZGl0VGFyZ2V0LFxuICAgICAgJ2NsaWNrJyxcbiAgICAgIChldmVudDogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICBjb25zb2xlLmRlYnVnKCdjbGljaycpO1xuICAgICAgICAvLyBPbiBjbGljayB3ZSBzYXZlIHRoZSB0ZXh0IFNlbGVjdGlvblxuICAgICAgICB0aGlzLnNhdmVTZWxlY3Rpb24oKTtcbiAgICAgICAgLy8gV2UgY2hlY2sgaWYgdGhlcmUgaXMgYSBkcm9wZG93biBtYXRjaGluZyB0aGlzIGNvbnRleHRcbiAgICAgICAgdGhpcy5jaGVja0ZvckRyb3Bkb3duQ29udGV4dCgpO1xuICAgICAgfVxuICAgICk7XG5cbiAgICB0aGlzLnVubGlzdGVuZXJzID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oXG4gICAgICB0aGlzLmVkaXRUYXJnZXQsXG4gICAgICAna2V5dXAnLFxuICAgICAgKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoJ2tleXByZXNzZWQnKTtcbiAgICAgICAgLy8gT24gY2xpY2sgd2Ugc2F2ZSB0aGUgdGV4dCBTZWxlY3Rpb25cbiAgICAgICAgdGhpcy5zYXZlU2VsZWN0aW9uKCk7XG4gICAgICAgIC8vIFdlIGNoZWNrIGlmIHRoZXJlIGlzIGEgZHJvcGRvd24gbWF0Y2hpbmcgdGhpcyBjb250ZXh0XG4gICAgICAgIHRoaXMuY2hlY2tGb3JEcm9wZG93bkNvbnRleHQoKTtcbiAgICAgIH1cbiAgICApO1xuXG4gICAgdGhpcy51bmxpc3RlbmVycyA9IHRoaXMucmVuZGVyZXIubGlzdGVuKFxuICAgICAgdGhpcy5lZGl0VGFyZ2V0LFxuICAgICAgJ2ZvY3VzJyxcbiAgICAgIChldmVudDogRm9jdXNFdmVudCkgPT4ge1xuICAgICAgICBjb25zb2xlLmRlYnVnKCcoJyArIHRoaXMudWlJZCArICcpIGZvY3VzJyk7XG4gICAgICAgIC8vIE9uIGZvY3VzIHdlIHJlc3RvcmUgaXRcbiAgICAgICAgdGhpcy5yZXN0b3JlU2VsZWN0aW9uKCk7XG4gICAgICAgIHRoaXMuaXNGb2N1c2VkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5mb2N1cy5lbWl0KCk7XG4gICAgICB9XG4gICAgKTtcbiAgICB0aGlzLnVubGlzdGVuZXJzID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oXG4gICAgICB0aGlzLmVkaXRUYXJnZXQsXG4gICAgICAnYmx1cicsXG4gICAgICAoZXZlbnQ6IEZvY3VzRXZlbnQpID0+IHtcbiAgICAgICAgY29uc29sZS5kZWJ1ZygnKCcgKyB0aGlzLnVpSWQgKyAnKSBibHVyJyk7XG4gICAgICAgIHRoaXMuaXNGb2N1c2VkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYmx1ci5lbWl0KCk7XG4gICAgICAgIHRoaXMuc2F2ZVNlbGVjdGlvbigpO1xuXG4gICAgICAgIGlmICh0aGlzLmRyb3Bkb3duQ29tcG9uZW50KSB7XG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmlubGluZUFjdGlvbiA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmRyb3Bkb3duQ29tcG9uZW50LmRlc3Ryb3koKTtcbiAgICAgICAgICB9LCAzMDApO1xuICAgICAgICAgIC8vIHRoaXMuaW5saW5lQWN0aW9uID0gbnVsbDtcbiAgICAgICAgICAvLyB0aGlzLmRyb3Bkb3duQ29tcG9uZW50LmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICk7XG5cbiAgICB0aGlzLnVubGlzdGVuZXJzID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oXG4gICAgICB0aGlzLmVkaXRUYXJnZXQsXG4gICAgICAna2V5ZG93bicsXG4gICAgICAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAgICAgY29uc29sZS5kZWJ1Zygna2V5ZG93bicsIGV2ZW50KTtcbiAgICAgICAgY29uc3Qgc3RvcERlZmF1bHQgPSAoKSA9PiB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3Qgc3RvcERlZmF1bHRBbmRGb3JjZVVwZGF0ZSA9ICgpID0+IHtcbiAgICAgICAgICBzdG9wRGVmYXVsdCgpO1xuICAgICAgICAgIHRoaXMuY2hlY2tFbXB0eSgpO1xuICAgICAgICAgIHRoaXMucmVhY3RUb0NoYW5nZXMoKTtcbiAgICAgICAgfTtcbiAgICAgICAgLy8gVGhpcyBpcyBuZWVkZWQgYmVjYXVzZSwgaWYgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIGlzIHBhcnRcbiAgICAgICAgLy8gb2YgYSBub24tZWRpdGFibGUgY2hpbGQgb2YgdGhlIGlucHV0LCB0aGUgZGVmYXVsdCBkZWxldGUgd29uJ3RcbiAgICAgICAgLy8gd29yay5cbiAgICAgICAgLy8gVGhpcyBjYXNlIGNhbiBoYXBwZW4gaWYgdGhlcmUgaXMgYSBjdXRvbSBlbGVtZW50IHRoYXRcbiAgICAgICAgLy8gd2FzIGluc2VydGVkIGJ5IHNvbWUgY3VzdG9tIGNvbnRyb2xsZXIuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIFNvbWUgY29uc3RyYWludHMgZm9yIGEgY3VzdG9tIGJsb2NrIHRvIHdvcmsgb24gdG9wIG9mIGNvbnRlbnRlZGl0YWJsZT1mYWxzZTpcbiAgICAgICAgLy8gLW1vei11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAgICAgLy8gLXdlYmtpdC11c2VyLW1vZGlmeTogcmVhZC1vbmx5O1xuICAgICAgICAvL1xuICAgICAgICAvLyBOb3RlOiBJdCBtYXkgbWFrZSBzZW5zZSB0byBkZWxldGUgdGhlIHNlbGVjdGlvbiBmb3Igbm9ybWFsIHRleHRcbiAgICAgICAgLy8gaW5wdXQgdG9vIGJ1dCBmb3Igbm93IHdlIG9ubHkgZG8gaXQgb24gZGVsZXRpb24uXG4gICAgICAgIGlmIChcbiAgICAgICAgICBldmVudC5rZXkgPT09ICdCYWNrc3BhY2UnIHx8XG4gICAgICAgICAgKGV2ZW50LmtleSA9PT0gJ0RlbGV0ZScgJiYgdGhpcy5zZWxlY3Rpb25SYW5nZSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuc2VsZWN0aW9uUmFuZ2UuY29tbW9uQW5jZXN0b3JDb250YWluZXI7XG4gICAgICAgICAgY29uc29sZS5kZWJ1ZygnRGVsZXRpb24nLCBub2RlKTtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBub2RlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiZcbiAgICAgICAgICAgICEobm9kZSBhcyBIVE1MRWxlbWVudCkuaXNDb250ZW50RWRpdGFibGVcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIC8vIHRoaXMgaXMgdGhlIGNhc2Ugb24gZmlyZWZveFxuICAgICAgICAgICAgY29uc29sZS5kZWJ1ZygnZGVsZXRpbmcgaW5zaWRlIHVuLWVkaXRhYmxlIGJsb2NrIGRldGVjdGVkJyk7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLnNlbGVjdE5vZGUobm9kZSk7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLmRlbGV0ZUNvbnRlbnRzKCk7XG4gICAgICAgICAgICBzdG9wRGVmYXVsdEFuZEZvcmNlVXBkYXRlKCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgIG5vZGUubm9kZU5hbWUgPT09ICcjdGV4dCcgJiZcbiAgICAgICAgICAgICFub2RlLnBhcmVudEVsZW1lbnQuaXNDb250ZW50RWRpdGFibGVcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIC8vIHRoaXMgaXMgdGhlIGNhc2Ugb24gd2Via2l0XG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdkZWxldGluZyBpbnNpZGUgdW4tZWRpdGFibGUgYmxvY2sgZGV0ZWN0ZWQnKTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2Uuc2VsZWN0Tm9kZShub2RlLnBhcmVudEVsZW1lbnQpO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5kZWxldGVDb250ZW50cygpO1xuICAgICAgICAgICAgc3RvcERlZmF1bHRBbmRGb3JjZVVwZGF0ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBUaGlzIGlzIG5lZWRlZCBiZWNhdXNlLCB0aGVyZSBpcyBhIGJ1ZyBpbiBGaXJlZm94IHRoYXQgcHJldmVudFxuICAgICAgICAvLyBkZWxldGluZyBhIHVuZWRpdGFibGUgZWxlbWVudCBpbnNpZGUgYW4gZWRpdGFibGUgZWxlbWVudC4gU28gd2VcbiAgICAgICAgLy8gcmVpbXBsZW1lbnQgdGhlIHdob2xlIGZ1bmN0aW9uIGZvciBhbGwgYnJvd3NlcnMuXG4gICAgICAgIGlmIChldmVudC5rZXkgPT09ICdCYWNrc3BhY2UnICYmIHRoaXMuc2VsZWN0aW9uUmFuZ2UpIHtcbiAgICAgICAgICBjb25zdCBub2RlID0gdGhpcy5zZWxlY3Rpb25SYW5nZS5jb21tb25BbmNlc3RvckNvbnRhaW5lcjtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLmNvbGxhcHNlZCA9PT0gdHJ1ZSAmJlxuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5zdGFydE9mZnNldCA9PT0gMCAmJlxuICAgICAgICAgICAgbm9kZS5wcmV2aW91c1NpYmxpbmcgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJlxuICAgICAgICAgICAgIShub2RlLnByZXZpb3VzU2libGluZyBhcyBIVE1MRWxlbWVudCkuaXNDb250ZW50RWRpdGFibGVcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIG5vZGUucHJldmlvdXNTaWJsaW5nLnJlbW92ZSgpO1xuICAgICAgICAgICAgc3RvcERlZmF1bHRBbmRGb3JjZVVwZGF0ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChldmVudC5rZXkgPT09ICdEZWxldGUnICYmIHRoaXMuc2VsZWN0aW9uUmFuZ2UpIHtcbiAgICAgICAgICBjb25zdCBub2RlID0gdGhpcy5zZWxlY3Rpb25SYW5nZS5jb21tb25BbmNlc3RvckNvbnRhaW5lcjtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLmNvbGxhcHNlZCA9PT0gdHJ1ZSAmJlxuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5lbmRDb250YWluZXIubm9kZU5hbWUgPT09ICcjdGV4dCcgJiZcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2UuZW5kT2Zmc2V0ID09PVxuICAgICAgICAgICAgICAodGhpcy5zZWxlY3Rpb25SYW5nZS5lbmRDb250YWluZXIgYXMgVGV4dCkubGVuZ3RoICYmXG4gICAgICAgICAgICBub2RlLm5leHRTaWJsaW5nIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiZcbiAgICAgICAgICAgICEobm9kZS5uZXh0U2libGluZyBhcyBIVE1MRWxlbWVudCkuaXNDb250ZW50RWRpdGFibGVcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIG5vZGUubmV4dFNpYmxpbmcucmVtb3ZlKCk7XG4gICAgICAgICAgICBzdG9wRGVmYXVsdEFuZEZvcmNlVXBkYXRlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIElmIGEgZHJvcGRvd24gaXMgY3VycmVudGx5IGJlaW5nIGRpc3BsYXllZCB3ZSB1c2UgdGhlIHVwL2Rvd25cbiAgICAgICAgLy8ga2V5IHRvIG5hdmlnYXRlIGl0cyBjb250ZW50IGFuZCByZXR1cm4gdG8gc2VsZWN0IHRoZSBzZWxlY3RlZFxuICAgICAgICAvLyBlbGVtZW50XG4gICAgICAgIGlmICh0aGlzLmlubGluZUFjdGlvbikge1xuICAgICAgICAgIGlmIChldmVudC5rZXkgPT09ICdVcCcgfHwgZXZlbnQua2V5ID09PSAnQXJyb3dVcCcpIHtcbiAgICAgICAgICAgIHN0b3BEZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLmRyb3Bkb3duSW5zdGFuY2Uuc2VsZWNQcmV2aW91cygpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQua2V5ID09PSAnRG93bicgfHwgZXZlbnQua2V5ID09PSAnQXJyb3dEb3duJykge1xuICAgICAgICAgICAgc3RvcERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMuZHJvcGRvd25JbnN0YW5jZS5zZWxlY3ROZXh0KCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChldmVudC5rZXkgPT09ICdFbnRlcicpIHtcbiAgICAgICAgICAgIHN0b3BEZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLmRyb3Bkb3duSW5zdGFuY2UuY29uZmlybVNlbGVjdGlvbigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICk7XG5cbiAgICB0aGlzLnVubGlzdGVuZXJzID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oXG4gICAgICB0aGlzLmVkaXRUYXJnZXQsXG4gICAgICAnaW5wdXQnLFxuICAgICAgKGV2ZW50OiBJbnB1dEV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoJ3ZhbHVlIGNoYW5nZWQnKTtcbiAgICAgICAgdGhpcy5jaGVja0VtcHR5KCk7XG4gICAgICAgIHRoaXMucmVhY3RUb0NoYW5nZXMoKTtcbiAgICAgIH1cbiAgICApO1xuXG4gICAgLy8gY29uc3Qgc3R5bGU6IENTU1N0eWxlRGVjbGFyYXRpb24gPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVkaXRUYXJnZXQpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lZGl0VGFyZ2V0LCAnbWluLWhlaWdodCcsIHRoaXMuZ2V0SGVpZ2h0KDIpKTtcblxuICAgIGlmICh0aGlzLmluaXRpYWxGb2N1cykge1xuICAgICAgUHJvbWlzZS5yZXNvbHZlKG51bGwpLnRoZW4oKCkgPT4gdGhpcy5lZGl0VGFyZ2V0LmZvY3VzKCkpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXMudWlJZCkge1xuICAgICAgdGhpcy5zdWJzY3JpYmVUb1VpKHRoaXMudWlJZCk7XG4gICAgfVxuICAgIGlmIChjaGFuZ2VzLnJvdykge1xuICAgICAgaWYgKHRoaXMuZWRpdFRhcmdldCkge1xuICAgICAgICB0aGlzLmNvbXB1dGVIZWlnaHQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMudWlTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMudWlTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgdGhpcy51bmxpc3RlbigpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGNvbXB1dGVIZWlnaHQoKSB7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVkaXRUYXJnZXQsICdoZWlnaHQnLCB0aGlzLmdldEhlaWdodCh0aGlzLnJvdykpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGNoZWNrRW1wdHkoKSB7XG4gICAgaWYgKHRoaXMuZWRpdFRhcmdldC5pbm5lckhUTUwgPT09ICcnKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZSh0aGlzLmVkaXRUYXJnZXQsICdpbm5lckhUTUwnLCAnPGJyPicpO1xuICAgICAgdGhpcy5lbXB0eSA9IHRydWU7XG4gICAgfSBlbHNlIGlmICh0aGlzLmVkaXRUYXJnZXQuaW5uZXJIVE1MID09PSAnPGJyPicpIHtcbiAgICAgIHRoaXMuZW1wdHkgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVtcHR5ID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGdldEhlaWdodChyb3dDb3VudDogbnVtYmVyKSB7XG4gICAgY29uc3Qgc3R5bGU6IENTU1N0eWxlRGVjbGFyYXRpb24gPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVkaXRUYXJnZXQpO1xuICAgIGxldCBoZWlnaHQgPSBwYXJzZUludChzdHlsZS5saW5lSGVpZ2h0LCAxMCkgKiByb3dDb3VudDtcblxuICAgIGlmIChzdHlsZS5ib3hTaXppbmcgPT09ICdib3JkZXItYm94Jykge1xuICAgICAgaGVpZ2h0ICs9XG4gICAgICAgIHBhcnNlSW50KHN0eWxlLnBhZGRpbmdUb3AsIDEwKSArXG4gICAgICAgIHBhcnNlSW50KHN0eWxlLnBhZGRpbmdCb3R0b20sIDEwKSArXG4gICAgICAgIHBhcnNlSW50KHN0eWxlLmJvcmRlclRvcFdpZHRoLCAxMCkgK1xuICAgICAgICBwYXJzZUludChzdHlsZS5ib3JkZXJCb3R0b21XaWR0aCwgMTApO1xuICAgIH1cbiAgICByZXR1cm4gaGVpZ2h0ICsgJ3B4JztcbiAgfVxuXG4gIHByb3RlY3RlZCB1aVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBwcm90ZWN0ZWQgc3Vic2NyaWJlVG9VaSh1aUlkOiBzdHJpbmcpIHtcbiAgICBjb25zb2xlLmRlYnVnKCdzdWJzY3JpYmluZyB0byAnICsgdWlJZCwgdGhpcy51aVN1YnNjcmlwdGlvbik7XG4gICAgaWYgKHRoaXMudWlTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMudWlTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgdGhpcy51aVN1YnNjcmlwdGlvbiA9IHRoaXMuY29udHJvbGxlci5jaGFubmVsKHVpSWQpLnN1YnNjcmliZShjb21tYW5kID0+IHtcbiAgICAgIC8vIGlmIGlucHV0IGlzIG5vdCBvbiBmb2N1cyB3ZSBzYXZlIGN1cnJlbnQgZm9jdXNlZCBlbGVtZW50OlxuICAgICAgY29uc3QgYWN0aXZlRWxlbWVudDogRWxlbWVudCA9IHRoaXMuZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICAgIGNvbnNvbGUuZGVidWcoXG4gICAgICAgICcoJyArIHVpSWQgKyAnKSBnb3QgY29tbWFuZCAnICsgY29tbWFuZC5uYW1lICsgJy8nICsgY29tbWFuZC52YWx1ZVxuICAgICAgKTtcblxuICAgICAgdGhpcy5yZXN0b3JlU2VsZWN0aW9uKCk7XG4gICAgICBpZiAoY29tbWFuZC5uYW1lID09PSAnaW5zZXJ0SFRNTCcgJiYgdGhpcy5zZWxlY3Rpb25SYW5nZSkge1xuICAgICAgICAvLyBJZiBzb21ldGhpbmcgaXMgc2VsZWN0ZWQgd2UgYXNzdW1lIHRoYXQgdGhlIGdvYWwgaXMgdG8gcmVwbGFjZSBpdCxcbiAgICAgICAgLy8gc28gZmlyc3Qgd2UgZGVsZXRlIHRoZSBjb250ZW50XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2UuZGVsZXRlQ29udGVudHMoKTtcbiAgICAgICAgLy8gaW5zZXJ0SHRtbCBzZWVtcyBxdWl0ZSBicm9rZW4gc28gd2UgZG8gaXQgb3Vyc2VsZXZlc1xuICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLmluc2VydE5vZGUoXG4gICAgICAgICAgdGhpcy5kb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChjb21tYW5kLnZhbHVlKVxuICAgICAgICApO1xuICAgICAgICAvLyBtb3ZlIGN1c29yIHRvIHRoZSBlbmQgb2YgdGhlIG5ld2x5IGluc2VydGVkIGVsZW1lbnRcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5jb2xsYXBzZShmYWxzZSk7XG4gICAgICAgIC8vIEZvcmNlIHRoZSB1cGRhdGUgb2YgdGhlIG1vZGVsXG4gICAgICAgIHRoaXMuY2hlY2tFbXB0eSgpO1xuICAgICAgICB0aGlzLnJlYWN0VG9DaGFuZ2VzKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRvY3VtZW50LmV4ZWNDb21tYW5kKGNvbW1hbmQubmFtZSwgZmFsc2UsIGNvbW1hbmQudmFsdWUpO1xuICAgICAgfVxuICAgICAgdGhpcy5zYXZlU2VsZWN0aW9uKCk7XG4gICAgICBpZiAoYWN0aXZlRWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgIGFjdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8vIFNhdmVzIHRoZSBjdXJyZW50IHRleHQgc2VsZWN0aW9uXG4gIHByb3RlY3RlZCBzZWxlY3Rpb25SYW5nZTogUmFuZ2U7XG4gIHByb3RlY3RlZCBzYXZlU2VsZWN0aW9uKCkge1xuICAgIGlmICh0aGlzLnNlbGVjdGlvbkluRWRpdGFibGVUYXJnZXQoKSkge1xuICAgICAgY29uc3Qgc2VsID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xuICAgICAgaWYgKHNlbC5nZXRSYW5nZUF0ICYmIHNlbC5yYW5nZUNvdW50KSB7XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2UgPSBzZWwuZ2V0UmFuZ2VBdCgwKTtcbiAgICAgICAgY29uc29sZS5kZWJ1ZygnKCcgKyB0aGlzLnVpSWQgKyAnKSBzYXZlU2VsZWN0aW9uJywgdGhpcy5zZWxlY3Rpb25SYW5nZSk7XG4gICAgICAgIHRoaXMuZGV0ZWN0U3R5bGUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLy8gUmVzdG9ycyB0aGUgY3VycmVudCB0ZXh0IHNlbGVjdGlvblxuICBwcm90ZWN0ZWQgcmVzdG9yZVNlbGVjdGlvbigpIHtcbiAgICBpZiAodGhpcy5zZWxlY3Rpb25JbkVkaXRhYmxlVGFyZ2V0KCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc29sZS5kZWJ1ZygnKCcgKyB0aGlzLnVpSWQgKyAnKSByZXN0b3JlU2VsZWN0aW9uJywgdGhpcy5zZWxlY3Rpb25SYW5nZSk7XG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uUmFuZ2UpIHtcbiAgICAgIGNvbnN0IHNlbCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcbiAgICAgIHNlbC5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICAgIHNlbC5hZGRSYW5nZSh0aGlzLnNlbGVjdGlvblJhbmdlKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgc2VsZWN0aW9uSW5FZGl0YWJsZVRhcmdldCgpIHtcbiAgICBjb25zdCBzZWwgPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk7XG4gICAgY29uc3Qgbm9kZSA9XG4gICAgICBzZWwuZ2V0UmFuZ2VBdCAmJlxuICAgICAgc2VsLnJhbmdlQ291bnQgJiZcbiAgICAgIHNlbC5nZXRSYW5nZUF0KDApICYmXG4gICAgICBzZWwuZ2V0UmFuZ2VBdCgwKS5jb21tb25BbmNlc3RvckNvbnRhaW5lcjtcbiAgICByZXR1cm4gKFxuICAgICAgbm9kZSAmJlxuICAgICAgKG5vZGUgPT09IHRoaXMuZWRpdFRhcmdldCB8fFxuICAgICAgICAobm9kZS5wYXJlbnRFbGVtZW50LmNsb3Nlc3QoJy5mYXRlLWVkaXQtdGFyZ2V0JykgJiZcbiAgICAgICAgICBub2RlLnBhcmVudEVsZW1lbnQuY2xvc2VzdCgnLmZhdGUtZWRpdC10YXJnZXQnKSA9PT0gdGhpcy5lZGl0VGFyZ2V0KSlcbiAgICApO1xuICB9XG5cbiAgcHJvdGVjdGVkIGRldGVjdFN0eWxlKCkge1xuICAgIGxldCBub2RlID0gdGhpcy5zZWxlY3Rpb25SYW5nZS5jb21tb25BbmNlc3RvckNvbnRhaW5lcjtcbiAgICBpZiAoXG4gICAgICAhbm9kZSB8fFxuICAgICAgIShcbiAgICAgICAgbm9kZS5wYXJlbnRFbGVtZW50LmNsb3Nlc3QoJy5mYXRlLWVkaXQtdGFyZ2V0JykgJiZcbiAgICAgICAgbm9kZSAhPT0gdGhpcy5lZGl0VGFyZ2V0XG4gICAgICApXG4gICAgKSB7XG4gICAgICAvLyBUaGUgY3VycmVudCBzZWxlY3Rpb24gaXMgbm90IGNvbnRhaW5lZCBpbiB0aGUgZWRpdGFibGUgem9uZS5cbiAgICAgIC8vIHRoaXMgaXMgbW9zdCBsaWtlbHkgZHVlIHRvIHRoZSBpbnB1dCBiZWluZyBlbXB0eS5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gc3BlY2lhbCBjYXNlcyBmb3IgRkYgd2hlbiBzZWxlY3Rpb24gaXMgb2J0YWluZWQgYnkgZG91YmxlIGNsaWNrOlxuICAgIGlmIChcbiAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2UuZW5kT2Zmc2V0ID09PSAwICYmXG4gICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLnN0YXJ0Q29udGFpbmVyLm5vZGVWYWx1ZSAmJlxuICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5zdGFydE9mZnNldCA9PT1cbiAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5zdGFydENvbnRhaW5lci5ub2RlVmFsdWUubGVuZ3RoXG4gICAgKSB7XG4gICAgICBub2RlID0gdGhpcy5zZWxlY3Rpb25SYW5nZS5zdGFydENvbnRhaW5lci5uZXh0U2libGluZztcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5lbmRPZmZzZXQgPT09IDAgJiZcbiAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2Uuc3RhcnRPZmZzZXQgPT09IDBcbiAgICApIHtcbiAgICAgIG5vZGUgPSB0aGlzLnNlbGVjdGlvblJhbmdlLnN0YXJ0Q29udGFpbmVyLnBhcmVudEVsZW1lbnQ7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2UuY29tbW9uQW5jZXN0b3JDb250YWluZXIgPT09IHRoaXMuZWRpdFRhcmdldCAmJlxuICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5zdGFydENvbnRhaW5lciA9PT0gdGhpcy5lZGl0VGFyZ2V0ICYmXG4gICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLmVuZENvbnRhaW5lciA9PT0gdGhpcy5lZGl0VGFyZ2V0XG4gICAgKSB7XG4gICAgICBub2RlID0gdGhpcy5zZWxlY3Rpb25SYW5nZS5jb21tb25BbmNlc3RvckNvbnRhaW5lci5jaGlsZE5vZGVzW1xuICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLnN0YXJ0T2Zmc2V0XG4gICAgICBdO1xuICAgIH1cbiAgICBpZiAobm9kZSAmJiBub2RlICE9PSB0aGlzLmVkaXRUYXJnZXQpIHtcbiAgICAgIGNvbnN0IG5vZGVzID0gdGhpcy5odG1sUGFyc2VyLmZpbmRQYXJlbnROb2Rlcyhub2RlLCB0aGlzLmVkaXRUYXJnZXQpO1xuICAgICAgY29uc29sZS5kZWJ1ZygnICAtPiBkZXRlY3RlZCBhY3Rpb25zOiAnLCBub2Rlcyk7XG4gICAgICB0aGlzLmNvbnRyb2xsZXIuZW5hYmxlQWN0aW9ucyh0aGlzLnVpSWQsIG5vZGVzKTtcbiAgICB9XG4gIH1cblxuICAvLyBpbXBsZW50YXRpb24gb2YgQ29udHJvbFZhbHVlQWNjZXNzb3I6XG4gIHByb3RlY3RlZCBjaGFuZ2VkID0gbmV3IEFycmF5PCh2YWx1ZTogc3RyaW5nKSA9PiB2b2lkPigpO1xuXG4gIHB1YmxpYyB3cml0ZVZhbHVlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMuY29udGVudCA9IHRoaXMuc2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RIdG1sKFxuICAgICAgICB0aGlzLmh0bWxQYXJzZXIuc2VyaWFsaXplKHRoaXMucGFyc2VyLnBhcnNlKHZhbHVlKSlcbiAgICAgICk7XG4gICAgICB0aGlzLmVtcHR5ID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY29udGVudCA9IHRoaXMuc2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RIdG1sKCc8YnI+Jyk7XG4gICAgICB0aGlzLmVtcHR5ID0gdHJ1ZTtcbiAgICB9XG4gICAgdGhpcy5zZWxlY3Rpb25SYW5nZSA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHB1YmxpYyByZWdpc3Rlck9uQ2hhbmdlKGZuOiAodmFsdWU6IHN0cmluZykgPT4gdm9pZCkge1xuICAgIHRoaXMuY2hhbmdlZC5wdXNoKGZuKTtcbiAgfVxuXG4gIHB1YmxpYyByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gdm9pZCkge31cblxuICBwcm90ZWN0ZWQgY2hlY2tGb3JEcm9wZG93bkNvbnRleHQoKSB7XG4gICAgY29uc3Qgc3RhcnRQb3MgPSBNYXRoLm1heCh0aGlzLnNlbGVjdGlvblJhbmdlLnN0YXJ0T2Zmc2V0IC0gMjAsIDApO1xuICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMuc2VsZWN0aW9uUmFuZ2Uuc3RhcnRPZmZzZXQgLSBzdGFydFBvcztcbiAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5zZWxlY3Rpb25SYW5nZS5zdGFydENvbnRhaW5lci50ZXh0Q29udGVudC5zdWJzdHIoXG4gICAgICBzdGFydFBvcyxcbiAgICAgIGxlbmd0aFxuICAgICk7XG5cbiAgICBjb25zdCBpbmxpbmVBY3Rpb24gPSB0aGlzLmNvbnRyb2xsZXIuZ2V0SW5saW5lQWN0aW9uKGNvbnRleHQpO1xuICAgIGlmIChpbmxpbmVBY3Rpb24pIHtcbiAgICAgIGlmIChcbiAgICAgICAgIXRoaXMuaW5saW5lQWN0aW9uIHx8XG4gICAgICAgIHRoaXMuaW5saW5lQWN0aW9uLmRyb3Bkb3duICE9PSBpbmxpbmVBY3Rpb24uZHJvcGRvd25cbiAgICAgICkge1xuICAgICAgICB0aGlzLmlubGluZUFjdGlvbiA9IGlubGluZUFjdGlvbjtcbiAgICAgICAgdGhpcy5pbml0RHJvcGRvd24oXG4gICAgICAgICAgaW5saW5lQWN0aW9uLFxuICAgICAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2UuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaW5saW5lQWN0aW9uID0gaW5saW5lQWN0aW9uO1xuICAgICAgICB0aGlzLnVwZGF0ZURyb3Bkb3duKGlubGluZUFjdGlvbi5tYXRjaGVkKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMuZHJvcGRvd25Db21wb25lbnQpIHtcbiAgICAgIHRoaXMuaW5saW5lQWN0aW9uID0gbnVsbDtcbiAgICAgIHRoaXMuZHJvcGRvd25Db21wb25lbnQuZGVzdHJveSgpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBpbml0RHJvcGRvd24oYWN0aW9uQ29tcG9uZW50LCBwb3NpdGlvbikge1xuICAgIC8vIHNldCB0aGUgZHJvcGRvd24gY29tcG9uZW50XG4gICAgaWYgKHRoaXMuZHJvcGRvd25Db21wb25lbnQpIHtcbiAgICAgIHRoaXMuZHJvcGRvd25Db21wb25lbnQuZGVzdHJveSgpO1xuICAgIH1cbiAgICBjb25zdCBmYWN0b3J5ID0gdGhpcy5mYWN0b3J5UmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkoXG4gICAgICBhY3Rpb25Db21wb25lbnQuZHJvcGRvd25cbiAgICApO1xuICAgIGNvbnN0IGNvbXBvbmVudDogYW55ID0gZmFjdG9yeS5jcmVhdGUodGhpcy52aWV3Q29udGFpbmVyUmVmLnBhcmVudEluamVjdG9yKTtcbiAgICBpZiAoY29tcG9uZW50Lmluc3RhbmNlLnZhbHVlQ2hhbmdlKSB7XG4gICAgICBjb21wb25lbnQuaW5zdGFuY2UudmFsdWUgPSBhY3Rpb25Db21wb25lbnQubWF0Y2hlZDtcbiAgICAgIGNvbXBvbmVudC5pbnN0YW5jZS52YWx1ZUNoYW5nZS5zdWJzY3JpYmUodmFsdWUgPT4ge1xuICAgICAgICB0aGlzLmVkaXRUYXJnZXQuZm9jdXMoKTtcbiAgICAgICAgY29uc3QgZW5kID0gdGhpcy5zZWxlY3Rpb25SYW5nZS5lbmRPZmZzZXQ7XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2Uuc2V0U3RhcnQoXG4gICAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5lbmRDb250YWluZXIsXG4gICAgICAgICAgZW5kIC0gYWN0aW9uQ29tcG9uZW50Lm1hdGNoZWQubGVuZ3RoXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuY29udHJvbGxlci5kb0lubGluZSh0aGlzLnVpSWQsIHRoaXMuaW5saW5lQWN0aW9uLCB2YWx1ZSk7XG4gICAgICAgIC8vIGRlbGV0ZSB0aGUgZHJvcGRvd25cbiAgICAgICAgdGhpcy5pbmxpbmVBY3Rpb24gPSBudWxsO1xuICAgICAgICB0aGlzLmRyb3Bkb3duQ29tcG9uZW50LmRlc3Ryb3koKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5kcm9wZG93bkNvbXBvbmVudCA9IHRoaXMudmlld0NvbnRhaW5lclJlZi5pbnNlcnQoY29tcG9uZW50Lmhvc3RWaWV3KTtcbiAgICAgIHRoaXMuZHJvcGRvd25JbnN0YW5jZSA9IGNvbXBvbmVudC5pbnN0YW5jZTtcbiAgICAgIHRoaXMudXBkYXRlRHJvcGRvd25Qb3NpdGlvbigpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdUaGUgY29tcG9uZW50IHVzZWQgYXMgYSBkcm9wZG93biBkb2VzblxcJ3QgY29udGFpbiBhIHZhbHVlQ2hhbmdlIGVtbWl0ZXIhJ1xuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgdXBkYXRlRHJvcGRvd24odmFsdWUpIHtcbiAgICB0aGlzLmRyb3Bkb3duSW5zdGFuY2UudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLnVwZGF0ZURyb3Bkb3duUG9zaXRpb24oKTtcbiAgfVxuXG4gIHByb3RlY3RlZCB1cGRhdGVEcm9wZG93blBvc2l0aW9uKCkge1xuICAgIGlmICh0aGlzLmlubGluZUFjdGlvbi5kaXNwbGF5ID09PSAnY29udGV4dHVhbCcpIHtcbiAgICAgIC8vIGNyZWF0ZSBhIHNlbGVjdGlvbiB0byBnZXQgdGhlIHNpemUgb2YgdGhlIG1hdGNoaW5nIHRleHRcbiAgICAgIGNvbnN0IHBhcmVudE9mZnNldEJCID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50Lm9mZnNldFBhcmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIGNvbnN0IHJhbmdlID0gdGhpcy5zZWxlY3Rpb25SYW5nZS5jbG9uZVJhbmdlKCk7XG4gICAgICBjb25zdCBlbmQgPSByYW5nZS5lbmRPZmZzZXQ7XG4gICAgICByYW5nZS5zZXRTdGFydChcbiAgICAgICAgcmFuZ2UuZW5kQ29udGFpbmVyLFxuICAgICAgICBlbmQgLSB0aGlzLmlubGluZUFjdGlvbi5tYXRjaGVkLmxlbmd0aFxuICAgICAgKTtcbiAgICAgIGNvbnN0IGJvdW5kaW5nQm94ID0gcmFuZ2UuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICB0aGlzLmRyb3Bkb3duUG9zdGlvblRvcCA9XG4gICAgICAgIGJvdW5kaW5nQm94LnRvcCArIGJvdW5kaW5nQm94LmhlaWdodCAtIHBhcmVudE9mZnNldEJCLnRvcCArICdweCc7XG4gICAgICB0aGlzLmRyb3Bkb3duUG9zdGlvbkxlZnQgPSBib3VuZGluZ0JveC5sZWZ0IC0gcGFyZW50T2Zmc2V0QkIubGVmdCArICdweCc7XG4gICAgfVxuICB9XG59XG4iXX0=