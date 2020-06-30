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
        this.focused = new EventEmitter();
        this.blured = new EventEmitter();
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
            _this.focused.emit();
        });
        this.unlisteners = this.renderer.listen(this.editTarget, 'blur', function (event) {
            console.debug('(' + _this.uiId + ') blur');
            _this.isFocused = false;
            _this.blured.emit();
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
            this.focus();
        }
    };
    FateInputComponent.prototype.focus = function () {
        var _this = this;
        Promise.resolve(null).then(function () { return _this.editTarget.focus(); });
    };
    FateInputComponent.prototype.blur = function () {
        var _this = this;
        Promise.resolve(null).then(function () { return _this.editTarget.blur(); });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmF0ZS1pbnB1dC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9mYXRlLWVkaXRvci8iLCJzb3VyY2VzIjpbImFwcC9mYXRlLWlucHV0L2ZhdGUtaW5wdXQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFDTCxNQUFNLEVBQ04sU0FBUyxFQUNULFVBQVUsRUFDVixPQUFPLEVBQ1AsZ0JBQWdCLEVBQ2hCLHdCQUF3QixFQUN4QixNQUFNLEVBQ04sU0FBUyxFQUNULGFBQWEsRUFDYixTQUFTLEVBQ1QsWUFBWSxFQUNaLFNBQVMsRUFDVCxhQUFhLEVBQ2IsTUFBTSxFQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBQUUsaUJBQWlCLEVBQXdCLE1BQU0sZ0JBQWdCLENBQUM7QUFDekUsT0FBTyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUluRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUNuRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUNwRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQStEM0Q7SUFtREUsNEJBQ1ksRUFBYyxFQUNkLFVBQWlDLEVBQ2pDLFVBQWlDLEVBQ2pDLE1BQXlCLEVBQ3pCLFNBQXVCLEVBQ3ZCLGVBQXlDLEVBQzNDLFFBQW1CLEVBQ0QsUUFBYTtRQVA3QixPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQ2QsZUFBVSxHQUFWLFVBQVUsQ0FBdUI7UUFDakMsZUFBVSxHQUFWLFVBQVUsQ0FBdUI7UUFDakMsV0FBTSxHQUFOLE1BQU0sQ0FBbUI7UUFDekIsY0FBUyxHQUFULFNBQVMsQ0FBYztRQUN2QixvQkFBZSxHQUFmLGVBQWUsQ0FBMEI7UUFDM0Ms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QkM7U0FyaEJZLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgVmlld0NoaWxkLFxuICBFbGVtZW50UmVmLFxuICBWaWV3UmVmLFxuICBWaWV3Q29udGFpbmVyUmVmLFxuICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gIE9uSW5pdCxcbiAgT25DaGFuZ2VzLFxuICBBZnRlclZpZXdJbml0LFxuICBPbkRlc3Ryb3ksXG4gIEV2ZW50RW1pdHRlcixcbiAgUmVuZGVyZXIyLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBJbmplY3Rcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOR19WQUxVRV9BQ0NFU1NPUiwgQ29udHJvbFZhbHVlQWNjZXNzb3IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBEb21TYW5pdGl6ZXIsIFNhZmVIdG1sIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5cbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBGYXRlQ29udHJvbGxlclNlcnZpY2UgfSBmcm9tICcuLi9mYXRlLWNvbnRyb2xsZXIuc2VydmljZSc7XG5pbXBvcnQgeyBGYXRlSHRtbFBhcnNlclNlcnZpY2UgfSBmcm9tICcuLi9mYXRlLWh0bWwtcGFyc2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgRmF0ZVBhcnNlclNlcnZpY2UgfSBmcm9tICcuLi9mYXRlLXBhcnNlci5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZmF0ZS1pbnB1dCcsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdlxuICAgICAgY2xhc3M9XCJmYXRlLWlubGluZS1kcm9wZG93blwiXG4gICAgICBbY2xhc3MuaGlkZGVuXT1cIiFpbmxpbmVBY3Rpb25cIlxuICAgICAgW2NsYXNzLmNvbnRleHR1YWxdPVwiaW5saW5lQWN0aW9uPy5kaXNwbGF5ID09PSAnY29udGV4dHVhbCdcIlxuICAgICAgW3N0eWxlLnRvcF09XCJkcm9wZG93blBvc3Rpb25Ub3BcIlxuICAgICAgW3N0eWxlLmxlZnRdPVwiZHJvcGRvd25Qb3N0aW9uTGVmdFwiXG4gICAgPlxuICAgICAgPG5nLXRlbXBsYXRlICNkcm9wZG93bj48L25nLXRlbXBsYXRlPlxuICAgIDwvZGl2PlxuICAgIDxkaXZcbiAgICAgICNlZGl0VGFyZ2V0XG4gICAgICBbY2xhc3NdPVwiJ2ZhdGUtZWRpdC10YXJnZXQgJyArIGN1c3RvbUNsYXNzXCJcbiAgICAgIFtuZ0NsYXNzXT1cInsgZW1wdHk6IGVtcHR5IH1cIlxuICAgICAgY29udGVudGVkaXRhYmxlPVwidHJ1ZVwiXG4gICAgICBbdGl0bGVdPVwicGxhY2Vob2xkZXJcIlxuICAgICAgW2lubmVySHRtbF09XCJjb250ZW50XCJcbiAgICA+PC9kaXY+XG4gIGAsXG4gIHN0eWxlczogW1xuICAgIGBcbiAgICAgIDpob3N0IGRpdi5mYXRlLWVkaXQtdGFyZ2V0IHtcbiAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICAgIHBhZGRpbmc6IDEwcHg7XG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNkZGQ7XG4gICAgICAgIG91dGxpbmU6IDA7XG4gICAgICAgIHJlc2l6ZTogdmVydGljYWw7XG4gICAgICAgIG92ZXJmbG93OiBhdXRvO1xuICAgICAgICBiYWNrZ3JvdW5kOiAjZmZmO1xuICAgICAgICBjb2xvcjogIzAwMDtcbiAgICAgICAgb3ZlcmZsb3c6IHZpc2libGU7XG4gICAgICB9XG4gICAgICA6aG9zdCBkaXYuZmF0ZS1lZGl0LXRhcmdldC5lbXB0eTpub3QoOmZvY3VzKTpiZWZvcmUge1xuICAgICAgICBjb250ZW50OiBhdHRyKHRpdGxlKTtcbiAgICAgICAgY29sb3I6ICM2MzZjNzI7XG4gICAgICB9XG4gICAgICAuZmF0ZS1pbmxpbmUtZHJvcGRvd24ge1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjZGRkO1xuICAgICAgICBib3JkZXItYm90dG9tOiAwO1xuICAgICAgfVxuICAgICAgLmZhdGUtaW5saW5lLWRyb3Bkb3duLmhpZGRlbiB7XG4gICAgICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgICAgIH1cbiAgICAgIC5mYXRlLWlubGluZS1kcm9wZG93bi5jb250ZXh0dWFsIHtcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICBiYWNrZ3JvdW5kOiAjZmZmO1xuICAgICAgICBib3gtc2hhZG93OiAwIDVweCAzMHB4IC0xMHB4IHJnYmEoMCwgMCwgMCwgMC40KTtcbiAgICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNjY2M7XG4gICAgICB9XG4gICAgICA6aG9zdCB7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDEwcHg7XG4gICAgICAgIC8qcG9zaXRpb246IHJlbGF0aXZlOyovXG4gICAgICB9XG4gICAgYFxuICBdLFxuICBwcm92aWRlcnM6IFtcbiAgICB7IHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLCB1c2VFeGlzdGluZzogRmF0ZUlucHV0Q29tcG9uZW50LCBtdWx0aTogdHJ1ZSB9XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgRmF0ZUlucHV0Q29tcG9uZW50XG4gIGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE9uQ2hhbmdlcywgT25Jbml0LCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuICBASW5wdXQoKVxuICBwdWJsaWMgdWlJZDogc3RyaW5nID0gJ2RlZmF1bHQnO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyByb3c6IG51bWJlcjtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgY3VzdG9tQ2xhc3M6IHN0cmluZztcblxuICBASW5wdXQoKVxuICBwdWJsaWMgcGxhY2Vob2xkZXI6IHN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBpbml0aWFsRm9jdXM6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBAT3V0cHV0KClcbiAgcHVibGljIGZvY3VzZWQgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgQE91dHB1dCgpXG4gIHB1YmxpYyBibHVyZWQgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgcHVibGljIGRyb3Bkb3duUG9zdGlvblRvcDogc3RyaW5nO1xuICBwdWJsaWMgZHJvcGRvd25Qb3N0aW9uTGVmdDogc3RyaW5nO1xuICBwdWJsaWMgaW5saW5lQWN0aW9uOiBhbnk7XG4gIHB1YmxpYyBjb250ZW50OiBTYWZlSHRtbDtcbiAgcHVibGljIGVtcHR5OiBib29sZWFuID0gdHJ1ZTtcblxuICBAVmlld0NoaWxkKCdkcm9wZG93bicsIHtcbiAgICByZWFkOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIHN0YXRpYzogdHJ1ZVxuICB9KVxuICB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmO1xuXG4gIEBWaWV3Q2hpbGQoJ2VkaXRUYXJnZXQnLCB7IHN0YXRpYzogdHJ1ZSB9KVxuICBwcm90ZWN0ZWQgc2V0IGVkaXRUYXJnZXRFbGVtZW50UmVmKGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+KSB7XG4gICAgdGhpcy5lZGl0VGFyZ2V0ID0gZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICB9XG5cbiAgcHJvdGVjdGVkIGRyb3Bkb3duQ29tcG9uZW50OiBWaWV3UmVmO1xuICBwcm90ZWN0ZWQgZHJvcGRvd25JbnN0YW5jZTogYW55O1xuICBwcm90ZWN0ZWQgZWRpdFRhcmdldDogSFRNTEVsZW1lbnQ7XG5cbiAgcHJvdGVjdGVkIGlzRm9jdXNlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHByaXZhdGUgX3VubGlzdGVuZXJzOiAoKCkgPT4gdm9pZClbXSA9IFtdO1xuICBwcml2YXRlIHNldCB1bmxpc3RlbmVycyhoYW5kbGVyOiAoKSA9PiB2b2lkKSB7XG4gICAgdGhpcy5fdW5saXN0ZW5lcnMucHVzaChoYW5kbGVyKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBlbDogRWxlbWVudFJlZixcbiAgICBwcm90ZWN0ZWQgY29udHJvbGxlcjogRmF0ZUNvbnRyb2xsZXJTZXJ2aWNlLFxuICAgIHByb3RlY3RlZCBodG1sUGFyc2VyOiBGYXRlSHRtbFBhcnNlclNlcnZpY2UsXG4gICAgcHJvdGVjdGVkIHBhcnNlcjogRmF0ZVBhcnNlclNlcnZpY2UsXG4gICAgcHJvdGVjdGVkIHNhbml0aXplcjogRG9tU2FuaXRpemVyLFxuICAgIHByb3RlY3RlZCBmYWN0b3J5UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBkb2N1bWVudDogYW55XG4gICkge31cblxuICBwcml2YXRlIHVubGlzdGVuKCkge1xuICAgIGZvciAoY29uc3QgaGFuZGxlciBvZiB0aGlzLl91bmxpc3RlbmVycykge1xuICAgICAgaGFuZGxlcigpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVhY3RUb0NoYW5nZXMoKSB7XG4gICAgY29uc3QgdHJlZSA9IHRoaXMuaHRtbFBhcnNlci5wYXJzZUVsZW1lbnQodGhpcy5lZGl0VGFyZ2V0KTtcbiAgICBjb25zdCBzZXJpYWxpemVkVHJlZSA9IHRoaXMucGFyc2VyLnNlcmlhbGl6ZSh0cmVlKTtcbiAgICB0aGlzLmNoYW5nZWQuZm9yRWFjaChmID0+IGYoc2VyaWFsaXplZFRyZWUpKTtcbiAgfVxuXG4gIHB1YmxpYyBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLnN1YnNjcmliZVRvVWkodGhpcy51aUlkKTtcbiAgfVxuXG4gIHB1YmxpYyBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgaWYgKHRoaXMucm93KSB7XG4gICAgICB0aGlzLmNvbXB1dGVIZWlnaHQoKTtcbiAgICB9XG5cbiAgICB0aGlzLnVubGlzdGVuZXJzID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oXG4gICAgICB0aGlzLmVkaXRUYXJnZXQsXG4gICAgICAnY2xpY2snLFxuICAgICAgKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoJ2NsaWNrJyk7XG4gICAgICAgIC8vIE9uIGNsaWNrIHdlIHNhdmUgdGhlIHRleHQgU2VsZWN0aW9uXG4gICAgICAgIHRoaXMuc2F2ZVNlbGVjdGlvbigpO1xuICAgICAgICAvLyBXZSBjaGVjayBpZiB0aGVyZSBpcyBhIGRyb3Bkb3duIG1hdGNoaW5nIHRoaXMgY29udGV4dFxuICAgICAgICB0aGlzLmNoZWNrRm9yRHJvcGRvd25Db250ZXh0KCk7XG4gICAgICB9XG4gICAgKTtcblxuICAgIHRoaXMudW5saXN0ZW5lcnMgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbihcbiAgICAgIHRoaXMuZWRpdFRhcmdldCxcbiAgICAgICdrZXl1cCcsXG4gICAgICAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAgICAgY29uc29sZS5kZWJ1Zygna2V5cHJlc3NlZCcpO1xuICAgICAgICAvLyBPbiBjbGljayB3ZSBzYXZlIHRoZSB0ZXh0IFNlbGVjdGlvblxuICAgICAgICB0aGlzLnNhdmVTZWxlY3Rpb24oKTtcbiAgICAgICAgLy8gV2UgY2hlY2sgaWYgdGhlcmUgaXMgYSBkcm9wZG93biBtYXRjaGluZyB0aGlzIGNvbnRleHRcbiAgICAgICAgdGhpcy5jaGVja0ZvckRyb3Bkb3duQ29udGV4dCgpO1xuICAgICAgfVxuICAgICk7XG5cbiAgICB0aGlzLnVubGlzdGVuZXJzID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oXG4gICAgICB0aGlzLmVkaXRUYXJnZXQsXG4gICAgICAnZm9jdXMnLFxuICAgICAgKGV2ZW50OiBGb2N1c0V2ZW50KSA9PiB7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoJygnICsgdGhpcy51aUlkICsgJykgZm9jdXMnKTtcbiAgICAgICAgLy8gT24gZm9jdXMgd2UgcmVzdG9yZSBpdFxuICAgICAgICB0aGlzLnJlc3RvcmVTZWxlY3Rpb24oKTtcbiAgICAgICAgdGhpcy5pc0ZvY3VzZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmZvY3VzZWQuZW1pdCgpO1xuICAgICAgfVxuICAgICk7XG4gICAgdGhpcy51bmxpc3RlbmVycyA9IHRoaXMucmVuZGVyZXIubGlzdGVuKFxuICAgICAgdGhpcy5lZGl0VGFyZ2V0LFxuICAgICAgJ2JsdXInLFxuICAgICAgKGV2ZW50OiBGb2N1c0V2ZW50KSA9PiB7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoJygnICsgdGhpcy51aUlkICsgJykgYmx1cicpO1xuICAgICAgICB0aGlzLmlzRm9jdXNlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmJsdXJlZC5lbWl0KCk7XG4gICAgICAgIHRoaXMuc2F2ZVNlbGVjdGlvbigpO1xuXG4gICAgICAgIGlmICh0aGlzLmRyb3Bkb3duQ29tcG9uZW50KSB7XG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmlubGluZUFjdGlvbiA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmRyb3Bkb3duQ29tcG9uZW50LmRlc3Ryb3koKTtcbiAgICAgICAgICB9LCAzMDApO1xuICAgICAgICAgIC8vIHRoaXMuaW5saW5lQWN0aW9uID0gbnVsbDtcbiAgICAgICAgICAvLyB0aGlzLmRyb3Bkb3duQ29tcG9uZW50LmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICk7XG5cbiAgICB0aGlzLnVubGlzdGVuZXJzID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oXG4gICAgICB0aGlzLmVkaXRUYXJnZXQsXG4gICAgICAna2V5ZG93bicsXG4gICAgICAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAgICAgY29uc29sZS5kZWJ1Zygna2V5ZG93bicsIGV2ZW50KTtcbiAgICAgICAgY29uc3Qgc3RvcERlZmF1bHQgPSAoKSA9PiB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3Qgc3RvcERlZmF1bHRBbmRGb3JjZVVwZGF0ZSA9ICgpID0+IHtcbiAgICAgICAgICBzdG9wRGVmYXVsdCgpO1xuICAgICAgICAgIHRoaXMuY2hlY2tFbXB0eSgpO1xuICAgICAgICAgIHRoaXMucmVhY3RUb0NoYW5nZXMoKTtcbiAgICAgICAgfTtcbiAgICAgICAgLy8gVGhpcyBpcyBuZWVkZWQgYmVjYXVzZSwgaWYgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIGlzIHBhcnRcbiAgICAgICAgLy8gb2YgYSBub24tZWRpdGFibGUgY2hpbGQgb2YgdGhlIGlucHV0LCB0aGUgZGVmYXVsdCBkZWxldGUgd29uJ3RcbiAgICAgICAgLy8gd29yay5cbiAgICAgICAgLy8gVGhpcyBjYXNlIGNhbiBoYXBwZW4gaWYgdGhlcmUgaXMgYSBjdXRvbSBlbGVtZW50IHRoYXRcbiAgICAgICAgLy8gd2FzIGluc2VydGVkIGJ5IHNvbWUgY3VzdG9tIGNvbnRyb2xsZXIuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIFNvbWUgY29uc3RyYWludHMgZm9yIGEgY3VzdG9tIGJsb2NrIHRvIHdvcmsgb24gdG9wIG9mIGNvbnRlbnRlZGl0YWJsZT1mYWxzZTpcbiAgICAgICAgLy8gLW1vei11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAgICAgLy8gLXdlYmtpdC11c2VyLW1vZGlmeTogcmVhZC1vbmx5O1xuICAgICAgICAvL1xuICAgICAgICAvLyBOb3RlOiBJdCBtYXkgbWFrZSBzZW5zZSB0byBkZWxldGUgdGhlIHNlbGVjdGlvbiBmb3Igbm9ybWFsIHRleHRcbiAgICAgICAgLy8gaW5wdXQgdG9vIGJ1dCBmb3Igbm93IHdlIG9ubHkgZG8gaXQgb24gZGVsZXRpb24uXG4gICAgICAgIGlmIChcbiAgICAgICAgICBldmVudC5rZXkgPT09ICdCYWNrc3BhY2UnIHx8XG4gICAgICAgICAgKGV2ZW50LmtleSA9PT0gJ0RlbGV0ZScgJiYgdGhpcy5zZWxlY3Rpb25SYW5nZSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuc2VsZWN0aW9uUmFuZ2UuY29tbW9uQW5jZXN0b3JDb250YWluZXI7XG4gICAgICAgICAgY29uc29sZS5kZWJ1ZygnRGVsZXRpb24nLCBub2RlKTtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBub2RlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiZcbiAgICAgICAgICAgICEobm9kZSBhcyBIVE1MRWxlbWVudCkuaXNDb250ZW50RWRpdGFibGVcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIC8vIHRoaXMgaXMgdGhlIGNhc2Ugb24gZmlyZWZveFxuICAgICAgICAgICAgY29uc29sZS5kZWJ1ZygnZGVsZXRpbmcgaW5zaWRlIHVuLWVkaXRhYmxlIGJsb2NrIGRldGVjdGVkJyk7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLnNlbGVjdE5vZGUobm9kZSk7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLmRlbGV0ZUNvbnRlbnRzKCk7XG4gICAgICAgICAgICBzdG9wRGVmYXVsdEFuZEZvcmNlVXBkYXRlKCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgIG5vZGUubm9kZU5hbWUgPT09ICcjdGV4dCcgJiZcbiAgICAgICAgICAgICFub2RlLnBhcmVudEVsZW1lbnQuaXNDb250ZW50RWRpdGFibGVcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIC8vIHRoaXMgaXMgdGhlIGNhc2Ugb24gd2Via2l0XG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdkZWxldGluZyBpbnNpZGUgdW4tZWRpdGFibGUgYmxvY2sgZGV0ZWN0ZWQnKTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2Uuc2VsZWN0Tm9kZShub2RlLnBhcmVudEVsZW1lbnQpO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5kZWxldGVDb250ZW50cygpO1xuICAgICAgICAgICAgc3RvcERlZmF1bHRBbmRGb3JjZVVwZGF0ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBUaGlzIGlzIG5lZWRlZCBiZWNhdXNlLCB0aGVyZSBpcyBhIGJ1ZyBpbiBGaXJlZm94IHRoYXQgcHJldmVudFxuICAgICAgICAvLyBkZWxldGluZyBhIHVuZWRpdGFibGUgZWxlbWVudCBpbnNpZGUgYW4gZWRpdGFibGUgZWxlbWVudC4gU28gd2VcbiAgICAgICAgLy8gcmVpbXBsZW1lbnQgdGhlIHdob2xlIGZ1bmN0aW9uIGZvciBhbGwgYnJvd3NlcnMuXG4gICAgICAgIGlmIChldmVudC5rZXkgPT09ICdCYWNrc3BhY2UnICYmIHRoaXMuc2VsZWN0aW9uUmFuZ2UpIHtcbiAgICAgICAgICBjb25zdCBub2RlID0gdGhpcy5zZWxlY3Rpb25SYW5nZS5jb21tb25BbmNlc3RvckNvbnRhaW5lcjtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLmNvbGxhcHNlZCA9PT0gdHJ1ZSAmJlxuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5zdGFydE9mZnNldCA9PT0gMCAmJlxuICAgICAgICAgICAgbm9kZS5wcmV2aW91c1NpYmxpbmcgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJlxuICAgICAgICAgICAgIShub2RlLnByZXZpb3VzU2libGluZyBhcyBIVE1MRWxlbWVudCkuaXNDb250ZW50RWRpdGFibGVcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIG5vZGUucHJldmlvdXNTaWJsaW5nLnJlbW92ZSgpO1xuICAgICAgICAgICAgc3RvcERlZmF1bHRBbmRGb3JjZVVwZGF0ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChldmVudC5rZXkgPT09ICdEZWxldGUnICYmIHRoaXMuc2VsZWN0aW9uUmFuZ2UpIHtcbiAgICAgICAgICBjb25zdCBub2RlID0gdGhpcy5zZWxlY3Rpb25SYW5nZS5jb21tb25BbmNlc3RvckNvbnRhaW5lcjtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLmNvbGxhcHNlZCA9PT0gdHJ1ZSAmJlxuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5lbmRDb250YWluZXIubm9kZU5hbWUgPT09ICcjdGV4dCcgJiZcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2UuZW5kT2Zmc2V0ID09PVxuICAgICAgICAgICAgICAodGhpcy5zZWxlY3Rpb25SYW5nZS5lbmRDb250YWluZXIgYXMgVGV4dCkubGVuZ3RoICYmXG4gICAgICAgICAgICBub2RlLm5leHRTaWJsaW5nIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiZcbiAgICAgICAgICAgICEobm9kZS5uZXh0U2libGluZyBhcyBIVE1MRWxlbWVudCkuaXNDb250ZW50RWRpdGFibGVcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIG5vZGUubmV4dFNpYmxpbmcucmVtb3ZlKCk7XG4gICAgICAgICAgICBzdG9wRGVmYXVsdEFuZEZvcmNlVXBkYXRlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIElmIGEgZHJvcGRvd24gaXMgY3VycmVudGx5IGJlaW5nIGRpc3BsYXllZCB3ZSB1c2UgdGhlIHVwL2Rvd25cbiAgICAgICAgLy8ga2V5IHRvIG5hdmlnYXRlIGl0cyBjb250ZW50IGFuZCByZXR1cm4gdG8gc2VsZWN0IHRoZSBzZWxlY3RlZFxuICAgICAgICAvLyBlbGVtZW50XG4gICAgICAgIGlmICh0aGlzLmlubGluZUFjdGlvbikge1xuICAgICAgICAgIGlmIChldmVudC5rZXkgPT09ICdVcCcgfHwgZXZlbnQua2V5ID09PSAnQXJyb3dVcCcpIHtcbiAgICAgICAgICAgIHN0b3BEZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLmRyb3Bkb3duSW5zdGFuY2Uuc2VsZWNQcmV2aW91cygpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQua2V5ID09PSAnRG93bicgfHwgZXZlbnQua2V5ID09PSAnQXJyb3dEb3duJykge1xuICAgICAgICAgICAgc3RvcERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMuZHJvcGRvd25JbnN0YW5jZS5zZWxlY3ROZXh0KCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChldmVudC5rZXkgPT09ICdFbnRlcicpIHtcbiAgICAgICAgICAgIHN0b3BEZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLmRyb3Bkb3duSW5zdGFuY2UuY29uZmlybVNlbGVjdGlvbigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICk7XG5cbiAgICB0aGlzLnVubGlzdGVuZXJzID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oXG4gICAgICB0aGlzLmVkaXRUYXJnZXQsXG4gICAgICAnaW5wdXQnLFxuICAgICAgKGV2ZW50OiBJbnB1dEV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoJ3ZhbHVlIGNoYW5nZWQnKTtcbiAgICAgICAgdGhpcy5jaGVja0VtcHR5KCk7XG4gICAgICAgIHRoaXMucmVhY3RUb0NoYW5nZXMoKTtcbiAgICAgIH1cbiAgICApO1xuXG4gICAgLy8gY29uc3Qgc3R5bGU6IENTU1N0eWxlRGVjbGFyYXRpb24gPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVkaXRUYXJnZXQpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lZGl0VGFyZ2V0LCAnbWluLWhlaWdodCcsIHRoaXMuZ2V0SGVpZ2h0KDIpKTtcblxuICAgIGlmICh0aGlzLmluaXRpYWxGb2N1cykge1xuICAgICAgdGhpcy5mb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBmb2N1cygpIHtcbiAgICBQcm9taXNlLnJlc29sdmUobnVsbCkudGhlbigoKSA9PiB0aGlzLmVkaXRUYXJnZXQuZm9jdXMoKSk7XG4gIH1cblxuICBwdWJsaWMgYmx1cigpIHtcbiAgICBQcm9taXNlLnJlc29sdmUobnVsbCkudGhlbigoKSA9PiB0aGlzLmVkaXRUYXJnZXQuYmx1cigpKTtcbiAgfVxuXG4gIHB1YmxpYyBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXMudWlJZCkge1xuICAgICAgdGhpcy5zdWJzY3JpYmVUb1VpKHRoaXMudWlJZCk7XG4gICAgfVxuICAgIGlmIChjaGFuZ2VzLnJvdykge1xuICAgICAgaWYgKHRoaXMuZWRpdFRhcmdldCkge1xuICAgICAgICB0aGlzLmNvbXB1dGVIZWlnaHQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMudWlTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMudWlTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgdGhpcy51bmxpc3RlbigpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGNvbXB1dGVIZWlnaHQoKSB7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVkaXRUYXJnZXQsICdoZWlnaHQnLCB0aGlzLmdldEhlaWdodCh0aGlzLnJvdykpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGNoZWNrRW1wdHkoKSB7XG4gICAgaWYgKHRoaXMuZWRpdFRhcmdldC5pbm5lckhUTUwgPT09ICcnKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZSh0aGlzLmVkaXRUYXJnZXQsICdpbm5lckhUTUwnLCAnPGJyPicpO1xuICAgICAgdGhpcy5lbXB0eSA9IHRydWU7XG4gICAgfSBlbHNlIGlmICh0aGlzLmVkaXRUYXJnZXQuaW5uZXJIVE1MID09PSAnPGJyPicpIHtcbiAgICAgIHRoaXMuZW1wdHkgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVtcHR5ID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGdldEhlaWdodChyb3dDb3VudDogbnVtYmVyKSB7XG4gICAgY29uc3Qgc3R5bGU6IENTU1N0eWxlRGVjbGFyYXRpb24gPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVkaXRUYXJnZXQpO1xuICAgIGxldCBoZWlnaHQgPSBwYXJzZUludChzdHlsZS5saW5lSGVpZ2h0LCAxMCkgKiByb3dDb3VudDtcblxuICAgIGlmIChzdHlsZS5ib3hTaXppbmcgPT09ICdib3JkZXItYm94Jykge1xuICAgICAgaGVpZ2h0ICs9XG4gICAgICAgIHBhcnNlSW50KHN0eWxlLnBhZGRpbmdUb3AsIDEwKSArXG4gICAgICAgIHBhcnNlSW50KHN0eWxlLnBhZGRpbmdCb3R0b20sIDEwKSArXG4gICAgICAgIHBhcnNlSW50KHN0eWxlLmJvcmRlclRvcFdpZHRoLCAxMCkgK1xuICAgICAgICBwYXJzZUludChzdHlsZS5ib3JkZXJCb3R0b21XaWR0aCwgMTApO1xuICAgIH1cbiAgICByZXR1cm4gaGVpZ2h0ICsgJ3B4JztcbiAgfVxuXG4gIHByb3RlY3RlZCB1aVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBwcm90ZWN0ZWQgc3Vic2NyaWJlVG9VaSh1aUlkOiBzdHJpbmcpIHtcbiAgICBjb25zb2xlLmRlYnVnKCdzdWJzY3JpYmluZyB0byAnICsgdWlJZCwgdGhpcy51aVN1YnNjcmlwdGlvbik7XG4gICAgaWYgKHRoaXMudWlTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMudWlTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgdGhpcy51aVN1YnNjcmlwdGlvbiA9IHRoaXMuY29udHJvbGxlci5jaGFubmVsKHVpSWQpLnN1YnNjcmliZShjb21tYW5kID0+IHtcbiAgICAgIC8vIGlmIGlucHV0IGlzIG5vdCBvbiBmb2N1cyB3ZSBzYXZlIGN1cnJlbnQgZm9jdXNlZCBlbGVtZW50OlxuICAgICAgY29uc3QgYWN0aXZlRWxlbWVudDogRWxlbWVudCA9IHRoaXMuZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICAgIGNvbnNvbGUuZGVidWcoXG4gICAgICAgICcoJyArIHVpSWQgKyAnKSBnb3QgY29tbWFuZCAnICsgY29tbWFuZC5uYW1lICsgJy8nICsgY29tbWFuZC52YWx1ZVxuICAgICAgKTtcblxuICAgICAgdGhpcy5yZXN0b3JlU2VsZWN0aW9uKCk7XG4gICAgICBpZiAoY29tbWFuZC5uYW1lID09PSAnaW5zZXJ0SFRNTCcgJiYgdGhpcy5zZWxlY3Rpb25SYW5nZSkge1xuICAgICAgICAvLyBJZiBzb21ldGhpbmcgaXMgc2VsZWN0ZWQgd2UgYXNzdW1lIHRoYXQgdGhlIGdvYWwgaXMgdG8gcmVwbGFjZSBpdCxcbiAgICAgICAgLy8gc28gZmlyc3Qgd2UgZGVsZXRlIHRoZSBjb250ZW50XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2UuZGVsZXRlQ29udGVudHMoKTtcbiAgICAgICAgLy8gaW5zZXJ0SHRtbCBzZWVtcyBxdWl0ZSBicm9rZW4gc28gd2UgZG8gaXQgb3Vyc2VsZXZlc1xuICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLmluc2VydE5vZGUoXG4gICAgICAgICAgdGhpcy5kb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChjb21tYW5kLnZhbHVlKVxuICAgICAgICApO1xuICAgICAgICAvLyBtb3ZlIGN1c29yIHRvIHRoZSBlbmQgb2YgdGhlIG5ld2x5IGluc2VydGVkIGVsZW1lbnRcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5jb2xsYXBzZShmYWxzZSk7XG4gICAgICAgIC8vIEZvcmNlIHRoZSB1cGRhdGUgb2YgdGhlIG1vZGVsXG4gICAgICAgIHRoaXMuY2hlY2tFbXB0eSgpO1xuICAgICAgICB0aGlzLnJlYWN0VG9DaGFuZ2VzKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRvY3VtZW50LmV4ZWNDb21tYW5kKGNvbW1hbmQubmFtZSwgZmFsc2UsIGNvbW1hbmQudmFsdWUpO1xuICAgICAgfVxuICAgICAgdGhpcy5zYXZlU2VsZWN0aW9uKCk7XG4gICAgICBpZiAoYWN0aXZlRWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgIGFjdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8vIFNhdmVzIHRoZSBjdXJyZW50IHRleHQgc2VsZWN0aW9uXG4gIHByb3RlY3RlZCBzZWxlY3Rpb25SYW5nZTogUmFuZ2U7XG4gIHByb3RlY3RlZCBzYXZlU2VsZWN0aW9uKCkge1xuICAgIGlmICh0aGlzLnNlbGVjdGlvbkluRWRpdGFibGVUYXJnZXQoKSkge1xuICAgICAgY29uc3Qgc2VsID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xuICAgICAgaWYgKHNlbC5nZXRSYW5nZUF0ICYmIHNlbC5yYW5nZUNvdW50KSB7XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2UgPSBzZWwuZ2V0UmFuZ2VBdCgwKTtcbiAgICAgICAgY29uc29sZS5kZWJ1ZygnKCcgKyB0aGlzLnVpSWQgKyAnKSBzYXZlU2VsZWN0aW9uJywgdGhpcy5zZWxlY3Rpb25SYW5nZSk7XG4gICAgICAgIHRoaXMuZGV0ZWN0U3R5bGUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLy8gUmVzdG9ycyB0aGUgY3VycmVudCB0ZXh0IHNlbGVjdGlvblxuICBwcm90ZWN0ZWQgcmVzdG9yZVNlbGVjdGlvbigpIHtcbiAgICBpZiAodGhpcy5zZWxlY3Rpb25JbkVkaXRhYmxlVGFyZ2V0KCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc29sZS5kZWJ1ZygnKCcgKyB0aGlzLnVpSWQgKyAnKSByZXN0b3JlU2VsZWN0aW9uJywgdGhpcy5zZWxlY3Rpb25SYW5nZSk7XG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uUmFuZ2UpIHtcbiAgICAgIGNvbnN0IHNlbCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcbiAgICAgIHNlbC5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICAgIHNlbC5hZGRSYW5nZSh0aGlzLnNlbGVjdGlvblJhbmdlKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgc2VsZWN0aW9uSW5FZGl0YWJsZVRhcmdldCgpIHtcbiAgICBjb25zdCBzZWwgPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk7XG4gICAgY29uc3Qgbm9kZSA9XG4gICAgICBzZWwuZ2V0UmFuZ2VBdCAmJlxuICAgICAgc2VsLnJhbmdlQ291bnQgJiZcbiAgICAgIHNlbC5nZXRSYW5nZUF0KDApICYmXG4gICAgICBzZWwuZ2V0UmFuZ2VBdCgwKS5jb21tb25BbmNlc3RvckNvbnRhaW5lcjtcbiAgICByZXR1cm4gKFxuICAgICAgbm9kZSAmJlxuICAgICAgKG5vZGUgPT09IHRoaXMuZWRpdFRhcmdldCB8fFxuICAgICAgICAobm9kZS5wYXJlbnRFbGVtZW50LmNsb3Nlc3QoJy5mYXRlLWVkaXQtdGFyZ2V0JykgJiZcbiAgICAgICAgICBub2RlLnBhcmVudEVsZW1lbnQuY2xvc2VzdCgnLmZhdGUtZWRpdC10YXJnZXQnKSA9PT0gdGhpcy5lZGl0VGFyZ2V0KSlcbiAgICApO1xuICB9XG5cbiAgcHJvdGVjdGVkIGRldGVjdFN0eWxlKCkge1xuICAgIGxldCBub2RlID0gdGhpcy5zZWxlY3Rpb25SYW5nZS5jb21tb25BbmNlc3RvckNvbnRhaW5lcjtcbiAgICBpZiAoXG4gICAgICAhbm9kZSB8fFxuICAgICAgIShcbiAgICAgICAgbm9kZS5wYXJlbnRFbGVtZW50LmNsb3Nlc3QoJy5mYXRlLWVkaXQtdGFyZ2V0JykgJiZcbiAgICAgICAgbm9kZSAhPT0gdGhpcy5lZGl0VGFyZ2V0XG4gICAgICApXG4gICAgKSB7XG4gICAgICAvLyBUaGUgY3VycmVudCBzZWxlY3Rpb24gaXMgbm90IGNvbnRhaW5lZCBpbiB0aGUgZWRpdGFibGUgem9uZS5cbiAgICAgIC8vIHRoaXMgaXMgbW9zdCBsaWtlbHkgZHVlIHRvIHRoZSBpbnB1dCBiZWluZyBlbXB0eS5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gc3BlY2lhbCBjYXNlcyBmb3IgRkYgd2hlbiBzZWxlY3Rpb24gaXMgb2J0YWluZWQgYnkgZG91YmxlIGNsaWNrOlxuICAgIGlmIChcbiAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2UuZW5kT2Zmc2V0ID09PSAwICYmXG4gICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLnN0YXJ0Q29udGFpbmVyLm5vZGVWYWx1ZSAmJlxuICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5zdGFydE9mZnNldCA9PT1cbiAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5zdGFydENvbnRhaW5lci5ub2RlVmFsdWUubGVuZ3RoXG4gICAgKSB7XG4gICAgICBub2RlID0gdGhpcy5zZWxlY3Rpb25SYW5nZS5zdGFydENvbnRhaW5lci5uZXh0U2libGluZztcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5lbmRPZmZzZXQgPT09IDAgJiZcbiAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2Uuc3RhcnRPZmZzZXQgPT09IDBcbiAgICApIHtcbiAgICAgIG5vZGUgPSB0aGlzLnNlbGVjdGlvblJhbmdlLnN0YXJ0Q29udGFpbmVyLnBhcmVudEVsZW1lbnQ7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2UuY29tbW9uQW5jZXN0b3JDb250YWluZXIgPT09IHRoaXMuZWRpdFRhcmdldCAmJlxuICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5zdGFydENvbnRhaW5lciA9PT0gdGhpcy5lZGl0VGFyZ2V0ICYmXG4gICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLmVuZENvbnRhaW5lciA9PT0gdGhpcy5lZGl0VGFyZ2V0XG4gICAgKSB7XG4gICAgICBub2RlID0gdGhpcy5zZWxlY3Rpb25SYW5nZS5jb21tb25BbmNlc3RvckNvbnRhaW5lci5jaGlsZE5vZGVzW1xuICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLnN0YXJ0T2Zmc2V0XG4gICAgICBdO1xuICAgIH1cbiAgICBpZiAobm9kZSAmJiBub2RlICE9PSB0aGlzLmVkaXRUYXJnZXQpIHtcbiAgICAgIGNvbnN0IG5vZGVzID0gdGhpcy5odG1sUGFyc2VyLmZpbmRQYXJlbnROb2Rlcyhub2RlLCB0aGlzLmVkaXRUYXJnZXQpO1xuICAgICAgY29uc29sZS5kZWJ1ZygnICAtPiBkZXRlY3RlZCBhY3Rpb25zOiAnLCBub2Rlcyk7XG4gICAgICB0aGlzLmNvbnRyb2xsZXIuZW5hYmxlQWN0aW9ucyh0aGlzLnVpSWQsIG5vZGVzKTtcbiAgICB9XG4gIH1cblxuICAvLyBpbXBsZW50YXRpb24gb2YgQ29udHJvbFZhbHVlQWNjZXNzb3I6XG4gIHByb3RlY3RlZCBjaGFuZ2VkID0gbmV3IEFycmF5PCh2YWx1ZTogc3RyaW5nKSA9PiB2b2lkPigpO1xuXG4gIHB1YmxpYyB3cml0ZVZhbHVlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMuY29udGVudCA9IHRoaXMuc2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RIdG1sKFxuICAgICAgICB0aGlzLmh0bWxQYXJzZXIuc2VyaWFsaXplKHRoaXMucGFyc2VyLnBhcnNlKHZhbHVlKSlcbiAgICAgICk7XG4gICAgICB0aGlzLmVtcHR5ID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY29udGVudCA9IHRoaXMuc2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RIdG1sKCc8YnI+Jyk7XG4gICAgICB0aGlzLmVtcHR5ID0gdHJ1ZTtcbiAgICB9XG4gICAgdGhpcy5zZWxlY3Rpb25SYW5nZSA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHB1YmxpYyByZWdpc3Rlck9uQ2hhbmdlKGZuOiAodmFsdWU6IHN0cmluZykgPT4gdm9pZCkge1xuICAgIHRoaXMuY2hhbmdlZC5wdXNoKGZuKTtcbiAgfVxuXG4gIHB1YmxpYyByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gdm9pZCkge31cblxuICBwcm90ZWN0ZWQgY2hlY2tGb3JEcm9wZG93bkNvbnRleHQoKSB7XG4gICAgY29uc3Qgc3RhcnRQb3MgPSBNYXRoLm1heCh0aGlzLnNlbGVjdGlvblJhbmdlLnN0YXJ0T2Zmc2V0IC0gMjAsIDApO1xuICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMuc2VsZWN0aW9uUmFuZ2Uuc3RhcnRPZmZzZXQgLSBzdGFydFBvcztcbiAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5zZWxlY3Rpb25SYW5nZS5zdGFydENvbnRhaW5lci50ZXh0Q29udGVudC5zdWJzdHIoXG4gICAgICBzdGFydFBvcyxcbiAgICAgIGxlbmd0aFxuICAgICk7XG5cbiAgICBjb25zdCBpbmxpbmVBY3Rpb24gPSB0aGlzLmNvbnRyb2xsZXIuZ2V0SW5saW5lQWN0aW9uKGNvbnRleHQpO1xuICAgIGlmIChpbmxpbmVBY3Rpb24pIHtcbiAgICAgIGlmIChcbiAgICAgICAgIXRoaXMuaW5saW5lQWN0aW9uIHx8XG4gICAgICAgIHRoaXMuaW5saW5lQWN0aW9uLmRyb3Bkb3duICE9PSBpbmxpbmVBY3Rpb24uZHJvcGRvd25cbiAgICAgICkge1xuICAgICAgICB0aGlzLmlubGluZUFjdGlvbiA9IGlubGluZUFjdGlvbjtcbiAgICAgICAgdGhpcy5pbml0RHJvcGRvd24oXG4gICAgICAgICAgaW5saW5lQWN0aW9uLFxuICAgICAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2UuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaW5saW5lQWN0aW9uID0gaW5saW5lQWN0aW9uO1xuICAgICAgICB0aGlzLnVwZGF0ZURyb3Bkb3duKGlubGluZUFjdGlvbi5tYXRjaGVkKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMuZHJvcGRvd25Db21wb25lbnQpIHtcbiAgICAgIHRoaXMuaW5saW5lQWN0aW9uID0gbnVsbDtcbiAgICAgIHRoaXMuZHJvcGRvd25Db21wb25lbnQuZGVzdHJveSgpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBpbml0RHJvcGRvd24oYWN0aW9uQ29tcG9uZW50LCBwb3NpdGlvbikge1xuICAgIC8vIHNldCB0aGUgZHJvcGRvd24gY29tcG9uZW50XG4gICAgaWYgKHRoaXMuZHJvcGRvd25Db21wb25lbnQpIHtcbiAgICAgIHRoaXMuZHJvcGRvd25Db21wb25lbnQuZGVzdHJveSgpO1xuICAgIH1cbiAgICBjb25zdCBmYWN0b3J5ID0gdGhpcy5mYWN0b3J5UmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkoXG4gICAgICBhY3Rpb25Db21wb25lbnQuZHJvcGRvd25cbiAgICApO1xuICAgIGNvbnN0IGNvbXBvbmVudDogYW55ID0gZmFjdG9yeS5jcmVhdGUodGhpcy52aWV3Q29udGFpbmVyUmVmLnBhcmVudEluamVjdG9yKTtcbiAgICBpZiAoY29tcG9uZW50Lmluc3RhbmNlLnZhbHVlQ2hhbmdlKSB7XG4gICAgICBjb21wb25lbnQuaW5zdGFuY2UudmFsdWUgPSBhY3Rpb25Db21wb25lbnQubWF0Y2hlZDtcbiAgICAgIGNvbXBvbmVudC5pbnN0YW5jZS52YWx1ZUNoYW5nZS5zdWJzY3JpYmUodmFsdWUgPT4ge1xuICAgICAgICB0aGlzLmVkaXRUYXJnZXQuZm9jdXMoKTtcbiAgICAgICAgY29uc3QgZW5kID0gdGhpcy5zZWxlY3Rpb25SYW5nZS5lbmRPZmZzZXQ7XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2Uuc2V0U3RhcnQoXG4gICAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5lbmRDb250YWluZXIsXG4gICAgICAgICAgZW5kIC0gYWN0aW9uQ29tcG9uZW50Lm1hdGNoZWQubGVuZ3RoXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuY29udHJvbGxlci5kb0lubGluZSh0aGlzLnVpSWQsIHRoaXMuaW5saW5lQWN0aW9uLCB2YWx1ZSk7XG4gICAgICAgIC8vIGRlbGV0ZSB0aGUgZHJvcGRvd25cbiAgICAgICAgdGhpcy5pbmxpbmVBY3Rpb24gPSBudWxsO1xuICAgICAgICB0aGlzLmRyb3Bkb3duQ29tcG9uZW50LmRlc3Ryb3koKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5kcm9wZG93bkNvbXBvbmVudCA9IHRoaXMudmlld0NvbnRhaW5lclJlZi5pbnNlcnQoY29tcG9uZW50Lmhvc3RWaWV3KTtcbiAgICAgIHRoaXMuZHJvcGRvd25JbnN0YW5jZSA9IGNvbXBvbmVudC5pbnN0YW5jZTtcbiAgICAgIHRoaXMudXBkYXRlRHJvcGRvd25Qb3NpdGlvbigpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdUaGUgY29tcG9uZW50IHVzZWQgYXMgYSBkcm9wZG93biBkb2VzblxcJ3QgY29udGFpbiBhIHZhbHVlQ2hhbmdlIGVtbWl0ZXIhJ1xuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgdXBkYXRlRHJvcGRvd24odmFsdWUpIHtcbiAgICB0aGlzLmRyb3Bkb3duSW5zdGFuY2UudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLnVwZGF0ZURyb3Bkb3duUG9zaXRpb24oKTtcbiAgfVxuXG4gIHByb3RlY3RlZCB1cGRhdGVEcm9wZG93blBvc2l0aW9uKCkge1xuICAgIGlmICh0aGlzLmlubGluZUFjdGlvbi5kaXNwbGF5ID09PSAnY29udGV4dHVhbCcpIHtcbiAgICAgIC8vIGNyZWF0ZSBhIHNlbGVjdGlvbiB0byBnZXQgdGhlIHNpemUgb2YgdGhlIG1hdGNoaW5nIHRleHRcbiAgICAgIGNvbnN0IHBhcmVudE9mZnNldEJCID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50Lm9mZnNldFBhcmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIGNvbnN0IHJhbmdlID0gdGhpcy5zZWxlY3Rpb25SYW5nZS5jbG9uZVJhbmdlKCk7XG4gICAgICBjb25zdCBlbmQgPSByYW5nZS5lbmRPZmZzZXQ7XG4gICAgICByYW5nZS5zZXRTdGFydChcbiAgICAgICAgcmFuZ2UuZW5kQ29udGFpbmVyLFxuICAgICAgICBlbmQgLSB0aGlzLmlubGluZUFjdGlvbi5tYXRjaGVkLmxlbmd0aFxuICAgICAgKTtcbiAgICAgIGNvbnN0IGJvdW5kaW5nQm94ID0gcmFuZ2UuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICB0aGlzLmRyb3Bkb3duUG9zdGlvblRvcCA9XG4gICAgICAgIGJvdW5kaW5nQm94LnRvcCArIGJvdW5kaW5nQm94LmhlaWdodCAtIHBhcmVudE9mZnNldEJCLnRvcCArICdweCc7XG4gICAgICB0aGlzLmRyb3Bkb3duUG9zdGlvbkxlZnQgPSBib3VuZGluZ0JveC5sZWZ0IC0gcGFyZW50T2Zmc2V0QkIubGVmdCArICdweCc7XG4gICAgfVxuICB9XG59XG4iXX0=