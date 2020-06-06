import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FateType } from './fate-type.enum';
import { FateLinkDropdownComponent } from './fate-link-dropdown/fate-link-dropdown.component';
import * as i0 from "@angular/core";
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
FateControllerService.ɵprov = i0.ɵɵdefineInjectable({ factory: function FateControllerService_Factory() { return new FateControllerService(); }, token: FateControllerService, providedIn: "root" });
FateControllerService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], FateControllerService);
export { FateControllerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmF0ZS1jb250cm9sbGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9mYXRlLWVkaXRvci8iLCJzb3VyY2VzIjpbImFwcC9mYXRlLWNvbnRyb2xsZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRS9CLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUM1QyxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxtREFBbUQsQ0FBQzs7QUFVOUYsSUFBYSxxQkFBcUIsR0FBbEMsTUFBYSxxQkFBcUI7SUFxTGhDO1FBbkxBLDZDQUE2QztRQUM3Qyw0RUFBNEU7UUFDbEUsa0JBQWEsR0FBRztZQUN4QixNQUFNLEVBQUc7Z0JBQ1AsT0FBTyxFQUFFLE1BQU07Z0JBQ2YsSUFBSSxFQUFFLE1BQU07Z0JBQ1osTUFBTSxFQUFFLFFBQVEsQ0FBQyxJQUFJO2FBQ3RCO1lBQ0QsUUFBUSxFQUFHO2dCQUNULE9BQU8sRUFBRSxRQUFRO2dCQUNqQixJQUFJLEVBQUUsUUFBUTtnQkFDZCxNQUFNLEVBQUUsUUFBUSxDQUFDLE1BQU07YUFDeEI7WUFDRCxXQUFXLEVBQUc7Z0JBQ1osT0FBTyxFQUFFLFdBQVc7Z0JBQ3BCLElBQUksRUFBRSxZQUFZO2dCQUNsQixNQUFNLEVBQUUsUUFBUSxDQUFDLFNBQVM7YUFDM0I7WUFDRCxRQUFRLEVBQUc7Z0JBQ1QsT0FBTyxFQUFFLGVBQWU7Z0JBQ3hCLElBQUksRUFBRSxnQkFBZ0I7Z0JBQ3RCLE1BQU0sRUFBRSxRQUFRLENBQUMsYUFBYTthQUMvQjtZQUNELFdBQVcsRUFBRztnQkFDWixPQUFPLEVBQUUsV0FBVztnQkFDcEIsSUFBSSxFQUFFLFdBQVc7Z0JBQ2pCLEtBQUssRUFBRSxLQUFLO2dCQUNaLE1BQU0sRUFBRSxRQUFRLENBQUMsU0FB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YmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgRmF0ZVR5cGUgfSBmcm9tICcuL2ZhdGUtdHlwZS5lbnVtJztcbmltcG9ydCB7IEZhdGVMaW5rRHJvcGRvd25Db21wb25lbnQgfSBmcm9tICcuL2ZhdGUtbGluay1kcm9wZG93bi9mYXRlLWxpbmstZHJvcGRvd24uY29tcG9uZW50JztcblxuZXhwb3J0IGludGVyZmFjZSBGYXRlQ29tbWFuZCB7XG4gIG5hbWU6IHN0cmluZztcbiAgdmFsdWU6IGFueTtcbn1cblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgRmF0ZUNvbnRyb2xsZXJTZXJ2aWNlIHtcblxuICAvLyBMaXN0IG9mIGF2YWlsYWJsZSBjb21tYW5kcywgYWxwaGFiZXRpY2FsbHlcbiAgLy8gc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9Eb2N1bWVudC9leGVjQ29tbWFuZFxuICBwcm90ZWN0ZWQgYWN0aW9uTWFwcGluZyA9IHtcbiAgICAnYm9sZCcgOiB7XG4gICAgICBjb21tYW5kOiAnYm9sZCcsXG4gICAgICBuYW1lOiAnQm9sZCcsXG4gICAgICBkZXRlY3Q6IEZhdGVUeXBlLkJPTERcbiAgICB9LFxuICAgICdpdGFsaWMnIDoge1xuICAgICAgY29tbWFuZDogJ2l0YWxpYycsXG4gICAgICBuYW1lOiAnSXRhbGljJyxcbiAgICAgIGRldGVjdDogRmF0ZVR5cGUuSVRBTElDXG4gICAgfSxcbiAgICAndW5kZXJsaW5lJyA6IHtcbiAgICAgIGNvbW1hbmQ6ICd1bmRlcmxpbmUnLFxuICAgICAgbmFtZTogJ1VuZGVybGluZWQnLFxuICAgICAgZGV0ZWN0OiBGYXRlVHlwZS5VTkRFUkxJTkVcbiAgICB9LFxuICAgICdzdHJpa2UnIDoge1xuICAgICAgY29tbWFuZDogJ3N0cmlrZVRocm91Z2gnLFxuICAgICAgbmFtZTogJ1N0cmlrZSBUaHJvdWdoJyxcbiAgICAgIGRldGVjdDogRmF0ZVR5cGUuU1RSSUtFVEhST1VHSFxuICAgIH0sXG4gICAgJ3N1YnNjcmlwdCcgOiB7XG4gICAgICBjb21tYW5kOiAnc3Vic2NyaXB0JyxcbiAgICAgIG5hbWU6ICdTdWJzY3JpcHQnLFxuICAgICAgbGFiZWw6ICdzdWInLFxuICAgICAgZGV0ZWN0OiBGYXRlVHlwZS5TVUJTQ1JJUFRcbiAgICB9LFxuICAgICdzdXBlcnNjcmlwdCcgOiB7XG4gICAgICBjb21tYW5kOiAnc3VwZXJzY3JpcHQnLFxuICAgICAgbmFtZTogJ1N1cGVyc2NyaXB0JyxcbiAgICAgIGxhYmVsOiAnc3VwJyxcbiAgICAgIGRldGVjdDogRmF0ZVR5cGUuU1VQRVJTQ1JJUFRcbiAgICB9LFxuICAgICdoZWFkaW5nMScgOiB7XG4gICAgICBjb21tYW5kOiAnZm9ybWF0QmxvY2snLFxuICAgICAgdmFsdWU6ICdIMScsXG4gICAgICBuYW1lOiAnMXN0IEhlYWRlcicsXG4gICAgICBsYWJlbDogJ2gxJyxcbiAgICAgIGRldGVjdDogRmF0ZVR5cGUuSEVBREVSMVxuICAgIH0sXG4gICAgJ2hlYWRpbmcyJyA6IHtcbiAgICAgIGNvbW1hbmQ6ICdmb3JtYXRCbG9jaycsXG4gICAgICB2YWx1ZTogJ0gyJyxcbiAgICAgIG5hbWU6ICcybmQgSGVhZGVyJyxcbiAgICAgIGxhYmVsOiAnaDInLFxuICAgICAgZGV0ZWN0OiBGYXRlVHlwZS5IRUFERVIyXG4gICAgfSxcbiAgICAnaGVhZGluZzMnIDoge1xuICAgICAgY29tbWFuZDogJ2Zvcm1hdEJsb2NrJyxcbiAgICAgIHZhbHVlOiAnSDMnLFxuICAgICAgbmFtZTogJzNyZCBIZWFkZXInLFxuICAgICAgbGFiZWw6ICdoMycsXG4gICAgICBkZXRlY3Q6IEZhdGVUeXBlLkhFQURFUjNcbiAgICB9LFxuICAgICdoZWFkaW5nNCcgOiB7XG4gICAgICBjb21tYW5kOiAnZm9ybWF0QmxvY2snLFxuICAgICAgdmFsdWU6ICdINCcsXG4gICAgICBuYW1lOiAnNHRoIEhlYWRlcicsXG4gICAgICBsYWJlbDogJ2g0JyxcbiAgICAgIGRldGVjdDogRmF0ZVR5cGUuSEVBREVSNFxuICAgIH0sXG4gICAgJ2hlYWRpbmc1JyA6IHtcbiAgICAgIGNvbW1hbmQ6ICdmb3JtYXRCbG9jaycsXG4gICAgICB2YWx1ZTogJ0g1JyxcbiAgICAgIG5hbWU6ICc1dGggSGVhZGVyJyxcbiAgICAgIGxhYmVsOiAnaDUnLFxuICAgICAgZGV0ZWN0OiBGYXRlVHlwZS5IRUFERVI1XG4gICAgfSxcbiAgICAnaGVhZGluZzYnIDoge1xuICAgICAgY29tbWFuZDogJ2Zvcm1hdEJsb2NrJyxcbiAgICAgIHZhbHVlOiAnSDYnLFxuICAgICAgbmFtZTogJzZ0aCBIZWFkZXInLFxuICAgICAgbGFiZWw6ICdoNicsXG4gICAgICBkZXRlY3Q6IEZhdGVUeXBlLkhFQURFUjZcbiAgICB9LFxuICAgICdub3JtYWwnIDoge1xuICAgICAgY29tbWFuZDogJ2Zvcm1hdEJsb2NrJyxcbiAgICAgIHZhbHVlOiAnRElWJyxcbiAgICAgIG5hbWU6ICdOb3JtYWwnLFxuICAgICAgbGFiZWw6ICdwJyxcbiAgICB9LFxuICAgICdpbmRlbnQnIDoge1xuICAgICAgY29tbWFuZDogJ2luZGVudCcsXG4gICAgICBuYW1lOiAnSW5kZW50JyxcbiAgICB9LFxuICAgICdvdXRkZW50JyA6IHtcbiAgICAgIGNvbW1hbmQ6ICdvdXRkZW50JyxcbiAgICAgIG5hbWU6ICdPdXRkZW50JyxcbiAgICB9LFxuICAgICdvcmRlcmVkJyA6IHtcbiAgICAgIGNvbW1hbmQ6ICdpbnNlcnRPcmRlcmVkTGlzdCcsXG4gICAgICBuYW1lOiAnT3JkZXJlZCBMaXN0JyxcbiAgICAgIGRldGVjdDogRmF0ZVR5cGUuT1JERVJFRF9MSVNUXG4gICAgfSxcbiAgICAndW5vcmRlcmVkJyA6IHtcbiAgICAgIGNvbW1hbmQ6ICdpbnNlcnRVbm9yZGVyZWRMaXN0JyxcbiAgICAgIG5hbWU6ICdVbm9yZGVyIExpc3QnLFxuICAgICAgZGV0ZWN0OiBGYXRlVHlwZS5VTk9SREVSRURfTElTVFxuICAgIH0sXG4gICAgJ2NlbnRlcicgOiB7XG4gICAgICBjb21tYW5kOiAnanVzdGlmeUNlbnRlcicsXG4gICAgICBuYW1lOiAnQ2VudGVyJyxcbiAgICAgIGRldGVjdDogRmF0ZVR5cGUuQUxJR05fQ0VOVEVSXG4gICAgfSxcbiAgICAnanVzdGlmeScgOiB7XG4gICAgICBjb21tYW5kOiAnanVzdGlmeUZ1bGwnLFxuICAgICAgbmFtZTogJ0p1c3RpZnknLFxuICAgICAgZGV0ZWN0OiBGYXRlVHlwZS5KVVNUSUZZXG4gICAgfSxcbiAgICAnbGVmdCcgOiB7XG4gICAgICBjb21tYW5kOiAnanVzdGlmeUxlZnQnLFxuICAgICAgbmFtZTogJ0xlZnQnLFxuICAgICAgZGV0ZWN0OiBGYXRlVHlwZS5BTElHTl9MRUZUXG4gICAgfSxcbiAgICAncmlnaHQnIDoge1xuICAgICAgY29tbWFuZDogJ2p1c3RpZnlSaWdodCcsXG4gICAgICBuYW1lOiAnUmlnaHQnLFxuICAgICAgZGV0ZWN0OiBGYXRlVHlwZS5BTElHTl9SSUdIVFxuICAgIH0sXG4gICAgJ3VuZG8nIDoge1xuICAgICAgY29tbWFuZDogJ3VuZG8nLFxuICAgICAgbmFtZTogJ1VuZG8nLFxuICAgIH0sXG4gICAgJ3JlZG8nIDoge1xuICAgICAgY29tbWFuZDogJ3JlZG8nLFxuICAgICAgbmFtZTogJ1JlZG8nLFxuICAgIH0sXG4gICAgJ2NsZWFuJyA6IHtcbiAgICAgIGNvbW1hbmQ6ICdyZW1vdmVGb3JtYXQnLFxuICAgICAgbmFtZTogJ1JlbW92ZSBGb3JtYXRpbmcnLFxuICAgIH0sXG4gICAgJ2xpbmsnIDoge1xuICAgICAgY29tbWFuZDogJ2NyZWF0ZUxpbmsnLFxuICAgICAgdW5kbzogJ3VubGluaycsXG4gICAgICBuYW1lOiAnTGluaycsXG4gICAgICBkZXRlY3Q6IEZhdGVUeXBlLkxJTkssXG4gICAgICBkcm9wZG93bjogRmF0ZUxpbmtEcm9wZG93bkNvbXBvbmVudFxuICAgIH1cbiAgfTtcbiAgcHVibGljIHJlZ2lzdGVyQWN0aW9uKG5hbWU6IHN0cmluZywgYWN0aW9uOiBhbnkpIHtcbiAgICBpZiAodGhpcy5hY3Rpb25NYXBwaW5nW25hbWVdKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FuIGFjdGlvbiB3aXRoIHRoZSBuYW1lIFwiJyArIG5hbWUgKyAnXCIgYWxyZWFkeSBleGlzdHMhJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYWN0aW9uTWFwcGluZ1tuYW1lXSA9IGFjdGlvbjtcbiAgICB9XG4gIH1cbiAgcHVibGljIGdldEFjdGlvbihhY3Rpb25OYW1lKTogYm9vbGVhbiB8IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuYWN0aW9uTWFwcGluZ1thY3Rpb25OYW1lXSB8fCBmYWxzZTtcbiAgfVxuXG4gIHByb3RlY3RlZCBpbmxpbmVBY3Rpb25NYXBwaW5nOiBhbnkgPSB7fTtcbiAgcHVibGljIHJlZ2lzdGVySW5saW5lQWN0aW9uKG5hbWU6IHN0cmluZywgYWN0aW9uOiBhbnkpIHtcbiAgICBpZiAodGhpcy5pbmxpbmVBY3Rpb25NYXBwaW5nW25hbWVdKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FuIGlubGluZSBhY3Rpb24gd2l0aCB0aGUgbmFtZSBcIicgKyBuYW1lICsgJ1wiIGFscmVhZHkgZXhpc3RzIScpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmlubGluZUFjdGlvbk1hcHBpbmdbbmFtZV0gPSBhY3Rpb247XG4gICAgfVxuICB9XG4gICBwdWJsaWMgZ2V0SW5saW5lQWN0aW9uKGNvbnRleHQ6IHN0cmluZyk6IGJvb2xlYW4gfCBhbnkge1xuICAgIGZvciAoY29uc3QgYWN0aW9uIG9mIE9iamVjdC5rZXlzKHRoaXMuaW5saW5lQWN0aW9uTWFwcGluZykpIHtcbiAgICAgIGNvbnN0IG1hdGNoID0gdGhpcy5pbmxpbmVBY3Rpb25NYXBwaW5nW2FjdGlvbl0ucmVnZXhwLmV4ZWMoY29udGV4dCk7XG4gICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgdGhpcy5pbmxpbmVBY3Rpb25NYXBwaW5nW2FjdGlvbl0ubWF0Y2hlZCA9IG1hdGNoWzFdO1xuICAgICAgICByZXR1cm4gdGhpcy5pbmxpbmVBY3Rpb25NYXBwaW5nW2FjdGlvbl07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByb3RlY3RlZCBjb21tYW5kc1BpcGUgPSB7XG4gICAgZGVmYXVsdDogbmV3IFN1YmplY3Q8RmF0ZUNvbW1hbmQ+KClcbiAgfTtcblxuICBwcm90ZWN0ZWQgZW5hYmxlZEFjdGlvbnMgPSB7XG4gICAgZGVmYXVsdDogbmV3IFN1YmplY3Q8YW55PigpXG4gIH07XG5cbiAgY29uc3RydWN0b3IoKSB7IH1cblxuICBwdWJsaWMgY2hhbm5lbChjaGFubmVsSWQpIHtcbiAgICBpZiAoIXRoaXMuY29tbWFuZHNQaXBlW2NoYW5uZWxJZF0pIHtcbiAgICAgIHRoaXMuY29tbWFuZHNQaXBlW2NoYW5uZWxJZF0gPSBuZXcgU3ViamVjdDxGYXRlQ29tbWFuZD4oKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY29tbWFuZHNQaXBlW2NoYW5uZWxJZF07XG4gIH1cblxuICBwdWJsaWMgZW5hYmxlZChjaGFubmVsSWQpIHtcbiAgICBpZiAoIXRoaXMuZW5hYmxlZEFjdGlvbnNbY2hhbm5lbElkXSkge1xuICAgICAgdGhpcy5lbmFibGVkQWN0aW9uc1tjaGFubmVsSWRdID0gbmV3IFN1YmplY3Q8YW55PigpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5lbmFibGVkQWN0aW9uc1tjaGFubmVsSWRdO1xuICB9XG5cbiAgcHVibGljIGVuYWJsZUFjdGlvbnMoY2hhbm5lbElkLCBub2Rlcykge1xuICAgIGNvbnN0IGFjdGlvbnM6IEFycmF5PGFueT4gPSBbXTtcbiAgICBmb3IgKGNvbnN0IG5vZGUgb2Ygbm9kZXMpIHtcbiAgICAgIGZvciAoY29uc3QgYWN0aW9uIGluIHRoaXMuYWN0aW9uTWFwcGluZykge1xuICAgICAgICBpZiAodGhpcy5hY3Rpb25NYXBwaW5nW2FjdGlvbl0uZGV0ZWN0ICYmIHRoaXMuYWN0aW9uTWFwcGluZ1thY3Rpb25dLmRldGVjdCA9PT0gbm9kZS50eXBlKSB7XG4gICAgICAgICAgYWN0aW9ucy5wdXNoKHthY3Rpb246IGFjdGlvbiwgdmFsdWU6IG5vZGUudmFsdWV9KTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmFjdGlvbk1hcHBpbmdbYWN0aW9uXS5kZXRlY3QgJiYgdHlwZW9mIHRoaXMuYWN0aW9uTWFwcGluZ1thY3Rpb25dLmRldGVjdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGNvbnN0IGRldGVjdGVkID0gdGhpcy5hY3Rpb25NYXBwaW5nW2FjdGlvbl0uZGV0ZWN0KG5vZGUpO1xuICAgICAgICAgIGlmIChkZXRlY3RlZCkge1xuICAgICAgICAgICAgYWN0aW9ucy5wdXNoKHthY3Rpb246IGFjdGlvbiwgdmFsdWU6IGRldGVjdGVkLnZhbHVlfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuZW5hYmxlZEFjdGlvbnNbY2hhbm5lbElkXS5uZXh0KGFjdGlvbnMpO1xuICB9XG5cblxuICBwdWJsaWMgZG8oY2hhbm5lbCwgYWN0aW9uLCB2YWx1ZT8pIHtcbiAgICBpZiAodGhpcy5hY3Rpb25NYXBwaW5nW2FjdGlvbl0uZHJvcGRvd24gJiYgIXZhbHVlKSB7XG4gICAgICBpZiAodGhpcy5hY3Rpb25NYXBwaW5nW2FjdGlvbl0udW5kbykge1xuICAgICAgICB0aGlzLmNvbW1hbmRzUGlwZVtjaGFubmVsXS5uZXh0KHtuYW1lOiB0aGlzLmFjdGlvbk1hcHBpbmdbYWN0aW9uXS51bmRvLCB2YWx1ZTogdGhpcy5hY3Rpb25NYXBwaW5nW2FjdGlvbl0udmFsdWUgfHwgdmFsdWV9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQWN0aW9uIFwiJyArIGFjdGlvbiArICdcImRvZXNuXFwndCBoYXZlIGEgdW5kbyBjb21tYW5kJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLmFjdGlvbk1hcHBpbmdbYWN0aW9uXS52YWx1ZSAmJiAodHlwZW9mIHRoaXMuYWN0aW9uTWFwcGluZ1thY3Rpb25dLnZhbHVlID09PSAnZnVuY3Rpb24nKSkge1xuICAgICAgICB0aGlzLmNvbW1hbmRzUGlwZVtjaGFubmVsXS5uZXh0KHtuYW1lOiB0aGlzLmFjdGlvbk1hcHBpbmdbYWN0aW9uXS5jb21tYW5kLCB2YWx1ZTogdGhpcy5hY3Rpb25NYXBwaW5nW2FjdGlvbl0udmFsdWUodmFsdWUpfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNvbW1hbmRzUGlwZVtjaGFubmVsXS5uZXh0KHtuYW1lOiB0aGlzLmFjdGlvbk1hcHBpbmdbYWN0aW9uXS5jb21tYW5kLCB2YWx1ZTogdGhpcy5hY3Rpb25NYXBwaW5nW2FjdGlvbl0udmFsdWUgfHwgdmFsdWV9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZG9JbmxpbmUoY2hhbm5lbCwgYWN0aW9uLCB2YWx1ZT8pIHtcbiAgICBpZiAoYWN0aW9uLmRyb3Bkb3duICYmICF2YWx1ZSkge1xuICAgICAgaWYgKGFjdGlvbi51bmRvKSB7XG4gICAgICAgIHRoaXMuY29tbWFuZHNQaXBlW2NoYW5uZWxdLm5leHQoe25hbWU6IGFjdGlvbi51bmRvLCB2YWx1ZTogYWN0aW9uLnZhbHVlIHx8IHZhbHVlfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FjdGlvbiBcIicgKyBhY3Rpb24gKyAnXCJkb2VzblxcJ3QgaGF2ZSBhIHVuZG8gY29tbWFuZCcpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoYWN0aW9uLnZhbHVlICYmICh0eXBlb2YgYWN0aW9uLnZhbHVlID09PSAnZnVuY3Rpb24nKSkge1xuICAgICAgICB0aGlzLmNvbW1hbmRzUGlwZVtjaGFubmVsXS5uZXh0KHtuYW1lOiBhY3Rpb24uY29tbWFuZCwgdmFsdWU6IGFjdGlvbi52YWx1ZSh2YWx1ZSl9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY29tbWFuZHNQaXBlW2NoYW5uZWxdLm5leHQoe25hbWU6IGFjdGlvbi5jb21tYW5kLCB2YWx1ZTogYWN0aW9uLnZhbHVlIHx8IHZhbHVlfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHVuZG8oY2hhbm5lbCwgYWN0aW9uLCB2YWx1ZT8pIHtcbiAgICBjb25zdCBtYXBwaW5nID0gdGhpcy5hY3Rpb25NYXBwaW5nW2FjdGlvbl0udW5kbztcbiAgICAvLyBUT0RPXG4gIH1cbn1cbiJdfQ==