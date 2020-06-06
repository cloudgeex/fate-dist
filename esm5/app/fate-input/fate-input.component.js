import { __decorate } from "tslib";
import { Component, Input, Output, ViewChild, ElementRef, ViewRef, ViewContainerRef, ComponentFactoryResolver, OnInit, OnChanges, AfterViewInit, OnDestroy, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FateControllerService } from '../fate-controller.service';
import { FateHtmlParserService } from '../fate-html-parser.service';
import { FateParserService } from '../fate-parser.service';
var FateInputComponent = /** @class */ (function () {
    function FateInputComponent(el, controller, htmlParser, parser, sanitizer, factoryResolver) {
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
    FateInputComponent_1 = FateInputComponent;
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
        this.editTarget = this.el.nativeElement.querySelector('.fate-edit-target');
        if (this.row) {
            this.computeHeight();
        }
        this.editTarget.addEventListener('click', function (event) {
            console.debug('click');
            // On click we save the text Selection
            _this.saveSelection();
            // We check if there is a dropdown matching this context
            _this.checkForDropdownContext();
        });
        this.editTarget.addEventListener('keyup', function (event) {
            console.debug('keypressed');
            // On click we save the text Selection
            _this.saveSelection();
            // We check if there is a dropdown matching this context
            _this.checkForDropdownContext();
        });
        this.editTarget.addEventListener('focus', function (event) {
            console.debug('(' + _this.uiId + ') focus');
            // On focus we restore it
            _this.restoreSelection();
            _this.isFocused = true;
            _this.focus.emit();
        });
        this.editTarget.addEventListener('blur', function (event) {
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
        this.editTarget.addEventListener('keydown', function (event) {
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
            if (event.key === 'Backspace' || event.key === 'Delete' && _this.selectionRange) {
                var node = _this.selectionRange.commonAncestorContainer;
                console.debug('Deletion', node);
                if (node instanceof HTMLElement && !node.isContentEditable) {
                    // this is the case on firefox
                    console.debug('deleting inside un-editable block detected');
                    _this.selectionRange.selectNode(node);
                    _this.selectionRange.deleteContents();
                    stopDefaultAndForceUpdate();
                }
                else if (node.nodeName === '#text' && !node.parentElement.isContentEditable) {
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
                    _this.selectionRange.endOffset === _this.selectionRange.endContainer.length &&
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
        this.editTarget.addEventListener('input', function (event) {
            console.debug('value changed');
            _this.checkEmpty();
            _this.reactToChanges();
        });
        var style = window.getComputedStyle(this.editTarget);
        this.editTarget.style.minHeight = this.getHeight(2);
    };
    FateInputComponent.prototype.ngOnChanges = function (changes) {
        if (changes['uiId']) {
            this.subscribeToUi(this.uiId);
        }
        if (changes['row']) {
            if (this.editTarget) {
                this.computeHeight();
            }
        }
    };
    FateInputComponent.prototype.ngOnDestroy = function () {
        if (this.uiSubscription) {
            this.uiSubscription.unsubscribe();
        }
    };
    FateInputComponent.prototype.computeHeight = function () {
        this.editTarget.style.height = this.getHeight(this.row);
    };
    FateInputComponent.prototype.checkEmpty = function () {
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
    };
    FateInputComponent.prototype.getHeight = function (rowCount) {
        var style = window.getComputedStyle(this.editTarget);
        var height = this.editTarget.style.height = (parseInt(style.lineHeight, 10) * rowCount);
        if (style.boxSizing === 'border-box') {
            height += parseInt(style.paddingTop, 10) + parseInt(style.paddingBottom, 10) + parseInt(style.borderTopWidth, 10) + parseInt(style.borderBottomWidth, 10);
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
            // if input is not on focus we save current focus:
            var focus = document.activeElement;
            console.debug('(' + uiId + ') got command ' + command.name + '/' + command.value);
            _this.restoreSelection();
            if (command.name === 'insertHTML' && _this.selectionRange) {
                // If something is selected we assume that the goal is to replace it,
                // so first we delete the content
                _this.selectionRange.deleteContents();
                // insertHtml seems quite broken so we do it ourseleves
                _this.selectionRange.insertNode(document.createRange().createContextualFragment(command.value));
                // move cusor to the end of the newly inserted element
                _this.selectionRange.collapse(false);
                // Force the update of the model
                _this.checkEmpty();
                _this.reactToChanges();
            }
            else {
                document.execCommand(command.name, false, command.value);
            }
            _this.saveSelection();
            focus.focus();
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
        var node = sel.getRangeAt && sel.rangeCount && sel.getRangeAt(0) && sel.getRangeAt(0).commonAncestorContainer;
        return node && (node === this.editTarget || (node.parentElement.closest('.fate-edit-target') && (node.parentElement.closest('.fate-edit-target') === this.editTarget)));
    };
    FateInputComponent.prototype.detectStyle = function () {
        var node = this.selectionRange.commonAncestorContainer;
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
            this.dropdownPostionTop = (boundingBox.top + boundingBox.height - parentOffsetBB.top) + 'px';
            this.dropdownPostionLeft = (boundingBox.left - parentOffsetBB.left) + 'px';
        }
    };
    var FateInputComponent_1;
    FateInputComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: FateControllerService },
        { type: FateHtmlParserService },
        { type: FateParserService },
        { type: DomSanitizer },
        { type: ComponentFactoryResolver }
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
            template: "\n    <div class=\"fate-inline-dropdown\"\n         [class.hidden]=\"!inlineAction\"\n         [class.contextual]=\"inlineAction?.display === 'contextual'\"\n         [style.top]=\"dropdownPostionTop\"\n         [style.left]=\"dropdownPostionLeft\">\n      <ng-template #dropdown></ng-template>\n    </div>\n    <div [class]=\"'fate-edit-target ' + customClass\"\n         [ngClass]=\"{empty: empty}\"\n         contenteditable=\"true\"\n         [title]=\"placeholder\"\n         [innerHtml]=\"content\"></div>\n  ",
            providers: [
                { provide: NG_VALUE_ACCESSOR, useExisting: FateInputComponent_1, multi: true }
            ],
            styles: ["\n    :host div.fate-edit-target {\n      display: block;\n      padding: 10px;\n      border: 1px solid #DDD;\n      outline: 0;\n      resize: vertical;\n      overflow: auto;\n      background: #FFF;\n      color: #000;\n      overflow: visible;\n    }\n    :host div.fate-edit-target.empty:not(:focus):before {\n      content:attr(title);\n      color: #636c72;\n    }\n    .fate-inline-dropdown {\n      border: 1px solid #DDD;\n      border-bottom: 0;\n    }\n    .fate-inline-dropdown.hidden {\n      display: none !important;\n    }\n    .fate-inline-dropdown.contextual {\n      position: absolute;\n      background: #FFF;\n      box-shadow: 0 5px 30px -10px rgba(0,0,0,0.4);\n      border-bottom: 1px solid #CCC;\n    }\n    :host {\n      margin-bottom: 10px;\n      /*position: relative;*/\n    }\n  "]
        })
    ], FateInputComponent);
    return FateInputComponent;
}());
export { FateInputComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmF0ZS1pbnB1dC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9mYXRlLWVkaXRvci8iLCJzb3VyY2VzIjpbImFwcC9mYXRlLWlucHV0L2ZhdGUtaW5wdXQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNoTSxPQUFPLEVBQUUsaUJBQWlCLEVBQXdCLE1BQU0sZ0JBQWdCLENBQUM7QUFDekUsT0FBTyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUluRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUNuRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUNwRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQXdEM0Q7SUFvQ0UsNEJBQXNCLEVBQWMsRUFBWSxVQUFpQyxFQUFZLFVBQWlDLEVBQVksTUFBeUIsRUFBWSxTQUF1QixFQUFZLGVBQXlDO1FBQXJPLE9BQUUsR0FBRixFQUFFLENBQVk7UUFBWSxlQUFVLEdBQVYsVUFBVSxDQUF1QjtRQUFZLGVBQVUsR0FBVixVQUFVLENBQXVCO1FBQVksV0FBTSxHQUFOLE1BQU0sQ0FBbUI7UUFBWSxjQUFTLEdBQVQsU0FBUyxDQUFjO1FBQVksb0JBQWUsR0FBZixlQUFlLENBQTBCO1FBakNwUCxTQUFJLEdBQVcsU0FBUyxDQUFDO1FBU3pCLGdCQUFXLEdBQVcsRUFBRSxDQUFDO1FBR3pCLFVBQUssR0FBRyxJQUFJLFlBQVksRUFBUSxDQUFDO1FBR2pDLFNBQUksR0FBRyxJQUFJ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cUJBQXFCO2dCQUFvQixpQkFBaUI7Z0JBQXVCLFlBQVk7Z0JBQTZCLHdCQUF3Qjs7SUFqQzNQO1FBREMsS0FBSyxFQUFFO29EQUN3QjtJQUdoQztRQURDLEtBQUssRUFBRTttREFDVztJQUduQjtRQURDLEtBQUssRUFBRTsyREFDbUI7SUFHM0I7UUFEQyxLQUFLLEVBQUU7MkRBQ3dCO0lBR2hDO1FBREMsTUFBTSxFQUFFO3FEQUMrQjtJQUd4QztRQURDLE1BQU0sRUFBRTtvREFDOEI7SUFNdkM7UUFKQyxTQUFTLENBQUMsVUFBVSxFQUFFO1lBQ3JCLElBQUksRUFBRSxnQkFBZ0I7WUFDdEIsTUFBTSxFQUFFLElBQUk7U0FDYixDQUFDO2dFQUNnQztJQXhCdkIsa0JBQWtCO1FBdEQ5QixTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsWUFBWTtZQUN0QixRQUFRLEVBQUUscWdCQWFUO1lBbUNELFNBQVMsRUFBRTtnQkFDVCxFQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxXQUFXLEVBQUUsb0JBQWtCLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBQzthQUMzRTtxQkFwQ1EsK3lCQWlDUjtTQUlGLENBQUM7T0FDVyxrQkFBa0IsQ0EyWTlCO0lBQUQseUJBQUM7Q0FBQSxBQTNZRCxJQTJZQztTQTNZWSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPdXRwdXQsIFZpZXdDaGlsZCwgRWxlbWVudFJlZiwgVmlld1JlZiwgVmlld0NvbnRhaW5lclJlZiwgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBPbkluaXQsIE9uQ2hhbmdlcywgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95LCBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5HX1ZBTFVFX0FDQ0VTU09SLCBDb250cm9sVmFsdWVBY2Nlc3NvciB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IERvbVNhbml0aXplciwgU2FmZUh0bWwgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcblxuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IEZhdGVDb250cm9sbGVyU2VydmljZSB9IGZyb20gJy4uL2ZhdGUtY29udHJvbGxlci5zZXJ2aWNlJztcbmltcG9ydCB7IEZhdGVIdG1sUGFyc2VyU2VydmljZSB9IGZyb20gJy4uL2ZhdGUtaHRtbC1wYXJzZXIuc2VydmljZSc7XG5pbXBvcnQgeyBGYXRlUGFyc2VyU2VydmljZSB9IGZyb20gJy4uL2ZhdGUtcGFyc2VyLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdmYXRlLWlucHV0JyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGNsYXNzPVwiZmF0ZS1pbmxpbmUtZHJvcGRvd25cIlxuICAgICAgICAgW2NsYXNzLmhpZGRlbl09XCIhaW5saW5lQWN0aW9uXCJcbiAgICAgICAgIFtjbGFzcy5jb250ZXh0dWFsXT1cImlubGluZUFjdGlvbj8uZGlzcGxheSA9PT0gJ2NvbnRleHR1YWwnXCJcbiAgICAgICAgIFtzdHlsZS50b3BdPVwiZHJvcGRvd25Qb3N0aW9uVG9wXCJcbiAgICAgICAgIFtzdHlsZS5sZWZ0XT1cImRyb3Bkb3duUG9zdGlvbkxlZnRcIj5cbiAgICAgIDxuZy10ZW1wbGF0ZSAjZHJvcGRvd24+PC9uZy10ZW1wbGF0ZT5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IFtjbGFzc109XCInZmF0ZS1lZGl0LXRhcmdldCAnICsgY3VzdG9tQ2xhc3NcIlxuICAgICAgICAgW25nQ2xhc3NdPVwie2VtcHR5OiBlbXB0eX1cIlxuICAgICAgICAgY29udGVudGVkaXRhYmxlPVwidHJ1ZVwiXG4gICAgICAgICBbdGl0bGVdPVwicGxhY2Vob2xkZXJcIlxuICAgICAgICAgW2lubmVySHRtbF09XCJjb250ZW50XCI+PC9kaXY+XG4gIGAsXG4gIHN0eWxlczogW2BcbiAgICA6aG9zdCBkaXYuZmF0ZS1lZGl0LXRhcmdldCB7XG4gICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgIHBhZGRpbmc6IDEwcHg7XG4gICAgICBib3JkZXI6IDFweCBzb2xpZCAjREREO1xuICAgICAgb3V0bGluZTogMDtcbiAgICAgIHJlc2l6ZTogdmVydGljYWw7XG4gICAgICBvdmVyZmxvdzogYXV0bztcbiAgICAgIGJhY2tncm91bmQ6ICNGRkY7XG4gICAgICBjb2xvcjogIzAwMDtcbiAgICAgIG92ZXJmbG93OiB2aXNpYmxlO1xuICAgIH1cbiAgICA6aG9zdCBkaXYuZmF0ZS1lZGl0LXRhcmdldC5lbXB0eTpub3QoOmZvY3VzKTpiZWZvcmUge1xuICAgICAgY29udGVudDphdHRyKHRpdGxlKTtcbiAgICAgIGNvbG9yOiAjNjM2YzcyO1xuICAgIH1cbiAgICAuZmF0ZS1pbmxpbmUtZHJvcGRvd24ge1xuICAgICAgYm9yZGVyOiAxcHggc29saWQgI0RERDtcbiAgICAgIGJvcmRlci1ib3R0b206IDA7XG4gICAgfVxuICAgIC5mYXRlLWlubGluZS1kcm9wZG93bi5oaWRkZW4ge1xuICAgICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICAgIH1cbiAgICAuZmF0ZS1pbmxpbmUtZHJvcGRvd24uY29udGV4dHVhbCB7XG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICBiYWNrZ3JvdW5kOiAjRkZGO1xuICAgICAgYm94LXNoYWRvdzogMCA1cHggMzBweCAtMTBweCByZ2JhKDAsMCwwLDAuNCk7XG4gICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI0NDQztcbiAgICB9XG4gICAgOmhvc3Qge1xuICAgICAgbWFyZ2luLWJvdHRvbTogMTBweDtcbiAgICAgIC8qcG9zaXRpb246IHJlbGF0aXZlOyovXG4gICAgfVxuICBgXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAge3Byb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLCB1c2VFeGlzdGluZzogRmF0ZUlucHV0Q29tcG9uZW50LCBtdWx0aTogdHJ1ZX1cbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgRmF0ZUlucHV0Q29tcG9uZW50IGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE9uQ2hhbmdlcywgT25Jbml0LCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyB1aUlkOiBzdHJpbmcgPSAnZGVmYXVsdCc7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHJvdzogbnVtYmVyO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBjdXN0b21DbGFzczogc3RyaW5nO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBwbGFjZWhvbGRlcjogc3RyaW5nID0gJyc7XG5cbiAgQE91dHB1dCgpXG4gIHB1YmxpYyBmb2N1cyA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICBAT3V0cHV0KClcbiAgcHVibGljIGJsdXIgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgQFZpZXdDaGlsZCgnZHJvcGRvd24nLCB7XG4gICAgcmVhZDogVmlld0NvbnRhaW5lclJlZixcbiAgICBzdGF0aWM6IHRydWUsXG4gIH0pXG4gIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWZcbiAgcHJvdGVjdGVkIGRyb3Bkb3duQ29tcG9uZW50OiBWaWV3UmVmO1xuICBwcm90ZWN0ZWQgZHJvcGRvd25JbnN0YW5jZTogYW55O1xuICBwdWJsaWMgZHJvcGRvd25Qb3N0aW9uVG9wOiBzdHJpbmc7XG4gIHB1YmxpYyBkcm9wZG93blBvc3Rpb25MZWZ0OiBzdHJpbmc7XG4gIHB1YmxpYyBpbmxpbmVBY3Rpb246IGFueTtcblxuICBwdWJsaWMgY29udGVudDogU2FmZUh0bWw7XG4gIHB1YmxpYyBlbXB0eTogYm9vbGVhbiA9IHRydWU7XG4gIHByb3RlY3RlZCBlZGl0VGFyZ2V0OiBhbnk7XG4gIHByb3RlY3RlZCBpc0ZvY3VzZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgZWw6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCBjb250cm9sbGVyOiBGYXRlQ29udHJvbGxlclNlcnZpY2UsIHByb3RlY3RlZCBodG1sUGFyc2VyOiBGYXRlSHRtbFBhcnNlclNlcnZpY2UsIHByb3RlY3RlZCBwYXJzZXI6IEZhdGVQYXJzZXJTZXJ2aWNlLCBwcm90ZWN0ZWQgc2FuaXRpemVyOiBEb21TYW5pdGl6ZXIsIHByb3RlY3RlZCBmYWN0b3J5UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcikge31cblxuICBwcml2YXRlIHJlYWN0VG9DaGFuZ2VzKCkge1xuICAgIGNvbnN0IHRyZWUgPSB0aGlzLmh0bWxQYXJzZXIucGFyc2VFbGVtZW50KHRoaXMuZWRpdFRhcmdldCk7XG4gICAgY29uc3Qgc2VyaWFsaXplZFRyZWUgPSB0aGlzLnBhcnNlci5zZXJpYWxpemUodHJlZSk7XG4gICAgdGhpcy5jaGFuZ2VkLmZvckVhY2goZiA9PiBmKHNlcmlhbGl6ZWRUcmVlKSk7XG4gIH1cblxuICBwdWJsaWMgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5zdWJzY3JpYmVUb1VpKHRoaXMudWlJZCk7XG4gIH1cblxuICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuZWRpdFRhcmdldCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZmF0ZS1lZGl0LXRhcmdldCcpO1xuICAgIGlmICh0aGlzLnJvdykge1xuICAgICAgdGhpcy5jb21wdXRlSGVpZ2h0KCk7XG4gICAgfVxuXG4gICAgdGhpcy5lZGl0VGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50OiBhbnkpwqA9PiB7XG4gICAgICBjb25zb2xlLmRlYnVnKCdjbGljaycpO1xuICAgICAgLy8gT24gY2xpY2sgd2Ugc2F2ZSB0aGUgdGV4dCBTZWxlY3Rpb25cbiAgICAgIHRoaXMuc2F2ZVNlbGVjdGlvbigpO1xuICAgICAgLy8gV2UgY2hlY2sgaWYgdGhlcmUgaXMgYSBkcm9wZG93biBtYXRjaGluZyB0aGlzIGNvbnRleHRcbiAgICAgIHRoaXMuY2hlY2tGb3JEcm9wZG93bkNvbnRleHQoKTtcbiAgICB9KTtcblxuICAgIHRoaXMuZWRpdFRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChldmVudDogYW55KcKgPT4ge1xuICAgICAgY29uc29sZS5kZWJ1Zygna2V5cHJlc3NlZCcpO1xuICAgICAgLy8gT24gY2xpY2sgd2Ugc2F2ZSB0aGUgdGV4dCBTZWxlY3Rpb25cbiAgICAgIHRoaXMuc2F2ZVNlbGVjdGlvbigpO1xuICAgICAgLy8gV2UgY2hlY2sgaWYgdGhlcmUgaXMgYSBkcm9wZG93biBtYXRjaGluZyB0aGlzIGNvbnRleHRcbiAgICAgIHRoaXMuY2hlY2tGb3JEcm9wZG93bkNvbnRleHQoKTtcbiAgICB9KTtcblxuICAgIHRoaXMuZWRpdFRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIChldmVudDogYW55KcKgPT4ge1xuICAgICAgY29uc29sZS5kZWJ1ZygnKCcgKyB0aGlzLnVpSWQgKyAnKSBmb2N1cycpO1xuICAgICAgLy8gT24gZm9jdXMgd2UgcmVzdG9yZSBpdFxuICAgICAgdGhpcy5yZXN0b3JlU2VsZWN0aW9uKCk7XG4gICAgICB0aGlzLmlzRm9jdXNlZCA9IHRydWU7XG4gICAgICB0aGlzLmZvY3VzLmVtaXQoKTtcbiAgICB9KTtcbiAgICB0aGlzLmVkaXRUYXJnZXQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIChldmVudDogYW55KcKgPT4ge1xuICAgICAgY29uc29sZS5kZWJ1ZygnKCcgKyB0aGlzLnVpSWQgKyAnKSBibHVyJyk7XG4gICAgICB0aGlzLmlzRm9jdXNlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5ibHVyLmVtaXQoKTtcbiAgICAgIHRoaXMuc2F2ZVNlbGVjdGlvbigpO1xuXG4gICAgICBpZiAodGhpcy5kcm9wZG93bkNvbXBvbmVudCkge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLmlubGluZUFjdGlvbiA9IG51bGw7XG4gICAgICAgICAgdGhpcy5kcm9wZG93bkNvbXBvbmVudC5kZXN0cm95KCk7XG4gICAgICAgIH0sIDMwMCk7XG4gICAgICAgIC8vIHRoaXMuaW5saW5lQWN0aW9uID0gbnVsbDtcbiAgICAgICAgLy8gdGhpcy5kcm9wZG93bkNvbXBvbmVudC5kZXN0cm95KCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLmVkaXRUYXJnZXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudDogYW55KcKgPT4ge1xuICAgICAgY29uc29sZS5kZWJ1Zygna2V5ZG93bicsIGV2ZW50KTtcbiAgICAgIGNvbnN0IHN0b3BEZWZhdWx0ID0gKCkgPT4ge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHN0b3BEZWZhdWx0QW5kRm9yY2VVcGRhdGUgPSAoKSA9PiB7XG4gICAgICAgIHN0b3BEZWZhdWx0KCk7XG4gICAgICAgIHRoaXMuY2hlY2tFbXB0eSgpO1xuICAgICAgICB0aGlzLnJlYWN0VG9DaGFuZ2VzKCk7XG4gICAgICB9XG4gICAgICAvLyBUaGlzIGlzIG5lZWRlZCBiZWNhdXNlLCBpZiB0aGUgY3VycmVudCBzZWxlY3Rpb24gaXMgcGFydFxuICAgICAgLy8gb2YgYSBub24tZWRpdGFibGUgY2hpbGQgb2YgdGhlIGlucHV0LCB0aGUgZGVmYXVsdCBkZWxldGUgd29uJ3RcbiAgICAgIC8vIHdvcmsuXG4gICAgICAvLyBUaGlzIGNhc2UgY2FuIGhhcHBlbiBpZiB0aGVyZSBpcyBhIGN1dG9tIGVsZW1lbnQgdGhhdFxuICAgICAgLy8gd2FzIGluc2VydGVkIGJ5IHNvbWUgY3VzdG9tIGNvbnRyb2xsZXIuXG4gICAgICAvL1xuICAgICAgLy8gU29tZSBjb25zdHJhaW50cyBmb3IgYSBjdXN0b20gYmxvY2sgdG8gd29yayBvbiB0b3Agb2YgY29udGVudGVkaXRhYmxlPWZhbHNlOlxuICAgICAgLy8gLW1vei11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAgIC8vIC13ZWJraXQtdXNlci1tb2RpZnk6IHJlYWQtb25seTtcbiAgICAgIC8vXG4gICAgICAvLyBOb3RlOiBJdCBtYXkgbWFrZSBzZW5zZSB0byBkZWxldGUgdGhlIHNlbGVjdGlvbiBmb3Igbm9ybWFsIHRleHRcbiAgICAgIC8vIGlucHV0IHRvbyBidXQgZm9yIG5vdyB3ZSBvbmx5IGRvIGl0IG9uIGRlbGV0aW9uLlxuICAgICAgaWYgKGV2ZW50LmtleSA9PT0gJ0JhY2tzcGFjZScgfHwgZXZlbnQua2V5ID09PSAnRGVsZXRlJyAmJiB0aGlzLnNlbGVjdGlvblJhbmdlKSB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLnNlbGVjdGlvblJhbmdlLmNvbW1vbkFuY2VzdG9yQ29udGFpbmVyO1xuICAgICAgICBjb25zb2xlLmRlYnVnKCdEZWxldGlvbicsIG5vZGUpO1xuICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmICEobm9kZSBhcyBIVE1MRWxlbWVudCkuaXNDb250ZW50RWRpdGFibGUpIHtcbiAgICAgICAgICAvLyB0aGlzIGlzIHRoZSBjYXNlIG9uIGZpcmVmb3hcbiAgICAgICAgICBjb25zb2xlLmRlYnVnKCdkZWxldGluZyBpbnNpZGUgdW4tZWRpdGFibGUgYmxvY2sgZGV0ZWN0ZWQnKTtcbiAgICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLnNlbGVjdE5vZGUobm9kZSk7XG4gICAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5kZWxldGVDb250ZW50cygpO1xuICAgICAgICAgIHN0b3BEZWZhdWx0QW5kRm9yY2VVcGRhdGUoKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlLm5vZGVOYW1lID09PSAnI3RleHQnICYmICFub2RlLnBhcmVudEVsZW1lbnQuaXNDb250ZW50RWRpdGFibGUpIHtcbiAgICAgICAgICAvLyB0aGlzIGlzIHRoZSBjYXNlIG9uIHdlYmtpdFxuICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ2RlbGV0aW5nIGluc2lkZSB1bi1lZGl0YWJsZSBibG9jayBkZXRlY3RlZCcpO1xuICAgICAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2Uuc2VsZWN0Tm9kZShub2RlLnBhcmVudEVsZW1lbnQpO1xuICAgICAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2UuZGVsZXRlQ29udGVudHMoKTtcbiAgICAgICAgICBzdG9wRGVmYXVsdEFuZEZvcmNlVXBkYXRlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIFRoaXMgaXMgbmVlZGVkIGJlY2F1c2UsIHRoZXJlIGlzIGEgYnVnIGluIEZpcmVmb3ggdGhhdCBwcmV2ZW50XG4gICAgICAvLyBkZWxldGluZyBhIHVuZWRpdGFibGUgZWxlbWVudCBpbnNpZGUgYW4gZWRpdGFibGUgZWxlbWVudC4gU28gd2VcbiAgICAgIC8vIHJlaW1wbGVtZW50IHRoZSB3aG9sZSBmdW5jdGlvbiBmb3IgYWxsIGJyb3dzZXJzLlxuICAgICAgaWYgKGV2ZW50LmtleSA9PT0gJ0JhY2tzcGFjZScgJiYgdGhpcy5zZWxlY3Rpb25SYW5nZSkge1xuICAgICAgICBjb25zdCBub2RlID0gdGhpcy5zZWxlY3Rpb25SYW5nZS5jb21tb25BbmNlc3RvckNvbnRhaW5lcjtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uUmFuZ2UuY29sbGFwc2VkID09PSB0cnVlICYmXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLnN0YXJ0T2Zmc2V0ID09PSAwICYmXG4gICAgICAgICAgICBub2RlLnByZXZpb3VzU2libGluZyBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmXG4gICAgICAgICAgICAhKG5vZGUucHJldmlvdXNTaWJsaW5nIGFzIEhUTUxFbGVtZW50KS5pc0NvbnRlbnRFZGl0YWJsZSApIHtcbiAgICAgICAgICBub2RlLnByZXZpb3VzU2libGluZy5yZW1vdmUoKTtcbiAgICAgICAgICBzdG9wRGVmYXVsdEFuZEZvcmNlVXBkYXRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoZXZlbnQua2V5ID09PSAnRGVsZXRlJyAmJiB0aGlzLnNlbGVjdGlvblJhbmdlKSB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLnNlbGVjdGlvblJhbmdlLmNvbW1vbkFuY2VzdG9yQ29udGFpbmVyO1xuICAgICAgICBpZiAodGhpcy5zZWxlY3Rpb25SYW5nZS5jb2xsYXBzZWQgPT09IHRydWUgJiZcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2UuZW5kQ29udGFpbmVyLm5vZGVOYW1lID09PSAnI3RleHQnICYmXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLmVuZE9mZnNldCA9PT0gKHRoaXMuc2VsZWN0aW9uUmFuZ2UuZW5kQ29udGFpbmVyIGFzIFRleHQpLmxlbmd0aCAmJlxuICAgICAgICAgICAgbm9kZS5uZXh0U2libGluZyBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmXG4gICAgICAgICAgICAhKG5vZGUubmV4dFNpYmxpbmcgYXMgSFRNTEVsZW1lbnQpLmlzQ29udGVudEVkaXRhYmxlICkge1xuICAgICAgICAgIG5vZGUubmV4dFNpYmxpbmcucmVtb3ZlKCk7XG4gICAgICAgICAgc3RvcERlZmF1bHRBbmRGb3JjZVVwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBJZiBhIGRyb3Bkb3duIGlzIGN1cnJlbnRseSBiZWluZyBkaXNwbGF5ZWQgd2UgdXNlIHRoZSB1cC9kb3duXG4gICAgICAvLyBrZXkgdG8gbmF2aWdhdGUgaXRzIGNvbnRlbnQgYW5kIHJldHVybiB0byBzZWxlY3QgdGhlIHNlbGVjdGVkXG4gICAgICAvLyBlbGVtZW50XG4gICAgICBpZiAodGhpcy5pbmxpbmVBY3Rpb24pIHtcbiAgICAgICAgaWYgKGV2ZW50LmtleSA9PT0gJ1VwJyB8fCBldmVudC5rZXkgPT09ICdBcnJvd1VwJykge1xuICAgICAgICAgIHN0b3BEZWZhdWx0KCk7XG4gICAgICAgICAgdGhpcy5kcm9wZG93bkluc3RhbmNlLnNlbGVjUHJldmlvdXMoKTtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudC5rZXkgPT09ICdEb3duJyB8fCBldmVudC5rZXkgPT09ICdBcnJvd0Rvd24nKSB7XG4gICAgICAgICAgc3RvcERlZmF1bHQoKTtcbiAgICAgICAgICB0aGlzLmRyb3Bkb3duSW5zdGFuY2Uuc2VsZWN0TmV4dCgpO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmtleSA9PT0gJ0VudGVyJykge1xuICAgICAgICAgIHN0b3BEZWZhdWx0KCk7XG4gICAgICAgICAgdGhpcy5kcm9wZG93bkluc3RhbmNlLmNvbmZpcm1TZWxlY3Rpb24oKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5lZGl0VGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGV2ZW50OiBhbnkpwqA9PiB7XG4gICAgICBjb25zb2xlLmRlYnVnKCd2YWx1ZSBjaGFuZ2VkJyk7XG4gICAgICB0aGlzLmNoZWNrRW1wdHkoKTtcbiAgICAgIHRoaXMucmVhY3RUb0NoYW5nZXMoKTtcbiAgICB9KTtcbiAgICBjb25zdCBzdHlsZTogYW55ID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5lZGl0VGFyZ2V0KTtcbiAgICB0aGlzLmVkaXRUYXJnZXQuc3R5bGUubWluSGVpZ2h0ID0gdGhpcy5nZXRIZWlnaHQoMik7XG4gIH1cblxuICBwdWJsaWMgbmdPbkNoYW5nZXMoY2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzWyd1aUlkJ10pIHtcbiAgICAgIHRoaXMuc3Vic2NyaWJlVG9VaSh0aGlzLnVpSWQpO1xuICAgIH1cbiAgICBpZiAoY2hhbmdlc1sncm93J10pIHtcbiAgICAgIGlmICh0aGlzLmVkaXRUYXJnZXQpIHtcbiAgICAgICAgdGhpcy5jb21wdXRlSGVpZ2h0KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLnVpU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnVpU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGNvbXB1dGVIZWlnaHQoKSB7XG4gICAgdGhpcy5lZGl0VGFyZ2V0LnN0eWxlLmhlaWdodCA9IHRoaXMuZ2V0SGVpZ2h0KHRoaXMucm93KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBjaGVja0VtcHR5KCkge1xuICAgIGlmICh0aGlzLmVkaXRUYXJnZXQuaW5uZXJIVE1MID09PSAnJykge1xuICAgICAgdGhpcy5lZGl0VGFyZ2V0LmlubmVySFRNTCA9ICc8YnI+JztcbiAgICAgIHRoaXMuZW1wdHkgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5lZGl0VGFyZ2V0LmlubmVySFRNTCA9PT0gJzxicj4nKSB7XG4gICAgICB0aGlzLmVtcHR5ID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbXB0eSA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRIZWlnaHQocm93Q291bnQpIHtcbiAgICBjb25zdCBzdHlsZTogYW55ID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5lZGl0VGFyZ2V0KTtcbiAgICBsZXQgaGVpZ2h0ID0gdGhpcy5lZGl0VGFyZ2V0LnN0eWxlLmhlaWdodCA9IChwYXJzZUludChzdHlsZS5saW5lSGVpZ2h0LCAxMCkgKiByb3dDb3VudCk7XG4gICAgaWYgKHN0eWxlLmJveFNpemluZyA9PT0gJ2JvcmRlci1ib3gnKSB7XG4gICAgICBoZWlnaHQgKz0gcGFyc2VJbnQoc3R5bGUucGFkZGluZ1RvcCwgMTApICsgcGFyc2VJbnQoc3R5bGUucGFkZGluZ0JvdHRvbSwgMTApICsgcGFyc2VJbnQoc3R5bGUuYm9yZGVyVG9wV2lkdGgsIDEwKSArIHBhcnNlSW50KHN0eWxlLmJvcmRlckJvdHRvbVdpZHRoLCAxMCk7XG4gICAgfVxuICAgIHJldHVybiBoZWlnaHQgKyAncHgnO1xuICB9XG5cbiAgcHJvdGVjdGVkIHVpU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByb3RlY3RlZCBzdWJzY3JpYmVUb1VpKHVpSWQpIHtcbiAgICBjb25zb2xlLmRlYnVnKCdzdWJzY3JpYmluZyB0byAnICsgdWlJZCwgdGhpcy51aVN1YnNjcmlwdGlvbik7XG4gICAgaWYgKHRoaXMudWlTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMudWlTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgdGhpcy51aVN1YnNjcmlwdGlvbiA9IHRoaXMuY29udHJvbGxlci5jaGFubmVsKHVpSWQpLnN1YnNjcmliZSgoY29tbWFuZCkgPT4ge1xuICAgICAgLy8gaWYgaW5wdXQgaXMgbm90IG9uIGZvY3VzIHdlIHNhdmUgY3VycmVudCBmb2N1czpcbiAgICAgIGNvbnN0IGZvY3VzID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICAgIGNvbnNvbGUuZGVidWcoJygnICsgdWlJZCArICcpIGdvdCBjb21tYW5kICcgKyBjb21tYW5kLm5hbWUgKyAnLycgKyBjb21tYW5kLnZhbHVlKTtcblxuICAgICAgdGhpcy5yZXN0b3JlU2VsZWN0aW9uKCk7XG4gICAgICBpZiAoY29tbWFuZC5uYW1lID09PSAnaW5zZXJ0SFRNTCcgJiYgdGhpcy5zZWxlY3Rpb25SYW5nZSkge1xuICAgICAgICAvLyBJZiBzb21ldGhpbmcgaXMgc2VsZWN0ZWQgd2UgYXNzdW1lIHRoYXQgdGhlIGdvYWwgaXMgdG8gcmVwbGFjZSBpdCxcbiAgICAgICAgLy8gc28gZmlyc3Qgd2UgZGVsZXRlIHRoZSBjb250ZW50XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2UuZGVsZXRlQ29udGVudHMoKTtcbiAgICAgICAgLy8gaW5zZXJ0SHRtbCBzZWVtcyBxdWl0ZSBicm9rZW4gc28gd2UgZG8gaXQgb3Vyc2VsZXZlc1xuICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLmluc2VydE5vZGUoZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoY29tbWFuZC52YWx1ZSkpO1xuICAgICAgICAvLyBtb3ZlIGN1c29yIHRvIHRoZSBlbmQgb2YgdGhlIG5ld2x5IGluc2VydGVkIGVsZW1lbnRcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5jb2xsYXBzZShmYWxzZSk7XG4gICAgICAgIC8vIEZvcmNlIHRoZSB1cGRhdGUgb2YgdGhlIG1vZGVsXG4gICAgICAgIHRoaXMuY2hlY2tFbXB0eSgpO1xuICAgICAgICB0aGlzLnJlYWN0VG9DaGFuZ2VzKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkb2N1bWVudC5leGVjQ29tbWFuZChjb21tYW5kLm5hbWUsIGZhbHNlLCBjb21tYW5kLnZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2F2ZVNlbGVjdGlvbigpO1xuICAgICAgKGZvY3VzIGFzIGFueSkuZm9jdXMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIFNhdmVzIHRoZSBjdXJyZW50IHRleHQgc2VsZWN0aW9uXG4gIHByb3RlY3RlZCBzZWxlY3Rpb25SYW5nZTogUmFuZ2U7XG4gIHByb3RlY3RlZCBzYXZlU2VsZWN0aW9uKCkge1xuICAgIGlmICh0aGlzLnNlbGVjdGlvbkluRWRpdGFibGVUYXJnZXQoKSkge1xuICAgICAgY29uc3Qgc2VsID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xuICAgICAgaWYgKHNlbC5nZXRSYW5nZUF0ICYmIHNlbC5yYW5nZUNvdW50KSB7XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2UgPSBzZWwuZ2V0UmFuZ2VBdCgwKTtcbiAgICAgICAgY29uc29sZS5kZWJ1ZygnKCcgKyB0aGlzLnVpSWQgKyAnKSBzYXZlU2VsZWN0aW9uJywgdGhpcy5zZWxlY3Rpb25SYW5nZSk7XG4gICAgICAgIHRoaXMuZGV0ZWN0U3R5bGUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLy8gUmVzdG9ycyB0aGUgY3VycmVudCB0ZXh0IHNlbGVjdGlvblxuICBwcm90ZWN0ZWQgcmVzdG9yZVNlbGVjdGlvbigpIHtcbiAgICBpZiAodGhpcy5zZWxlY3Rpb25JbkVkaXRhYmxlVGFyZ2V0KCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc29sZS5kZWJ1ZygnKCcgKyB0aGlzLnVpSWQgKyAnKSByZXN0b3JlU2VsZWN0aW9uJywgdGhpcy5zZWxlY3Rpb25SYW5nZSk7XG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uUmFuZ2UpIHtcbiAgICAgIGNvbnN0IHNlbCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcbiAgICAgIHNlbC5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICAgIHNlbC5hZGRSYW5nZSh0aGlzLnNlbGVjdGlvblJhbmdlKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgc2VsZWN0aW9uSW5FZGl0YWJsZVRhcmdldCgpIHtcbiAgICBjb25zdCBzZWwgPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk7XG4gICAgY29uc3Qgbm9kZSA9IHNlbC5nZXRSYW5nZUF0ICYmIHNlbC5yYW5nZUNvdW50ICYmIHNlbC5nZXRSYW5nZUF0KDApICYmIHNlbC5nZXRSYW5nZUF0KDApLmNvbW1vbkFuY2VzdG9yQ29udGFpbmVyO1xuICAgIHJldHVybiBub2RlICYmIChub2RlID09PSB0aGlzLmVkaXRUYXJnZXQgfHwgKG5vZGUucGFyZW50RWxlbWVudC5jbG9zZXN0KCcuZmF0ZS1lZGl0LXRhcmdldCcpICYmIChub2RlLnBhcmVudEVsZW1lbnQuY2xvc2VzdCgnLmZhdGUtZWRpdC10YXJnZXQnKSA9PT0gdGhpcy5lZGl0VGFyZ2V0KSkpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGRldGVjdFN0eWxlKCkge1xuICAgIGxldCBub2RlID0gdGhpcy5zZWxlY3Rpb25SYW5nZS5jb21tb25BbmNlc3RvckNvbnRhaW5lcjtcbiAgICBpZiAoIW5vZGUgfHwgKCEobm9kZS5wYXJlbnRFbGVtZW50LmNsb3Nlc3QoJy5mYXRlLWVkaXQtdGFyZ2V0JykgJiYgbm9kZSAhPT0gdGhpcy5lZGl0VGFyZ2V0KSkpwqB7XG4gICAgICAvLyBUaGUgY3VycmVudCBzZWxlY3Rpb24gaXMgbm90IGNvbnRhaW5lZCBpbiB0aGUgZWRpdGFibGUgem9uZS5cbiAgICAgIC8vIHRoaXMgaXMgbW9zdCBsaWtlbHkgZHVlIHRvIHRoZSBpbnB1dCBiZWluZyBlbXB0eS5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gc3BlY2lhbCBjYXNlcyBmb3IgRkYgd2hlbiBzZWxlY3Rpb24gaXMgb2J0YWluZWQgYnkgZG91YmxlIGNsaWNrOlxuICAgIGlmICgodGhpcy5zZWxlY3Rpb25SYW5nZS5lbmRPZmZzZXQgPT09IDApICYmXG4gICAgICAgICh0aGlzLnNlbGVjdGlvblJhbmdlLnN0YXJ0Q29udGFpbmVyLm5vZGVWYWx1ZSkgJiZcbiAgICAgICAgKHRoaXMuc2VsZWN0aW9uUmFuZ2Uuc3RhcnRPZmZzZXQgPT09IHRoaXMuc2VsZWN0aW9uUmFuZ2Uuc3RhcnRDb250YWluZXIubm9kZVZhbHVlLmxlbmd0aCkpIHtcbiAgICAgIG5vZGUgPSB0aGlzLnNlbGVjdGlvblJhbmdlLnN0YXJ0Q29udGFpbmVyLm5leHRTaWJsaW5nO1xuICAgIH0gZWxzZSBpZiAoKHRoaXMuc2VsZWN0aW9uUmFuZ2UuZW5kT2Zmc2V0ID09PSAwKSAmJlxuICAgICAgICAodGhpcy5zZWxlY3Rpb25SYW5nZS5zdGFydE9mZnNldCA9PT0gMCkpIHtcbiAgICAgIG5vZGUgPSB0aGlzLnNlbGVjdGlvblJhbmdlLnN0YXJ0Q29udGFpbmVyLnBhcmVudEVsZW1lbnQ7XG4gICAgfSBlbHNlIGlmICgodGhpcy5zZWxlY3Rpb25SYW5nZS5jb21tb25BbmNlc3RvckNvbnRhaW5lciA9PT0gdGhpcy5lZGl0VGFyZ2V0KSAmJlxuICAgICAgICAgICAgICAgKHRoaXMuc2VsZWN0aW9uUmFuZ2Uuc3RhcnRDb250YWluZXIgPT09IHRoaXMuZWRpdFRhcmdldCkgJiZcbiAgICAgICAgICAgICAgICh0aGlzLnNlbGVjdGlvblJhbmdlLmVuZENvbnRhaW5lciA9PT0gdGhpcy5lZGl0VGFyZ2V0KSkge1xuICAgICAgbm9kZSA9IHRoaXMuc2VsZWN0aW9uUmFuZ2UuY29tbW9uQW5jZXN0b3JDb250YWluZXIuY2hpbGROb2Rlc1t0aGlzLnNlbGVjdGlvblJhbmdlLnN0YXJ0T2Zmc2V0XTtcbiAgICB9XG4gICAgaWYgKG5vZGUgJiYgbm9kZSAhPT0gdGhpcy5lZGl0VGFyZ2V0KSB7XG4gICAgICBjb25zdCBub2RlcyA9IHRoaXMuaHRtbFBhcnNlci5maW5kUGFyZW50Tm9kZXMobm9kZSwgdGhpcy5lZGl0VGFyZ2V0KTtcbiAgICAgIGNvbnNvbGUuZGVidWcoJyAgLT4gZGV0ZWN0ZWQgYWN0aW9uczogJywgbm9kZXMpO1xuICAgICAgdGhpcy5jb250cm9sbGVyLmVuYWJsZUFjdGlvbnModGhpcy51aUlkLCBub2Rlcyk7XG4gICAgfVxuICB9XG5cbiAgLy8gaW1wbGVudGF0aW9uIG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yOlxuICBwcm90ZWN0ZWQgY2hhbmdlZCA9IG5ldyBBcnJheTwodmFsdWU6IHN0cmluZykgPT4gdm9pZD4oKTtcblxuICBwdWJsaWMgd3JpdGVWYWx1ZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLmNvbnRlbnQgPSB0aGlzLnNhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0SHRtbCh0aGlzLmh0bWxQYXJzZXIuc2VyaWFsaXplKHRoaXMucGFyc2VyLnBhcnNlKHZhbHVlKSkpO1xuICAgICAgdGhpcy5lbXB0eSA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNvbnRlbnQgPSB0aGlzLnNhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0SHRtbCgnPGJyPicpO1xuICAgICAgdGhpcy5lbXB0eSA9IHRydWU7XG4gICAgfVxuICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2UgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBzdHJpbmcpID0+IHZvaWQpIHtcbiAgICB0aGlzLmNoYW5nZWQucHVzaChmbik7XG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IHZvaWQpIHt9XG5cbiAgcHJvdGVjdGVkIGNoZWNrRm9yRHJvcGRvd25Db250ZXh0KCkge1xuICAgIGNvbnN0IHN0YXJ0UG9zID0gTWF0aC5tYXgodGhpcy5zZWxlY3Rpb25SYW5nZS5zdGFydE9mZnNldCAtIDIwLCAwKTtcbiAgICBjb25zdCBsZW5ndGggPSB0aGlzLnNlbGVjdGlvblJhbmdlLnN0YXJ0T2Zmc2V0IC0gc3RhcnRQb3M7XG4gICAgY29uc3QgY29udGV4dCA9IHRoaXMuc2VsZWN0aW9uUmFuZ2Uuc3RhcnRDb250YWluZXIudGV4dENvbnRlbnQuc3Vic3RyKHN0YXJ0UG9zLCBsZW5ndGgpO1xuXG4gICAgY29uc3QgaW5saW5lQWN0aW9uID0gdGhpcy5jb250cm9sbGVyLmdldElubGluZUFjdGlvbihjb250ZXh0KTtcbiAgICBpZiAoaW5saW5lQWN0aW9uKSB7XG4gICAgICBpZiAoIXRoaXMuaW5saW5lQWN0aW9uIHx8IHRoaXMuaW5saW5lQWN0aW9uLmRyb3Bkb3duICE9PSBpbmxpbmVBY3Rpb24uZHJvcGRvd24pIHtcbiAgICAgICAgdGhpcy5pbmxpbmVBY3Rpb24gPSBpbmxpbmVBY3Rpb247XG4gICAgICAgIHRoaXMuaW5pdERyb3Bkb3duKGlubGluZUFjdGlvbiwgdGhpcy5zZWxlY3Rpb25SYW5nZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmlubGluZUFjdGlvbiA9IGlubGluZUFjdGlvbjtcbiAgICAgICAgdGhpcy51cGRhdGVEcm9wZG93bihpbmxpbmVBY3Rpb24ubWF0Y2hlZCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0aGlzLmRyb3Bkb3duQ29tcG9uZW50KSB7XG4gICAgICB0aGlzLmlubGluZUFjdGlvbiA9IG51bGw7XG4gICAgICB0aGlzLmRyb3Bkb3duQ29tcG9uZW50LmRlc3Ryb3koKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgaW5pdERyb3Bkb3duKGFjdGlvbkNvbXBvbmVudCwgcG9zaXRpb24pIHtcbiAgICAvLyBzZXQgdGhlIGRyb3Bkb3duIGNvbXBvbmVudFxuICAgIGlmICh0aGlzLmRyb3Bkb3duQ29tcG9uZW50KSB7XG4gICAgICB0aGlzLmRyb3Bkb3duQ29tcG9uZW50LmRlc3Ryb3koKTtcbiAgICB9XG4gICAgY29uc3QgZmFjdG9yeSA9IHRoaXMuZmFjdG9yeVJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KGFjdGlvbkNvbXBvbmVudC5kcm9wZG93bik7XG4gICAgY29uc3QgY29tcG9uZW50OiBhbnkgPSBmYWN0b3J5LmNyZWF0ZSh0aGlzLnZpZXdDb250YWluZXJSZWYucGFyZW50SW5qZWN0b3IpO1xuICAgIGlmIChjb21wb25lbnQuaW5zdGFuY2UudmFsdWVDaGFuZ2UpIHtcbiAgICAgIGNvbXBvbmVudC5pbnN0YW5jZS52YWx1ZSA9IGFjdGlvbkNvbXBvbmVudC5tYXRjaGVkO1xuICAgICAgY29tcG9uZW50Lmluc3RhbmNlLnZhbHVlQ2hhbmdlLnN1YnNjcmliZSgodmFsdWUpID0+IHtcbiAgICAgICAgdGhpcy5lZGl0VGFyZ2V0LmZvY3VzKCk7XG4gICAgICAgIGNvbnN0IGVuZCA9IHRoaXMuc2VsZWN0aW9uUmFuZ2UuZW5kT2Zmc2V0O1xuICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLnNldFN0YXJ0KHRoaXMuc2VsZWN0aW9uUmFuZ2UuZW5kQ29udGFpbmVyLCBlbmQgLSBhY3Rpb25Db21wb25lbnQubWF0Y2hlZC5sZW5ndGgpO1xuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuZG9JbmxpbmUodGhpcy51aUlkLCB0aGlzLmlubGluZUFjdGlvbiwgdmFsdWUpO1xuICAgICAgICAvLyBkZWxldGUgdGhlIGRyb3Bkb3duXG4gICAgICAgIHRoaXMuaW5saW5lQWN0aW9uID0gbnVsbDtcbiAgICAgICAgdGhpcy5kcm9wZG93bkNvbXBvbmVudC5kZXN0cm95KCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuZHJvcGRvd25Db21wb25lbnQgPSB0aGlzLnZpZXdDb250YWluZXJSZWYuaW5zZXJ0KGNvbXBvbmVudC5ob3N0Vmlldyk7XG4gICAgICB0aGlzLmRyb3Bkb3duSW5zdGFuY2UgPSBjb21wb25lbnQuaW5zdGFuY2U7XG4gICAgICB0aGlzLnVwZGF0ZURyb3Bkb3duUG9zaXRpb24oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgY29tcG9uZW50IHVzZWQgYXMgYSBkcm9wZG93biBkb2VzblxcJ3QgY29udGFpbiBhIHZhbHVlQ2hhbmdlIGVtbWl0ZXIhJyk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIHVwZGF0ZURyb3Bkb3duKHZhbHVlKSB7XG4gICAgdGhpcy5kcm9wZG93bkluc3RhbmNlLnZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy51cGRhdGVEcm9wZG93blBvc2l0aW9uKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgdXBkYXRlRHJvcGRvd25Qb3NpdGlvbigpIHtcbiAgICBpZiAodGhpcy5pbmxpbmVBY3Rpb24uZGlzcGxheSA9PT0gJ2NvbnRleHR1YWwnKSB7XG4gICAgICAvLyBjcmVhdGUgYSBzZWxlY3Rpb24gdG8gZ2V0IHRoZSBzaXplIG9mIHRoZSBtYXRjaGluZyB0ZXh0XG4gICAgICBjb25zdCBwYXJlbnRPZmZzZXRCQiA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5vZmZzZXRQYXJlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBjb25zdCByYW5nZSA9IHRoaXMuc2VsZWN0aW9uUmFuZ2UuY2xvbmVSYW5nZSgpO1xuICAgICAgY29uc3QgZW5kID0gcmFuZ2UuZW5kT2Zmc2V0O1xuICAgICAgcmFuZ2Uuc2V0U3RhcnQocmFuZ2UuZW5kQ29udGFpbmVyLCBlbmQgLSB0aGlzLmlubGluZUFjdGlvbi5tYXRjaGVkLmxlbmd0aCk7XG4gICAgICBjb25zdCBib3VuZGluZ0JveCA9IHJhbmdlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgdGhpcy5kcm9wZG93blBvc3Rpb25Ub3AgPSAoYm91bmRpbmdCb3gudG9wICsgYm91bmRpbmdCb3guaGVpZ2h0IC0gcGFyZW50T2Zmc2V0QkIudG9wKSArICdweCc7XG4gICAgICB0aGlzLmRyb3Bkb3duUG9zdGlvbkxlZnQgPSAoYm91bmRpbmdCb3gubGVmdCAtIHBhcmVudE9mZnNldEJCLmxlZnQpICsgJ3B4JztcbiAgICB9XG4gIH1cbn1cbiJdfQ==