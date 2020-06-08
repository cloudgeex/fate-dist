import { __decorate, __values } from "tslib";
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FateType } from './fate-type.enum';
import { FateLinkDropdownComponent } from './fate-link-dropdown/fate-link-dropdown.component';
import * as i0 from "@angular/core";
var FateControllerService = /** @class */ (function () {
    function FateControllerService() {
        // List of available commands, alphabetically
        // see https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
        this.actionMapping = {
            bold: {
                command: 'bold',
                name: 'Bold',
                detect: FateType.BOLD
            },
            italic: {
                command: 'italic',
                name: 'Italic',
                detect: FateType.ITALIC
            },
            underline: {
                command: 'underline',
                name: 'Underlined',
                detect: FateType.UNDERLINE
            },
            strike: {
                command: 'strikeThrough',
                name: 'Strike Through',
                detect: FateType.STRIKETHROUGH
            },
            subscript: {
                command: 'subscript',
                name: 'Subscript',
                label: 'sub',
                detect: FateType.SUBSCRIPT
            },
            superscript: {
                command: 'superscript',
                name: 'Superscript',
                label: 'sup',
                detect: FateType.SUPERSCRIPT
            },
            heading1: {
                command: 'formatBlock',
                value: 'H1',
                name: '1st Header',
                label: 'h1',
                detect: FateType.HEADER1
            },
            heading2: {
                command: 'formatBlock',
                value: 'H2',
                name: '2nd Header',
                label: 'h2',
                detect: FateType.HEADER2
            },
            heading3: {
                command: 'formatBlock',
                value: 'H3',
                name: '3rd Header',
                label: 'h3',
                detect: FateType.HEADER3
            },
            heading4: {
                command: 'formatBlock',
                value: 'H4',
                name: '4th Header',
                label: 'h4',
                detect: FateType.HEADER4
            },
            heading5: {
                command: 'formatBlock',
                value: 'H5',
                name: '5th Header',
                label: 'h5',
                detect: FateType.HEADER5
            },
            heading6: {
                command: 'formatBlock',
                value: 'H6',
                name: '6th Header',
                label: 'h6',
                detect: FateType.HEADER6
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
                detect: FateType.ORDERED_LIST
            },
            unordered: {
                command: 'insertUnorderedList',
                name: 'Unorder List',
                detect: FateType.UNORDERED_LIST
            },
            center: {
                command: 'justifyCenter',
                name: 'Center',
                detect: FateType.ALIGN_CENTER
            },
            justify: {
                command: 'justifyFull',
                name: 'Justify',
                detect: FateType.JUSTIFY
            },
            left: {
                command: 'justifyLeft',
                name: 'Left',
                detect: FateType.ALIGN_LEFT
            },
            right: {
                command: 'justifyRight',
                name: 'Right',
                detect: FateType.ALIGN_RIGHT
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
            this.commandsPipe[channelId] = new Subject();
        }
        return this.commandsPipe[channelId];
    };
    FateControllerService.prototype.enabled = function (channelId) {
        if (!this.enabledActions[channelId]) {
            this.enabledActions[channelId] = new Subject();
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
    FateControllerService.ɵprov = i0.ɵɵdefineInjectable({ factory: function FateControllerService_Factory() { return new FateControllerService(); }, token: FateControllerService, providedIn: "root" });
    FateControllerService = __decorate([
        Injectable({
            providedIn: 'root'
        })
    ], FateControllerService);
    return FateControllerService;
}());
export { FateControllerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmF0ZS1jb250cm9sbGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9mYXRlLWVkaXRvci8iLCJzb3VyY2VzIjpbImFwcC9mYXRlLWNvbnRyb2xsZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRS9CLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUM1QyxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxtREFBbUQsQ0FBQzs7QUFVOUY7SUFzTEU7UUFyTEEsNkNBQTZDO1FBQzdDLDRFQUE0RTtRQUNsRSxrQkFBYSxHQUFHO1lBQ3hCLElBQUksRUFBRTtnQkFDSixPQUFPLEVBQUUsTUFBTTtnQkFDZixJQUFJLEVBQUUsTUFBTTtnQkFDWixNQUFNLEVBQUUsUUFBUSxDQUFDLElBQUk7YUFDdEI7WUFDRCxNQUFNLEVBQUU7Z0JBQ04sT0FBTyxFQUFFLFFBQVE7Z0JBQ2pCLElBQUksRUFBRSxRQUFRO2dCQUNkLE1BQU0sRUFBRSxRQUFRLENBQUMsTUFBTTthQUN4QjtZQUNELFNBQVMsRUFBRTtnQkFDVCxPQUFPLEVBQUUsV0FBVztnQkFDcEIsSUFBSSxFQUFFLFlBQVk7Z0JBQ2xCLE1BQU0sRUFBRSxRQUFRLENBQUMsU0FBUzthQUMzQjtZQUNELE1BQU0sRUFBRTtnQkFDTixPQUFPLEVBQUUsZUFBZTtnQkFDeEIsSUFBSSxFQUFFLGdCQUFnQjtnQkFDdEIsTUFBTSxFQUFFLFFBQVEsQ0FBQyxhQUFhO2FBQy9CO1lBQ0QsU0FBUyxFQUFFO2dCQUNULE9BQU8sRUFBRSxXQUFXO2dCQUNwQixJQUFJLEVBQUUsV0FBVztnQkFDakIsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osTUFBTSxFQUFFLFFBQVEsQ0FBQyxTQUFTO2FBQzNCO1lBQ0QsV0FBVyxFQUFFO2dCQUNYLE9B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SUFDVCxDQUFDOztJQXJSVSxxQkFBcUI7UUFIakMsVUFBVSxDQUFDO1lBQ1YsVUFBVSxFQUFFLE1BQU07U0FDbkIsQ0FBQztPQUNXLHFCQUFxQixDQXNSakM7Z0NBclNEO0NBcVNDLEFBdFJELElBc1JDO1NBdFJZLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBGYXRlVHlwZSB9IGZyb20gJy4vZmF0ZS10eXBlLmVudW0nO1xuaW1wb3J0IHsgRmF0ZUxpbmtEcm9wZG93bkNvbXBvbmVudCB9IGZyb20gJy4vZmF0ZS1saW5rLWRyb3Bkb3duL2ZhdGUtbGluay1kcm9wZG93bi5jb21wb25lbnQnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEZhdGVDb21tYW5kIHtcbiAgbmFtZTogc3RyaW5nO1xuICB2YWx1ZTogYW55O1xufVxuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBGYXRlQ29udHJvbGxlclNlcnZpY2Uge1xuICAvLyBMaXN0IG9mIGF2YWlsYWJsZSBjb21tYW5kcywgYWxwaGFiZXRpY2FsbHlcbiAgLy8gc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9Eb2N1bWVudC9leGVjQ29tbWFuZFxuICBwcm90ZWN0ZWQgYWN0aW9uTWFwcGluZyA9IHtcbiAgICBib2xkOiB7XG4gICAgICBjb21tYW5kOiAnYm9sZCcsXG4gICAgICBuYW1lOiAnQm9sZCcsXG4gICAgICBkZXRlY3Q6IEZhdGVUeXBlLkJPTERcbiAgICB9LFxuICAgIGl0YWxpYzoge1xuICAgICAgY29tbWFuZDogJ2l0YWxpYycsXG4gICAgICBuYW1lOiAnSXRhbGljJyxcbiAgICAgIGRldGVjdDogRmF0ZVR5cGUuSVRBTElDXG4gICAgfSxcbiAgICB1bmRlcmxpbmU6IHtcbiAgICAgIGNvbW1hbmQ6ICd1bmRlcmxpbmUnLFxuICAgICAgbmFtZTogJ1VuZGVybGluZWQnLFxuICAgICAgZGV0ZWN0OiBGYXRlVHlwZS5VTkRFUkxJTkVcbiAgICB9LFxuICAgIHN0cmlrZToge1xuICAgICAgY29tbWFuZDogJ3N0cmlrZVRocm91Z2gnLFxuICAgICAgbmFtZTogJ1N0cmlrZSBUaHJvdWdoJyxcbiAgICAgIGRldGVjdDogRmF0ZVR5cGUuU1RSSUtFVEhST1VHSFxuICAgIH0sXG4gICAgc3Vic2NyaXB0OiB7XG4gICAgICBjb21tYW5kOiAnc3Vic2NyaXB0JyxcbiAgICAgIG5hbWU6ICdTdWJzY3JpcHQnLFxuICAgICAgbGFiZWw6ICdzdWInLFxuICAgICAgZGV0ZWN0OiBGYXRlVHlwZS5TVUJTQ1JJUFRcbiAgICB9LFxuICAgIHN1cGVyc2NyaXB0OiB7XG4gICAgICBjb21tYW5kOiAnc3VwZXJzY3JpcHQnLFxuICAgICAgbmFtZTogJ1N1cGVyc2NyaXB0JyxcbiAgICAgIGxhYmVsOiAnc3VwJyxcbiAgICAgIGRldGVjdDogRmF0ZVR5cGUuU1VQRVJTQ1JJUFRcbiAgICB9LFxuICAgIGhlYWRpbmcxOiB7XG4gICAgICBjb21tYW5kOiAnZm9ybWF0QmxvY2snLFxuICAgICAgdmFsdWU6ICdIMScsXG4gICAgICBuYW1lOiAnMXN0IEhlYWRlcicsXG4gICAgICBsYWJlbDogJ2gxJyxcbiAgICAgIGRldGVjdDogRmF0ZVR5cGUuSEVBREVSMVxuICAgIH0sXG4gICAgaGVhZGluZzI6IHtcbiAgICAgIGNvbW1hbmQ6ICdmb3JtYXRCbG9jaycsXG4gICAgICB2YWx1ZTogJ0gyJyxcbiAgICAgIG5hbWU6ICcybmQgSGVhZGVyJyxcbiAgICAgIGxhYmVsOiAnaDInLFxuICAgICAgZGV0ZWN0OiBGYXRlVHlwZS5IRUFERVIyXG4gICAgfSxcbiAgICBoZWFkaW5nMzoge1xuICAgICAgY29tbWFuZDogJ2Zvcm1hdEJsb2NrJyxcbiAgICAgIHZhbHVlOiAnSDMnLFxuICAgICAgbmFtZTogJzNyZCBIZWFkZXInLFxuICAgICAgbGFiZWw6ICdoMycsXG4gICAgICBkZXRlY3Q6IEZhdGVUeXBlLkhFQURFUjNcbiAgICB9LFxuICAgIGhlYWRpbmc0OiB7XG4gICAgICBjb21tYW5kOiAnZm9ybWF0QmxvY2snLFxuICAgICAgdmFsdWU6ICdINCcsXG4gICAgICBuYW1lOiAnNHRoIEhlYWRlcicsXG4gICAgICBsYWJlbDogJ2g0JyxcbiAgICAgIGRldGVjdDogRmF0ZVR5cGUuSEVBREVSNFxuICAgIH0sXG4gICAgaGVhZGluZzU6IHtcbiAgICAgIGNvbW1hbmQ6ICdmb3JtYXRCbG9jaycsXG4gICAgICB2YWx1ZTogJ0g1JyxcbiAgICAgIG5hbWU6ICc1dGggSGVhZGVyJyxcbiAgICAgIGxhYmVsOiAnaDUnLFxuICAgICAgZGV0ZWN0OiBGYXRlVHlwZS5IRUFERVI1XG4gICAgfSxcbiAgICBoZWFkaW5nNjoge1xuICAgICAgY29tbWFuZDogJ2Zvcm1hdEJsb2NrJyxcbiAgICAgIHZhbHVlOiAnSDYnLFxuICAgICAgbmFtZTogJzZ0aCBIZWFkZXInLFxuICAgICAgbGFiZWw6ICdoNicsXG4gICAgICBkZXRlY3Q6IEZhdGVUeXBlLkhFQURFUjZcbiAgICB9LFxuICAgIG5vcm1hbDoge1xuICAgICAgY29tbWFuZDogJ2Zvcm1hdEJsb2NrJyxcbiAgICAgIHZhbHVlOiAnRElWJyxcbiAgICAgIG5hbWU6ICdOb3JtYWwnLFxuICAgICAgbGFiZWw6ICdwJ1xuICAgIH0sXG4gICAgaW5kZW50OiB7XG4gICAgICBjb21tYW5kOiAnaW5kZW50JyxcbiAgICAgIG5hbWU6ICdJbmRlbnQnXG4gICAgfSxcbiAgICBvdXRkZW50OiB7XG4gICAgICBjb21tYW5kOiAnb3V0ZGVudCcsXG4gICAgICBuYW1lOiAnT3V0ZGVudCdcbiAgICB9LFxuICAgIG9yZGVyZWQ6IHtcbiAgICAgIGNvbW1hbmQ6ICdpbnNlcnRPcmRlcmVkTGlzdCcsXG4gICAgICBuYW1lOiAnT3JkZXJlZCBMaXN0JyxcbiAgICAgIGRldGVjdDogRmF0ZVR5cGUuT1JERVJFRF9MSVNUXG4gICAgfSxcbiAgICB1bm9yZGVyZWQ6IHtcbiAgICAgIGNvbW1hbmQ6ICdpbnNlcnRVbm9yZGVyZWRMaXN0JyxcbiAgICAgIG5hbWU6ICdVbm9yZGVyIExpc3QnLFxuICAgICAgZGV0ZWN0OiBGYXRlVHlwZS5VTk9SREVSRURfTElTVFxuICAgIH0sXG4gICAgY2VudGVyOiB7XG4gICAgICBjb21tYW5kOiAnanVzdGlmeUNlbnRlcicsXG4gICAgICBuYW1lOiAnQ2VudGVyJyxcbiAgICAgIGRldGVjdDogRmF0ZVR5cGUuQUxJR05fQ0VOVEVSXG4gICAgfSxcbiAgICBqdXN0aWZ5OiB7XG4gICAgICBjb21tYW5kOiAnanVzdGlmeUZ1bGwnLFxuICAgICAgbmFtZTogJ0p1c3RpZnknLFxuICAgICAgZGV0ZWN0OiBGYXRlVHlwZS5KVVNUSUZZXG4gICAgfSxcbiAgICBsZWZ0OiB7XG4gICAgICBjb21tYW5kOiAnanVzdGlmeUxlZnQnLFxuICAgICAgbmFtZTogJ0xlZnQnLFxuICAgICAgZGV0ZWN0OiBGYXRlVHlwZS5BTElHTl9MRUZUXG4gICAgfSxcbiAgICByaWdodDoge1xuICAgICAgY29tbWFuZDogJ2p1c3RpZnlSaWdodCcsXG4gICAgICBuYW1lOiAnUmlnaHQnLFxuICAgICAgZGV0ZWN0OiBGYXRlVHlwZS5BTElHTl9SSUdIVFxuICAgIH0sXG4gICAgdW5kbzoge1xuICAgICAgY29tbWFuZDogJ3VuZG8nLFxuICAgICAgbmFtZTogJ1VuZG8nXG4gICAgfSxcbiAgICByZWRvOiB7XG4gICAgICBjb21tYW5kOiAncmVkbycsXG4gICAgICBuYW1lOiAnUmVkbydcbiAgICB9LFxuICAgIGNsZWFuOiB7XG4gICAgICBjb21tYW5kOiAncmVtb3ZlRm9ybWF0JyxcbiAgICAgIG5hbWU6ICdSZW1vdmUgRm9ybWF0aW5nJ1xuICAgIH0sXG4gICAgbGluazoge1xuICAgICAgY29tbWFuZDogJ2NyZWF0ZUxpbmsnLFxuICAgICAgdW5kbzogJ3VubGluaycsXG4gICAgICBuYW1lOiAnTGluaycsXG4gICAgICBkZXRlY3Q6IEZhdGVUeXBlLkxJTkssXG4gICAgICBkcm9wZG93bjogRmF0ZUxpbmtEcm9wZG93bkNvbXBvbmVudFxuICAgIH1cbiAgfTtcbiAgcHVibGljIHJlZ2lzdGVyQWN0aW9uKG5hbWU6IHN0cmluZywgYWN0aW9uOiBhbnkpIHtcbiAgICBpZiAodGhpcy5hY3Rpb25NYXBwaW5nW25hbWVdKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FuIGFjdGlvbiB3aXRoIHRoZSBuYW1lIFwiJyArIG5hbWUgKyAnXCIgYWxyZWFkeSBleGlzdHMhJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYWN0aW9uTWFwcGluZ1tuYW1lXSA9IGFjdGlvbjtcbiAgICB9XG4gIH1cbiAgcHVibGljIGdldEFjdGlvbihhY3Rpb25OYW1lKTogYm9vbGVhbiB8IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuYWN0aW9uTWFwcGluZ1thY3Rpb25OYW1lXSB8fCBmYWxzZTtcbiAgfVxuXG4gIHByb3RlY3RlZCBpbmxpbmVBY3Rpb25NYXBwaW5nOiBhbnkgPSB7fTtcbiAgcHVibGljIHJlZ2lzdGVySW5saW5lQWN0aW9uKG5hbWU6IHN0cmluZywgYWN0aW9uOiBhbnkpIHtcbiAgICBpZiAodGhpcy5pbmxpbmVBY3Rpb25NYXBwaW5nW25hbWVdKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdBbiBpbmxpbmUgYWN0aW9uIHdpdGggdGhlIG5hbWUgXCInICsgbmFtZSArICdcIiBhbHJlYWR5IGV4aXN0cyEnXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmlubGluZUFjdGlvbk1hcHBpbmdbbmFtZV0gPSBhY3Rpb247XG4gICAgfVxuICB9XG4gIHB1YmxpYyBnZXRJbmxpbmVBY3Rpb24oY29udGV4dDogc3RyaW5nKTogYm9vbGVhbiB8IGFueSB7XG4gICAgZm9yIChjb25zdCBhY3Rpb24gb2YgT2JqZWN0LmtleXModGhpcy5pbmxpbmVBY3Rpb25NYXBwaW5nKSkge1xuICAgICAgY29uc3QgbWF0Y2ggPSB0aGlzLmlubGluZUFjdGlvbk1hcHBpbmdbYWN0aW9uXS5yZWdleHAuZXhlYyhjb250ZXh0KTtcbiAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICB0aGlzLmlubGluZUFjdGlvbk1hcHBpbmdbYWN0aW9uXS5tYXRjaGVkID0gbWF0Y2hbMV07XG4gICAgICAgIHJldHVybiB0aGlzLmlubGluZUFjdGlvbk1hcHBpbmdbYWN0aW9uXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJvdGVjdGVkIGNvbW1hbmRzUGlwZSA9IHtcbiAgICBkZWZhdWx0OiBuZXcgU3ViamVjdDxGYXRlQ29tbWFuZD4oKVxuICB9O1xuXG4gIHByb3RlY3RlZCBlbmFibGVkQWN0aW9ucyA9IHtcbiAgICBkZWZhdWx0OiBuZXcgU3ViamVjdDxhbnk+KClcbiAgfTtcblxuICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgcHVibGljIGNoYW5uZWwoY2hhbm5lbElkKSB7XG4gICAgaWYgKCF0aGlzLmNvbW1hbmRzUGlwZVtjaGFubmVsSWRdKSB7XG4gICAgICB0aGlzLmNvbW1hbmRzUGlwZVtjaGFubmVsSWRdID0gbmV3IFN1YmplY3Q8RmF0ZUNvbW1hbmQ+KCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvbW1hbmRzUGlwZVtjaGFubmVsSWRdO1xuICB9XG5cbiAgcHVibGljIGVuYWJsZWQoY2hhbm5lbElkKSB7XG4gICAgaWYgKCF0aGlzLmVuYWJsZWRBY3Rpb25zW2NoYW5uZWxJZF0pIHtcbiAgICAgIHRoaXMuZW5hYmxlZEFjdGlvbnNbY2hhbm5lbElkXSA9IG5ldyBTdWJqZWN0PGFueT4oKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZW5hYmxlZEFjdGlvbnNbY2hhbm5lbElkXTtcbiAgfVxuXG4gIHB1YmxpYyBlbmFibGVBY3Rpb25zKGNoYW5uZWxJZCwgbm9kZXMpIHtcbiAgICBjb25zdCBhY3Rpb25zOiBBcnJheTxhbnk+ID0gW107XG4gICAgZm9yIChjb25zdCBub2RlIG9mIG5vZGVzKSB7XG4gICAgICBmb3IgKGNvbnN0IGFjdGlvbiBpbiB0aGlzLmFjdGlvbk1hcHBpbmcpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHRoaXMuYWN0aW9uTWFwcGluZ1thY3Rpb25dLmRldGVjdCAmJlxuICAgICAgICAgIHRoaXMuYWN0aW9uTWFwcGluZ1thY3Rpb25dLmRldGVjdCA9PT0gbm9kZS50eXBlXG4gICAgICAgICkge1xuICAgICAgICAgIGFjdGlvbnMucHVzaCh7IGFjdGlvbjogYWN0aW9uLCB2YWx1ZTogbm9kZS52YWx1ZSB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICB0aGlzLmFjdGlvbk1hcHBpbmdbYWN0aW9uXS5kZXRlY3QgJiZcbiAgICAgICAgICB0eXBlb2YgdGhpcy5hY3Rpb25NYXBwaW5nW2FjdGlvbl0uZGV0ZWN0ID09PSAnZnVuY3Rpb24nXG4gICAgICAgICkge1xuICAgICAgICAgIGNvbnN0IGRldGVjdGVkID0gdGhpcy5hY3Rpb25NYXBwaW5nW2FjdGlvbl0uZGV0ZWN0KG5vZGUpO1xuICAgICAgICAgIGlmIChkZXRlY3RlZCkge1xuICAgICAgICAgICAgYWN0aW9ucy5wdXNoKHsgYWN0aW9uOiBhY3Rpb24sIHZhbHVlOiBkZXRlY3RlZC52YWx1ZSB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5lbmFibGVkQWN0aW9uc1tjaGFubmVsSWRdLm5leHQoYWN0aW9ucyk7XG4gIH1cblxuICBwdWJsaWMgZG8oY2hhbm5lbCwgYWN0aW9uLCB2YWx1ZT8pIHtcbiAgICBpZiAodGhpcy5hY3Rpb25NYXBwaW5nW2FjdGlvbl0uZHJvcGRvd24gJiYgIXZhbHVlKSB7XG4gICAgICBpZiAodGhpcy5hY3Rpb25NYXBwaW5nW2FjdGlvbl0udW5kbykge1xuICAgICAgICB0aGlzLmNvbW1hbmRzUGlwZVtjaGFubmVsXS5uZXh0KHtcbiAgICAgICAgICBuYW1lOiB0aGlzLmFjdGlvbk1hcHBpbmdbYWN0aW9uXS51bmRvLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLmFjdGlvbk1hcHBpbmdbYWN0aW9uXS52YWx1ZSB8fCB2YWx1ZVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQWN0aW9uIFwiJyArIGFjdGlvbiArICdcImRvZXNuXFwndCBoYXZlIGEgdW5kbyBjb21tYW5kJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChcbiAgICAgICAgdGhpcy5hY3Rpb25NYXBwaW5nW2FjdGlvbl0udmFsdWUgJiZcbiAgICAgICAgdHlwZW9mIHRoaXMuYWN0aW9uTWFwcGluZ1thY3Rpb25dLnZhbHVlID09PSAnZnVuY3Rpb24nXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5jb21tYW5kc1BpcGVbY2hhbm5lbF0ubmV4dCh7XG4gICAgICAgICAgbmFtZTogdGhpcy5hY3Rpb25NYXBwaW5nW2FjdGlvbl0uY29tbWFuZCxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5hY3Rpb25NYXBwaW5nW2FjdGlvbl0udmFsdWUodmFsdWUpXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jb21tYW5kc1BpcGVbY2hhbm5lbF0ubmV4dCh7XG4gICAgICAgICAgbmFtZTogdGhpcy5hY3Rpb25NYXBwaW5nW2FjdGlvbl0uY29tbWFuZCxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5hY3Rpb25NYXBwaW5nW2FjdGlvbl0udmFsdWUgfHwgdmFsdWVcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGRvSW5saW5lKGNoYW5uZWwsIGFjdGlvbiwgdmFsdWU/KSB7XG4gICAgaWYgKGFjdGlvbi5kcm9wZG93biAmJiAhdmFsdWUpIHtcbiAgICAgIGlmIChhY3Rpb24udW5kbykge1xuICAgICAgICB0aGlzLmNvbW1hbmRzUGlwZVtjaGFubmVsXS5uZXh0KHtcbiAgICAgICAgICBuYW1lOiBhY3Rpb24udW5kbyxcbiAgICAgICAgICB2YWx1ZTogYWN0aW9uLnZhbHVlIHx8IHZhbHVlXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBY3Rpb24gXCInICsgYWN0aW9uICsgJ1wiZG9lc25cXCd0IGhhdmUgYSB1bmRvIGNvbW1hbmQnKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGFjdGlvbi52YWx1ZSAmJiB0eXBlb2YgYWN0aW9uLnZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRoaXMuY29tbWFuZHNQaXBlW2NoYW5uZWxdLm5leHQoe1xuICAgICAgICAgIG5hbWU6IGFjdGlvbi5jb21tYW5kLFxuICAgICAgICAgIHZhbHVlOiBhY3Rpb24udmFsdWUodmFsdWUpXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jb21tYW5kc1BpcGVbY2hhbm5lbF0ubmV4dCh7XG4gICAgICAgICAgbmFtZTogYWN0aW9uLmNvbW1hbmQsXG4gICAgICAgICAgdmFsdWU6IGFjdGlvbi52YWx1ZSB8fCB2YWx1ZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdW5kbyhjaGFubmVsLCBhY3Rpb24sIHZhbHVlPykge1xuICAgIGNvbnN0IG1hcHBpbmcgPSB0aGlzLmFjdGlvbk1hcHBpbmdbYWN0aW9uXS51bmRvO1xuICAgIC8vIFRPRE9cbiAgfVxufVxuIl19