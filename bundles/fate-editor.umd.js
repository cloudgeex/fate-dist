(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/forms'), require('@angular/material/form-field'), require('@fortawesome/angular-fontawesome'), require('rxjs'), require('@angular/platform-browser'), require('@angular/cdk/coercion')) :
    typeof define === 'function' && define.amd ? define('fate-editor', ['exports', '@angular/core', '@angular/common', '@angular/forms', '@angular/material/form-field', '@fortawesome/angular-fontawesome', 'rxjs', '@angular/platform-browser', '@angular/cdk/coercion'], factory) :
    (global = global || self, factory(global['fate-editor'] = {}, global.ng.core, global.ng.common, global.ng.forms, global.ng.material.formField, global.angularFontawesome, global.rxjs, global.ng.platformBrowser, global.ng.cdk.coercion));
}(this, (function (exports, core, common, forms, formField, angularFontawesome, rxjs, platformBrowser, coercion) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __createBinding(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    }

    function __exportStar(m, exports) {
        for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
    }

    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    }

    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }

    function __asyncValues(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    }

    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    function __importStar(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result.default = mod;
        return result;
    }

    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }

    function __classPrivateFieldGet(receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    }

    function __classPrivateFieldSet(receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    }

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
    })(exports.FateType || (exports.FateType = {}));

    var FateLinkDropdownComponent = /** @class */ (function () {
        function FateLinkDropdownComponent() {
            this.valueChange = new core.EventEmitter();
        }
        FateLinkDropdownComponent.prototype.changeValue = function (value) {
            this.value = value;
            this.valueChange.emit(value);
        };
        FateLinkDropdownComponent.prototype.selectNext = function () { };
        ;
        FateLinkDropdownComponent.prototype.selecPrevious = function () { };
        ;
        FateLinkDropdownComponent.prototype.confirmSelection = function () { };
        ;
        __decorate([
            core.Input()
        ], FateLinkDropdownComponent.prototype, "value", void 0);
        __decorate([
            core.Output()
        ], FateLinkDropdownComponent.prototype, "valueChange", void 0);
        FateLinkDropdownComponent = __decorate([
            core.Component({
                selector: 'fate-link-dropdown',
                template: "<input type=\"text\" [ngModel]=\"value\" (ngModelChange)=\"changeValue($event)\" placeholder=\"http://\">\n",
                styles: [""]
            })
        ], FateLinkDropdownComponent);
        return FateLinkDropdownComponent;
    }());

    var FateControllerService = /** @class */ (function () {
        function FateControllerService() {
            // List of available commands, alphabetically
            // see https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
            this.actionMapping = {
                bold: {
                    command: 'bold',
                    name: 'Bold',
                    detect: exports.FateType.BOLD
                },
                italic: {
                    command: 'italic',
                    name: 'Italic',
                    detect: exports.FateType.ITALIC
                },
                underline: {
                    command: 'underline',
                    name: 'Underlined',
                    detect: exports.FateType.UNDERLINE
                },
                strike: {
                    command: 'strikeThrough',
                    name: 'Strike Through',
                    detect: exports.FateType.STRIKETHROUGH
                },
                subscript: {
                    command: 'subscript',
                    name: 'Subscript',
                    label: 'sub',
                    detect: exports.FateType.SUBSCRIPT
                },
                superscript: {
                    command: 'superscript',
                    name: 'Superscript',
                    label: 'sup',
                    detect: exports.FateType.SUPERSCRIPT
                },
                heading1: {
                    command: 'formatBlock',
                    value: 'H1',
                    name: '1st Header',
                    label: 'h1',
                    detect: exports.FateType.HEADER1
                },
                heading2: {
                    command: 'formatBlock',
                    value: 'H2',
                    name: '2nd Header',
                    label: 'h2',
                    detect: exports.FateType.HEADER2
                },
                heading3: {
                    command: 'formatBlock',
                    value: 'H3',
                    name: '3rd Header',
                    label: 'h3',
                    detect: exports.FateType.HEADER3
                },
                heading4: {
                    command: 'formatBlock',
                    value: 'H4',
                    name: '4th Header',
                    label: 'h4',
                    detect: exports.FateType.HEADER4
                },
                heading5: {
                    command: 'formatBlock',
                    value: 'H5',
                    name: '5th Header',
                    label: 'h5',
                    detect: exports.FateType.HEADER5
                },
                heading6: {
                    command: 'formatBlock',
                    value: 'H6',
                    name: '6th Header',
                    label: 'h6',
                    detect: exports.FateType.HEADER6
                },
                normal: {
                    command: 'formatBlock',
                    value: 'DIV',
                    name: 'Normal',
                    label: 'p'
                },
                indent: {
                    command: 'indent',
                    name: 'Indent'
                },
                outdent: {
                    command: 'outdent',
                    name: 'Outdent'
                },
                ordered: {
                    command: 'insertOrderedList',
                    name: 'Ordered List',
                    detect: exports.FateType.ORDERED_LIST
                },
                unordered: {
                    command: 'insertUnorderedList',
                    name: 'Unorder List',
                    detect: exports.FateType.UNORDERED_LIST
                },
                center: {
                    command: 'justifyCenter',
                    name: 'Center',
                    detect: exports.FateType.ALIGN_CENTER
                },
                justify: {
                    command: 'justifyFull',
                    name: 'Justify',
                    detect: exports.FateType.JUSTIFY
                },
                left: {
                    command: 'justifyLeft',
                    name: 'Left',
                    detect: exports.FateType.ALIGN_LEFT
                },
                right: {
                    command: 'justifyRight',
                    name: 'Right',
                    detect: exports.FateType.ALIGN_RIGHT
                },
                undo: {
                    command: 'undo',
                    name: 'Undo'
                },
                redo: {
                    command: 'redo',
                    name: 'Redo'
                },
                clean: {
                    command: 'removeFormat',
                    name: 'Remove Formating'
                },
                link: {
                    command: 'createLink',
                    undo: 'unlink',
                    name: 'Link',
                    detect: exports.FateType.LINK,
                    dropdown: FateLinkDropdownComponent
                }
            };
            this.inlineActionMapping = {};
            this.commandsPipe = {
                default: new rxjs.Subject()
            };
            this.enabledActions = {
                default: new rxjs.Subject()
            };
        }
        FateControllerService.prototype.registerAction = function (name, action) {
            if (this.actionMapping[name]) {
                throw new Error('An action with the name "' + name + '" already exists!');
            }
            else {
                this.actionMapping[name] = action;
            }
        };
        FateControllerService.prototype.getAction = function (actionName) {
            return this.actionMapping[actionName] || false;
        };
        FateControllerService.prototype.registerInlineAction = function (name, action) {
            if (this.inlineActionMapping[name]) {
                throw new Error('An inline action with the name "' + name + '" already exists!');
            }
            else {
                this.inlineActionMapping[name] = action;
            }
        };
        FateControllerService.prototype.getInlineAction = function (context) {
            var e_1, _a;
            try {
                for (var _b = __values(Object.keys(this.inlineActionMapping)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var action = _c.value;
                    var match = this.inlineActionMapping[action].regexp.exec(context);
                    if (match) {
                        this.inlineActionMapping[action].matched = match[1];
                        return this.inlineActionMapping[action];
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return false;
        };
        FateControllerService.prototype.channel = function (channelId) {
            if (!this.commandsPipe[channelId]) {
                this.commandsPipe[channelId] = new rxjs.Subject();
            }
            return this.commandsPipe[channelId];
        };
        FateControllerService.prototype.enabled = function (channelId) {
            if (!this.enabledActions[channelId]) {
                this.enabledActions[channelId] = new rxjs.Subject();
            }
            return this.enabledActions[channelId];
        };
        FateControllerService.prototype.enableActions = function (channelId, nodes) {
            var e_2, _a;
            var actions = [];
            try {
                for (var nodes_1 = __values(nodes), nodes_1_1 = nodes_1.next(); !nodes_1_1.done; nodes_1_1 = nodes_1.next()) {
                    var node = nodes_1_1.value;
                    for (var action in this.actionMapping) {
                        if (this.actionMapping[action].detect &&
                            this.actionMapping[action].detect === node.type) {
                            actions.push({ action: action, value: node.value });
                        }
                        else if (this.actionMapping[action].detect &&
                            typeof this.actionMapping[action].detect === 'function') {
                            var detected = this.actionMapping[action].detect(node);
                            if (detected) {
                                actions.push({ action: action, value: detected.value });
                            }
                        }
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (nodes_1_1 && !nodes_1_1.done && (_a = nodes_1.return)) _a.call(nodes_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            this.enabledActions[channelId].next(actions);
        };
        FateControllerService.prototype.do = function (channel, action, value) {
            if (this.actionMapping[action].dropdown && !value) {
                if (this.actionMapping[action].undo) {
                    this.commandsPipe[channel].next({
                        name: this.actionMapping[action].undo,
                        value: this.actionMapping[action].value || value
                    });
                }
                else {
                    throw new Error('Action "' + action + '"doesn\'t have a undo command');
                }
            }
            else {
                if (this.actionMapping[action].value &&
                    typeof this.actionMapping[action].value === 'function') {
                    this.commandsPipe[channel].next({
                        name: this.actionMapping[action].command,
                        value: this.actionMapping[action].value(value)
                    });
                }
                else {
                    this.commandsPipe[channel].next({
                        name: this.actionMapping[action].command,
                        value: this.actionMapping[action].value || value
                    });
                }
            }
        };
        FateControllerService.prototype.doInline = function (channel, action, value) {
            if (action.dropdown && !value) {
                if (action.undo) {
                    this.commandsPipe[channel].next({
                        name: action.undo,
                        value: action.value || value
                    });
                }
                else {
                    throw new Error('Action "' + action + '"doesn\'t have a undo command');
                }
            }
            else {
                if (action.value && typeof action.value === 'function') {
                    this.commandsPipe[channel].next({
                        name: action.command,
                        value: action.value(value)
                    });
                }
                else {
                    this.commandsPipe[channel].next({
                        name: action.command,
                        value: action.value || value
                    });
                }
            }
        };
        FateControllerService.prototype.undo = function (channel, action, value) {
            var mapping = this.actionMapping[action].undo;
            // TODO
        };
        FateControllerService.ɵprov = core.ɵɵdefineInjectable({ factory: function FateControllerService_Factory() { return new FateControllerService(); }, token: FateControllerService, providedIn: "root" });
        FateControllerService = __decorate([
            core.Injectable({
                providedIn: 'root'
            })
        ], FateControllerService);
        return FateControllerService;
    }());

    var FateNode = /** @class */ (function () {
        function FateNode(type, value) {
            if (type === void 0) { type = exports.FateType.NONE; }
            this.type = type;
            this.value = value;
            this.children = [];
        }
        return FateNode;
    }());

    var FateHtmlParserService = /** @class */ (function () {
        function FateHtmlParserService() {
        }
        FateHtmlParserService.prototype.parse = function (html) {
            var div = document.createElement('div');
            div.innerHTML = html;
            return this.parseElement(div);
        };
        ;
        FateHtmlParserService.prototype.parseElement = function (element) {
            var nodes = this.parseType(element);
            var currentNode = nodes[0];
            var isABlock = (currentNode.type === exports.FateType.PARAGRAPH);
            for (var i = 1; i < nodes.length; i++) {
                currentNode.children.push(nodes[i]);
                currentNode = nodes[i];
                if (currentNode.type === exports.FateType.PARAGRAPH) {
                    isABlock = true;
                }
            }
            var previousNodeWasText = false;
            for (var i = 0; i < element.childNodes.length; i++) {
                var child = element.childNodes[i];
                // pick ahead to look for <br>
                if ((i < element.childNodes.length - 1) &&
                    (this.isLinebreak(element.childNodes[i + 1])) &&
                    !(isABlock && i === element.childNodes.length - 2) // The last child is a BR in a block, this can be ignored
                ) {
                    previousNodeWasText = false;
                    if (child instanceof Text) {
                        // wrap the text in a paragraph
                        var paragraph = new FateNode(exports.FateType.PARAGRAPH);
                        paragraph.children.push(child.data);
                        currentNode.children.push(paragraph);
                    }
                    else if (child instanceof HTMLElement) {
                        // insert an empty paragraph
                        currentNode.children.push(this.parseElement(child));
                        currentNode.children.push(new FateNode(exports.FateType.PARAGRAPH));
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
        };
        FateHtmlParserService.prototype.findParentNodes = function (node, until) {
            var nodes = [];
            var current = (node.nodeType === 1) ? node : node.parentElement;
            while (current !== until) {
                nodes.push.apply(nodes, __spread(this.parseType(current)));
                current = current.parentElement;
            }
            return nodes;
        };
        FateHtmlParserService.prototype.getAdditonalStyle = function (element) {
            var style = element.style;
            var detectedStyleNode = [];
            // Look for alignement
            var align = element.getAttribute('align') || style.textAlign;
            switch (align) {
                case 'left':
                    detectedStyleNode.push(new FateNode(exports.FateType.ALIGN_LEFT));
                    break;
                case 'center':
                    detectedStyleNode.push(new FateNode(exports.FateType.ALIGN_CENTER));
                    break;
                case 'right':
                    detectedStyleNode.push(new FateNode(exports.FateType.ALIGN_RIGHT));
                    break;
                case 'justify':
                    detectedStyleNode.push(new FateNode(exports.FateType.JUSTIFY));
                    break;
            }
            // Look for color
            var color = element.getAttribute('color') || style.color;
            if (color) {
                detectedStyleNode.push(new FateNode(exports.FateType.COLOR, color));
            }
            // Look for size
            var size = element.getAttribute('size') || style.fontSize;
            if (size) {
                detectedStyleNode.push(new FateNode(exports.FateType.SIZE, size));
            }
            // Look for family
            var typeface = element.getAttribute('face') || style.fontFamily;
            if (typeface) {
                detectedStyleNode.push(new FateNode(exports.FateType.TYPEFACE, typeface));
            }
            return detectedStyleNode;
        };
        FateHtmlParserService.prototype.parseType = function (element) {
            var additionaStyle = this.getAdditonalStyle(element);
            switch (element.nodeName) {
                case 'H1':
                    return __spread([new FateNode(exports.FateType.HEADER1)], additionaStyle);
                case 'H2':
                    return __spread([new FateNode(exports.FateType.HEADER2)], additionaStyle);
                case 'H3':
                    return __spread([new FateNode(exports.FateType.HEADER3)], additionaStyle);
                case 'H4':
                    return __spread([new FateNode(exports.FateType.HEADER4)], additionaStyle);
                case 'H5':
                    return __spread([new FateNode(exports.FateType.HEADER5)], additionaStyle);
                case 'H6':
                    return __spread([new FateNode(exports.FateType.HEADER6)], additionaStyle);
                case 'B':
                case 'STRONG':
                    return [new FateNode(exports.FateType.BOLD)];
                case 'I':
                case 'EM':
                    return [new FateNode(exports.FateType.ITALIC)];
                case 'U':
                    return [new FateNode(exports.FateType.UNDERLINE)];
                case 'STRIKE':
                    return [new FateNode(exports.FateType.STRIKETHROUGH)];
                case 'SUB':
                    return [new FateNode(exports.FateType.SUBSCRIPT)];
                case 'SUP':
                    return [new FateNode(exports.FateType.SUPERSCRIPT)];
                case 'A':
                    return [new FateNode(exports.FateType.LINK, element.getAttribute('href'))];
                case 'OL':
                    return [new FateNode(exports.FateType.ORDERED_LIST)];
                case 'UL':
                    return [new FateNode(exports.FateType.UNORDERED_LIST)];
                case 'LI':
                    return [new FateNode(exports.FateType.LISTITEM)];
                case 'DIV':
                case 'P':
                    if (additionaStyle.length > 0) {
                        return __spread(additionaStyle);
                    }
                    return [new FateNode(exports.FateType.PARAGRAPH)];
                case 'BLOCKQUOTE':
                    // FIXME: this doesn't work on FF
                    if (element.style.marginLeft === '40px') {
                        return [new FateNode(exports.FateType.INDENT)];
                    }
                    return [new FateNode(exports.FateType.NONE)];
                default:
                    if (additionaStyle.length > 0) {
                        return __spread(additionaStyle);
                    }
                    return [new FateNode(exports.FateType.NONE)];
            }
        };
        FateHtmlParserService.prototype.parseValue = function (element) {
            switch (element.nodeName) {
                case 'A':
                    return element.getAttribute('href');
            }
            return undefined;
        };
        FateHtmlParserService.prototype.serializeType = function (node) {
            switch (node.type) {
                case exports.FateType.PARAGRAPH:
                    return '<div>' + this.serialize(node, true) + '</div>';
                case exports.FateType.HEADER1:
                    return '<h1>' + this.serialize(node, true) + '</h1>';
                case exports.FateType.HEADER2:
                    return '<h2>' + this.serialize(node, true) + '</h2>';
                case exports.FateType.HEADER3:
                    return '<h3>' + this.serialize(node, true) + '</h3>';
                case exports.FateType.HEADER4:
                    return '<h4>' + this.serialize(node, true) + '</h4>';
                case exports.FateType.HEADER5:
                    return '<h5>' + this.serialize(node, true) + '</h5>';
                case exports.FateType.HEADER6:
                    return '<h6>' + this.serialize(node, true) + '</h6>';
                case exports.FateType.QUOTE:
                    return '<quote>' + this.serialize(node) + '</quote>';
                case exports.FateType.CODE:
                    return '<code>' + this.serialize(node) + '</code>';
                case exports.FateType.BOLD:
                    return '<strong>' + this.serialize(node) + '</strong>';
                case exports.FateType.ITALIC:
                    return '<em>' + this.serialize(node) + '</em>';
                case exports.FateType.UNDERLINE:
                    return '<u>' + this.serialize(node) + '</u>';
                case exports.FateType.STRIKETHROUGH:
                    return '<strike>' + this.serialize(node) + '</strike>';
                case exports.FateType.SUBSCRIPT:
                    return '<sub>' + this.serialize(node) + '</sub>';
                case exports.FateType.SUPERSCRIPT:
                    return '<sup>' + this.serialize(node) + '</sup>';
                case exports.FateType.LINK:
                    return '<a href="' + node.value + '">' + this.serialize(node) + '</a>';
                case exports.FateType.ORDERED_LIST:
                    return '<ol>' + this.serialize(node) + '</ol>';
                case exports.FateType.UNORDERED_LIST:
                    return '<ul>' + this.serialize(node) + '</ul>';
                case exports.FateType.LISTITEM:
                    return '<li>' + this.serialize(node) + '</li>';
                case exports.FateType.ALIGN_LEFT:
                    return '<div style="text-align: left;">' + this.serialize(node, true) + '</div>';
                case exports.FateType.ALIGN_CENTER:
                    return '<div style="text-align: center;">' + this.serialize(node, true) + '</div>';
                case exports.FateType.ALIGN_RIGHT:
                    return '<div style="text-align: right">' + this.serialize(node, true) + '</div>';
                case exports.FateType.JUSTIFY:
                    return '<div style="text-align: justify;">' + this.serialize(node, true) + '</div>';
                case exports.FateType.INDENT:
                    return '<blockquote style="margin-left: 40px">' + this.serialize(node, true) + '</blockquote>';
                case exports.FateType.COLOR:
                    return '<font color="' + node.value + '">' + this.serialize(node) + '</font>';
                case exports.FateType.SIZE:
                    return '<font size="' + node.value + '">' + this.serialize(node) + '</font>';
                case exports.FateType.TYPEFACE:
                    return '<font face="' + node.value + '">' + this.serialize(node) + '</font>';
                case exports.FateType.NONE:
                    return this.serialize(node);
            }
        };
        ;
        FateHtmlParserService.prototype.isLinebreak = function (child) {
            return (child instanceof HTMLElement && child.nodeName === 'BR');
        };
        // Saves a Tree in string representation
        FateHtmlParserService.prototype.serialize = function (node, fallbackToBr) {
            var _this = this;
            if (fallbackToBr === void 0) { fallbackToBr = false; }
            var serialized = '';
            node.children.forEach(function (child) {
                if (typeof child === 'string') {
                    serialized += child;
                }
                else {
                    serialized += _this.serializeType(child);
                }
            });
            if (fallbackToBr && !serialized) {
                serialized = '<br>';
            }
            return serialized;
        };
        ;
        FateHtmlParserService.ɵprov = core.ɵɵdefineInjectable({ factory: function FateHtmlParserService_Factory() { return new FateHtmlParserService(); }, token: FateHtmlParserService, providedIn: "root" });
        FateHtmlParserService = __decorate([
            core.Injectable({
                providedIn: 'root'
            })
        ], FateHtmlParserService);
        return FateHtmlParserService;
    }());

    var FateParserService = /** @class */ (function (_super) {
        __extends(FateParserService, _super);
        function FateParserService() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FateParserService.ɵprov = core.ɵɵdefineInjectable({ factory: function FateParserService_Factory() { return new FateParserService(); }, token: FateParserService, providedIn: "root" });
        FateParserService = __decorate([
            core.Injectable({
                providedIn: 'root'
            })
        ], FateParserService);
        return FateParserService;
    }(FateHtmlParserService));

    var FateIconService = /** @class */ (function () {
        function FateIconService() {
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
        FateIconService.prototype.getIcon = function (actionName) {
            return this.iconMapping[actionName];
        };
        FateIconService.ɵprov = core.ɵɵdefineInjectable({ factory: function FateIconService_Factory() { return new FateIconService(); }, token: FateIconService, providedIn: "root" });
        FateIconService = __decorate([
            core.Injectable({
                providedIn: 'root'
            })
        ], FateIconService);
        return FateIconService;
    }());

    var defaultButtons = [
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
    var FateUiComponent = /** @class */ (function () {
        function FateUiComponent(el, controller, icon, parser, factoryResolver) {
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
        FateUiComponent.prototype.mouseDown = function (event) {
            if (!event.target.closest('.fate-ui-dropdown')) {
                event.preventDefault();
            }
        };
        FateUiComponent.prototype.keyUp = function (event) {
            if (event.key === 'Enter') {
                var name_1 = event.target.name;
                if (name_1) {
                    this.do(event, name_1);
                }
            }
        };
        FateUiComponent.prototype.do = function (event, action) {
            var _this = this;
            event.preventDefault();
            event.stopPropagation();
            if (this.controller.getAction(action).dropdown) {
                if (action === this.dropdownAction) {
                    this.dropdownAction = false;
                }
                else {
                    var button_1 = event.target;
                    if (!button_1.classList.contains('fate-ui-button')) {
                        button_1 = button_1.closest('.fate-ui-button');
                    }
                    if (!button_1) {
                        return;
                    }
                    var dropdown_1 = this.el.nativeElement.querySelector('.fate-ui-dropdown');
                    // Enable the dropdown
                    this.dropdownValue = this.enabled[action];
                    console.debug('action has value', button_1, dropdown_1, this.dropdownValue);
                    this.initDropdown(this.controller.getAction(action).dropdown, this.dropdownValue);
                    // Postion the dropdown
                    setTimeout(function () {
                        var buttonSize = button_1.getBoundingClientRect();
                        var dropdownSize = dropdown_1.getBoundingClientRect();
                        var leftPosition = button_1.offsetLeft + (buttonSize.width / 2) - (dropdownSize.width / 2);
                        // make sure the dropdown is not bleeding out of the viewport
                        if (buttonSize.left + window.pageXOffset + (buttonSize.width / 2) - (dropdownSize.width / 2) < 3) {
                            leftPosition = -buttonSize.left - window.pageXOffset + button_1.offsetLeft + 3;
                        }
                        else if (buttonSize.left + window.pageXOffset + (buttonSize.width / 2) + (dropdownSize.width / 2) > window.innerWidth - 3) {
                            leftPosition = window.innerWidth - buttonSize.left - window.pageXOffset + button_1.offsetLeft - dropdownSize.width - 3;
                        }
                        var topPosition = button_1.offsetTop + buttonSize.height - 3;
                        dropdown_1.style.left = leftPosition + 'px';
                        dropdown_1.style.top = topPosition + 'px';
                        // make the dropdown visible
                        _this.dropdownAction = action;
                    }, 0);
                }
            }
            else {
                this.dropdownAction = false;
                this.controller.do(this.uiId, action);
            }
        };
        FateUiComponent.prototype.getOffset = function (element) {
            var top = 0;
            var left = 0;
            do {
                top += element.offsetTop || 0;
                left += element.offsetLeft || 0;
                element = element.offsetParent;
            } while (element);
            return {
                top: top,
                left: left
            };
        };
        FateUiComponent.prototype.initDropdown = function (actionComponent, value) {
            var _this = this;
            if (this.dropdownComponent) {
                this.dropdownComponent.destroy();
            }
            var factory = this.factoryResolver.resolveComponentFactory(actionComponent);
            var component = factory.create(this.viewContainerRef.parentInjector);
            if (component.instance.valueChange) {
                component.instance.value = value;
                component.instance.valueChange.subscribe(function (newValue) {
                    _this.dropdownValue = newValue;
                    _this.controller.do(_this.uiId, _this.dropdownAction, newValue);
                });
                this.dropdownComponent = this.viewContainerRef.insert(component.hostView);
            }
            else {
                throw new Error('The component used as a dropdown doesn\'t contain a valueChange emmiter!');
            }
        };
        FateUiComponent.prototype.ngOnChanges = function (changes) {
            var _this = this;
            if (changes['uiId']) {
                if (this.inputSubscription) {
                    this.inputSubscription.unsubscribe();
                }
                this.inputSubscription = this.controller.enabled(this.uiId).subscribe(function (actions) {
                    var e_1, _a;
                    _this.enabled = {};
                    try {
                        for (var actions_1 = __values(actions), actions_1_1 = actions_1.next(); !actions_1_1.done; actions_1_1 = actions_1.next()) {
                            var action = actions_1_1.value;
                            _this.enabled[action.action] = action.value || true;
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (actions_1_1 && !actions_1_1.done && (_a = actions_1.return)) _a.call(actions_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                });
            }
        };
        FateUiComponent.prototype.ngAfterViewInit = function () {
            var _this = this;
            var handle = window.addEventListener('mousedown', function (event) {
                if (!event.target.closest('.fate-ui-dropdown')) {
                    _this.dropdownAction = false;
                }
            });
        };
        FateUiComponent.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: FateControllerService },
            { type: FateIconService },
            { type: FateParserService },
            { type: core.ComponentFactoryResolver }
        ]; };
        __decorate([
            core.Input()
        ], FateUiComponent.prototype, "uiId", void 0);
        __decorate([
            core.Input()
        ], FateUiComponent.prototype, "buttons", void 0);
        __decorate([
            core.HostListener('mousedown', ['$event'])
        ], FateUiComponent.prototype, "mouseDown", null);
        __decorate([
            core.HostListener('keyup', ['$event'])
        ], FateUiComponent.prototype, "keyUp", null);
        __decorate([
            core.ViewChild('dropdown', {
                read: core.ViewContainerRef,
                static: true,
            })
        ], FateUiComponent.prototype, "viewContainerRef", void 0);
        FateUiComponent = __decorate([
            core.Component({
                selector: 'fate-ui',
                template: "<div>\n  <ng-container *ngFor=\"let button of buttons\">\n    <a *ngIf=\"button !== 'separator'\" tabindex=\"0\" class=\"fate-ui-button\" [name]=\"button\" [ngClass]=\"{enabled: enabled[button], 'with-dropdown': dropdownAction === button}\" (click)=\"do($event, button)\">\n      <span *ngIf=\"icon.getIcon(button) as iconName\" >\n        <fa-icon [icon]=\"['fas', iconName]\"></fa-icon>\n      </span>\n      <span *ngIf=\"!icon.getIcon(button)\">{{controller.getAction(button).label}}</span>\n      <span class=\"reader\">{{controller.getAction(button).name}}</span>\n    </a>\n    <div *ngIf=\"button === 'separator'\" class=\"fate-ui-separator\"></div>\n  </ng-container>\n  <div class=\"fate-ui-dropdown\" [ngClass]=\"{visible: dropdownAction}\">\n    <ng-template #dropdown></ng-template>\n  </div>\n</div>\n",
                styles: [":host{border:1px solid #ddd;border-bottom:0;display:block;box-sizing:border-box;padding:5px;background:#fff;color:#333;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;position:relative;overflow:visible}.fate-ui-separator{display:inline-block;width:2px;height:14px;vertical-align:middle;background-color:#ddd;border-radius:2px}.fate-ui-button{display:inline-block;height:25px;width:25px;text-align:center;line-height:25px;margin-bottom:3px;vertical-align:middle;cursor:pointer;font-size:14px;box-sizing:border-box;transition:background .3s;border-radius:3px;color:#333}.fate-ui-button.enabled,.fate-ui-button.with-dropdown,.fate-ui-button:active{background-color:#e5e5e5}.fate-ui-button:focus,.fate-ui-button:hover{background-color:#ccc}.fate-ui-button span.reader{display:none}.fate-ui-dropdown{opacity:0;pointer-events:none;z-index:1;font-size:14px;-webkit-user-select:all;-moz-user-select:all;-ms-user-select:all;user-select:all;box-sizing:border-box;border-radius:3px;background-color:#e5e5e5;position:absolute;padding:10px;border-bottom:1px solid #ccc;box-shadow:0 10px 10px -10px rgba(0,0,0,.3)}.fate-ui-dropdown.visible{opacity:1;pointer-events:all}"]
            })
        ], FateUiComponent);
        return FateUiComponent;
    }());

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
            this.focused = new core.EventEmitter();
            this.blured = new core.EventEmitter();
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
            { type: core.ElementRef },
            { type: FateControllerService },
            { type: FateHtmlParserService },
            { type: FateParserService },
            { type: platformBrowser.DomSanitizer },
            { type: core.ComponentFactoryResolver },
            { type: core.Renderer2 },
            { type: undefined, decorators: [{ type: core.Inject, args: [common.DOCUMENT,] }] }
        ]; };
        __decorate([
            core.Input()
        ], FateInputComponent.prototype, "uiId", void 0);
        __decorate([
            core.Input()
        ], FateInputComponent.prototype, "row", void 0);
        __decorate([
            core.Input()
        ], FateInputComponent.prototype, "customClass", void 0);
        __decorate([
            core.Input()
        ], FateInputComponent.prototype, "placeholder", void 0);
        __decorate([
            core.Input()
        ], FateInputComponent.prototype, "initialFocus", void 0);
        __decorate([
            core.Output()
        ], FateInputComponent.prototype, "focused", void 0);
        __decorate([
            core.Output()
        ], FateInputComponent.prototype, "blured", void 0);
        __decorate([
            core.ViewChild('dropdown', {
                read: core.ViewContainerRef,
                static: true
            })
        ], FateInputComponent.prototype, "viewContainerRef", void 0);
        __decorate([
            core.ViewChild('editTarget', { static: true })
        ], FateInputComponent.prototype, "editTargetElementRef", null);
        FateInputComponent = FateInputComponent_1 = __decorate([
            core.Component({
                selector: 'fate-input',
                template: "\n    <div\n      class=\"fate-inline-dropdown\"\n      [class.hidden]=\"!inlineAction\"\n      [class.contextual]=\"inlineAction?.display === 'contextual'\"\n      [style.top]=\"dropdownPostionTop\"\n      [style.left]=\"dropdownPostionLeft\"\n    >\n      <ng-template #dropdown></ng-template>\n    </div>\n    <div\n      #editTarget\n      [class]=\"'fate-edit-target ' + customClass\"\n      [ngClass]=\"{ empty: empty }\"\n      contenteditable=\"true\"\n      [title]=\"placeholder\"\n      [innerHtml]=\"content\"\n    ></div>\n  ",
                providers: [
                    { provide: forms.NG_VALUE_ACCESSOR, useExisting: FateInputComponent_1, multi: true }
                ],
                styles: ["\n      :host div.fate-edit-target {\n        display: block;\n        padding: 10px;\n        border: 1px solid #ddd;\n        outline: 0;\n        resize: vertical;\n        overflow: auto;\n        background: #fff;\n        color: #000;\n        overflow: visible;\n      }\n      :host div.fate-edit-target.empty:not(:focus):before {\n        content: attr(title);\n        color: #636c72;\n      }\n      .fate-inline-dropdown {\n        border: 1px solid #ddd;\n        border-bottom: 0;\n      }\n      .fate-inline-dropdown.hidden {\n        display: none !important;\n      }\n      .fate-inline-dropdown.contextual {\n        position: absolute;\n        background: #fff;\n        box-shadow: 0 5px 30px -10px rgba(0, 0, 0, 0.4);\n        border-bottom: 1px solid #ccc;\n      }\n      :host {\n        margin-bottom: 10px;\n        /*position: relative;*/\n      }\n    "]
            }),
            __param(7, core.Inject(common.DOCUMENT))
        ], FateInputComponent);
        return FateInputComponent;
    }());

    var instanceCounter = 0;
    var FateBootstrapComponent = /** @class */ (function () {
        function FateBootstrapComponent(el, controller, parser, icon, factoryResolver) {
            this.buttons = defaultButtons;
            // implentation of ControlValueAccessor:
            this.changed = new Array();
            this.clickOngoing = false;
            this.uiId = 'bootstrap-' + (instanceCounter++);
        }
        FateBootstrapComponent_1 = FateBootstrapComponent;
        FateBootstrapComponent.prototype.blur = function (event) {
            if (!this.clickOngoing) {
                this.uiVisible = false;
            }
        };
        FateBootstrapComponent.prototype.mousedown = function (event) {
            this.clickOngoing = true;
        };
        FateBootstrapComponent.prototype.mouseup = function (event) {
            this.clickOngoing = false;
        };
        FateBootstrapComponent.prototype.focus = function (event) {
            this.uiVisible = true;
            console.info('boostrap focus!');
        };
        FateBootstrapComponent.prototype.writeValue = function (value) {
            this.passthrough = value;
        };
        FateBootstrapComponent.prototype.registerOnChange = function (fn) {
            this.changed.push(fn);
        };
        FateBootstrapComponent.prototype.registerOnTouched = function (fn) { };
        // change callback
        FateBootstrapComponent.prototype.onChange = function (value) {
            this.passthrough = value;
            this.changed.forEach(function (f) { return f(value); });
        };
        var FateBootstrapComponent_1;
        FateBootstrapComponent.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: FateControllerService },
            { type: FateParserService },
            { type: FateIconService },
            { type: core.ComponentFactoryResolver }
        ]; };
        __decorate([
            core.Input()
        ], FateBootstrapComponent.prototype, "row", void 0);
        __decorate([
            core.Input()
        ], FateBootstrapComponent.prototype, "placeholder", void 0);
        __decorate([
            core.Input()
        ], FateBootstrapComponent.prototype, "buttons", void 0);
        __decorate([
            core.HostListener('focusout', ['$event'])
        ], FateBootstrapComponent.prototype, "blur", null);
        __decorate([
            core.HostListener('mousedown', ['$event'])
        ], FateBootstrapComponent.prototype, "mousedown", null);
        __decorate([
            core.HostListener('mouseup', ['$event'])
        ], FateBootstrapComponent.prototype, "mouseup", null);
        __decorate([
            core.HostListener('focusin', ['$event'])
        ], FateBootstrapComponent.prototype, "focus", null);
        FateBootstrapComponent = FateBootstrapComponent_1 = __decorate([
            core.Component({
                selector: 'fate-bootstrap',
                template: "<fate-input customClass=\"form-control\" [uiId]=\"uiId\" [row]=\"row\" [placeholder]=\"placeholder\" [ngModel]=\"passthrough\" (ngModelChange)=\"onChange($event)\"></fate-input>\n<fate-ui [uiId]=\"uiId\" [buttons]=\"buttons\" [ngClass]=\"{'visible': uiVisible}\" class=\"tooltip tooltip-inner\"></fate-ui>\n",
                providers: [
                    { provide: forms.NG_VALUE_ACCESSOR, useExisting: FateBootstrapComponent_1, multi: true }
                ],
                styles: [":host{margin-bottom:10px;display:block;position:relative}:host fate-ui{display:block;position:absolute;opacity:0;pointer-events:none;transition:opacity .3s;text-align:left;background:#222;color:#eee;max-width:100%}:host fate-ui.visible{opacity:1;pointer-events:all}:host fate-ui ::ng-deep .fate-ui-button{color:#eee}:host fate-ui ::ng-deep .fate-ui-button.enabled,:host fate-ui ::ng-deep .fate-ui-button.with-dropdown,:host fate-ui ::ng-deep .fate-ui-button:active{background-color:#555}:host fate-ui ::ng-deep .fate-ui-button:focus,:host fate-ui ::ng-deep .fate-ui-button:hover{background-color:#666}:host fate-ui ::ng-deep .fate-ui-separator{background-color:#666!important}:host fate-ui ::ng-deep .fate-ui-dropdown{background-color:#555;border-color:#666}:host fate-input ::ng-deep .fate-edit-target{resize:vertical;padding:.375rem .75rem}:host fate-input ::ng-deep .fate-inline-dropdown{display:block;transition:opacity .3s;background:#222;color:#eee;border-radius:.25rem;z-index:1080}"]
            })
        ], FateBootstrapComponent);
        return FateBootstrapComponent;
    }());

    var FateMaterialIconService = /** @class */ (function (_super) {
        __extends(FateMaterialIconService, _super);
        function FateMaterialIconService() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FateMaterialIconService.ɵprov = core.ɵɵdefineInjectable({ factory: function FateMaterialIconService_Factory() { return new FateMaterialIconService(); }, token: FateMaterialIconService, providedIn: "root" });
        FateMaterialIconService = __decorate([
            core.Injectable({
                providedIn: 'root'
            })
        ], FateMaterialIconService);
        return FateMaterialIconService;
    }(FateIconService));

    var instanceCounter$1 = 0;
    var FateMaterialComponent = /** @class */ (function () {
        function FateMaterialComponent(controller, parser, icon, el, ngControl) {
            this.ngControl = ngControl;
            this.buttons = defaultButtons;
            this.id = "" + this.uiId;
            this.clickOngoing = false;
            this.uiVisible = false;
            this._required = false;
            this._disabled = false;
            this.errorState = false;
            this.controlType = 'fate-material';
            this.describedBy = '';
            this.stateChanges = new rxjs.Subject();
            this.focused = false;
            this.changed = new Array();
            this.uiId = 'material-' + (instanceCounter$1++);
            // Setting the value accessor directly (instead of using
            // the providers) to avoid running into a circular import.
            if (this.ngControl != null) {
                this.ngControl.valueAccessor = this;
            }
        }
        FateMaterialComponent_1 = FateMaterialComponent;
        Object.defineProperty(FateMaterialComponent.prototype, "value", {
            get: function () {
                return this.passthrough;
            },
            set: function (value) {
                this.stateChanges.next();
                this.passthrough = value;
                this.changed.forEach(function (f) { return f(value); });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FateMaterialComponent.prototype, "placeholder", {
            get: function () {
                return this._placeholder;
            },
            set: function (placeholder) {
                this._placeholder = placeholder;
                this.stateChanges.next();
            },
            enumerable: true,
            configurable: true
        });
        FateMaterialComponent.prototype.blur = function () {
            this.focused = false;
            this.stateChanges.next();
            if (!this.clickOngoing) {
                this.uiVisible = false;
            }
        };
        FateMaterialComponent.prototype.focus = function () {
            this.focused = true;
            this.uiVisible = true;
            this.stateChanges.next();
        };
        FateMaterialComponent.prototype.mousedown = function (event) {
            this.clickOngoing = true;
        };
        FateMaterialComponent.prototype.mouseup = function (event) {
            this.clickOngoing = false;
        };
        Object.defineProperty(FateMaterialComponent.prototype, "empty", {
            get: function () {
                return !this.passthrough || this.passthrough === '';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FateMaterialComponent.prototype, "shouldLabelFloat", {
            get: function () {
                return this.focused || !this.empty;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FateMaterialComponent.prototype, "required", {
            get: function () {
                return this._required;
            },
            set: function (req) {
                this._required = coercion.coerceBooleanProperty(req);
                this.stateChanges.next();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FateMaterialComponent.prototype, "disabled", {
            get: function () {
                return this._disabled;
            },
            set: function (dis) {
                this._disabled = coercion.coerceBooleanProperty(dis);
                this.stateChanges.next();
            },
            enumerable: true,
            configurable: true
        });
        FateMaterialComponent.prototype.setDescribedByIds = function (ids) {
            this.describedBy = ids.join(' ');
        };
        FateMaterialComponent.prototype.onContainerClick = function (event) { };
        FateMaterialComponent.prototype.onChange = function (value) {
            this.passthrough = value;
            this.changed.forEach(function (f) { return f(value); });
            this.stateChanges.next();
        };
        FateMaterialComponent.prototype.ngOnDestroy = function () {
            this.stateChanges.complete();
        };
        FateMaterialComponent.prototype.writeValue = function (value) {
            this.passthrough = value;
            this.stateChanges.next();
        };
        FateMaterialComponent.prototype.registerOnChange = function (fn) {
            this.changed.push(fn);
        };
        FateMaterialComponent.prototype.registerOnTouched = function (fn) { };
        var FateMaterialComponent_1;
        FateMaterialComponent.ctorParameters = function () { return [
            { type: FateControllerService },
            { type: FateParserService },
            { type: FateIconService },
            { type: core.ElementRef },
            { type: forms.NgControl, decorators: [{ type: core.Optional }, { type: core.Self }] }
        ]; };
        __decorate([
            core.Input()
        ], FateMaterialComponent.prototype, "row", void 0);
        __decorate([
            core.Input()
        ], FateMaterialComponent.prototype, "buttons", void 0);
        __decorate([
            core.Input()
        ], FateMaterialComponent.prototype, "value", null);
        __decorate([
            core.Input()
        ], FateMaterialComponent.prototype, "placeholder", null);
        __decorate([
            core.HostBinding()
        ], FateMaterialComponent.prototype, "id", void 0);
        __decorate([
            core.HostListener('focusout')
        ], FateMaterialComponent.prototype, "blur", null);
        __decorate([
            core.HostListener('focusin')
        ], FateMaterialComponent.prototype, "focus", null);
        __decorate([
            core.HostListener('mousedown', ['$event'])
        ], FateMaterialComponent.prototype, "mousedown", null);
        __decorate([
            core.HostListener('mouseup', ['$event'])
        ], FateMaterialComponent.prototype, "mouseup", null);
        __decorate([
            core.Input()
        ], FateMaterialComponent.prototype, "required", null);
        __decorate([
            core.Input()
        ], FateMaterialComponent.prototype, "disabled", null);
        __decorate([
            core.HostBinding('attr.aria-describedby')
        ], FateMaterialComponent.prototype, "describedBy", void 0);
        FateMaterialComponent = FateMaterialComponent_1 = __decorate([
            core.Component({
                selector: 'fate-material',
                template: "<fate-input customClass=\"\" [uiId]=\"uiId\" [row]=\"row\" [ngModel]=\"passthrough\" (ngModelChange)=\"onChange($event)\"></fate-input>\n<fate-ui class=\"mat-select-panel\" [uiId]=\"uiId\" [buttons]=\"buttons\" [ngClass]=\"{'visible': uiVisible}\"></fate-ui>\n",
                providers: [
                    { provide: formField.MatFormFieldControl, useExisting: FateMaterialComponent_1 },
                    { provide: FateIconService, useClass: FateMaterialIconService }
                ],
                styles: [":host{display:block;position:relative}:host fate-ui{display:block;position:absolute;opacity:0;pointer-events:none;transition:opacity .3s;text-align:left;box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);background:#fff;z-index:1;transform:translateY(10px);max-width:100%;padding:0}:host fate-ui.visible{opacity:1;pointer-events:all}:host fate-ui ::ng-deep .fate-ui-button{height:40px;line-height:23px;padding:7px 0 11px;width:40px;border-radius:0;margin-right:-4px;margin-bottom:0;vertical-align:middle}:host fate-ui ::ng-deep .fate-ui-button.enabled,:host fate-ui ::ng-deep .fate-ui-button.with-dropdown,:host fate-ui ::ng-deep .fate-ui-button:active{background-color:#eee}:host fate-ui ::ng-deep .fate-ui-button:focus,:host fate-ui ::ng-deep .fate-ui-button:hover{background-color:#dfdfdf}:host fate-ui ::ng-deep .fate-ui-dropdown{background-color:#eee}:host fate-ui ::ng-deep .fate-ui-separator{height:36px;border-radius:0;width:1px;vertical-align:middle;background-color:#dfdfdf;margin:2px -4px 2px -1px}:host fate-input ::ng-deep div.fate-edit-target{border:none;background:0 0;color:inherit;padding:0;outline:0;font:inherit;resize:vertical;margin-bottom:0}:host fate-input ::ng-deep .fate-inline-dropdown{display:block;position:absolute;transition:opacity .3s;box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);background:#fff;z-index:2;padding:0}"]
            }),
            __param(4, core.Optional()), __param(4, core.Self())
        ], FateMaterialComponent);
        return FateMaterialComponent;
    }());

    var FateFontawsomeLegacyIconService = /** @class */ (function (_super) {
        __extends(FateFontawsomeLegacyIconService, _super);
        function FateFontawsomeLegacyIconService() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.iconMapping = {
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
            return _this;
        }
        FateFontawsomeLegacyIconService.ɵprov = core.ɵɵdefineInjectable({ factory: function FateFontawsomeLegacyIconService_Factory() { return new FateFontawsomeLegacyIconService(); }, token: FateFontawsomeLegacyIconService, providedIn: "root" });
        FateFontawsomeLegacyIconService = __decorate([
            core.Injectable({
                providedIn: 'root'
            })
        ], FateFontawsomeLegacyIconService);
        return FateFontawsomeLegacyIconService;
    }(FateIconService));

    var FateModule = /** @class */ (function () {
        function FateModule() {
        }
        FateModule = __decorate([
            core.NgModule({
                declarations: [
                    FateInputComponent,
                    FateUiComponent,
                    FateBootstrapComponent,
                    FateLinkDropdownComponent
                ],
                imports: [common.CommonModule, forms.FormsModule, formField.MatFormFieldModule, angularFontawesome.FontAwesomeModule],
                exports: [
                    FateUiComponent,
                    FateInputComponent,
                    FateBootstrapComponent,
                    FateLinkDropdownComponent
                ]
            })
        ], FateModule);
        return FateModule;
    }());
    var FateMaterialModule = /** @class */ (function () {
        function FateMaterialModule() {
        }
        FateMaterialModule = __decorate([
            core.NgModule({
                declarations: [FateMaterialComponent],
                imports: [common.CommonModule, forms.FormsModule, formField.MatFormFieldModule, FateModule],
                exports: [FateMaterialComponent]
            })
        ], FateMaterialModule);
        return FateMaterialModule;
    }());

    exports.FateControllerService = FateControllerService;
    exports.FateFontawsomeLegacyIconService = FateFontawsomeLegacyIconService;
    exports.FateHtmlParserService = FateHtmlParserService;
    exports.FateIconService = FateIconService;
    exports.FateInputComponent = FateInputComponent;
    exports.FateLinkDropdownComponent = FateLinkDropdownComponent;
    exports.FateMaterialIconService = FateMaterialIconService;
    exports.FateMaterialModule = FateMaterialModule;
    exports.FateModule = FateModule;
    exports.FateNode = FateNode;
    exports.FateParserService = FateParserService;
    exports.FateUiComponent = FateUiComponent;
    exports.ɵa = FateBootstrapComponent;
    exports.ɵb = FateMaterialComponent;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=fate-editor.umd.js.map
