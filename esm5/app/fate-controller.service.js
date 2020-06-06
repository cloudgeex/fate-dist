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
                    if (this.actionMapping[action].detect && this.actionMapping[action].detect === node.type) {
                        actions.push({ action: action, value: node.value });
                    }
                    else if (this.actionMapping[action].detect && typeof this.actionMapping[action].detect === 'function') {
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
    };
    FateControllerService.prototype.doInline = function (channel, action, value) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmF0ZS1jb250cm9sbGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9mYXRlLWVkaXRvci8iLCJzb3VyY2VzIjpbImFwcC9mYXRlLWNvbnRyb2xsZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRS9CLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUM1QyxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxtREFBbUQsQ0FBQzs7QUFVOUY7SUFxTEU7UUFuTEEsNkNBQTZDO1FBQzdDLDRFQUE0RTtRQUNsRSxrQkFBYSxHQUFHO1lBQ3hCLE1BQU0sRUFBRztnQkFDUCxPQUFPLEVBQUUsTUFBTTtnQkFDZixJQUFJLEVBQUUsTUFBTTtnQkFDWixNQUFNLEVBQUUsUUFBUSxDQUFDLElBQUk7YUFDdEI7WUFDRCxRQUFRLEVBQUc7Z0JBQ1QsT0FBTyxFQUFFLFFBQVE7Z0JBQ2pCLElBQUksRUFBRSxRQUFRO2dCQUNkLE1BQU0sRUFBRSxRQUFRLENBQUMsTUFBTTthQUN4QjtZQUNELFdBQVcsRUFBRztnQkFDWixPQUFPLEVBQUUsV0FBVztnQkFDcEIsSUFBSSxFQUFFLFlBQVk7Z0JBQ2xCLE1BQU0sRUFBRSxRQUFRLENBQUMsU0FBUzthQUMzQjtZQUNELFFBQVEsRUFBRztnQkFDVCxPQUFPLEVBQUUsZUFBZTtnQkFDeEIsSUFBSSxFQUFFLGdCQUFnQjtnQkFDdEIsTUFBTSxFQUFFLFFBQVEsQ0FBQyxhQUFhO2FBQy9CO1lBQ0QsV0FBVyxFQUFHO2dCQUNaLE9BQU8sRUFBRSxXQUFXO2dCQUNwQixJQUFJLEVBQUUsV0FBVztnQkFDakIsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osTUFBTSxFQUFFLFFBQVEsQ0FBQyxTQUFTO2FBQzNCO1lBQ0QsYUFBYSxFQUFHO2dCQUNkLE9B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LHFCQUFxQjtRQUhqQyxVQUFVLENBQUM7WUFDVixVQUFVLEVBQUUsTUFBTTtTQUNuQixDQUFDO09BQ1cscUJBQXFCLENBMlBqQztnQ0ExUUQ7Q0EwUUMsQUEzUEQsSUEyUEM7U0EzUFkscUJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IEZhdGVUeXBlIH0gZnJvbSAnLi9mYXRlLXR5cGUuZW51bSc7XG5pbXBvcnQgeyBGYXRlTGlua0Ryb3Bkb3duQ29tcG9uZW50IH0gZnJvbSAnLi9mYXRlLWxpbmstZHJvcGRvd24vZmF0ZS1saW5rLWRyb3Bkb3duLmNvbXBvbmVudCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRmF0ZUNvbW1hbmQge1xuICBuYW1lOiBzdHJpbmc7XG4gIHZhbHVlOiBhbnk7XG59XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIEZhdGVDb250cm9sbGVyU2VydmljZSB7XG5cbiAgLy8gTGlzdCBvZiBhdmFpbGFibGUgY29tbWFuZHMsIGFscGhhYmV0aWNhbGx5XG4gIC8vIHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRG9jdW1lbnQvZXhlY0NvbW1hbmRcbiAgcHJvdGVjdGVkIGFjdGlvbk1hcHBpbmcgPSB7XG4gICAgJ2JvbGQnIDoge1xuICAgICAgY29tbWFuZDogJ2JvbGQnLFxuICAgICAgbmFtZTogJ0JvbGQnLFxuICAgICAgZGV0ZWN0OiBGYXRlVHlwZS5CT0xEXG4gICAgfSxcbiAgICAnaXRhbGljJyA6IHtcbiAgICAgIGNvbW1hbmQ6ICdpdGFsaWMnLFxuICAgICAgbmFtZTogJ0l0YWxpYycsXG4gICAgICBkZXRlY3Q6IEZhdGVUeXBlLklUQUxJQ1xuICAgIH0sXG4gICAgJ3VuZGVybGluZScgOiB7XG4gICAgICBjb21tYW5kOiAndW5kZXJsaW5lJyxcbiAgICAgIG5hbWU6ICdVbmRlcmxpbmVkJyxcbiAgICAgIGRldGVjdDogRmF0ZVR5cGUuVU5ERVJMSU5FXG4gICAgfSxcbiAgICAnc3RyaWtlJyA6IHtcbiAgICAgIGNvbW1hbmQ6ICdzdHJpa2VUaHJvdWdoJyxcbiAgICAgIG5hbWU6ICdTdHJpa2UgVGhyb3VnaCcsXG4gICAgICBkZXRlY3Q6IEZhdGVUeXBlLlNUUklLRVRIUk9VR0hcbiAgICB9LFxuICAgICdzdWJzY3JpcHQnIDoge1xuICAgICAgY29tbWFuZDogJ3N1YnNjcmlwdCcsXG4gICAgICBuYW1lOiAnU3Vic2NyaXB0JyxcbiAgICAgIGxhYmVsOiAnc3ViJyxcbiAgICAgIGRldGVjdDogRmF0ZVR5cGUuU1VCU0NSSVBUXG4gICAgfSxcbiAgICAnc3VwZXJzY3JpcHQnIDoge1xuICAgICAgY29tbWFuZDogJ3N1cGVyc2NyaXB0JyxcbiAgICAgIG5hbWU6ICdTdXBlcnNjcmlwdCcsXG4gICAgICBsYWJlbDogJ3N1cCcsXG4gICAgICBkZXRlY3Q6IEZhdGVUeXBlLlNVUEVSU0NSSVBUXG4gICAgfSxcbiAgICAnaGVhZGluZzEnIDoge1xuICAgICAgY29tbWFuZDogJ2Zvcm1hdEJsb2NrJyxcbiAgICAgIHZhbHVlOiAnSDEnLFxuICAgICAgbmFtZTogJzFzdCBIZWFkZXInLFxuICAgICAgbGFiZWw6ICdoMScsXG4gICAgICBkZXRlY3Q6IEZhdGVUeXBlLkhFQURFUjFcbiAgICB9LFxuICAgICdoZWFkaW5nMicgOiB7XG4gICAgICBjb21tYW5kOiAnZm9ybWF0QmxvY2snLFxuICAgICAgdmFsdWU6ICdIMicsXG4gICAgICBuYW1lOiAnMm5kIEhlYWRlcicsXG4gICAgICBsYWJlbDogJ2gyJyxcbiAgICAgIGRldGVjdDogRmF0ZVR5cGUuSEVBREVSMlxuICAgIH0sXG4gICAgJ2hlYWRpbmczJyA6IHtcbiAgICAgIGNvbW1hbmQ6ICdmb3JtYXRCbG9jaycsXG4gICAgICB2YWx1ZTogJ0gzJyxcbiAgICAgIG5hbWU6ICczcmQgSGVhZGVyJyxcbiAgICAgIGxhYmVsOiAnaDMnLFxuICAgICAgZGV0ZWN0OiBGYXRlVHlwZS5IRUFERVIzXG4gICAgfSxcbiAgICAnaGVhZGluZzQnIDoge1xuICAgICAgY29tbWFuZDogJ2Zvcm1hdEJsb2NrJyxcbiAgICAgIHZhbHVlOiAnSDQnLFxuICAgICAgbmFtZTogJzR0aCBIZWFkZXInLFxuICAgICAgbGFiZWw6ICdoNCcsXG4gICAgICBkZXRlY3Q6IEZhdGVUeXBlLkhFQURFUjRcbiAgICB9LFxuICAgICdoZWFkaW5nNScgOiB7XG4gICAgICBjb21tYW5kOiAnZm9ybWF0QmxvY2snLFxuICAgICAgdmFsdWU6ICdINScsXG4gICAgICBuYW1lOiAnNXRoIEhlYWRlcicsXG4gICAgICBsYWJlbDogJ2g1JyxcbiAgICAgIGRldGVjdDogRmF0ZVR5cGUuSEVBREVSNVxuICAgIH0sXG4gICAgJ2hlYWRpbmc2JyA6IHtcbiAgICAgIGNvbW1hbmQ6ICdmb3JtYXRCbG9jaycsXG4gICAgICB2YWx1ZTogJ0g2JyxcbiAgICAgIG5hbWU6ICc2dGggSGVhZGVyJyxcbiAgICAgIGxhYmVsOiAnaDYnLFxuICAgICAgZGV0ZWN0OiBGYXRlVHlwZS5IRUFERVI2XG4gICAgfSxcbiAgICAnbm9ybWFsJyA6IHtcbiAgICAgIGNvbW1hbmQ6ICdmb3JtYXRCbG9jaycsXG4gICAgICB2YWx1ZTogJ0RJVicsXG4gICAgICBuYW1lOiAnTm9ybWFsJyxcbiAgICAgIGxhYmVsOiAncCcsXG4gICAgfSxcbiAgICAnaW5kZW50JyA6IHtcbiAgICAgIGNvbW1hbmQ6ICdpbmRlbnQnLFxuICAgICAgbmFtZTogJ0luZGVudCcsXG4gICAgfSxcbiAgICAnb3V0ZGVudCcgOiB7XG4gICAgICBjb21tYW5kOiAnb3V0ZGVudCcsXG4gICAgICBuYW1lOiAnT3V0ZGVudCcsXG4gICAgfSxcbiAgICAnb3JkZXJlZCcgOiB7XG4gICAgICBjb21tYW5kOiAnaW5zZXJ0T3JkZXJlZExpc3QnLFxuICAgICAgbmFtZTogJ09yZGVyZWQgTGlzdCcsXG4gICAgICBkZXRlY3Q6IEZhdGVUeXBlLk9SREVSRURfTElTVFxuICAgIH0sXG4gICAgJ3Vub3JkZXJlZCcgOiB7XG4gICAgICBjb21tYW5kOiAnaW5zZXJ0VW5vcmRlcmVkTGlzdCcsXG4gICAgICBuYW1lOiAnVW5vcmRlciBMaXN0JyxcbiAgICAgIGRldGVjdDogRmF0ZVR5cGUuVU5PUkRFUkVEX0xJU1RcbiAgICB9LFxuICAgICdjZW50ZXInIDoge1xuICAgICAgY29tbWFuZDogJ2p1c3RpZnlDZW50ZXInLFxuICAgICAgbmFtZTogJ0NlbnRlcicsXG4gICAgICBkZXRlY3Q6IEZhdGVUeXBlLkFMSUdOX0NFTlRFUlxuICAgIH0sXG4gICAgJ2p1c3RpZnknIDoge1xuICAgICAgY29tbWFuZDogJ2p1c3RpZnlGdWxsJyxcbiAgICAgIG5hbWU6ICdKdXN0aWZ5JyxcbiAgICAgIGRldGVjdDogRmF0ZVR5cGUuSlVTVElGWVxuICAgIH0sXG4gICAgJ2xlZnQnIDoge1xuICAgICAgY29tbWFuZDogJ2p1c3RpZnlMZWZ0JyxcbiAgICAgIG5hbWU6ICdMZWZ0JyxcbiAgICAgIGRldGVjdDogRmF0ZVR5cGUuQUxJR05fTEVGVFxuICAgIH0sXG4gICAgJ3JpZ2h0JyA6IHtcbiAgICAgIGNvbW1hbmQ6ICdqdXN0aWZ5UmlnaHQnLFxuICAgICAgbmFtZTogJ1JpZ2h0JyxcbiAgICAgIGRldGVjdDogRmF0ZVR5cGUuQUxJR05fUklHSFRcbiAgICB9LFxuICAgICd1bmRvJyA6IHtcbiAgICAgIGNvbW1hbmQ6ICd1bmRvJyxcbiAgICAgIG5hbWU6ICdVbmRvJyxcbiAgICB9LFxuICAgICdyZWRvJyA6IHtcbiAgICAgIGNvbW1hbmQ6ICdyZWRvJyxcbiAgICAgIG5hbWU6ICdSZWRvJyxcbiAgICB9LFxuICAgICdjbGVhbicgOiB7XG4gICAgICBjb21tYW5kOiAncmVtb3ZlRm9ybWF0JyxcbiAgICAgIG5hbWU6ICdSZW1vdmUgRm9ybWF0aW5nJyxcbiAgICB9LFxuICAgICdsaW5rJyA6IHtcbiAgICAgIGNvbW1hbmQ6ICdjcmVhdGVMaW5rJyxcbiAgICAgIHVuZG86ICd1bmxpbmsnLFxuICAgICAgbmFtZTogJ0xpbmsnLFxuICAgICAgZGV0ZWN0OiBGYXRlVHlwZS5MSU5LLFxuICAgICAgZHJvcGRvd246IEZhdGVMaW5rRHJvcGRvd25Db21wb25lbnRcbiAgICB9XG4gIH07XG4gIHB1YmxpYyByZWdpc3RlckFjdGlvbihuYW1lOiBzdHJpbmcsIGFjdGlvbjogYW55KSB7XG4gICAgaWYgKHRoaXMuYWN0aW9uTWFwcGluZ1tuYW1lXSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBbiBhY3Rpb24gd2l0aCB0aGUgbmFtZSBcIicgKyBuYW1lICsgJ1wiIGFscmVhZHkgZXhpc3RzIScpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFjdGlvbk1hcHBpbmdbbmFtZV0gPSBhY3Rpb247XG4gICAgfVxuICB9XG4gIHB1YmxpYyBnZXRBY3Rpb24oYWN0aW9uTmFtZSk6IGJvb2xlYW4gfCBhbnkge1xuICAgIHJldHVybiB0aGlzLmFjdGlvbk1hcHBpbmdbYWN0aW9uTmFtZV0gfHwgZmFsc2U7XG4gIH1cblxuICBwcm90ZWN0ZWQgaW5saW5lQWN0aW9uTWFwcGluZzogYW55ID0ge307XG4gIHB1YmxpYyByZWdpc3RlcklubGluZUFjdGlvbihuYW1lOiBzdHJpbmcsIGFjdGlvbjogYW55KSB7XG4gICAgaWYgKHRoaXMuaW5saW5lQWN0aW9uTWFwcGluZ1tuYW1lXSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBbiBpbmxpbmUgYWN0aW9uIHdpdGggdGhlIG5hbWUgXCInICsgbmFtZSArICdcIiBhbHJlYWR5IGV4aXN0cyEnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pbmxpbmVBY3Rpb25NYXBwaW5nW25hbWVdID0gYWN0aW9uO1xuICAgIH1cbiAgfVxuICAgcHVibGljIGdldElubGluZUFjdGlvbihjb250ZXh0OiBzdHJpbmcpOiBib29sZWFuIHwgYW55IHtcbiAgICBmb3IgKGNvbnN0IGFjdGlvbiBvZiBPYmplY3Qua2V5cyh0aGlzLmlubGluZUFjdGlvbk1hcHBpbmcpKSB7XG4gICAgICBjb25zdCBtYXRjaCA9IHRoaXMuaW5saW5lQWN0aW9uTWFwcGluZ1thY3Rpb25dLnJlZ2V4cC5leGVjKGNvbnRleHQpO1xuICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgIHRoaXMuaW5saW5lQWN0aW9uTWFwcGluZ1thY3Rpb25dLm1hdGNoZWQgPSBtYXRjaFsxXTtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5saW5lQWN0aW9uTWFwcGluZ1thY3Rpb25dO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwcm90ZWN0ZWQgY29tbWFuZHNQaXBlID0ge1xuICAgIGRlZmF1bHQ6IG5ldyBTdWJqZWN0PEZhdGVDb21tYW5kPigpXG4gIH07XG5cbiAgcHJvdGVjdGVkIGVuYWJsZWRBY3Rpb25zID0ge1xuICAgIGRlZmF1bHQ6IG5ldyBTdWJqZWN0PGFueT4oKVxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKCkgeyB9XG5cbiAgcHVibGljIGNoYW5uZWwoY2hhbm5lbElkKSB7XG4gICAgaWYgKCF0aGlzLmNvbW1hbmRzUGlwZVtjaGFubmVsSWRdKSB7XG4gICAgICB0aGlzLmNvbW1hbmRzUGlwZVtjaGFubmVsSWRdID0gbmV3IFN1YmplY3Q8RmF0ZUNvbW1hbmQ+KCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvbW1hbmRzUGlwZVtjaGFubmVsSWRdO1xuICB9XG5cbiAgcHVibGljIGVuYWJsZWQoY2hhbm5lbElkKSB7XG4gICAgaWYgKCF0aGlzLmVuYWJsZWRBY3Rpb25zW2NoYW5uZWxJZF0pIHtcbiAgICAgIHRoaXMuZW5hYmxlZEFjdGlvbnNbY2hhbm5lbElkXSA9IG5ldyBTdWJqZWN0PGFueT4oKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZW5hYmxlZEFjdGlvbnNbY2hhbm5lbElkXTtcbiAgfVxuXG4gIHB1YmxpYyBlbmFibGVBY3Rpb25zKGNoYW5uZWxJZCwgbm9kZXMpIHtcbiAgICBjb25zdCBhY3Rpb25zOiBBcnJheTxhbnk+ID0gW107XG4gICAgZm9yIChjb25zdCBub2RlIG9mIG5vZGVzKSB7XG4gICAgICBmb3IgKGNvbnN0IGFjdGlvbiBpbiB0aGlzLmFjdGlvbk1hcHBpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMuYWN0aW9uTWFwcGluZ1thY3Rpb25dLmRldGVjdCAmJiB0aGlzLmFjdGlvbk1hcHBpbmdbYWN0aW9uXS5kZXRlY3QgPT09IG5vZGUudHlwZSkge1xuICAgICAgICAgIGFjdGlvbnMucHVzaCh7YWN0aW9uOiBhY3Rpb24sIHZhbHVlOiBub2RlLnZhbHVlfSk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5hY3Rpb25NYXBwaW5nW2FjdGlvbl0uZGV0ZWN0ICYmIHR5cGVvZiB0aGlzLmFjdGlvbk1hcHBpbmdbYWN0aW9uXS5kZXRlY3QgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBjb25zdCBkZXRlY3RlZCA9IHRoaXMuYWN0aW9uTWFwcGluZ1thY3Rpb25dLmRldGVjdChub2RlKTtcbiAgICAgICAgICBpZiAoZGV0ZWN0ZWQpIHtcbiAgICAgICAgICAgIGFjdGlvbnMucHVzaCh7YWN0aW9uOiBhY3Rpb24sIHZhbHVlOiBkZXRlY3RlZC52YWx1ZX0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmVuYWJsZWRBY3Rpb25zW2NoYW5uZWxJZF0ubmV4dChhY3Rpb25zKTtcbiAgfVxuXG5cbiAgcHVibGljIGRvKGNoYW5uZWwsIGFjdGlvbiwgdmFsdWU/KSB7XG4gICAgaWYgKHRoaXMuYWN0aW9uTWFwcGluZ1thY3Rpb25dLmRyb3Bkb3duICYmICF2YWx1ZSkge1xuICAgICAgaWYgKHRoaXMuYWN0aW9uTWFwcGluZ1thY3Rpb25dLnVuZG8pIHtcbiAgICAgICAgdGhpcy5jb21tYW5kc1BpcGVbY2hhbm5lbF0ubmV4dCh7bmFtZTogdGhpcy5hY3Rpb25NYXBwaW5nW2FjdGlvbl0udW5kbywgdmFsdWU6IHRoaXMuYWN0aW9uTWFwcGluZ1thY3Rpb25dLnZhbHVlIHx8IHZhbHVlfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FjdGlvbiBcIicgKyBhY3Rpb24gKyAnXCJkb2VzblxcJ3QgaGF2ZSBhIHVuZG8gY29tbWFuZCcpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5hY3Rpb25NYXBwaW5nW2FjdGlvbl0udmFsdWUgJiYgKHR5cGVvZiB0aGlzLmFjdGlvbk1hcHBpbmdbYWN0aW9uXS52YWx1ZSA9PT0gJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgdGhpcy5jb21tYW5kc1BpcGVbY2hhbm5lbF0ubmV4dCh7bmFtZTogdGhpcy5hY3Rpb25NYXBwaW5nW2FjdGlvbl0uY29tbWFuZCwgdmFsdWU6IHRoaXMuYWN0aW9uTWFwcGluZ1thY3Rpb25dLnZhbHVlKHZhbHVlKX0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jb21tYW5kc1BpcGVbY2hhbm5lbF0ubmV4dCh7bmFtZTogdGhpcy5hY3Rpb25NYXBwaW5nW2FjdGlvbl0uY29tbWFuZCwgdmFsdWU6IHRoaXMuYWN0aW9uTWFwcGluZ1thY3Rpb25dLnZhbHVlIHx8IHZhbHVlfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGRvSW5saW5lKGNoYW5uZWwsIGFjdGlvbiwgdmFsdWU/KSB7XG4gICAgaWYgKGFjdGlvbi5kcm9wZG93biAmJiAhdmFsdWUpIHtcbiAgICAgIGlmIChhY3Rpb24udW5kbykge1xuICAgICAgICB0aGlzLmNvbW1hbmRzUGlwZVtjaGFubmVsXS5uZXh0KHtuYW1lOiBhY3Rpb24udW5kbywgdmFsdWU6IGFjdGlvbi52YWx1ZSB8fCB2YWx1ZX0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBY3Rpb24gXCInICsgYWN0aW9uICsgJ1wiZG9lc25cXCd0IGhhdmUgYSB1bmRvIGNvbW1hbmQnKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGFjdGlvbi52YWx1ZSAmJiAodHlwZW9mIGFjdGlvbi52YWx1ZSA9PT0gJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgdGhpcy5jb21tYW5kc1BpcGVbY2hhbm5lbF0ubmV4dCh7bmFtZTogYWN0aW9uLmNvbW1hbmQsIHZhbHVlOiBhY3Rpb24udmFsdWUodmFsdWUpfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNvbW1hbmRzUGlwZVtjaGFubmVsXS5uZXh0KHtuYW1lOiBhY3Rpb24uY29tbWFuZCwgdmFsdWU6IGFjdGlvbi52YWx1ZSB8fCB2YWx1ZX0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB1bmRvKGNoYW5uZWwsIGFjdGlvbiwgdmFsdWU/KSB7XG4gICAgY29uc3QgbWFwcGluZyA9IHRoaXMuYWN0aW9uTWFwcGluZ1thY3Rpb25dLnVuZG87XG4gICAgLy8gVE9ET1xuICB9XG59XG4iXX0=