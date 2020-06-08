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
        this.initialFocus = false;
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
        this.editTarget.addEventListener('input', function (event) {
            console.debug('value changed');
            _this.checkEmpty();
            _this.reactToChanges();
        });
        var style = window.getComputedStyle(this.editTarget);
        this.editTarget.style.minHeight = this.getHeight(2);
        if (this.initialFocus) {
            this.editTarget.focus();
        }
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
        var height = (this.editTarget.style.height =
            parseInt(style.lineHeight, 10) * rowCount);
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
            template: "\n    <div\n      class=\"fate-inline-dropdown\"\n      [class.hidden]=\"!inlineAction\"\n      [class.contextual]=\"inlineAction?.display === 'contextual'\"\n      [style.top]=\"dropdownPostionTop\"\n      [style.left]=\"dropdownPostionLeft\"\n    >\n      <ng-template #dropdown></ng-template>\n    </div>\n    <div\n      [class]=\"'fate-edit-target ' + customClass\"\n      [ngClass]=\"{ empty: empty }\"\n      contenteditable=\"true\"\n      [title]=\"placeholder\"\n      [innerHtml]=\"content\"\n    ></div>\n  ",
            providers: [
                { provide: NG_VALUE_ACCESSOR, useExisting: FateInputComponent_1, multi: true }
            ],
            styles: ["\n      :host div.fate-edit-target {\n        display: block;\n        padding: 10px;\n        border: 1px solid #ddd;\n        outline: 0;\n        resize: vertical;\n        overflow: auto;\n        background: #fff;\n        color: #000;\n        overflow: visible;\n      }\n      :host div.fate-edit-target.empty:not(:focus):before {\n        content: attr(title);\n        color: #636c72;\n      }\n      .fate-inline-dropdown {\n        border: 1px solid #ddd;\n        border-bottom: 0;\n      }\n      .fate-inline-dropdown.hidden {\n        display: none !important;\n      }\n      .fate-inline-dropdown.contextual {\n        position: absolute;\n        background: #fff;\n        box-shadow: 0 5px 30px -10px rgba(0, 0, 0, 0.4);\n        border-bottom: 1px solid #ccc;\n      }\n      :host {\n        margin-bottom: 10px;\n        /*position: relative;*/\n      }\n    "]
        })
    ], FateInputComponent);
    return FateInputComponent;
}());
export { FateInputComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmF0ZS1pbnB1dC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9mYXRlLWVkaXRvci8iLCJzb3VyY2VzIjpbImFwcC9mYXRlLWlucHV0L2ZhdGUtaW5wdXQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFDTCxNQUFNLEVBQ04sU0FBUyxFQUNULFVBQVUsRUFDVixPQUFPLEVBQ1AsZ0JBQWdCLEVBQ2hCLHdCQUF3QixFQUN4QixNQUFNLEVBQ04sU0FBUyxFQUNULGFBQWEsRUFDYixTQUFTLEVBQ1QsWUFBWSxFQUNiLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxpQkFBaUIsRUFBd0IsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6RSxPQUFPLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBSW5FLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ25FLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQ3BFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBOEQzRDtJQXVDRSw0QkFDWSxFQUFjLEVBQ2QsVUFBaUMsRUFDakMsVUFBaUMsRUFDakMsTUFBeUIsRUFDekIsU0FBdUIsRUFDdkIsZUFBeUM7UUFMekMsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUNkLGVBQVUsR0FBVixVQUFVLENBQXVCO1FBQ2pDLGVBQVUsR0FBVixVQUFVLENBQXVCO1FBQ2pDLFdBQU0sR0FBTixNQUFNLENBQW1CO1FBQ3pCLGNBQVMsR0FBVCxTQUFTLENBQWM7UUFDdkIsb0JBQWUsR0FBZixlQUFlLENBQTBCO1FBMUM5QyxTQUFJLEdBQVcsU0FBUyxDQUFDO1FBU3pCLGdCQUFXLEdBQVcsRUFBRSxDQUFDO1FBR3pCLGlCQUFZLEdBQVksS0FBSyxDQUFDO1FBRzlCLFVBQUssR0FBRyxJQUFJLFlBQVksRUFBUSxDQUFDO1FBR2pDLFNBQUksR0FBRyxJQUFJLFlBQVksRUFBUSxDQUFDO1FBY2hDLFVBQUssR0FBWSxJQUFJLENBQUM7UUFFbkIsY0FBUyxHQUFZLEtBQUssQ0FBQztRQWdWckMsd0NBQXdDO1FBQzlCLFlBQU8sR0FBRyxJQUFJLEtBQUssRUFBMkIsQ0FBQztJQXhVdEQsQ0FBQzsyQkE5Q08sa0JBQWtCO0lBZ0RyQiwyQ0FBYyxHQUF0QjtRQUNFLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMzRCxJQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxjQUFjLENBQUMsRUFBakIsQ0FBaUIsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFTSxxQ0FBUSxHQUFmO1FBQ0UsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVNLDRDQUFlLEdBQXRCO1FBQUEsaUJBc0pDO1FBckpDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDM0UsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ1osSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1NBQ3RCO1FBRUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBQyxLQUFVO1lBQ25ELE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDdkIsc0NBQXNDO1lBQ3RDLEtBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUNyQix3REFBd0Q7WUFDeEQsS0FBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7UUFDakMsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxVQUFDLEtBQVU7WUFDbkQsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUM1QixzQ0FBc0M7WUFDdEMsS0FBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3JCLHdEQUF3RDtZQUN4RCxLQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztRQUNqQyxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQUMsS0FBVTtZQUNuRCxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxLQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQyxDQUFDO1lBQzNDLHlCQUF5QjtZQUN6QixLQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUN4QixLQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztZQUN0QixLQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3BCLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsVUFBQyxLQUFVO1lBQ2xELE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEtBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLENBQUM7WUFDMUMsS0FBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7WUFDdkIsS0FBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNqQixLQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFFckIsSUFBSSxLQUFJLENBQUMsaUJBQWlCLEVBQUU7Z0JBQzFCLFVBQVUsQ0FBQztvQkFDVCxLQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztvQkFDekIsS0FBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUNuQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ1IsNEJBQTRCO2dCQUM1QixvQ0FBb0M7YUFDckM7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLFVBQUMsS0FBVTtZQUNyRCxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNoQyxJQUFNLFdBQVcsR0FBRztnQkFDbEIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUN2QixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDMUIsQ0FBQyxDQUFDO1lBQ0YsSUFBTSx5QkFBeUIsR0FBRztnQkFDaEMsV0FBVyxFQUFFLENBQUM7Z0JBQ2QsS0FBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO2dCQUNsQixLQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDeEIsQ0FBQyxDQUFDO1lBQ0YsMkRBQTJEO1lBQzNELGlFQUFpRTtZQUNqRSxRQUFRO1lBQ1Isd0RBQXdEO1lBQ3hELDBDQUEwQztZQUMxQyxFQUFFO1lBQ0YsK0VBQStFO1lBQy9FLDBCQUEwQjtZQUMxQixrQ0FBa0M7WUFDbEMsRUFBRTtZQUNGLGtFQUFrRTtZQUNsRSxtREFBbUQ7WUFDbkQsSUFDRSxLQUFLLENBQUMsR0FBRyxLQUFLLFdBQVc7Z0JBQ3pCLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxRQUFRLElBQUksS0FBSSxDQUFDLGNBQWMsQ0FBQyxFQUMvQztnQkFDQSxJQUFNLElBQUksR0FBRyxLQUFJLENBQUMsY0FBYyxDQUFDLHVCQUF1QixDQUFDO2dCQUN6RCxPQUFPLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDaEMsSUFDRSxJQUFJLFlBQVksV0FBVztvQkFDM0IsQ0FBRSxJQUFvQixDQUFDLGlCQUFpQixFQUN4QztvQkFDQSw4QkFBOEI7b0JBQzlCLE9BQU8sQ0FBQyxLQUFLLENBQUMsNENBQTRDLENBQUMsQ0FBQztvQkFDNUQsS0FBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3JDLEtBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxFQUFFLENBQUM7b0JBQ3JDLHlCQUF5QixFQUFFLENBQUM7aUJBQzdCO3FCQUFNLElBQ0wsSUFBSSxDQUFDLFFBQVEsS0FBSyxPQUFPO29CQUN6QixDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsaUJBQWlCLEVBQ3JDO29CQUNBLDZCQUE2QjtvQkFDN0IsT0FBTyxDQUFDLEtBQUssQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO29CQUM1RCxLQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBQ25ELEtBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxFQUFFLENBQUM7b0JBQ3JDLHlCQUF5QixFQUFFLENBQUM7aUJBQzdCO2FBQ0Y7WUFDRCxpRUFBaUU7WUFDakUsa0VBQWtFO1lBQ2xFLG1EQUFtRDtZQUNuRCxJQUFJLEtBQUssQ0FBQyxHQUFHLEtBQUssV0FBVyxJQUFJLEtBQUksQ0FBQyxjQUFjLEVBQUU7Z0JBQ3BELElBQU0sSUFBSSxHQUFHLEtBQUksQ0FBQyxjQUFjLENBQUMsdUJBQXVCLENBQUM7Z0JBQ3pELElBQ0UsS0FBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLEtBQUssSUFBSTtvQkFDdEMsS0FBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLEtBQUssQ0FBQztvQkFDckMsSUFBSSxDQUFDLGVBQWUsWUFBWSxXQUFXO29CQUMzQyxDQUFFLElBQUksQ0FBQyxlQUErQixDQUFDLGlCQUFpQixFQUN4RDtvQkFDQSxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUM5Qix5QkFBeUIsRUFBRSxDQUFDO2lCQUM3QjthQUNGO2lCQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsS0FBSyxRQUFRLElBQUksS0FBSSxDQUFDLGNBQWMsRUFBRTtnQkFDeEQsSUFBTSxJQUFJLEdBQUcsS0FBSSxDQUFDLGNBQWMsQ0FBQyx1QkFBdUIsQ0FBQztnQkFDekQsSUFDRSxLQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsS0FBSyxJQUFJO29CQUN0QyxLQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxRQUFRLEtBQUssT0FBTztvQkFDckQsS0FBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTO3dCQUMxQixLQUFJLENBQUMsY0FBYyxDQUFDLFlBQXFCLENBQUMsTUFBTTtvQkFDbkQsSUFBSSxDQUFDLFdBQVcsWUFBWSxXQUFXO29CQUN2QyxDQUFFLElBQUksQ0FBQyxXQUEyQixDQUFDLGlCQUFpQixFQUNwRDtvQkFDQSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUMxQix5QkFBeUIsRUFBRSxDQUFDO2lCQUM3QjthQUNGO1lBQ0QsZ0VBQWdFO1lBQ2hFLGdFQUFnRTtZQUNoRSxVQUFVO1lBQ1YsSUFBSSxLQUFJLENBQUMsWUFBWSxFQUFFO2dCQUNyQixJQUFJLEtBQUssQ0FBQyxHQUFHLEtBQUssSUFBSSxJQUFJLEtBQUssQ0FBQyxHQUFHLEtBQUssU0FBUyxFQUFFO29CQUNqRCxXQUFXLEVBQUUsQ0FBQztvQkFDZCxLQUFJLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLENBQUM7aUJBQ3ZDO3FCQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsS0FBSyxNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsS0FBSyxXQUFXLEVBQUU7b0JBQzVELFdBQVcsRUFBRSxDQUFDO29CQUNkLEtBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsQ0FBQztpQkFDcEM7cUJBQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxLQUFLLE9BQU8sRUFBRTtvQkFDaEMsV0FBVyxFQUFFLENBQUM7b0JBQ2QsS0FBSSxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixFQUFFLENBQUM7aUJBQzFDO2FBQ0Y7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQUMsS0FBVTtZQUNuRCxPQUFPLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQy9CLEtBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNsQixLQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDeEIsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFNLEtBQUssR0FBUSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzVELElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXBELElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNyQixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ3pCO0lBQ0gsQ0FBQztJQUVNLHdDQUFXLEdBQWxCLFVBQW1CLE9BQU87UUFDeEIsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDbkIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDL0I7UUFDRCxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNsQixJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQ25CLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQzthQUN0QjtTQUNGO0lBQ0gsQ0FBQztJQUVNLHdDQUFXLEdBQWxCO1FBQ0UsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3ZCLElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDbkM7SUFDSCxDQUFDO0lBRVMsMENBQWEsR0FBdkI7UUFDRSxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVTLHVDQUFVLEdBQXBCO1FBQ0UsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsS0FBSyxFQUFFLEVBQUU7WUFDcEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDO1lBQ25DLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1NBQ25CO2FBQU0sSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsS0FBSyxNQUFNLEVBQUU7WUFDL0MsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7U0FDbkI7YUFBTTtZQUNMLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1NBQ3BCO0lBQ0gsQ0FBQztJQUVTLHNDQUFTLEdBQW5CLFVBQW9CLFFBQVE7UUFDMUIsSUFBTSxLQUFLLEdBQVEsTUFBTSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM1RCxJQUFJLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLE1BQU07WUFDeEMsUUFBUSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUM7UUFDN0MsSUFBSSxLQUFLLENBQUMsU0FBUyxLQUFLLFlBQVksRUFBRTtZQUNwQyxNQUFNO2dCQUNKLFFBQVEsQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQztvQkFDOUIsUUFBUSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDO29CQUNqQyxRQUFRLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRSxFQUFFLENBQUM7b0JBQ2xDLFFBQVEsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDekM7UUFDRCxPQUFPLE1BQU0sR0FBRyxJQUFJLENBQUM7SUFDdkIsQ0FBQztJQUdTLDBDQUFhLEdBQXZCLFVBQXdCLElBQUk7UUFBNUIsaUJBZ0NDO1FBL0JDLE9BQU8sQ0FBQyxLQUFLLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUM3RCxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDdkIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNuQztRQUNELElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQUEsT0FBTztZQUNuRSxrREFBa0Q7WUFDbEQsSUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQztZQUNyQyxPQUFPLENBQUMsS0FBSyxDQUNYLEdBQUcsR0FBRyxJQUFJLEdBQUcsZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FDbkUsQ0FBQztZQUVGLEtBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1lBQ3hCLElBQUksT0FBTyxDQUFDLElBQUksS0FBSyxZQUFZLElBQUksS0FBSSxDQUFDLGNBQWMsRUFBRTtnQkFDeEQscUVBQXFFO2dCQUNyRSxpQ0FBaUM7Z0JBQ2pDLEtBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQ3JDLHVEQUF1RDtnQkFDdkQsS0FBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQzVCLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQy9ELENBQUM7Z0JBQ0Ysc0RBQXNEO2dCQUN0RCxLQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDcEMsZ0NBQWdDO2dCQUNoQyxLQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7Z0JBQ2xCLEtBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQzthQUN2QjtpQkFBTTtnQkFDTCxRQUFRLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUMxRDtZQUNELEtBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUNwQixLQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDekIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBSVMsMENBQWEsR0FBdkI7UUFDRSxJQUFJLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxFQUFFO1lBQ3BDLElBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUNsQyxJQUFJLEdBQUcsQ0FBQyxVQUFVLElBQUksR0FBRyxDQUFDLFVBQVUsRUFBRTtnQkFDcEMsSUFBSSxDQUFDLGNBQWMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4QyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLGlCQUFpQixFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztnQkFDeEUsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO2FBQ3BCO1NBQ0Y7SUFDSCxDQUFDO0lBQ0QscUNBQXFDO0lBQzNCLDZDQUFnQixHQUExQjtRQUNFLElBQUksSUFBSSxDQUFDLHlCQUF5QixFQUFFLEVBQUU7WUFDcEMsT0FBTztTQUNSO1FBQ0QsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDM0UsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3ZCLElBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUNsQyxHQUFHLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDdEIsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7U0FDbkM7SUFDSCxDQUFDO0lBRVMsc0RBQXlCLEdBQW5DO1FBQ0UsSUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ2xDLElBQU0sSUFBSSxHQUNSLEdBQUcsQ0FBQyxVQUFVO1lBQ2QsR0FBRyxDQUFDLFVBQVU7WUFDZCxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNqQixHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLHVCQUF1QixDQUFDO1FBQzVDLE9BQU8sQ0FDTCxJQUFJO1lBQ0osQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLFVBQVU7Z0JBQ3ZCLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUM7b0JBQzlDLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLEtBQUssSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQzFFLENBQUM7SUFDSixDQUFDO0lBRVMsd0NBQVcsR0FBckI7UUFDRSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLHVCQUF1QixDQUFDO1FBQ3ZELElBQ0UsQ0FBQyxJQUFJO1lBQ0wsQ0FBQyxDQUNDLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDO2dCQUMvQyxJQUFJLEtBQUssSUFBSSxDQUFDLFVBQVUsQ0FDekIsRUFDRDtZQUNBLCtEQUErRDtZQUMvRCxvREFBb0Q7WUFDcEQsT0FBTztTQUNSO1FBQ0QsbUVBQW1FO1FBQ25FLElBQ0UsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLEtBQUssQ0FBQztZQUNuQyxJQUFJLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxTQUFTO1lBQzVDLElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVztnQkFDN0IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFDckQ7WUFDQSxJQUFJLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDO1NBQ3ZEO2FBQU0sSUFDTCxJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsS0FBSyxDQUFDO1lBQ25DLElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxLQUFLLENBQUMsRUFDckM7WUFDQSxJQUFJLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDO1NBQ3pEO2FBQU0sSUFDTCxJQUFJLENBQUMsY0FBYyxDQUFDLHVCQUF1QixLQUFLLElBQUksQ0FBQyxVQUFVO1lBQy9ELElBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxLQUFLLElBQUksQ0FBQyxVQUFVO1lBQ3RELElBQUksQ0FBQyxjQUFjLENBQUMsWUFBWSxLQUFLLElBQUksQ0FBQyxVQUFVLEVBQ3BEO1lBQ0EsSUFBSSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsdUJBQXVCLENBQUMsVUFBVSxDQUMzRCxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FDaEMsQ0FBQztTQUNIO1FBQ0QsSUFBSSxJQUFJLElBQUksSUFBSSxLQUFLLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDcEMsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNyRSxPQUFPLENBQUMsS0FBSyxDQUFDLHlCQUF5QixFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ2hELElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDakQ7SUFDSCxDQUFDO0lBS00sdUNBQVUsR0FBakIsVUFBa0IsS0FBYTtRQUM3QixJQUFJLEtBQUssRUFBRTtZQUNULElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyx1QkFBdUIsQ0FDbkQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FDcEQsQ0FBQztZQUNGLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1NBQ3BCO2FBQU07WUFDTCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDOUQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7U0FDbkI7UUFDRCxJQUFJLENBQUMsY0FBYyxHQUFHLFNBQVMsQ0FBQztJQUNsQyxDQUFDO0lBRU0sNkNBQWdCLEdBQXZCLFVBQXdCLEVBQTJCO1FBQ2pELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFFTSw4Q0FBaUIsR0FBeEIsVUFBeUIsRUFBYyxJQUFHLENBQUM7SUFFakMsb0RBQXVCLEdBQWpDO1FBQ0UsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbkUsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDO1FBQzFELElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQ25FLFFBQVEsRUFDUixNQUFNLENBQ1AsQ0FBQztRQUVGLElBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlELElBQUksWUFBWSxFQUFFO1lBQ2hCLElBQ0UsQ0FBQyxJQUFJLENBQUMsWUFBWTtnQkFDbEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEtBQUssWUFBWSxDQUFDLFFBQVEsRUFDcEQ7Z0JBQ0EsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7Z0JBQ2pDLElBQUksQ0FBQyxZQUFZLENBQ2YsWUFBWSxFQUNaLElBQUksQ0FBQyxjQUFjLENBQUMscUJBQXFCLEVBQUUsQ0FDNUMsQ0FBQzthQUNIO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDO2dCQUNqQyxJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUMzQztTQUNGO2FBQU0sSUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUU7WUFDakMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7WUFDekIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ2xDO0lBQ0gsQ0FBQztJQUVTLHlDQUFZLEdBQXRCLFVBQXVCLGVBQWUsRUFBRSxRQUFRO1FBQWhELGlCQStCQztRQTlCQyw2QkFBNkI7UUFDN0IsSUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUU7WUFDMUIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ2xDO1FBQ0QsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyx1QkFBdUIsQ0FDMUQsZUFBZSxDQUFDLFFBQVEsQ0FDekIsQ0FBQztRQUNGLElBQU0sU0FBUyxHQUFRLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzVFLElBQUksU0FBUyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUU7WUFDbEMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsZUFBZSxDQUFDLE9BQU8sQ0FBQztZQUNuRCxTQUFTLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsVUFBQSxLQUFLO2dCQUM1QyxLQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUN4QixJQUFNLEdBQUcsR0FBRyxLQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQztnQkFDMUMsS0FBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQzFCLEtBQUksQ0FBQyxjQUFjLENBQUMsWUFBWSxFQUNoQyxHQUFHLEdBQUcsZUFBZSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQ3JDLENBQUM7Z0JBQ0YsS0FBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsS0FBSSxDQUFDLElBQUksRUFBRSxLQUFJLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUM5RCxzQkFBc0I7Z0JBQ3RCLEtBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO2dCQUN6QixLQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDbkMsQ0FBQyxDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDMUUsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUM7WUFDM0MsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7U0FDL0I7YUFBTTtZQUNMLE1BQU0sSUFBSSxLQUFLLENBQ2IsMEVBQTBFLENBQzNFLENBQUM7U0FDSDtJQUNILENBQUM7SUFFUywyQ0FBYyxHQUF4QixVQUF5QixLQUFLO1FBQzVCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO0lBQ2hDLENBQUM7SUFFUyxtREFBc0IsR0FBaEM7UUFDRSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxLQUFLLFlBQVksRUFBRTtZQUM5QywwREFBMEQ7WUFDMUQsSUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLHFCQUFxQixFQUFFLENBQUM7WUFDbEYsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUMvQyxJQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO1lBQzVCLEtBQUssQ0FBQyxRQUFRLENBQ1osS0FBSyxDQUFDLFlBQVksRUFDbEIsR0FBRyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FDdkMsQ0FBQztZQUNGLElBQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1lBQ2xELElBQUksQ0FBQyxrQkFBa0I7Z0JBQ3JCLFdBQVcsQ0FBQyxHQUFHLEdBQUcsV0FBVyxDQUFDLE1BQU0sR0FBRyxjQUFjLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztZQUNuRSxJQUFJLENBQUMsbUJBQW1CLEdBQUcsV0FBVyxDQUFDLElBQUksR0FBRyxjQUFjLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztTQUMxRTtJQUNILENBQUM7OztnQkFyYmUsVUFBVTtnQkFDRixxQkFBcUI7Z0JBQ3JCLHFCQUFxQjtnQkFDekIsaUJBQWlCO2dCQUNkLFlBQVk7Z0JBQ04sd0JBQXdCOztJQTFDckQ7UUFEQyxLQUFLLEVBQUU7b0RBQ3dCO0lBR2hDO1FBREMsS0FBSyxFQUFFO21EQUNXO0lBR25CO1FBREMsS0FBSyxFQUFFOzJEQUNtQjtJQUczQjtRQURDLEtBQUssRUFBRTsyREFDd0I7SUFHaEM7UUFEQyxLQUFLLEVBQUU7NERBQzZCO0lBR3JDO1FBREMsTUFBTSxFQUFFO3FEQUMrQjtJQUd4QztRQURDLE1BQU0sRUFBRTtvREFDOEI7SUFNdkM7UUFKQyxTQUFTLENBQUMsVUFBVSxFQUFFO1lBQ3JCLElBQUksRUFBRSxnQkFBZ0I7WUFDdEIsTUFBTSxFQUFFLElBQUk7U0FDYixDQUFDO2dFQUNpQztJQTNCeEIsa0JBQWtCO1FBNUQ5QixTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsWUFBWTtZQUN0QixRQUFRLEVBQUUseWdCQWlCVDtZQXFDRCxTQUFTLEVBQUU7Z0JBQ1QsRUFBRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsV0FBVyxFQUFFLG9CQUFrQixFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7YUFDN0U7cUJBckNDLHEzQkFpQ0M7U0FLSixDQUFDO09BQ1csa0JBQWtCLENBOGQ5QjtJQUFELHlCQUFDO0NBQUEsQUE5ZEQsSUE4ZEM7U0E5ZFksa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBWaWV3Q2hpbGQsXG4gIEVsZW1lbnRSZWYsXG4gIFZpZXdSZWYsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgT25Jbml0LFxuICBPbkNoYW5nZXMsXG4gIEFmdGVyVmlld0luaXQsXG4gIE9uRGVzdHJveSxcbiAgRXZlbnRFbWl0dGVyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTkdfVkFMVUVfQUNDRVNTT1IsIENvbnRyb2xWYWx1ZUFjY2Vzc29yIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgRG9tU2FuaXRpemVyLCBTYWZlSHRtbCB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuXG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgRmF0ZUNvbnRyb2xsZXJTZXJ2aWNlIH0gZnJvbSAnLi4vZmF0ZS1jb250cm9sbGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgRmF0ZUh0bWxQYXJzZXJTZXJ2aWNlIH0gZnJvbSAnLi4vZmF0ZS1odG1sLXBhcnNlci5zZXJ2aWNlJztcbmltcG9ydCB7IEZhdGVQYXJzZXJTZXJ2aWNlIH0gZnJvbSAnLi4vZmF0ZS1wYXJzZXIuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2ZhdGUtaW5wdXQnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXZcbiAgICAgIGNsYXNzPVwiZmF0ZS1pbmxpbmUtZHJvcGRvd25cIlxuICAgICAgW2NsYXNzLmhpZGRlbl09XCIhaW5saW5lQWN0aW9uXCJcbiAgICAgIFtjbGFzcy5jb250ZXh0dWFsXT1cImlubGluZUFjdGlvbj8uZGlzcGxheSA9PT0gJ2NvbnRleHR1YWwnXCJcbiAgICAgIFtzdHlsZS50b3BdPVwiZHJvcGRvd25Qb3N0aW9uVG9wXCJcbiAgICAgIFtzdHlsZS5sZWZ0XT1cImRyb3Bkb3duUG9zdGlvbkxlZnRcIlxuICAgID5cbiAgICAgIDxuZy10ZW1wbGF0ZSAjZHJvcGRvd24+PC9uZy10ZW1wbGF0ZT5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2XG4gICAgICBbY2xhc3NdPVwiJ2ZhdGUtZWRpdC10YXJnZXQgJyArIGN1c3RvbUNsYXNzXCJcbiAgICAgIFtuZ0NsYXNzXT1cInsgZW1wdHk6IGVtcHR5IH1cIlxuICAgICAgY29udGVudGVkaXRhYmxlPVwidHJ1ZVwiXG4gICAgICBbdGl0bGVdPVwicGxhY2Vob2xkZXJcIlxuICAgICAgW2lubmVySHRtbF09XCJjb250ZW50XCJcbiAgICA+PC9kaXY+XG4gIGAsXG4gIHN0eWxlczogW1xuICAgIGBcbiAgICAgIDpob3N0IGRpdi5mYXRlLWVkaXQtdGFyZ2V0IHtcbiAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICAgIHBhZGRpbmc6IDEwcHg7XG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNkZGQ7XG4gICAgICAgIG91dGxpbmU6IDA7XG4gICAgICAgIHJlc2l6ZTogdmVydGljYWw7XG4gICAgICAgIG92ZXJmbG93OiBhdXRvO1xuICAgICAgICBiYWNrZ3JvdW5kOiAjZmZmO1xuICAgICAgICBjb2xvcjogIzAwMDtcbiAgICAgICAgb3ZlcmZsb3c6IHZpc2libGU7XG4gICAgICB9XG4gICAgICA6aG9zdCBkaXYuZmF0ZS1lZGl0LXRhcmdldC5lbXB0eTpub3QoOmZvY3VzKTpiZWZvcmUge1xuICAgICAgICBjb250ZW50OiBhdHRyKHRpdGxlKTtcbiAgICAgICAgY29sb3I6ICM2MzZjNzI7XG4gICAgICB9XG4gICAgICAuZmF0ZS1pbmxpbmUtZHJvcGRvd24ge1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjZGRkO1xuICAgICAgICBib3JkZXItYm90dG9tOiAwO1xuICAgICAgfVxuICAgICAgLmZhdGUtaW5saW5lLWRyb3Bkb3duLmhpZGRlbiB7XG4gICAgICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgICAgIH1cbiAgICAgIC5mYXRlLWlubGluZS1kcm9wZG93bi5jb250ZXh0dWFsIHtcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICBiYWNrZ3JvdW5kOiAjZmZmO1xuICAgICAgICBib3gtc2hhZG93OiAwIDVweCAzMHB4IC0xMHB4IHJnYmEoMCwgMCwgMCwgMC40KTtcbiAgICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNjY2M7XG4gICAgICB9XG4gICAgICA6aG9zdCB7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDEwcHg7XG4gICAgICAgIC8qcG9zaXRpb246IHJlbGF0aXZlOyovXG4gICAgICB9XG4gICAgYFxuICBdLFxuICBwcm92aWRlcnM6IFtcbiAgICB7IHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLCB1c2VFeGlzdGluZzogRmF0ZUlucHV0Q29tcG9uZW50LCBtdWx0aTogdHJ1ZSB9XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgRmF0ZUlucHV0Q29tcG9uZW50XG4gIGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE9uQ2hhbmdlcywgT25Jbml0LCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuICBASW5wdXQoKVxuICBwdWJsaWMgdWlJZDogc3RyaW5nID0gJ2RlZmF1bHQnO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyByb3c6IG51bWJlcjtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgY3VzdG9tQ2xhc3M6IHN0cmluZztcblxuICBASW5wdXQoKVxuICBwdWJsaWMgcGxhY2Vob2xkZXI6IHN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBpbml0aWFsRm9jdXM6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBAT3V0cHV0KClcbiAgcHVibGljIGZvY3VzID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIEBPdXRwdXQoKVxuICBwdWJsaWMgYmx1ciA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICBAVmlld0NoaWxkKCdkcm9wZG93bicsIHtcbiAgICByZWFkOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIHN0YXRpYzogdHJ1ZVxuICB9KVxuICB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmO1xuICBwcm90ZWN0ZWQgZHJvcGRvd25Db21wb25lbnQ6IFZpZXdSZWY7XG4gIHByb3RlY3RlZCBkcm9wZG93bkluc3RhbmNlOiBhbnk7XG4gIHB1YmxpYyBkcm9wZG93blBvc3Rpb25Ub3A6IHN0cmluZztcbiAgcHVibGljIGRyb3Bkb3duUG9zdGlvbkxlZnQ6IHN0cmluZztcbiAgcHVibGljIGlubGluZUFjdGlvbjogYW55O1xuXG4gIHB1YmxpYyBjb250ZW50OiBTYWZlSHRtbDtcbiAgcHVibGljIGVtcHR5OiBib29sZWFuID0gdHJ1ZTtcbiAgcHJvdGVjdGVkIGVkaXRUYXJnZXQ6IGFueTtcbiAgcHJvdGVjdGVkIGlzRm9jdXNlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBlbDogRWxlbWVudFJlZixcbiAgICBwcm90ZWN0ZWQgY29udHJvbGxlcjogRmF0ZUNvbnRyb2xsZXJTZXJ2aWNlLFxuICAgIHByb3RlY3RlZCBodG1sUGFyc2VyOiBGYXRlSHRtbFBhcnNlclNlcnZpY2UsXG4gICAgcHJvdGVjdGVkIHBhcnNlcjogRmF0ZVBhcnNlclNlcnZpY2UsXG4gICAgcHJvdGVjdGVkIHNhbml0aXplcjogRG9tU2FuaXRpemVyLFxuICAgIHByb3RlY3RlZCBmYWN0b3J5UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlclxuICApIHt9XG5cbiAgcHJpdmF0ZSByZWFjdFRvQ2hhbmdlcygpIHtcbiAgICBjb25zdCB0cmVlID0gdGhpcy5odG1sUGFyc2VyLnBhcnNlRWxlbWVudCh0aGlzLmVkaXRUYXJnZXQpO1xuICAgIGNvbnN0IHNlcmlhbGl6ZWRUcmVlID0gdGhpcy5wYXJzZXIuc2VyaWFsaXplKHRyZWUpO1xuICAgIHRoaXMuY2hhbmdlZC5mb3JFYWNoKGYgPT4gZihzZXJpYWxpemVkVHJlZSkpO1xuICB9XG5cbiAgcHVibGljIG5nT25Jbml0KCkge1xuICAgIHRoaXMuc3Vic2NyaWJlVG9VaSh0aGlzLnVpSWQpO1xuICB9XG5cbiAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLmVkaXRUYXJnZXQgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmZhdGUtZWRpdC10YXJnZXQnKTtcbiAgICBpZiAodGhpcy5yb3cpIHtcbiAgICAgIHRoaXMuY29tcHV0ZUhlaWdodCgpO1xuICAgIH1cblxuICAgIHRoaXMuZWRpdFRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudDogYW55KSA9PiB7XG4gICAgICBjb25zb2xlLmRlYnVnKCdjbGljaycpO1xuICAgICAgLy8gT24gY2xpY2sgd2Ugc2F2ZSB0aGUgdGV4dCBTZWxlY3Rpb25cbiAgICAgIHRoaXMuc2F2ZVNlbGVjdGlvbigpO1xuICAgICAgLy8gV2UgY2hlY2sgaWYgdGhlcmUgaXMgYSBkcm9wZG93biBtYXRjaGluZyB0aGlzIGNvbnRleHRcbiAgICAgIHRoaXMuY2hlY2tGb3JEcm9wZG93bkNvbnRleHQoKTtcbiAgICB9KTtcblxuICAgIHRoaXMuZWRpdFRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChldmVudDogYW55KSA9PiB7XG4gICAgICBjb25zb2xlLmRlYnVnKCdrZXlwcmVzc2VkJyk7XG4gICAgICAvLyBPbiBjbGljayB3ZSBzYXZlIHRoZSB0ZXh0IFNlbGVjdGlvblxuICAgICAgdGhpcy5zYXZlU2VsZWN0aW9uKCk7XG4gICAgICAvLyBXZSBjaGVjayBpZiB0aGVyZSBpcyBhIGRyb3Bkb3duIG1hdGNoaW5nIHRoaXMgY29udGV4dFxuICAgICAgdGhpcy5jaGVja0ZvckRyb3Bkb3duQ29udGV4dCgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5lZGl0VGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgKGV2ZW50OiBhbnkpID0+IHtcbiAgICAgIGNvbnNvbGUuZGVidWcoJygnICsgdGhpcy51aUlkICsgJykgZm9jdXMnKTtcbiAgICAgIC8vIE9uIGZvY3VzIHdlIHJlc3RvcmUgaXRcbiAgICAgIHRoaXMucmVzdG9yZVNlbGVjdGlvbigpO1xuICAgICAgdGhpcy5pc0ZvY3VzZWQgPSB0cnVlO1xuICAgICAgdGhpcy5mb2N1cy5lbWl0KCk7XG4gICAgfSk7XG4gICAgdGhpcy5lZGl0VGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCAoZXZlbnQ6IGFueSkgPT4ge1xuICAgICAgY29uc29sZS5kZWJ1ZygnKCcgKyB0aGlzLnVpSWQgKyAnKSBibHVyJyk7XG4gICAgICB0aGlzLmlzRm9jdXNlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5ibHVyLmVtaXQoKTtcbiAgICAgIHRoaXMuc2F2ZVNlbGVjdGlvbigpO1xuXG4gICAgICBpZiAodGhpcy5kcm9wZG93bkNvbXBvbmVudCkge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLmlubGluZUFjdGlvbiA9IG51bGw7XG4gICAgICAgICAgdGhpcy5kcm9wZG93bkNvbXBvbmVudC5kZXN0cm95KCk7XG4gICAgICAgIH0sIDMwMCk7XG4gICAgICAgIC8vIHRoaXMuaW5saW5lQWN0aW9uID0gbnVsbDtcbiAgICAgICAgLy8gdGhpcy5kcm9wZG93bkNvbXBvbmVudC5kZXN0cm95KCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLmVkaXRUYXJnZXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudDogYW55KSA9PiB7XG4gICAgICBjb25zb2xlLmRlYnVnKCdrZXlkb3duJywgZXZlbnQpO1xuICAgICAgY29uc3Qgc3RvcERlZmF1bHQgPSAoKSA9PiB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgfTtcbiAgICAgIGNvbnN0IHN0b3BEZWZhdWx0QW5kRm9yY2VVcGRhdGUgPSAoKSA9PiB7XG4gICAgICAgIHN0b3BEZWZhdWx0KCk7XG4gICAgICAgIHRoaXMuY2hlY2tFbXB0eSgpO1xuICAgICAgICB0aGlzLnJlYWN0VG9DaGFuZ2VzKCk7XG4gICAgICB9O1xuICAgICAgLy8gVGhpcyBpcyBuZWVkZWQgYmVjYXVzZSwgaWYgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIGlzIHBhcnRcbiAgICAgIC8vIG9mIGEgbm9uLWVkaXRhYmxlIGNoaWxkIG9mIHRoZSBpbnB1dCwgdGhlIGRlZmF1bHQgZGVsZXRlIHdvbid0XG4gICAgICAvLyB3b3JrLlxuICAgICAgLy8gVGhpcyBjYXNlIGNhbiBoYXBwZW4gaWYgdGhlcmUgaXMgYSBjdXRvbSBlbGVtZW50IHRoYXRcbiAgICAgIC8vIHdhcyBpbnNlcnRlZCBieSBzb21lIGN1c3RvbSBjb250cm9sbGVyLlxuICAgICAgLy9cbiAgICAgIC8vIFNvbWUgY29uc3RyYWludHMgZm9yIGEgY3VzdG9tIGJsb2NrIHRvIHdvcmsgb24gdG9wIG9mIGNvbnRlbnRlZGl0YWJsZT1mYWxzZTpcbiAgICAgIC8vIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgICAvLyAtd2Via2l0LXVzZXItbW9kaWZ5OiByZWFkLW9ubHk7XG4gICAgICAvL1xuICAgICAgLy8gTm90ZTogSXQgbWF5IG1ha2Ugc2Vuc2UgdG8gZGVsZXRlIHRoZSBzZWxlY3Rpb24gZm9yIG5vcm1hbCB0ZXh0XG4gICAgICAvLyBpbnB1dCB0b28gYnV0IGZvciBub3cgd2Ugb25seSBkbyBpdCBvbiBkZWxldGlvbi5cbiAgICAgIGlmIChcbiAgICAgICAgZXZlbnQua2V5ID09PSAnQmFja3NwYWNlJyB8fFxuICAgICAgICAoZXZlbnQua2V5ID09PSAnRGVsZXRlJyAmJiB0aGlzLnNlbGVjdGlvblJhbmdlKVxuICAgICAgKSB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLnNlbGVjdGlvblJhbmdlLmNvbW1vbkFuY2VzdG9yQ29udGFpbmVyO1xuICAgICAgICBjb25zb2xlLmRlYnVnKCdEZWxldGlvbicsIG5vZGUpO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgbm9kZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmXG4gICAgICAgICAgIShub2RlIGFzIEhUTUxFbGVtZW50KS5pc0NvbnRlbnRFZGl0YWJsZVxuICAgICAgICApIHtcbiAgICAgICAgICAvLyB0aGlzIGlzIHRoZSBjYXNlIG9uIGZpcmVmb3hcbiAgICAgICAgICBjb25zb2xlLmRlYnVnKCdkZWxldGluZyBpbnNpZGUgdW4tZWRpdGFibGUgYmxvY2sgZGV0ZWN0ZWQnKTtcbiAgICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLnNlbGVjdE5vZGUobm9kZSk7XG4gICAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5kZWxldGVDb250ZW50cygpO1xuICAgICAgICAgIHN0b3BEZWZhdWx0QW5kRm9yY2VVcGRhdGUoKTtcbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICBub2RlLm5vZGVOYW1lID09PSAnI3RleHQnICYmXG4gICAgICAgICAgIW5vZGUucGFyZW50RWxlbWVudC5pc0NvbnRlbnRFZGl0YWJsZVxuICAgICAgICApIHtcbiAgICAgICAgICAvLyB0aGlzIGlzIHRoZSBjYXNlIG9uIHdlYmtpdFxuICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ2RlbGV0aW5nIGluc2lkZSB1bi1lZGl0YWJsZSBibG9jayBkZXRlY3RlZCcpO1xuICAgICAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2Uuc2VsZWN0Tm9kZShub2RlLnBhcmVudEVsZW1lbnQpO1xuICAgICAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2UuZGVsZXRlQ29udGVudHMoKTtcbiAgICAgICAgICBzdG9wRGVmYXVsdEFuZEZvcmNlVXBkYXRlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIFRoaXMgaXMgbmVlZGVkIGJlY2F1c2UsIHRoZXJlIGlzIGEgYnVnIGluIEZpcmVmb3ggdGhhdCBwcmV2ZW50XG4gICAgICAvLyBkZWxldGluZyBhIHVuZWRpdGFibGUgZWxlbWVudCBpbnNpZGUgYW4gZWRpdGFibGUgZWxlbWVudC4gU28gd2VcbiAgICAgIC8vIHJlaW1wbGVtZW50IHRoZSB3aG9sZSBmdW5jdGlvbiBmb3IgYWxsIGJyb3dzZXJzLlxuICAgICAgaWYgKGV2ZW50LmtleSA9PT0gJ0JhY2tzcGFjZScgJiYgdGhpcy5zZWxlY3Rpb25SYW5nZSkge1xuICAgICAgICBjb25zdCBub2RlID0gdGhpcy5zZWxlY3Rpb25SYW5nZS5jb21tb25BbmNlc3RvckNvbnRhaW5lcjtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2UuY29sbGFwc2VkID09PSB0cnVlICYmXG4gICAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5zdGFydE9mZnNldCA9PT0gMCAmJlxuICAgICAgICAgIG5vZGUucHJldmlvdXNTaWJsaW5nIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiZcbiAgICAgICAgICAhKG5vZGUucHJldmlvdXNTaWJsaW5nIGFzIEhUTUxFbGVtZW50KS5pc0NvbnRlbnRFZGl0YWJsZVxuICAgICAgICApIHtcbiAgICAgICAgICBub2RlLnByZXZpb3VzU2libGluZy5yZW1vdmUoKTtcbiAgICAgICAgICBzdG9wRGVmYXVsdEFuZEZvcmNlVXBkYXRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoZXZlbnQua2V5ID09PSAnRGVsZXRlJyAmJiB0aGlzLnNlbGVjdGlvblJhbmdlKSB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLnNlbGVjdGlvblJhbmdlLmNvbW1vbkFuY2VzdG9yQ29udGFpbmVyO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5jb2xsYXBzZWQgPT09IHRydWUgJiZcbiAgICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLmVuZENvbnRhaW5lci5ub2RlTmFtZSA9PT0gJyN0ZXh0JyAmJlxuICAgICAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2UuZW5kT2Zmc2V0ID09PVxuICAgICAgICAgICAgKHRoaXMuc2VsZWN0aW9uUmFuZ2UuZW5kQ29udGFpbmVyIGFzIFRleHQpLmxlbmd0aCAmJlxuICAgICAgICAgIG5vZGUubmV4dFNpYmxpbmcgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJlxuICAgICAgICAgICEobm9kZS5uZXh0U2libGluZyBhcyBIVE1MRWxlbWVudCkuaXNDb250ZW50RWRpdGFibGVcbiAgICAgICAgKSB7XG4gICAgICAgICAgbm9kZS5uZXh0U2libGluZy5yZW1vdmUoKTtcbiAgICAgICAgICBzdG9wRGVmYXVsdEFuZEZvcmNlVXBkYXRlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIElmIGEgZHJvcGRvd24gaXMgY3VycmVudGx5IGJlaW5nIGRpc3BsYXllZCB3ZSB1c2UgdGhlIHVwL2Rvd25cbiAgICAgIC8vIGtleSB0byBuYXZpZ2F0ZSBpdHMgY29udGVudCBhbmQgcmV0dXJuIHRvIHNlbGVjdCB0aGUgc2VsZWN0ZWRcbiAgICAgIC8vIGVsZW1lbnRcbiAgICAgIGlmICh0aGlzLmlubGluZUFjdGlvbikge1xuICAgICAgICBpZiAoZXZlbnQua2V5ID09PSAnVXAnIHx8IGV2ZW50LmtleSA9PT0gJ0Fycm93VXAnKSB7XG4gICAgICAgICAgc3RvcERlZmF1bHQoKTtcbiAgICAgICAgICB0aGlzLmRyb3Bkb3duSW5zdGFuY2Uuc2VsZWNQcmV2aW91cygpO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmtleSA9PT0gJ0Rvd24nIHx8IGV2ZW50LmtleSA9PT0gJ0Fycm93RG93bicpIHtcbiAgICAgICAgICBzdG9wRGVmYXVsdCgpO1xuICAgICAgICAgIHRoaXMuZHJvcGRvd25JbnN0YW5jZS5zZWxlY3ROZXh0KCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQua2V5ID09PSAnRW50ZXInKSB7XG4gICAgICAgICAgc3RvcERlZmF1bHQoKTtcbiAgICAgICAgICB0aGlzLmRyb3Bkb3duSW5zdGFuY2UuY29uZmlybVNlbGVjdGlvbigpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLmVkaXRUYXJnZXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZXZlbnQ6IGFueSkgPT4ge1xuICAgICAgY29uc29sZS5kZWJ1ZygndmFsdWUgY2hhbmdlZCcpO1xuICAgICAgdGhpcy5jaGVja0VtcHR5KCk7XG4gICAgICB0aGlzLnJlYWN0VG9DaGFuZ2VzKCk7XG4gICAgfSk7XG4gICAgY29uc3Qgc3R5bGU6IGFueSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMuZWRpdFRhcmdldCk7XG4gICAgdGhpcy5lZGl0VGFyZ2V0LnN0eWxlLm1pbkhlaWdodCA9IHRoaXMuZ2V0SGVpZ2h0KDIpO1xuXG4gICAgaWYgKHRoaXMuaW5pdGlhbEZvY3VzKSB7XG4gICAgICB0aGlzLmVkaXRUYXJnZXQuZm9jdXMoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgbmdPbkNoYW5nZXMoY2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzWyd1aUlkJ10pIHtcbiAgICAgIHRoaXMuc3Vic2NyaWJlVG9VaSh0aGlzLnVpSWQpO1xuICAgIH1cbiAgICBpZiAoY2hhbmdlc1sncm93J10pIHtcbiAgICAgIGlmICh0aGlzLmVkaXRUYXJnZXQpIHtcbiAgICAgICAgdGhpcy5jb21wdXRlSGVpZ2h0KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLnVpU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnVpU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGNvbXB1dGVIZWlnaHQoKSB7XG4gICAgdGhpcy5lZGl0VGFyZ2V0LnN0eWxlLmhlaWdodCA9IHRoaXMuZ2V0SGVpZ2h0KHRoaXMucm93KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBjaGVja0VtcHR5KCkge1xuICAgIGlmICh0aGlzLmVkaXRUYXJnZXQuaW5uZXJIVE1MID09PSAnJykge1xuICAgICAgdGhpcy5lZGl0VGFyZ2V0LmlubmVySFRNTCA9ICc8YnI+JztcbiAgICAgIHRoaXMuZW1wdHkgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5lZGl0VGFyZ2V0LmlubmVySFRNTCA9PT0gJzxicj4nKSB7XG4gICAgICB0aGlzLmVtcHR5ID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbXB0eSA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRIZWlnaHQocm93Q291bnQpIHtcbiAgICBjb25zdCBzdHlsZTogYW55ID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5lZGl0VGFyZ2V0KTtcbiAgICBsZXQgaGVpZ2h0ID0gKHRoaXMuZWRpdFRhcmdldC5zdHlsZS5oZWlnaHQgPVxuICAgICAgcGFyc2VJbnQoc3R5bGUubGluZUhlaWdodCwgMTApICogcm93Q291bnQpO1xuICAgIGlmIChzdHlsZS5ib3hTaXppbmcgPT09ICdib3JkZXItYm94Jykge1xuICAgICAgaGVpZ2h0ICs9XG4gICAgICAgIHBhcnNlSW50KHN0eWxlLnBhZGRpbmdUb3AsIDEwKSArXG4gICAgICAgIHBhcnNlSW50KHN0eWxlLnBhZGRpbmdCb3R0b20sIDEwKSArXG4gICAgICAgIHBhcnNlSW50KHN0eWxlLmJvcmRlclRvcFdpZHRoLCAxMCkgK1xuICAgICAgICBwYXJzZUludChzdHlsZS5ib3JkZXJCb3R0b21XaWR0aCwgMTApO1xuICAgIH1cbiAgICByZXR1cm4gaGVpZ2h0ICsgJ3B4JztcbiAgfVxuXG4gIHByb3RlY3RlZCB1aVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBwcm90ZWN0ZWQgc3Vic2NyaWJlVG9VaSh1aUlkKSB7XG4gICAgY29uc29sZS5kZWJ1Zygnc3Vic2NyaWJpbmcgdG8gJyArIHVpSWQsIHRoaXMudWlTdWJzY3JpcHRpb24pO1xuICAgIGlmICh0aGlzLnVpU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnVpU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIHRoaXMudWlTdWJzY3JpcHRpb24gPSB0aGlzLmNvbnRyb2xsZXIuY2hhbm5lbCh1aUlkKS5zdWJzY3JpYmUoY29tbWFuZCA9PiB7XG4gICAgICAvLyBpZiBpbnB1dCBpcyBub3Qgb24gZm9jdXMgd2Ugc2F2ZSBjdXJyZW50IGZvY3VzOlxuICAgICAgY29uc3QgZm9jdXMgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgICAgY29uc29sZS5kZWJ1ZyhcbiAgICAgICAgJygnICsgdWlJZCArICcpIGdvdCBjb21tYW5kICcgKyBjb21tYW5kLm5hbWUgKyAnLycgKyBjb21tYW5kLnZhbHVlXG4gICAgICApO1xuXG4gICAgICB0aGlzLnJlc3RvcmVTZWxlY3Rpb24oKTtcbiAgICAgIGlmIChjb21tYW5kLm5hbWUgPT09ICdpbnNlcnRIVE1MJyAmJiB0aGlzLnNlbGVjdGlvblJhbmdlKSB7XG4gICAgICAgIC8vIElmIHNvbWV0aGluZyBpcyBzZWxlY3RlZCB3ZSBhc3N1bWUgdGhhdCB0aGUgZ29hbCBpcyB0byByZXBsYWNlIGl0LFxuICAgICAgICAvLyBzbyBmaXJzdCB3ZSBkZWxldGUgdGhlIGNvbnRlbnRcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5kZWxldGVDb250ZW50cygpO1xuICAgICAgICAvLyBpbnNlcnRIdG1sIHNlZW1zIHF1aXRlIGJyb2tlbiBzbyB3ZSBkbyBpdCBvdXJzZWxldmVzXG4gICAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2UuaW5zZXJ0Tm9kZShcbiAgICAgICAgICBkb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChjb21tYW5kLnZhbHVlKVxuICAgICAgICApO1xuICAgICAgICAvLyBtb3ZlIGN1c29yIHRvIHRoZSBlbmQgb2YgdGhlIG5ld2x5IGluc2VydGVkIGVsZW1lbnRcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5jb2xsYXBzZShmYWxzZSk7XG4gICAgICAgIC8vIEZvcmNlIHRoZSB1cGRhdGUgb2YgdGhlIG1vZGVsXG4gICAgICAgIHRoaXMuY2hlY2tFbXB0eSgpO1xuICAgICAgICB0aGlzLnJlYWN0VG9DaGFuZ2VzKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkb2N1bWVudC5leGVjQ29tbWFuZChjb21tYW5kLm5hbWUsIGZhbHNlLCBjb21tYW5kLnZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2F2ZVNlbGVjdGlvbigpO1xuICAgICAgKGZvY3VzIGFzIGFueSkuZm9jdXMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIFNhdmVzIHRoZSBjdXJyZW50IHRleHQgc2VsZWN0aW9uXG4gIHByb3RlY3RlZCBzZWxlY3Rpb25SYW5nZTogUmFuZ2U7XG4gIHByb3RlY3RlZCBzYXZlU2VsZWN0aW9uKCkge1xuICAgIGlmICh0aGlzLnNlbGVjdGlvbkluRWRpdGFibGVUYXJnZXQoKSkge1xuICAgICAgY29uc3Qgc2VsID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xuICAgICAgaWYgKHNlbC5nZXRSYW5nZUF0ICYmIHNlbC5yYW5nZUNvdW50KSB7XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2UgPSBzZWwuZ2V0UmFuZ2VBdCgwKTtcbiAgICAgICAgY29uc29sZS5kZWJ1ZygnKCcgKyB0aGlzLnVpSWQgKyAnKSBzYXZlU2VsZWN0aW9uJywgdGhpcy5zZWxlY3Rpb25SYW5nZSk7XG4gICAgICAgIHRoaXMuZGV0ZWN0U3R5bGUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLy8gUmVzdG9ycyB0aGUgY3VycmVudCB0ZXh0IHNlbGVjdGlvblxuICBwcm90ZWN0ZWQgcmVzdG9yZVNlbGVjdGlvbigpIHtcbiAgICBpZiAodGhpcy5zZWxlY3Rpb25JbkVkaXRhYmxlVGFyZ2V0KCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc29sZS5kZWJ1ZygnKCcgKyB0aGlzLnVpSWQgKyAnKSByZXN0b3JlU2VsZWN0aW9uJywgdGhpcy5zZWxlY3Rpb25SYW5nZSk7XG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uUmFuZ2UpIHtcbiAgICAgIGNvbnN0IHNlbCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcbiAgICAgIHNlbC5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICAgIHNlbC5hZGRSYW5nZSh0aGlzLnNlbGVjdGlvblJhbmdlKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgc2VsZWN0aW9uSW5FZGl0YWJsZVRhcmdldCgpIHtcbiAgICBjb25zdCBzZWwgPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk7XG4gICAgY29uc3Qgbm9kZSA9XG4gICAgICBzZWwuZ2V0UmFuZ2VBdCAmJlxuICAgICAgc2VsLnJhbmdlQ291bnQgJiZcbiAgICAgIHNlbC5nZXRSYW5nZUF0KDApICYmXG4gICAgICBzZWwuZ2V0UmFuZ2VBdCgwKS5jb21tb25BbmNlc3RvckNvbnRhaW5lcjtcbiAgICByZXR1cm4gKFxuICAgICAgbm9kZSAmJlxuICAgICAgKG5vZGUgPT09IHRoaXMuZWRpdFRhcmdldCB8fFxuICAgICAgICAobm9kZS5wYXJlbnRFbGVtZW50LmNsb3Nlc3QoJy5mYXRlLWVkaXQtdGFyZ2V0JykgJiZcbiAgICAgICAgICBub2RlLnBhcmVudEVsZW1lbnQuY2xvc2VzdCgnLmZhdGUtZWRpdC10YXJnZXQnKSA9PT0gdGhpcy5lZGl0VGFyZ2V0KSlcbiAgICApO1xuICB9XG5cbiAgcHJvdGVjdGVkIGRldGVjdFN0eWxlKCkge1xuICAgIGxldCBub2RlID0gdGhpcy5zZWxlY3Rpb25SYW5nZS5jb21tb25BbmNlc3RvckNvbnRhaW5lcjtcbiAgICBpZiAoXG4gICAgICAhbm9kZSB8fFxuICAgICAgIShcbiAgICAgICAgbm9kZS5wYXJlbnRFbGVtZW50LmNsb3Nlc3QoJy5mYXRlLWVkaXQtdGFyZ2V0JykgJiZcbiAgICAgICAgbm9kZSAhPT0gdGhpcy5lZGl0VGFyZ2V0XG4gICAgICApXG4gICAgKSB7XG4gICAgICAvLyBUaGUgY3VycmVudCBzZWxlY3Rpb24gaXMgbm90IGNvbnRhaW5lZCBpbiB0aGUgZWRpdGFibGUgem9uZS5cbiAgICAgIC8vIHRoaXMgaXMgbW9zdCBsaWtlbHkgZHVlIHRvIHRoZSBpbnB1dCBiZWluZyBlbXB0eS5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gc3BlY2lhbCBjYXNlcyBmb3IgRkYgd2hlbiBzZWxlY3Rpb24gaXMgb2J0YWluZWQgYnkgZG91YmxlIGNsaWNrOlxuICAgIGlmIChcbiAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2UuZW5kT2Zmc2V0ID09PSAwICYmXG4gICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLnN0YXJ0Q29udGFpbmVyLm5vZGVWYWx1ZSAmJlxuICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5zdGFydE9mZnNldCA9PT1cbiAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5zdGFydENvbnRhaW5lci5ub2RlVmFsdWUubGVuZ3RoXG4gICAgKSB7XG4gICAgICBub2RlID0gdGhpcy5zZWxlY3Rpb25SYW5nZS5zdGFydENvbnRhaW5lci5uZXh0U2libGluZztcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5lbmRPZmZzZXQgPT09IDAgJiZcbiAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2Uuc3RhcnRPZmZzZXQgPT09IDBcbiAgICApIHtcbiAgICAgIG5vZGUgPSB0aGlzLnNlbGVjdGlvblJhbmdlLnN0YXJ0Q29udGFpbmVyLnBhcmVudEVsZW1lbnQ7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2UuY29tbW9uQW5jZXN0b3JDb250YWluZXIgPT09IHRoaXMuZWRpdFRhcmdldCAmJlxuICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5zdGFydENvbnRhaW5lciA9PT0gdGhpcy5lZGl0VGFyZ2V0ICYmXG4gICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLmVuZENvbnRhaW5lciA9PT0gdGhpcy5lZGl0VGFyZ2V0XG4gICAgKSB7XG4gICAgICBub2RlID0gdGhpcy5zZWxlY3Rpb25SYW5nZS5jb21tb25BbmNlc3RvckNvbnRhaW5lci5jaGlsZE5vZGVzW1xuICAgICAgICB0aGlzLnNlbGVjdGlvblJhbmdlLnN0YXJ0T2Zmc2V0XG4gICAgICBdO1xuICAgIH1cbiAgICBpZiAobm9kZSAmJiBub2RlICE9PSB0aGlzLmVkaXRUYXJnZXQpIHtcbiAgICAgIGNvbnN0IG5vZGVzID0gdGhpcy5odG1sUGFyc2VyLmZpbmRQYXJlbnROb2Rlcyhub2RlLCB0aGlzLmVkaXRUYXJnZXQpO1xuICAgICAgY29uc29sZS5kZWJ1ZygnICAtPiBkZXRlY3RlZCBhY3Rpb25zOiAnLCBub2Rlcyk7XG4gICAgICB0aGlzLmNvbnRyb2xsZXIuZW5hYmxlQWN0aW9ucyh0aGlzLnVpSWQsIG5vZGVzKTtcbiAgICB9XG4gIH1cblxuICAvLyBpbXBsZW50YXRpb24gb2YgQ29udHJvbFZhbHVlQWNjZXNzb3I6XG4gIHByb3RlY3RlZCBjaGFuZ2VkID0gbmV3IEFycmF5PCh2YWx1ZTogc3RyaW5nKSA9PiB2b2lkPigpO1xuXG4gIHB1YmxpYyB3cml0ZVZhbHVlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMuY29udGVudCA9IHRoaXMuc2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RIdG1sKFxuICAgICAgICB0aGlzLmh0bWxQYXJzZXIuc2VyaWFsaXplKHRoaXMucGFyc2VyLnBhcnNlKHZhbHVlKSlcbiAgICAgICk7XG4gICAgICB0aGlzLmVtcHR5ID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY29udGVudCA9IHRoaXMuc2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RIdG1sKCc8YnI+Jyk7XG4gICAgICB0aGlzLmVtcHR5ID0gdHJ1ZTtcbiAgICB9XG4gICAgdGhpcy5zZWxlY3Rpb25SYW5nZSA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHB1YmxpYyByZWdpc3Rlck9uQ2hhbmdlKGZuOiAodmFsdWU6IHN0cmluZykgPT4gdm9pZCkge1xuICAgIHRoaXMuY2hhbmdlZC5wdXNoKGZuKTtcbiAgfVxuXG4gIHB1YmxpYyByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gdm9pZCkge31cblxuICBwcm90ZWN0ZWQgY2hlY2tGb3JEcm9wZG93bkNvbnRleHQoKSB7XG4gICAgY29uc3Qgc3RhcnRQb3MgPSBNYXRoLm1heCh0aGlzLnNlbGVjdGlvblJhbmdlLnN0YXJ0T2Zmc2V0IC0gMjAsIDApO1xuICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMuc2VsZWN0aW9uUmFuZ2Uuc3RhcnRPZmZzZXQgLSBzdGFydFBvcztcbiAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5zZWxlY3Rpb25SYW5nZS5zdGFydENvbnRhaW5lci50ZXh0Q29udGVudC5zdWJzdHIoXG4gICAgICBzdGFydFBvcyxcbiAgICAgIGxlbmd0aFxuICAgICk7XG5cbiAgICBjb25zdCBpbmxpbmVBY3Rpb24gPSB0aGlzLmNvbnRyb2xsZXIuZ2V0SW5saW5lQWN0aW9uKGNvbnRleHQpO1xuICAgIGlmIChpbmxpbmVBY3Rpb24pIHtcbiAgICAgIGlmIChcbiAgICAgICAgIXRoaXMuaW5saW5lQWN0aW9uIHx8XG4gICAgICAgIHRoaXMuaW5saW5lQWN0aW9uLmRyb3Bkb3duICE9PSBpbmxpbmVBY3Rpb24uZHJvcGRvd25cbiAgICAgICkge1xuICAgICAgICB0aGlzLmlubGluZUFjdGlvbiA9IGlubGluZUFjdGlvbjtcbiAgICAgICAgdGhpcy5pbml0RHJvcGRvd24oXG4gICAgICAgICAgaW5saW5lQWN0aW9uLFxuICAgICAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2UuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaW5saW5lQWN0aW9uID0gaW5saW5lQWN0aW9uO1xuICAgICAgICB0aGlzLnVwZGF0ZURyb3Bkb3duKGlubGluZUFjdGlvbi5tYXRjaGVkKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMuZHJvcGRvd25Db21wb25lbnQpIHtcbiAgICAgIHRoaXMuaW5saW5lQWN0aW9uID0gbnVsbDtcbiAgICAgIHRoaXMuZHJvcGRvd25Db21wb25lbnQuZGVzdHJveSgpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBpbml0RHJvcGRvd24oYWN0aW9uQ29tcG9uZW50LCBwb3NpdGlvbikge1xuICAgIC8vIHNldCB0aGUgZHJvcGRvd24gY29tcG9uZW50XG4gICAgaWYgKHRoaXMuZHJvcGRvd25Db21wb25lbnQpIHtcbiAgICAgIHRoaXMuZHJvcGRvd25Db21wb25lbnQuZGVzdHJveSgpO1xuICAgIH1cbiAgICBjb25zdCBmYWN0b3J5ID0gdGhpcy5mYWN0b3J5UmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkoXG4gICAgICBhY3Rpb25Db21wb25lbnQuZHJvcGRvd25cbiAgICApO1xuICAgIGNvbnN0IGNvbXBvbmVudDogYW55ID0gZmFjdG9yeS5jcmVhdGUodGhpcy52aWV3Q29udGFpbmVyUmVmLnBhcmVudEluamVjdG9yKTtcbiAgICBpZiAoY29tcG9uZW50Lmluc3RhbmNlLnZhbHVlQ2hhbmdlKSB7XG4gICAgICBjb21wb25lbnQuaW5zdGFuY2UudmFsdWUgPSBhY3Rpb25Db21wb25lbnQubWF0Y2hlZDtcbiAgICAgIGNvbXBvbmVudC5pbnN0YW5jZS52YWx1ZUNoYW5nZS5zdWJzY3JpYmUodmFsdWUgPT4ge1xuICAgICAgICB0aGlzLmVkaXRUYXJnZXQuZm9jdXMoKTtcbiAgICAgICAgY29uc3QgZW5kID0gdGhpcy5zZWxlY3Rpb25SYW5nZS5lbmRPZmZzZXQ7XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uUmFuZ2Uuc2V0U3RhcnQoXG4gICAgICAgICAgdGhpcy5zZWxlY3Rpb25SYW5nZS5lbmRDb250YWluZXIsXG4gICAgICAgICAgZW5kIC0gYWN0aW9uQ29tcG9uZW50Lm1hdGNoZWQubGVuZ3RoXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuY29udHJvbGxlci5kb0lubGluZSh0aGlzLnVpSWQsIHRoaXMuaW5saW5lQWN0aW9uLCB2YWx1ZSk7XG4gICAgICAgIC8vIGRlbGV0ZSB0aGUgZHJvcGRvd25cbiAgICAgICAgdGhpcy5pbmxpbmVBY3Rpb24gPSBudWxsO1xuICAgICAgICB0aGlzLmRyb3Bkb3duQ29tcG9uZW50LmRlc3Ryb3koKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5kcm9wZG93bkNvbXBvbmVudCA9IHRoaXMudmlld0NvbnRhaW5lclJlZi5pbnNlcnQoY29tcG9uZW50Lmhvc3RWaWV3KTtcbiAgICAgIHRoaXMuZHJvcGRvd25JbnN0YW5jZSA9IGNvbXBvbmVudC5pbnN0YW5jZTtcbiAgICAgIHRoaXMudXBkYXRlRHJvcGRvd25Qb3NpdGlvbigpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdUaGUgY29tcG9uZW50IHVzZWQgYXMgYSBkcm9wZG93biBkb2VzblxcJ3QgY29udGFpbiBhIHZhbHVlQ2hhbmdlIGVtbWl0ZXIhJ1xuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgdXBkYXRlRHJvcGRvd24odmFsdWUpIHtcbiAgICB0aGlzLmRyb3Bkb3duSW5zdGFuY2UudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLnVwZGF0ZURyb3Bkb3duUG9zaXRpb24oKTtcbiAgfVxuXG4gIHByb3RlY3RlZCB1cGRhdGVEcm9wZG93blBvc2l0aW9uKCkge1xuICAgIGlmICh0aGlzLmlubGluZUFjdGlvbi5kaXNwbGF5ID09PSAnY29udGV4dHVhbCcpIHtcbiAgICAgIC8vIGNyZWF0ZSBhIHNlbGVjdGlvbiB0byBnZXQgdGhlIHNpemUgb2YgdGhlIG1hdGNoaW5nIHRleHRcbiAgICAgIGNvbnN0IHBhcmVudE9mZnNldEJCID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50Lm9mZnNldFBhcmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIGNvbnN0IHJhbmdlID0gdGhpcy5zZWxlY3Rpb25SYW5nZS5jbG9uZVJhbmdlKCk7XG4gICAgICBjb25zdCBlbmQgPSByYW5nZS5lbmRPZmZzZXQ7XG4gICAgICByYW5nZS5zZXRTdGFydChcbiAgICAgICAgcmFuZ2UuZW5kQ29udGFpbmVyLFxuICAgICAgICBlbmQgLSB0aGlzLmlubGluZUFjdGlvbi5tYXRjaGVkLmxlbmd0aFxuICAgICAgKTtcbiAgICAgIGNvbnN0IGJvdW5kaW5nQm94ID0gcmFuZ2UuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICB0aGlzLmRyb3Bkb3duUG9zdGlvblRvcCA9XG4gICAgICAgIGJvdW5kaW5nQm94LnRvcCArIGJvdW5kaW5nQm94LmhlaWdodCAtIHBhcmVudE9mZnNldEJCLnRvcCArICdweCc7XG4gICAgICB0aGlzLmRyb3Bkb3duUG9zdGlvbkxlZnQgPSBib3VuZGluZ0JveC5sZWZ0IC0gcGFyZW50T2Zmc2V0QkIubGVmdCArICdweCc7XG4gICAgfVxuICB9XG59XG4iXX0=