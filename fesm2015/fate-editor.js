import { __decorate, __param } from 'tslib';
import { EventEmitter, Input, Output, Component, ɵɵdefineInjectable, Injectable, ElementRef, ComponentFactoryResolver, HostListener, ViewChild, ViewContainerRef, Optional, Self, HostBinding, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, NgControl, FormsModule } from '@angular/forms';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

var FateType;
(function (FateType) {
    FateType["NONE"] = "NONE";
    FateType["PARAGRAPH"] = "PARAGRAPH";
    FateType["HEADER1"] = "HEADER1";
    FateType["HEADER2"] = "HEADER2";
    FateType["HEADER3"] = "HEADER3";
    FateType["HEADER4"] = "HEADER4";
    FateType["HEADER5"] = "HEADER5";
    FateType["HEADER6"] = "HEADER6";
    FateType["QUOTE"] = "QUOTE";
    FateType["CODE"] = "CODE";
    FateType["SIZE"] = "SIZE";
    FateType["BOLD"] = "BOLD";
    FateType["HIGHLIGHT"] = "HIGHLIGHT";
    FateType["SUBSCRIPT"] = "SUBSCRIPT";
    FateType["SUPERSCRIPT"] = "SUPERSCRIPT";
    FateType["STRIKETHROUGH"] = "STRIKETHROUGH";
    FateType["ITALIC"] = "ITALIC";
    FateType["COLOR"] = "COLOR";
    FateType["UNDERLINE"] = "UNDERLINE";
    FateType["LINK"] = "LINK";
    FateType["ALIGN_LEFT"] = "ALIGN_LEFT";
    FateType["ALIGN_CENTER"] = "ALIGN_CENTER";
    FateType["ALIGN_RIGHT"] = "ALIGN_RIGHT";
    FateType["JUSTIFY"] = "JUSTIFY";
    FateType["ORDERED_LIST"] = "ORDERED_LIST";
    FateType["UNORDERED_LIST"] = "UNORDERED_LIST";
    FateType["LISTITEM"] = "LISTITEM";
    FateType["INDENT"] = "INDENT";
    FateType["TYPEFACE"] = "TYPEFACE";
})(FateType || (FateType = {}));

let FateLinkDropdownComponent = class FateLinkDropdownComponent {
    constructor() {
        this.valueChange = new EventEmitter();
    }
    changeValue(value) {
        this.value = value;
        this.valueChange.emit(value);
    }
    selectNext() { }
    ;
    selecPrevious() { }
    ;
    confirmSelection() { }
    ;
};
__decorate([
    Input()
], FateLinkDropdownComponent.prototype, "value", void 0);
__decorate([
    Output()
], FateLinkDropdownComponent.prototype, "valueChange", void 0);
FateLinkDropdownComponent = __decorate([
    Component({
        selector: 'fate-link-dropdown',
        template: "<input type=\"text\" [ngModel]=\"value\" (ngModelChange)=\"changeValue($event)\" placeholder=\"http://\">\n",
        styles: [""]
    })
], FateLinkDropdownComponent);

let FateControllerService = class FateControllerService {
    constructor() {
        // List of available commands, alphabetically
        // see https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
        this.actionMapping = {
            'bold': {
                command: 'bold',
                name: 'Bold',
                detect: FateType.BOLD
            },
            'italic': {
                command: 'italic',
                name: 'Italic',
                detect: FateType.ITALIC
            },
            'underline': {
                command: 'underline',
                name: 'Underlined',
                detect: FateType.UNDERLINE
            },
            'strike': {
                command: 'strikeThrough',
                name: 'Strike Through',
                detect: FateType.STRIKETHROUGH
            },
            'subscript': {
                command: 'subscript',
                name: 'Subscript',
                label: 'sub',
                detect: FateType.SUBSCRIPT
            },
            'superscript': {
                command: 'superscript',
                name: 'Superscript',
                label: 'sup',
                detect: FateType.SUPERSCRIPT
            },
            'heading1': {
                command: 'formatBlock',
                value: 'H1',
                name: '1st Header',
                label: 'h1',
                detect: FateType.HEADER1
            },
            'heading2': {
                command: 'formatBlock',
                value: 'H2',
                name: '2nd Header',
                label: 'h2',
                detect: FateType.HEADER2
            },
            'heading3': {
                command: 'formatBlock',
                value: 'H3',
                name: '3rd Header',
                label: 'h3',
                detect: FateType.HEADER3
            },
            'heading4': {
                command: 'formatBlock',
                value: 'H4',
                name: '4th Header',
                label: 'h4',
                detect: FateType.HEADER4
            },
            'heading5': {
                command: 'formatBlock',
                value: 'H5',
                name: '5th Header',
                label: 'h5',
                detect: FateType.HEADER5
            },
            'heading6': {
                command: 'formatBlock',
                value: 'H6',
                name: '6th Header',
                label: 'h6',
                detect: FateType.HEADER6
            },
            'normal': {
                command: 'formatBlock',
                value: 'DIV',
                name: 'Normal',
                label: 'p',
            },
            'indent': {
                command: 'indent',
                name: 'Indent',
            },
            'outdent': {
                command: 'outdent',
                name: 'Outdent',
            },
            'ordered': {
                command: 'insertOrderedList',
                name: 'Ordered List',
                detect: FateType.ORDERED_LIST
            },
            'unordered': {
                command: 'insertUnorderedList',
                name: 'Unorder List',
                detect: FateType.UNORDERED_LIST
            },
            'center': {
                command: 'justifyCenter',
                name: 'Center',
                detect: FateType.ALIGN_CENTER
            },
            'justify': {
                command: 'justifyFull',
                name: 'Justify',
                detect: FateType.JUSTIFY
            },
            'left': {
                command: 'justifyLeft',
                name: 'Left',
                detect: FateType.ALIGN_LEFT
            },
            'right': {
                command: 'justifyRight',
                name: 'Right',
                detect: FateType.ALIGN_RIGHT
            },
            'undo': {
                command: 'undo',
                name: 'Undo',
            },
            'redo': {
                command: 'redo',
                name: 'Redo',
            },
            'clean': {
                command: 'removeFormat',
                name: 'Remove Formating',
            },
            'link': {
                command: 'createLink',
                undo: 'unlink',
                name: 'Link',
                detect: FateType.LINK,
                dropdown: FateLinkDropdownComponent
            }
        };
        this.inlineActionMapping = {};
        this.commandsPipe = {
            default: new Subject()
        };
        this.enabledActions = {
            default: new Subject()
        };
    }
    registerAction(name, action) {
        if (this.actionMapping[name]) {
            throw new Error('An action with the name "' + name + '" already exists!');
        }
        else {
            this.actionMapping[name] = action;
        }
    }
    getAction(actionName) {
        return this.actionMapping[actionName] || false;
    }
    registerInlineAction(name, action) {
        if (this.inlineActionMapping[name]) {
            throw new Error('An inline action with the name "' + name + '" already exists!');
        }
        else {
            this.inlineActionMapping[name] = action;
        }
    }
    getInlineAction(context) {
        for (const action of Object.keys(this.inlineActionMapping)) {
            const match = this.inlineActionMapping[action].regexp.exec(context);
            if (match) {
                this.inlineActionMapping[action].matched = match[1];
                return this.inlineActionMapping[action];
            }
        }
        return false;
    }
    channel(channelId) {
        if (!this.commandsPipe[channelId]) {
            this.commandsPipe[channelId] = new Subject();
        }
        return this.commandsPipe[channelId];
    }
    enabled(channelId) {
        if (!this.enabledActions[channelId]) {
            this.enabledActions[channelId] = new Subject();
        }
        return this.enabledActions[channelId];
    }
    enableActions(channelId, nodes) {
        const actions = [];
        for (const node of nodes) {
            for (const action in this.actionMapping) {
                if (this.actionMapping[action].detect && this.actionMapping[action].detect === node.type) {
                    actions.push({ action: action, value: node.value });
                }
                else if (this.actionMapping[action].detect && typeof this.actionMapping[action].detect === 'function') {
                    const detected = this.actionMapping[action].detect(node);
                    if (detected) {
                        actions.push({ action: action, value: detected.value });
                    }
                }
            }
        }
        this.enabledActions[channelId].next(actions);
    }
    do(channel, action, value) {
        if (this.actionMapping[action].dropdown && !value) {
            if (this.actionMapping[action].undo) {
                this.commandsPipe[channel].next({ name: this.actionMapping[action].undo, value: this.actionMapping[action].value || value });
            }
            else {
                throw new Error('Action "' + action + '"doesn\'t have a undo command');
            }
        }
        else {
            if (this.actionMapping[action].value && (typeof this.actionMapping[action].value === 'function')) {
                this.commandsPipe[channel].next({ name: this.actionMapping[action].command, value: this.actionMapping[action].value(value) });
            }
            else {
                this.commandsPipe[channel].next({ name: this.actionMapping[action].command, value: this.actionMapping[action].value || value });
            }
        }
    }
    doInline(channel, action, value) {
        if (action.dropdown && !value) {
            if (action.undo) {
                this.commandsPipe[channel].next({ name: action.undo, value: action.value || value });
            }
            else {
                throw new Error('Action "' + action + '"doesn\'t have a undo command');
            }
        }
        else {
            if (action.value && (typeof action.value === 'function')) {
                this.commandsPipe[channel].next({ name: action.command, value: action.value(value) });
            }
            else {
                this.commandsPipe[channel].next({ name: action.command, value: action.value || value });
            }
        }
    }
    undo(channel, action, value) {
        const mapping = this.actionMapping[action].undo;
        // TODO
    }
};
FateControllerService.ɵprov = ɵɵdefineInjectable({ factory: function FateControllerService_Factory() { return new FateControllerService(); }, token: FateControllerService, providedIn: "root" });
FateControllerService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], FateControllerService);

class FateNode {
    constructor(type = FateType.NONE, value) {
        this.type = type;
        this.value = value;
        this.children = [];
    }
}

let FateHtmlParserService = class FateHtmlParserService {
    constructor() { }
    parse(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return this.parseElement(div);
    }
    ;
    parseElement(element) {
        const nodes = this.parseType(element);
        let currentNode = nodes[0];
        let isABlock = (currentNode.type === FateType.PARAGRAPH);
        for (let i = 1; i < nodes.length; i++) {
            currentNode.children.push(nodes[i]);
            currentNode = nodes[i];
            if (currentNode.type === FateType.PARAGRAPH) {
                isABlock = true;
            }
        }
        let previousNodeWasText = false;
        for (let i = 0; i < element.childNodes.length; i++) {
            const child = element.childNodes[i];
            // pick ahead to look for <br>
            if ((i < element.childNodes.length - 1) &&
                (this.isLinebreak(element.childNodes[i + 1])) &&
                !(isABlock && i === element.childNodes.length - 2) // The last child is a BR in a block, this can be ignored
            ) {
                previousNodeWasText = false;
                if (child instanceof Text) {
                    // wrap the text in a paragraph
                    const paragraph = new FateNode(FateType.PARAGRAPH);
                    paragraph.children.push(child.data);
                    currentNode.children.push(paragraph);
                }
                else if (child instanceof HTMLElement) {
                    // insert an empty paragraph
                    currentNode.children.push(this.parseElement(child));
                    currentNode.children.push(new FateNode(FateType.PARAGRAPH));
                }
                else {
                    // ignore
                }
            }
            else {
                if (child instanceof Text) {
                    // If two "pure" text node follow one another we can safely merge then as one (for i > 0)
                    if (previousNodeWasText) {
                        currentNode.children[currentNode.children.length - 1] = currentNode.children[currentNode.children.length - 1] + child.data;
                    }
                    else {
                        currentNode.children.push(child.data);
                    }
                    previousNodeWasText = true;
                }
                else if (child instanceof HTMLElement) {
                    currentNode.children.push(this.parseElement(child));
                    previousNodeWasText = false;
                }
                else {
                    // ignore
                }
            }
        }
        return nodes[0];
    }
    findParentNodes(node, until) {
        const nodes = [];
        let current = (node.nodeType === 1) ? node : node.parentElement;
        while (current !== until) {
            nodes.push(...this.parseType(current));
            current = current.parentElement;
        }
        return nodes;
    }
    getAdditonalStyle(element) {
        const style = element.style;
        const detectedStyleNode = [];
        // Look for alignement
        const align = element.getAttribute('align') || style.textAlign;
        switch (align) {
            case 'left':
                detectedStyleNode.push(new FateNode(FateType.ALIGN_LEFT));
                break;
            case 'center':
                detectedStyleNode.push(new FateNode(FateType.ALIGN_CENTER));
                break;
            case 'right':
                detectedStyleNode.push(new FateNode(FateType.ALIGN_RIGHT));
                break;
            case 'justify':
                detectedStyleNode.push(new FateNode(FateType.JUSTIFY));
                break;
        }
        // Look for color
        const color = element.getAttribute('color') || style.color;
        if (color) {
            detectedStyleNode.push(new FateNode(FateType.COLOR, color));
        }
        // Look for size
        const size = element.getAttribute('size') || style.fontSize;
        if (size) {
            detectedStyleNode.push(new FateNode(FateType.SIZE, size));
        }
        // Look for family
        const typeface = element.getAttribute('face') || style.fontFamily;
        if (typeface) {
            detectedStyleNode.push(new FateNode(FateType.TYPEFACE, typeface));
        }
        return detectedStyleNode;
    }
    parseType(element) {
        const additionaStyle = this.getAdditonalStyle(element);
        switch (element.nodeName) {
            case 'H1':
                return [new FateNode(FateType.HEADER1), ...additionaStyle];
            case 'H2':
                return [new FateNode(FateType.HEADER2), ...additionaStyle];
            case 'H3':
                return [new FateNode(FateType.HEADER3), ...additionaStyle];
            case 'H4':
                return [new FateNode(FateType.HEADER4), ...additionaStyle];
            case 'H5':
                return [new FateNode(FateType.HEADER5), ...additionaStyle];
            case 'H6':
                return [new FateNode(FateType.HEADER6), ...additionaStyle];
            case 'B':
            case 'STRONG':
                return [new FateNode(FateType.BOLD)];
            case 'I':
            case 'EM':
                return [new FateNode(FateType.ITALIC)];
            case 'U':
                return [new FateNode(FateType.UNDERLINE)];
            case 'STRIKE':
                return [new FateNode(FateType.STRIKETHROUGH)];
            case 'SUB':
                return [new FateNode(FateType.SUBSCRIPT)];
            case 'SUP':
                return [new FateNode(FateType.SUPERSCRIPT)];
            case 'A':
                return [new FateNode(FateType.LINK, element.getAttribute('href'))];
            case 'OL':
                return [new FateNode(FateType.ORDERED_LIST)];
            case 'UL':
                return [new FateNode(FateType.UNORDERED_LIST)];
            case 'LI':
                return [new FateNode(FateType.LISTITEM)];
            case 'DIV':
            case 'P':
                if (additionaStyle.length > 0) {
                    return [...additionaStyle];
                }
                return [new FateNode(FateType.PARAGRAPH)];
            case 'BLOCKQUOTE':
                // FIXME: this doesn't work on FF
                if (element.style.marginLeft === '40px') {
                    return [new FateNode(FateType.INDENT)];
                }
                return [new FateNode(FateType.NONE)];
            default:
                if (additionaStyle.length > 0) {
                    return [...additionaStyle];
                }
                return [new FateNode(FateType.NONE)];
        }
    }
    parseValue(element) {
        switch (element.nodeName) {
            case 'A':
                return element.getAttribute('href');
        }
        return undefined;
    }
    serializeType(node) {
        switch (node.type) {
            case FateType.PARAGRAPH:
                return '<div>' + this.serialize(node, true) + '</div>';
            case FateType.HEADER1:
                return '<h1>' + this.serialize(node, true) + '</h1>';
            case FateType.HEADER2:
                return '<h2>' + this.serialize(node, true) + '</h2>';
            case FateType.HEADER3:
                return '<h3>' + this.serialize(node, true) + '</h3>';
            case FateType.HEADER4:
                return '<h4>' + this.serialize(node, true) + '</h4>';
            case FateType.HEADER5:
                return '<h5>' + this.serialize(node, true) + '</h5>';
            case FateType.HEADER6:
                return '<h6>' + this.serialize(node, true) + '</h6>';
            case FateType.QUOTE:
                return '<quote>' + this.serialize(node) + '</quote>';
            case FateType.CODE:
                return '<code>' + this.serialize(node) + '</code>';
            case FateType.BOLD:
                return '<strong>' + this.serialize(node) + '</strong>';
            case FateType.ITALIC:
                return '<em>' + this.serialize(node) + '</em>';
            case FateType.UNDERLINE:
                return '<u>' + this.serialize(node) + '</u>';
            case FateType.STRIKETHROUGH:
                return '<strike>' + this.serialize(node) + '</strike>';
            case FateType.SUBSCRIPT:
                return '<sub>' + this.serialize(node) + '</sub>';
            case FateType.SUPERSCRIPT:
                return '<sup>' + this.serialize(node) + '</sup>';
            case FateType.LINK:
                return '<a href="' + node.value + '">' + this.serialize(node) + '</a>';
            case FateType.ORDERED_LIST:
                return '<ol>' + this.serialize(node) + '</ol>';
            case FateType.UNORDERED_LIST:
                return '<ul>' + this.serialize(node) + '</ul>';
            case FateType.LISTITEM:
                return '<li>' + this.serialize(node) + '</li>';
            case FateType.ALIGN_LEFT:
                return '<div style="text-align: left;">' + this.serialize(node, true) + '</div>';
            case FateType.ALIGN_CENTER:
                return '<div style="text-align: center;">' + this.serialize(node, true) + '</div>';
            case FateType.ALIGN_RIGHT:
                return '<div style="text-align: right">' + this.serialize(node, true) + '</div>';
            case FateType.JUSTIFY:
                return '<div style="text-align: justify;">' + this.serialize(node, true) + '</div>';
            case FateType.INDENT:
                return '<blockquote style="margin-left: 40px">' + this.serialize(node, true) + '</blockquote>';
            case FateType.COLOR:
                return '<font color="' + node.value + '">' + this.serialize(node) + '</font>';
            case FateType.SIZE:
                return '<font size="' + node.value + '">' + this.serialize(node) + '</font>';
            case FateType.TYPEFACE:
                return '<font face="' + node.value + '">' + this.serialize(node) + '</font>';
            case FateType.NONE:
                return this.serialize(node);
        }
    }
    ;
    isLinebreak(child) {
        return (child instanceof HTMLElement && child.nodeName === 'BR');
    }
    // Saves a Tree in string representation
    serialize(node, fallbackToBr = false) {
        let serialized = '';
        node.children.forEach((child) => {
            if (typeof child === 'string') {
                serialized += child;
            }
            else {
                serialized += this.serializeType(child);
            }
        });
        if (fallbackToBr && !serialized) {
            serialized = '<br>';
        }
        return serialized;
    }
    ;
};
FateHtmlParserService.ɵprov = ɵɵdefineInjectable({ factory: function FateHtmlParserService_Factory() { return new FateHtmlParserService(); }, token: FateHtmlParserService, providedIn: "root" });
FateHtmlParserService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], FateHtmlParserService);

let FateParserService = class FateParserService extends FateHtmlParserService {
};
FateParserService.ɵprov = ɵɵdefineInjectable({ factory: function FateParserService_Factory() { return new FateParserService(); }, token: FateParserService, providedIn: "root" });
FateParserService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], FateParserService);

let FateIconService = class FateIconService {
    constructor() {
        // font awesome
        this.iconMapping = {
            bold: 'bold',
            italic: 'italic',
            underline: 'underline',
            strike: 'strikethrough',
            subscript: 'subscript',
            superscript: 'superscript',
            indent: 'indent',
            outdent: 'outdent',
            ordered: 'list-ol',
            unordered: 'list-ul',
            center: 'align-center',
            justify: 'align-justify',
            left: 'align-left',
            right: 'align-right',
            undo: 'undo-alt',
            redo: 'redo-alt',
            clean: 'eraser',
            link: 'link'
        };
    }
    getIcon(actionName) {
        return this.iconMapping[actionName];
    }
};
FateIconService.ɵprov = ɵɵdefineInjectable({ factory: function FateIconService_Factory() { return new FateIconService(); }, token: FateIconService, providedIn: "root" });
FateIconService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], FateIconService);

const defaultButtons = [
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

var FateInputComponent_1;
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

var FateBootstrapComponent_1;
let instanceCounter = 0;
let FateBootstrapComponent = FateBootstrapComponent_1 = class FateBootstrapComponent {
    constructor(el, controller, parser, icon, factoryResolver) {
        this.buttons = defaultButtons;
        // implentation of ControlValueAccessor:
        this.changed = new Array();
        this.clickOngoing = false;
        this.uiId = 'bootstrap-' + (instanceCounter++);
    }
    blur(event) {
        if (!this.clickOngoing) {
            this.uiVisible = false;
        }
    }
    mousedown(event) {
        this.clickOngoing = true;
    }
    mouseup(event) {
        this.clickOngoing = false;
    }
    focus(event) {
        this.uiVisible = true;
        console.info('boostrap focus!');
    }
    writeValue(value) {
        this.passthrough = value;
    }
    registerOnChange(fn) {
        this.changed.push(fn);
    }
    registerOnTouched(fn) { }
    // change callback
    onChange(value) {
        this.passthrough = value;
        this.changed.forEach(f => f(value));
    }
};
FateBootstrapComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: FateControllerService },
    { type: FateParserService },
    { type: FateIconService },
    { type: ComponentFactoryResolver }
];
__decorate([
    Input()
], FateBootstrapComponent.prototype, "row", void 0);
__decorate([
    Input()
], FateBootstrapComponent.prototype, "placeholder", void 0);
__decorate([
    Input()
], FateBootstrapComponent.prototype, "buttons", void 0);
__decorate([
    HostListener('focusout', ['$event'])
], FateBootstrapComponent.prototype, "blur", null);
__decorate([
    HostListener('mousedown', ['$event'])
], FateBootstrapComponent.prototype, "mousedown", null);
__decorate([
    HostListener('mouseup', ['$event'])
], FateBootstrapComponent.prototype, "mouseup", null);
__decorate([
    HostListener('focusin', ['$event'])
], FateBootstrapComponent.prototype, "focus", null);
FateBootstrapComponent = FateBootstrapComponent_1 = __decorate([
    Component({
        selector: 'fate-bootstrap',
        template: "<fate-input customClass=\"form-control\" [uiId]=\"uiId\" [row]=\"row\" [placeholder]=\"placeholder\" [ngModel]=\"passthrough\" (ngModelChange)=\"onChange($event)\"></fate-input>\n<fate-ui [uiId]=\"uiId\" [buttons]=\"buttons\" [ngClass]=\"{'visible': uiVisible}\" class=\"tooltip tooltip-inner\"></fate-ui>\n",
        providers: [
            { provide: NG_VALUE_ACCESSOR, useExisting: FateBootstrapComponent_1, multi: true }
        ],
        styles: [":host{margin-bottom:10px;display:block;position:relative}:host fate-ui{display:block;position:absolute;opacity:0;pointer-events:none;transition:opacity .3s;text-align:left;background:#222;color:#eee;max-width:100%}:host fate-ui.visible{opacity:1;pointer-events:all}:host fate-ui ::ng-deep .fate-ui-button{color:#eee}:host fate-ui ::ng-deep .fate-ui-button.enabled,:host fate-ui ::ng-deep .fate-ui-button.with-dropdown,:host fate-ui ::ng-deep .fate-ui-button:active{background-color:#555}:host fate-ui ::ng-deep .fate-ui-button:focus,:host fate-ui ::ng-deep .fate-ui-button:hover{background-color:#666}:host fate-ui ::ng-deep .fate-ui-separator{background-color:#666!important}:host fate-ui ::ng-deep .fate-ui-dropdown{background-color:#555;border-color:#666}:host fate-input ::ng-deep .fate-edit-target{resize:vertical;padding:.375rem .75rem}:host fate-input ::ng-deep .fate-inline-dropdown{display:block;transition:opacity .3s;background:#222;color:#eee;border-radius:.25rem;z-index:1080}"]
    })
], FateBootstrapComponent);

let FateMaterialIconService = class FateMaterialIconService extends FateIconService {
};
FateMaterialIconService.ɵprov = ɵɵdefineInjectable({ factory: function FateMaterialIconService_Factory() { return new FateMaterialIconService(); }, token: FateMaterialIconService, providedIn: "root" });
FateMaterialIconService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], FateMaterialIconService);

var FateMaterialComponent_1;
let instanceCounter$1 = 0;
let FateMaterialComponent = FateMaterialComponent_1 = class FateMaterialComponent {
    constructor(controller, parser, icon, el, ngControl) {
        this.ngControl = ngControl;
        this.buttons = defaultButtons;
        this.id = `${this.uiId}`;
        this.clickOngoing = false;
        this.uiVisible = false;
        this._required = false;
        this._disabled = false;
        this.errorState = false;
        this.controlType = 'fate-material';
        this.describedBy = '';
        this.stateChanges = new Subject();
        this.focused = false;
        this.changed = new Array();
        this.uiId = 'material-' + (instanceCounter$1++);
        // Setting the value accessor directly (instead of using
        // the providers) to avoid running into a circular import.
        if (this.ngControl != null) {
            this.ngControl.valueAccessor = this;
        }
    }
    get value() {
        return this.passthrough;
    }
    set value(value) {
        this.stateChanges.next();
        this.passthrough = value;
        this.changed.forEach(f => f(value));
    }
    get placeholder() {
        return this._placeholder;
    }
    set placeholder(placeholder) {
        this._placeholder = placeholder;
        this.stateChanges.next();
    }
    blur() {
        this.focused = false;
        this.stateChanges.next();
        if (!this.clickOngoing) {
            this.uiVisible = false;
        }
    }
    focus() {
        this.focused = true;
        this.uiVisible = true;
        this.stateChanges.next();
    }
    mousedown(event) {
        this.clickOngoing = true;
    }
    mouseup(event) {
        this.clickOngoing = false;
    }
    get empty() {
        return !this.passthrough || this.passthrough === '';
    }
    get shouldLabelFloat() {
        return this.focused || !this.empty;
    }
    get required() {
        return this._required;
    }
    set required(req) {
        this._required = coerceBooleanProperty(req);
        this.stateChanges.next();
    }
    get disabled() {
        return this._disabled;
    }
    set disabled(dis) {
        this._disabled = coerceBooleanProperty(dis);
        this.stateChanges.next();
    }
    setDescribedByIds(ids) {
        this.describedBy = ids.join(' ');
    }
    onContainerClick(event) { }
    onChange(value) {
        this.passthrough = value;
        this.changed.forEach(f => f(value));
        this.stateChanges.next();
    }
    ngOnDestroy() {
        this.stateChanges.complete();
    }
    writeValue(value) {
        this.passthrough = value;
        this.stateChanges.next();
    }
    registerOnChange(fn) {
        this.changed.push(fn);
    }
    registerOnTouched(fn) { }
};
FateMaterialComponent.ctorParameters = () => [
    { type: FateControllerService },
    { type: FateParserService },
    { type: FateIconService },
    { type: ElementRef },
    { type: NgControl, decorators: [{ type: Optional }, { type: Self }] }
];
__decorate([
    Input()
], FateMaterialComponent.prototype, "row", void 0);
__decorate([
    Input()
], FateMaterialComponent.prototype, "buttons", void 0);
__decorate([
    Input()
], FateMaterialComponent.prototype, "value", null);
__decorate([
    Input()
], FateMaterialComponent.prototype, "placeholder", null);
__decorate([
    HostBinding()
], FateMaterialComponent.prototype, "id", void 0);
__decorate([
    HostListener('focusout')
], FateMaterialComponent.prototype, "blur", null);
__decorate([
    HostListener('focusin')
], FateMaterialComponent.prototype, "focus", null);
__decorate([
    HostListener('mousedown', ['$event'])
], FateMaterialComponent.prototype, "mousedown", null);
__decorate([
    HostListener('mouseup', ['$event'])
], FateMaterialComponent.prototype, "mouseup", null);
__decorate([
    Input()
], FateMaterialComponent.prototype, "required", null);
__decorate([
    Input()
], FateMaterialComponent.prototype, "disabled", null);
__decorate([
    HostBinding('attr.aria-describedby')
], FateMaterialComponent.prototype, "describedBy", void 0);
FateMaterialComponent = FateMaterialComponent_1 = __decorate([
    Component({
        selector: 'fate-material',
        template: "<fate-input customClass=\"\" [uiId]=\"uiId\" [row]=\"row\" [ngModel]=\"passthrough\" (ngModelChange)=\"onChange($event)\"></fate-input>\n<fate-ui class=\"mat-select-panel\" [uiId]=\"uiId\" [buttons]=\"buttons\" [ngClass]=\"{'visible': uiVisible}\"></fate-ui>\n",
        providers: [
            { provide: MatFormFieldControl, useExisting: FateMaterialComponent_1 },
            { provide: FateIconService, useClass: FateMaterialIconService }
        ],
        styles: [":host{display:block;position:relative}:host fate-ui{display:block;position:absolute;opacity:0;pointer-events:none;transition:opacity .3s;text-align:left;box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);background:#fff;z-index:1;transform:translateY(10px);max-width:100%;padding:0}:host fate-ui.visible{opacity:1;pointer-events:all}:host fate-ui ::ng-deep .fate-ui-button{height:40px;line-height:23px;padding:7px 0 11px;width:40px;border-radius:0;margin-right:-4px;margin-bottom:0;vertical-align:middle}:host fate-ui ::ng-deep .fate-ui-button.enabled,:host fate-ui ::ng-deep .fate-ui-button.with-dropdown,:host fate-ui ::ng-deep .fate-ui-button:active{background-color:#eee}:host fate-ui ::ng-deep .fate-ui-button:focus,:host fate-ui ::ng-deep .fate-ui-button:hover{background-color:#dfdfdf}:host fate-ui ::ng-deep .fate-ui-dropdown{background-color:#eee}:host fate-ui ::ng-deep .fate-ui-separator{height:36px;border-radius:0;width:1px;vertical-align:middle;background-color:#dfdfdf;margin:2px -4px 2px -1px}:host fate-input ::ng-deep div.fate-edit-target{border:none;background:0 0;color:inherit;padding:0;outline:0;font:inherit;resize:vertical;margin-bottom:0}:host fate-input ::ng-deep .fate-inline-dropdown{display:block;position:absolute;transition:opacity .3s;box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);background:#fff;z-index:2;padding:0}"]
    }),
    __param(4, Optional()), __param(4, Self())
], FateMaterialComponent);

let FateFontawsomeLegacyIconService = class FateFontawsomeLegacyIconService extends FateIconService {
    constructor() {
        super(...arguments);
        this.iconMapping = {
            'bold': '<i class="fa fa-bold"></i>',
            'italic': '<i class="fa fa-italic"></i>',
            'underline': '<i class="fa fa-underline"></i>',
            'strike': '<i class="fa fa-strikethrough"></i>',
            'subscript': '<i class="fa fa-subscript"></i>',
            'superscript': '<i class="fa fa-superscript"></i>',
            'indent': '<i class="fa fa-indent"></i>',
            'outdent': '<i class="fa fa-outdent"></i>',
            'ordered': '<i class="fa fa-list-ol"></i>',
            'unordered': '<i class="fa fa-list-ul"></i>',
            'center': '<i class="fa fa-align-center"></i>',
            'justify': '<i class="fa fa-align-justify"></i>',
            'left': '<i class="fa fa-align-left"></i>',
            'right': '<i class="fa fa-align-right"></i>',
            'undo': '<i class="fa fa-undo"></i>',
            'redo': '<i class="fa fa-repeat"></i>',
            'clean': '<i class="fa fa-eraser"></i>',
            'link': '<i class="fa fa-link"></i>',
        };
    }
};
FateFontawsomeLegacyIconService.ɵprov = ɵɵdefineInjectable({ factory: function FateFontawsomeLegacyIconService_Factory() { return new FateFontawsomeLegacyIconService(); }, token: FateFontawsomeLegacyIconService, providedIn: "root" });
FateFontawsomeLegacyIconService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], FateFontawsomeLegacyIconService);

let FateModule = class FateModule {
};
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
let FateMaterialModule = class FateMaterialModule {
};
FateMaterialModule = __decorate([
    NgModule({
        declarations: [FateMaterialComponent],
        imports: [CommonModule, FormsModule, MatFormFieldModule, FateModule],
        exports: [FateMaterialComponent]
    })
], FateMaterialModule);

/**
 * Generated bundle index. Do not edit.
 */

export { FateControllerService, FateFontawsomeLegacyIconService, FateHtmlParserService, FateIconService, FateInputComponent, FateLinkDropdownComponent, FateMaterialIconService, FateMaterialModule, FateModule, FateNode, FateParserService, FateType, FateUiComponent, FateBootstrapComponent as ɵa, FateMaterialComponent as ɵb };
//# sourceMappingURL=fate-editor.js.map
