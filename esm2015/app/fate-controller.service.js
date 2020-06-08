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
                if (this.actionMapping[action].detect &&
                    this.actionMapping[action].detect === node.type) {
                    actions.push({ action: action, value: node.value });
                }
                else if (this.actionMapping[action].detect &&
                    typeof this.actionMapping[action].detect === 'function') {
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
    }
    doInline(channel, action, value) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmF0ZS1jb250cm9sbGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9mYXRlLWVkaXRvci8iLCJzb3VyY2VzIjpbImFwcC9mYXRlLWNvbnRyb2xsZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRS9CLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUM1QyxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxtREFBbUQsQ0FBQzs7QUFVOUYsSUFBYSxxQkFBcUIsR0FBbEMsTUFBYSxxQkFBcUI7SUFzTGhDO1FBckxBLDZDQUE2QztRQUM3Qyw0RUFBNEU7UUFDbEUsa0JBQWEsR0FBRztZQUN4QixJQUFJLEVBQUU7Z0JBQ0osT0FBTyxFQUFFLE1BQU07Z0JBQ2YsSUFBSSxFQUFFLE1BQU07Z0JBQ1osTUFBTSxFQUFFLFFBQVEsQ0FBQyxJQUFJO2FBQ3RCO1lBQ0QsTUFBTSxFQUFFO2dCQUNOLE9BQU8sRUFBRSxRQUFRO2dCQUNqQixJQUFJLEVBQUUsUUFBUTtnQkFDZCxNQUFNLEVBQUUsUUFBUSxDQUFDLE1BQU07YUFDeEI7WUFDRCxTQUFTLEVBQUU7Z0JBQ1QsT0FBTyxFQUFFLFdBQVc7Z0JBQ3BCLElBQUksRUFBRSxZQUFZO2dCQUNsQixNQUFNLEVBQUUsUUFBUSxDQUFDLFNBQVM7YUFDM0I7WUFDRCxNQUFNLEVBQUU7Z0JBQ04sT0FBTyxFQUFFLGVBQWU7Z0JBQ3hCLElBQUksRUFBRSxnQkFBZ0I7Z0JBQ3RCLE1BQU0sRUFBRSxRQUFRLENBQUMsYUFBYTthQUMvQjtZQUNELFNBQVMsRUFBRTtnQkFDVCxPQUFPLEVBQUUsV0FBVztnQkFDcEIsSUFBSSxFQUFFLFdBQVc7Z0JBQ2pCLEtBQUssRUFBRSxLQUFLO2dCQUNaLE1BQU0sRUFBRSxRQUFRLENBQUMsU0FBUzthQUMzQjtZQUNELFdBQVcsRUFBRTtnQkFDWCxPQUFPLEVBQUUsYUFBYTtnQkFDdEIsSUFBSSxFQUFFLGFBQWE7Z0JBQ25CLEtBQUssRUFBRSxLQUFLO2dCQUNaLE1BQU0sRUFBRSxRQUFRLENBQUMsV0FBVzthQUM3QjtZQUNELFFBQVEsRUFBRTtnQkFDUixPQUFPLEVBQUUsYUFBYTtnQkFDdEIsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsSUFBSSxFQUFFLFlBQVk7Z0JBQ2xCLEtBQUssRUFBRSxJQUFJO2dCQUNYLE1BQU0sRUFBRSxRQUFRLENBQUMsT0FBTzthQUN6QjtZQUNELFFBQVEsRUFBRTtnQkFDUixPQUFPLEVBQUUsYUFBYTtnQkFDdEIsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsSUFBSSxFQUFFLFlBQVk7Z0JBQ2xCLEtBQUssRUFBRSxJQUFJO2dCQUNYLE1BQU0sRUFBRSxRQUFRLENBQUMsT0FBTzthQUN6QjtZQUNELFFBQVEsRUFBRTtnQkFDUixPQUFPLEVBQUUsYUFBYTtnQkFDdEIsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsSUFBSSxFQUFFLFlBQVk7Z0JBQ2xCLEtBQUssRUFBRSxJQUFJO2dCQUNYLE1BQU0sRUFBRSxRQUFRLENBQUMsT0FBTzthQUN6QjtZQUNELFFBQVEsRUFBRTtnQkFDUixPQUFPLEVBQUUsYUFBYTtnQkFDdEIsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsSUFBSSxFQUFFLFlBQVk7Z0JBQ2xCLEtBQUssRUFBRSxJQUFJO2dCQUNYLE1BQU0sRUFBRSxRQUFRLENBQUMsT0FBTzthQUN6QjtZQUNELFFBQVEsRUFBRTtnQkFDUixPQUFPLEVBQUUsYUFBYTtnQkFDdEIsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsSUFBSSxFQUFFLFlBQVk7Z0JBQ2xCLEtBQUssRUFBRSxJQUFJO2dCQUNYLE1BQU0sRUFBRSxRQUFRLENBQUMsT0FBTzthQUN6QjtZQUNELFFBQVEsRUFBRTtnQkFDUixPQUFPLEVBQUUsYUFBYTtnQkFDdEIsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsSUFBSSxFQUFFLFlBQVk7Z0JBQ2xCLEtBQUssRUFBRSxJQUFJO2dCQUNYLE1BQU0sRUFBRSxRQUFRLENBQUMsT0FBTzthQUN6QjtZQUNELE1BQU0sRUFBRTtnQkFDTixPQUFPLEVBQUUsYUFBYTtnQkFDdEIsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsS0FBSyxFQUFFLEdBQUc7YUFDWDtZQUNELE1BQU0sRUFBRTtnQkFDTixPQUFPLEVBQUUsUUFBUTtnQkFDakIsSUFBSSxFQUFFLFFBQVE7YUFDZjtZQUNELE9BQU8sRUFBRTtnQkFDUCxPQUFPLEVBQUUsU0FBUztnQkFDbEIsSUFBSSxFQUFFLFNBQVM7YUFDaEI7WUFDRCxPQUFPLEVBQUU7Z0JBQ1AsT0FBTyxFQUFFLG1CQUFtQjtnQkFDNUIsSUFBSSxFQUFFLGNBQWM7Z0JBQ3BCLE1BQU0sRUFBRSxRQUFRLENBQUMsWUFBWTthQUM5QjtZQUNELFNBQVMsRUFBRTtnQkFDVCxPQUFPLEVBQUUscUJBQXFCO2dCQUM5QixJQUFJLEVBQUUsY0FBYztnQkFDcEIsTUFBTSxFQUFFLFFBQVEsQ0FBQyxjQUFjO2FBQ2hDO1lBQ0QsTUFBTSxFQUFFO2dCQUNOLE9BQU8sRUFBRSxlQUFlO2dCQUN4QixJQUFJLEVBQUUsUUFBUTtnQkFDZCxNQUFNLEVBQUUsUUFBUSxDQUFDLFlBQVk7YUFDOUI7WUFDRCxPQUFPLEVBQUU7Z0JBQ1AsT0FBTyxFQUFFLGFBQWE7Z0JBQ3RCLElBQUksRUFBRSxTQUFTO2dCQUNmLE1BQU0sRUFBRSxRQUFRLENBQUMsT0FBTzthQUN6QjtZQUNELElBQUksRUFBRTtnQkFDSixPQUFPLEVBQUUsYUFBYTtnQkFDdEIsSUFBSSxFQUFFLE1BQU07Z0JBQ1osTUFBTSxFQUFFLFFBQVEsQ0FBQyxVQUFVO2FBQzVCO1lBQ0QsS0FBSyxFQUFFO2dCQUNMLE9BQU8sRUFBRSxjQUFjO2dCQUN2QixJQUFJLEVBQUUsT0FBTztnQkFDYixNQUFNLEVBQUUsUUFBUSxDQUFDLFdBQVc7YUFDN0I7WUFDRCxJQUFJLEVBQUU7Z0JBQ0osT0FBTyxFQUFFLE1BQU07Z0JBQ2YsSUFBSSxFQUFFLE1BQU07YUFDYjtZQUNELElBQUksRUFBRTtnQkFDSixPQUFPLEVBQUUsTUFBTTtnQkFDZixJQUFJLEVBQUUsTUFBTTthQUNiO1lBQ0QsS0FBSyxFQUFFO2dCQUNMLE9BQU8sRUFBRSxjQUFjO2dCQUN2QixJQUFJLEVBQUUsa0JBQWtCO2FBQ3pCO1lBQ0QsSUFBSSxFQUFFO2dCQUNKLE9BQU8sRUFBRSxZQUFZO2dCQUNyQixJQUFJLEVBQUUsUUFBUTtnQkFDZCxJQUFJLEVBQUUsTUFBTTtnQkFDWixNQUFNLEVBQUUsUUFBUSxDQUFDLElBQUk7Z0JBQ3JCLFFBQVEsRUFBRSx5QkFBeUI7YUFDcEM7U0FDRixDQUFDO1FBWVEsd0JBQW1CLEdBQVEsRUFBRSxDQUFDO1FBcUI5QixpQkFBWSxHQUFHO1lBQ3ZCLE9BQU8sRUFBRSxJQUFJLE9BQU8sRUFBZTtTQUNwQyxDQUFDO1FBRVEsbUJBQWMsR0FBRztZQUN6QixPQUFPLEVBQUUsSUFBSSxPQUFPLEVBQU87U0FDNUIsQ0FBQztJQUVhLENBQUM7SUF4Q1QsY0FBYyxDQUFDLElBQVksRUFBRSxNQUFXO1FBQzdDLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUM1QixNQUFNLElBQUksS0FBSyxDQUFDLDJCQUEyQixHQUFHLElBQUksR0FBRyxtQkFBbUIsQ0FBQyxDQUFDO1NBQzNFO2FBQU07WUFDTCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQztTQUNuQztJQUNILENBQUM7SUFDTSxTQUFTLENBQUMsVUFBVTtRQUN6QixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLElBQUksS0FBSyxDQUFDO0lBQ2pELENBQUM7SUFHTSxvQkFBb0IsQ0FBQyxJQUFZLEVBQUUsTUFBVztRQUNuRCxJQUFJLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNsQyxNQUFNLElBQUksS0FBSyxDQUNiLGtDQUFrQyxHQUFHLElBQUksR0FBRyxtQkFBbUIsQ0FDaEUsQ0FBQztTQUNIO2FBQU07WUFDTCxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDO1NBQ3pDO0lBQ0gsQ0FBQztJQUNNLGVBQWUsQ0FBQyxPQUFlO1FBQ3BDLEtBQUssTUFBTSxNQUFNLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsRUFBRTtZQUMxRCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNwRSxJQUFJLEtBQUssRUFBRTtnQkFDVCxJQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEQsT0FBTyxJQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDekM7U0FDRjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQVlNLE9BQU8sQ0FBQyxTQUFTO1FBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ2pDLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBSSxPQUFPLEVBQWUsQ0FBQztTQUMzRDtRQUNELE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRU0sT0FBTyxDQUFDLFNBQVM7UUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDbkMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLE9BQU8sRUFBTyxDQUFDO1NBQ3JEO1FBQ0QsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFTSxhQUFhLENBQUMsU0FBUyxFQUFFLEtBQUs7UUFDbkMsTUFBTSxPQUFPLEdBQWUsRUFBRSxDQUFDO1FBQy9CLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxFQUFFO1lBQ3hCLEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtnQkFDdkMsSUFDRSxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU07b0JBQ2pDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxJQUFJLEVBQy9DO29CQUNBLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztpQkFDckQ7cUJBQU0sSUFDTCxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU07b0JBQ2pDLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEtBQUssVUFBVSxFQUN2RDtvQkFDQSxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDekQsSUFBSSxRQUFRLEVBQUU7d0JBQ1osT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO3FCQUN6RDtpQkFDRjthQUNGO1NBQ0Y7UUFDRCxJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRU0sRUFBRSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsS0FBTTtRQUMvQixJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2pELElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUU7Z0JBQ25DLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDO29CQUM5QixJQUFJLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJO29CQUNyQyxLQUFLLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLElBQUksS0FBSztpQkFDakQsQ0FBQyxDQUFDO2FBQ0o7aUJBQU07Z0JBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyxVQUFVLEdBQUcsTUFBTSxHQUFHLCtCQUErQixDQUFDLENBQUM7YUFDeEU7U0FDRjthQUFNO1lBQ0wsSUFDRSxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUs7Z0JBQ2hDLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEtBQUssVUFBVSxFQUN0RDtnQkFDQSxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQztvQkFDOUIsSUFBSSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTztvQkFDeEMsS0FBSyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztpQkFDL0MsQ0FBQyxDQUFDO2FBQ0o7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUM7b0JBQzlCLElBQUksRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU87b0JBQ3hDLEtBQUssRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssSUFBSSxLQUFLO2lCQUNqRCxDQUFDLENBQUM7YUFDSjtTQUNGO0lBQ0gsQ0FBQztJQUVNLFFBQVEsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEtBQU07UUFDckMsSUFBSSxNQUFNLENBQUMsUUFBUSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQzdCLElBQUksTUFBTSxDQUFDLElBQUksRUFBRTtnQkFDZixJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQztvQkFDOUIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO29CQUNqQixLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUssSUFBSSxLQUFLO2lCQUM3QixDQUFDLENBQUM7YUFDSjtpQkFBTTtnQkFDTCxNQUFNLElBQUksS0FBSyxDQUFDLFVBQVUsR0FBRyxNQUFNLEdBQUcsK0JBQStCLENBQUMsQ0FBQzthQUN4RTtTQUNGO2FBQU07WUFDTCxJQUFJLE1BQU0sQ0FBQyxLQUFLLElBQUksT0FBTyxNQUFNLENBQUMsS0FBSyxLQUFLLFVBQVUsRUFBRTtnQkFDdEQsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUM7b0JBQzlCLElBQUksRUFBRSxNQUFNLENBQUMsT0FBTztvQkFDcEIsS0FBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO2lCQUMzQixDQUFDLENBQUM7YUFDSjtpQkFBTTtnQkFDTCxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQztvQkFDOUIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxPQUFPO29CQUNwQixLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUssSUFBSSxLQUFLO2lCQUM3QixDQUFDLENBQUM7YUFDSjtTQUNGO0lBQ0gsQ0FBQztJQUVNLElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEtBQU07UUFDakMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDaEQsT0FBTztJQUNULENBQUM7Q0FDRixDQUFBOztBQXRSWSxxQkFBcUI7SUFIakMsVUFBVSxDQUFDO1FBQ1YsVUFBVSxFQUFFLE1BQU07S0FDbkIsQ0FBQztHQUNXLHFCQUFxQixDQXNSakM7U0F0UlkscUJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IEZhdGVUeXBlIH0gZnJvbSAnLi9mYXRlLXR5cGUuZW51bSc7XG5pbXBvcnQgeyBGYXRlTGlua0Ryb3Bkb3duQ29tcG9uZW50IH0gZnJvbSAnLi9mYXRlLWxpbmstZHJvcGRvd24vZmF0ZS1saW5rLWRyb3Bkb3duLmNvbXBvbmVudCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRmF0ZUNvbW1hbmQge1xuICBuYW1lOiBzdHJpbmc7XG4gIHZhbHVlOiBhbnk7XG59XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIEZhdGVDb250cm9sbGVyU2VydmljZSB7XG4gIC8vIExpc3Qgb2YgYXZhaWxhYmxlIGNvbW1hbmRzLCBhbHBoYWJldGljYWxseVxuICAvLyBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0RvY3VtZW50L2V4ZWNDb21tYW5kXG4gIHByb3RlY3RlZCBhY3Rpb25NYXBwaW5nID0ge1xuICAgIGJvbGQ6IHtcbiAgICAgIGNvbW1hbmQ6ICdib2xkJyxcbiAgICAgIG5hbWU6ICdCb2xkJyxcbiAgICAgIGRldGVjdDogRmF0ZVR5cGUuQk9MRFxuICAgIH0sXG4gICAgaXRhbGljOiB7XG4gICAgICBjb21tYW5kOiAnaXRhbGljJyxcbiAgICAgIG5hbWU6ICdJdGFsaWMnLFxuICAgICAgZGV0ZWN0OiBGYXRlVHlwZS5JVEFMSUNcbiAgICB9LFxuICAgIHVuZGVybGluZToge1xuICAgICAgY29tbWFuZDogJ3VuZGVybGluZScsXG4gICAgICBuYW1lOiAnVW5kZXJsaW5lZCcsXG4gICAgICBkZXRlY3Q6IEZhdGVUeXBlLlVOREVSTElORVxuICAgIH0sXG4gICAgc3RyaWtlOiB7XG4gICAgICBjb21tYW5kOiAnc3RyaWtlVGhyb3VnaCcsXG4gICAgICBuYW1lOiAnU3RyaWtlIFRocm91Z2gnLFxuICAgICAgZGV0ZWN0OiBGYXRlVHlwZS5TVFJJS0VUSFJPVUdIXG4gICAgfSxcbiAgICBzdWJzY3JpcHQ6IHtcbiAgICAgIGNvbW1hbmQ6ICdzdWJzY3JpcHQnLFxuICAgICAgbmFtZTogJ1N1YnNjcmlwdCcsXG4gICAgICBsYWJlbDogJ3N1YicsXG4gICAgICBkZXRlY3Q6IEZhdGVUeXBlLlNVQlNDUklQVFxuICAgIH0sXG4gICAgc3VwZXJzY3JpcHQ6IHtcbiAgICAgIGNvbW1hbmQ6ICdzdXBlcnNjcmlwdCcsXG4gICAgICBuYW1lOiAnU3VwZXJzY3JpcHQnLFxuICAgICAgbGFiZWw6ICdzdXAnLFxuICAgICAgZGV0ZWN0OiBGYXRlVHlwZS5TVVBFUlNDUklQVFxuICAgIH0sXG4gICAgaGVhZGluZzE6IHtcbiAgICAgIGNvbW1hbmQ6ICdmb3JtYXRCbG9jaycsXG4gICAgICB2YWx1ZTogJ0gxJyxcbiAgICAgIG5hbWU6ICcxc3QgSGVhZGVyJyxcbiAgICAgIGxhYmVsOiAnaDEnLFxuICAgICAgZGV0ZWN0OiBGYXRlVHlwZS5IRUFERVIxXG4gICAgfSxcbiAgICBoZWFkaW5nMjoge1xuICAgICAgY29tbWFuZDogJ2Zvcm1hdEJsb2NrJyxcbiAgICAgIHZhbHVlOiAnSDInLFxuICAgICAgbmFtZTogJzJuZCBIZWFkZXInLFxuICAgICAgbGFiZWw6ICdoMicsXG4gICAgICBkZXRlY3Q6IEZhdGVUeXBlLkhFQURFUjJcbiAgICB9LFxuICAgIGhlYWRpbmczOiB7XG4gICAgICBjb21tYW5kOiAnZm9ybWF0QmxvY2snLFxuICAgICAgdmFsdWU6ICdIMycsXG4gICAgICBuYW1lOiAnM3JkIEhlYWRlcicsXG4gICAgICBsYWJlbDogJ2gzJyxcbiAgICAgIGRldGVjdDogRmF0ZVR5cGUuSEVBREVSM1xuICAgIH0sXG4gICAgaGVhZGluZzQ6IHtcbiAgICAgIGNvbW1hbmQ6ICdmb3JtYXRCbG9jaycsXG4gICAgICB2YWx1ZTogJ0g0JyxcbiAgICAgIG5hbWU6ICc0dGggSGVhZGVyJyxcbiAgICAgIGxhYmVsOiAnaDQnLFxuICAgICAgZGV0ZWN0OiBGYXRlVHlwZS5IRUFERVI0XG4gICAgfSxcbiAgICBoZWFkaW5nNToge1xuICAgICAgY29tbWFuZDogJ2Zvcm1hdEJsb2NrJyxcbiAgICAgIHZhbHVlOiAnSDUnLFxuICAgICAgbmFtZTogJzV0aCBIZWFkZXInLFxuICAgICAgbGFiZWw6ICdoNScsXG4gICAgICBkZXRlY3Q6IEZhdGVUeXBlLkhFQURFUjVcbiAgICB9LFxuICAgIGhlYWRpbmc2OiB7XG4gICAgICBjb21tYW5kOiAnZm9ybWF0QmxvY2snLFxuICAgICAgdmFsdWU6ICdINicsXG4gICAgICBuYW1lOiAnNnRoIEhlYWRlcicsXG4gICAgICBsYWJlbDogJ2g2JyxcbiAgICAgIGRldGVjdDogRmF0ZVR5cGUuSEVBREVSNlxuICAgIH0sXG4gICAgbm9ybWFsOiB7XG4gICAgICBjb21tYW5kOiAnZm9ybWF0QmxvY2snLFxuICAgICAgdmFsdWU6ICdESVYnLFxuICAgICAgbmFtZTogJ05vcm1hbCcsXG4gICAgICBsYWJlbDogJ3AnXG4gICAgfSxcbiAgICBpbmRlbnQ6IHtcbiAgICAgIGNvbW1hbmQ6ICdpbmRlbnQnLFxuICAgICAgbmFtZTogJ0luZGVudCdcbiAgICB9LFxuICAgIG91dGRlbnQ6IHtcbiAgICAgIGNvbW1hbmQ6ICdvdXRkZW50JyxcbiAgICAgIG5hbWU6ICdPdXRkZW50J1xuICAgIH0sXG4gICAgb3JkZXJlZDoge1xuICAgICAgY29tbWFuZDogJ2luc2VydE9yZGVyZWRMaXN0JyxcbiAgICAgIG5hbWU6ICdPcmRlcmVkIExpc3QnLFxuICAgICAgZGV0ZWN0OiBGYXRlVHlwZS5PUkRFUkVEX0xJU1RcbiAgICB9LFxuICAgIHVub3JkZXJlZDoge1xuICAgICAgY29tbWFuZDogJ2luc2VydFVub3JkZXJlZExpc3QnLFxuICAgICAgbmFtZTogJ1Vub3JkZXIgTGlzdCcsXG4gICAgICBkZXRlY3Q6IEZhdGVUeXBlLlVOT1JERVJFRF9MSVNUXG4gICAgfSxcbiAgICBjZW50ZXI6IHtcbiAgICAgIGNvbW1hbmQ6ICdqdXN0aWZ5Q2VudGVyJyxcbiAgICAgIG5hbWU6ICdDZW50ZXInLFxuICAgICAgZGV0ZWN0OiBGYXRlVHlwZS5BTElHTl9DRU5URVJcbiAgICB9LFxuICAgIGp1c3RpZnk6IHtcbiAgICAgIGNvbW1hbmQ6ICdqdXN0aWZ5RnVsbCcsXG4gICAgICBuYW1lOiAnSnVzdGlmeScsXG4gICAgICBkZXRlY3Q6IEZhdGVUeXBlLkpVU1RJRllcbiAgICB9LFxuICAgIGxlZnQ6IHtcbiAgICAgIGNvbW1hbmQ6ICdqdXN0aWZ5TGVmdCcsXG4gICAgICBuYW1lOiAnTGVmdCcsXG4gICAgICBkZXRlY3Q6IEZhdGVUeXBlLkFMSUdOX0xFRlRcbiAgICB9LFxuICAgIHJpZ2h0OiB7XG4gICAgICBjb21tYW5kOiAnanVzdGlmeVJpZ2h0JyxcbiAgICAgIG5hbWU6ICdSaWdodCcsXG4gICAgICBkZXRlY3Q6IEZhdGVUeXBlLkFMSUdOX1JJR0hUXG4gICAgfSxcbiAgICB1bmRvOiB7XG4gICAgICBjb21tYW5kOiAndW5kbycsXG4gICAgICBuYW1lOiAnVW5kbydcbiAgICB9LFxuICAgIHJlZG86IHtcbiAgICAgIGNvbW1hbmQ6ICdyZWRvJyxcbiAgICAgIG5hbWU6ICdSZWRvJ1xuICAgIH0sXG4gICAgY2xlYW46IHtcbiAgICAgIGNvbW1hbmQ6ICdyZW1vdmVGb3JtYXQnLFxuICAgICAgbmFtZTogJ1JlbW92ZSBGb3JtYXRpbmcnXG4gICAgfSxcbiAgICBsaW5rOiB7XG4gICAgICBjb21tYW5kOiAnY3JlYXRlTGluaycsXG4gICAgICB1bmRvOiAndW5saW5rJyxcbiAgICAgIG5hbWU6ICdMaW5rJyxcbiAgICAgIGRldGVjdDogRmF0ZVR5cGUuTElOSyxcbiAgICAgIGRyb3Bkb3duOiBGYXRlTGlua0Ryb3Bkb3duQ29tcG9uZW50XG4gICAgfVxuICB9O1xuICBwdWJsaWMgcmVnaXN0ZXJBY3Rpb24obmFtZTogc3RyaW5nLCBhY3Rpb246IGFueSkge1xuICAgIGlmICh0aGlzLmFjdGlvbk1hcHBpbmdbbmFtZV0pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQW4gYWN0aW9uIHdpdGggdGhlIG5hbWUgXCInICsgbmFtZSArICdcIiBhbHJlYWR5IGV4aXN0cyEnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hY3Rpb25NYXBwaW5nW25hbWVdID0gYWN0aW9uO1xuICAgIH1cbiAgfVxuICBwdWJsaWMgZ2V0QWN0aW9uKGFjdGlvbk5hbWUpOiBib29sZWFuIHwgYW55IHtcbiAgICByZXR1cm4gdGhpcy5hY3Rpb25NYXBwaW5nW2FjdGlvbk5hbWVdIHx8IGZhbHNlO1xuICB9XG5cbiAgcHJvdGVjdGVkIGlubGluZUFjdGlvbk1hcHBpbmc6IGFueSA9IHt9O1xuICBwdWJsaWMgcmVnaXN0ZXJJbmxpbmVBY3Rpb24obmFtZTogc3RyaW5nLCBhY3Rpb246IGFueSkge1xuICAgIGlmICh0aGlzLmlubGluZUFjdGlvbk1hcHBpbmdbbmFtZV0pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ0FuIGlubGluZSBhY3Rpb24gd2l0aCB0aGUgbmFtZSBcIicgKyBuYW1lICsgJ1wiIGFscmVhZHkgZXhpc3RzISdcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaW5saW5lQWN0aW9uTWFwcGluZ1tuYW1lXSA9IGFjdGlvbjtcbiAgICB9XG4gIH1cbiAgcHVibGljIGdldElubGluZUFjdGlvbihjb250ZXh0OiBzdHJpbmcpOiBib29sZWFuIHwgYW55IHtcbiAgICBmb3IgKGNvbnN0IGFjdGlvbiBvZiBPYmplY3Qua2V5cyh0aGlzLmlubGluZUFjdGlvbk1hcHBpbmcpKSB7XG4gICAgICBjb25zdCBtYXRjaCA9IHRoaXMuaW5saW5lQWN0aW9uTWFwcGluZ1thY3Rpb25dLnJlZ2V4cC5leGVjKGNvbnRleHQpO1xuICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgIHRoaXMuaW5saW5lQWN0aW9uTWFwcGluZ1thY3Rpb25dLm1hdGNoZWQgPSBtYXRjaFsxXTtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5saW5lQWN0aW9uTWFwcGluZ1thY3Rpb25dO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwcm90ZWN0ZWQgY29tbWFuZHNQaXBlID0ge1xuICAgIGRlZmF1bHQ6IG5ldyBTdWJqZWN0PEZhdGVDb21tYW5kPigpXG4gIH07XG5cbiAgcHJvdGVjdGVkIGVuYWJsZWRBY3Rpb25zID0ge1xuICAgIGRlZmF1bHQ6IG5ldyBTdWJqZWN0PGFueT4oKVxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKCkge31cblxuICBwdWJsaWMgY2hhbm5lbChjaGFubmVsSWQpIHtcbiAgICBpZiAoIXRoaXMuY29tbWFuZHNQaXBlW2NoYW5uZWxJZF0pIHtcbiAgICAgIHRoaXMuY29tbWFuZHNQaXBlW2NoYW5uZWxJZF0gPSBuZXcgU3ViamVjdDxGYXRlQ29tbWFuZD4oKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY29tbWFuZHNQaXBlW2NoYW5uZWxJZF07XG4gIH1cblxuICBwdWJsaWMgZW5hYmxlZChjaGFubmVsSWQpIHtcbiAgICBpZiAoIXRoaXMuZW5hYmxlZEFjdGlvbnNbY2hhbm5lbElkXSkge1xuICAgICAgdGhpcy5lbmFibGVkQWN0aW9uc1tjaGFubmVsSWRdID0gbmV3IFN1YmplY3Q8YW55PigpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5lbmFibGVkQWN0aW9uc1tjaGFubmVsSWRdO1xuICB9XG5cbiAgcHVibGljIGVuYWJsZUFjdGlvbnMoY2hhbm5lbElkLCBub2Rlcykge1xuICAgIGNvbnN0IGFjdGlvbnM6IEFycmF5PGFueT4gPSBbXTtcbiAgICBmb3IgKGNvbnN0IG5vZGUgb2Ygbm9kZXMpIHtcbiAgICAgIGZvciAoY29uc3QgYWN0aW9uIGluIHRoaXMuYWN0aW9uTWFwcGluZykge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgdGhpcy5hY3Rpb25NYXBwaW5nW2FjdGlvbl0uZGV0ZWN0ICYmXG4gICAgICAgICAgdGhpcy5hY3Rpb25NYXBwaW5nW2FjdGlvbl0uZGV0ZWN0ID09PSBub2RlLnR5cGVcbiAgICAgICAgKSB7XG4gICAgICAgICAgYWN0aW9ucy5wdXNoKHsgYWN0aW9uOiBhY3Rpb24sIHZhbHVlOiBub2RlLnZhbHVlIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgIHRoaXMuYWN0aW9uTWFwcGluZ1thY3Rpb25dLmRldGVjdCAmJlxuICAgICAgICAgIHR5cGVvZiB0aGlzLmFjdGlvbk1hcHBpbmdbYWN0aW9uXS5kZXRlY3QgPT09ICdmdW5jdGlvbidcbiAgICAgICAgKSB7XG4gICAgICAgICAgY29uc3QgZGV0ZWN0ZWQgPSB0aGlzLmFjdGlvbk1hcHBpbmdbYWN0aW9uXS5kZXRlY3Qobm9kZSk7XG4gICAgICAgICAgaWYgKGRldGVjdGVkKSB7XG4gICAgICAgICAgICBhY3Rpb25zLnB1c2goeyBhY3Rpb246IGFjdGlvbiwgdmFsdWU6IGRldGVjdGVkLnZhbHVlIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmVuYWJsZWRBY3Rpb25zW2NoYW5uZWxJZF0ubmV4dChhY3Rpb25zKTtcbiAgfVxuXG4gIHB1YmxpYyBkbyhjaGFubmVsLCBhY3Rpb24sIHZhbHVlPykge1xuICAgIGlmICh0aGlzLmFjdGlvbk1hcHBpbmdbYWN0aW9uXS5kcm9wZG93biAmJiAhdmFsdWUpIHtcbiAgICAgIGlmICh0aGlzLmFjdGlvbk1hcHBpbmdbYWN0aW9uXS51bmRvKSB7XG4gICAgICAgIHRoaXMuY29tbWFuZHNQaXBlW2NoYW5uZWxdLm5leHQoe1xuICAgICAgICAgIG5hbWU6IHRoaXMuYWN0aW9uTWFwcGluZ1thY3Rpb25dLnVuZG8sXG4gICAgICAgICAgdmFsdWU6IHRoaXMuYWN0aW9uTWFwcGluZ1thY3Rpb25dLnZhbHVlIHx8IHZhbHVlXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBY3Rpb24gXCInICsgYWN0aW9uICsgJ1wiZG9lc25cXCd0IGhhdmUgYSB1bmRvIGNvbW1hbmQnKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKFxuICAgICAgICB0aGlzLmFjdGlvbk1hcHBpbmdbYWN0aW9uXS52YWx1ZSAmJlxuICAgICAgICB0eXBlb2YgdGhpcy5hY3Rpb25NYXBwaW5nW2FjdGlvbl0udmFsdWUgPT09ICdmdW5jdGlvbidcbiAgICAgICkge1xuICAgICAgICB0aGlzLmNvbW1hbmRzUGlwZVtjaGFubmVsXS5uZXh0KHtcbiAgICAgICAgICBuYW1lOiB0aGlzLmFjdGlvbk1hcHBpbmdbYWN0aW9uXS5jb21tYW5kLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLmFjdGlvbk1hcHBpbmdbYWN0aW9uXS52YWx1ZSh2YWx1ZSlcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNvbW1hbmRzUGlwZVtjaGFubmVsXS5uZXh0KHtcbiAgICAgICAgICBuYW1lOiB0aGlzLmFjdGlvbk1hcHBpbmdbYWN0aW9uXS5jb21tYW5kLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLmFjdGlvbk1hcHBpbmdbYWN0aW9uXS52YWx1ZSB8fCB2YWx1ZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZG9JbmxpbmUoY2hhbm5lbCwgYWN0aW9uLCB2YWx1ZT8pIHtcbiAgICBpZiAoYWN0aW9uLmRyb3Bkb3duICYmICF2YWx1ZSkge1xuICAgICAgaWYgKGFjdGlvbi51bmRvKSB7XG4gICAgICAgIHRoaXMuY29tbWFuZHNQaXBlW2NoYW5uZWxdLm5leHQoe1xuICAgICAgICAgIG5hbWU6IGFjdGlvbi51bmRvLFxuICAgICAgICAgIHZhbHVlOiBhY3Rpb24udmFsdWUgfHwgdmFsdWVcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FjdGlvbiBcIicgKyBhY3Rpb24gKyAnXCJkb2VzblxcJ3QgaGF2ZSBhIHVuZG8gY29tbWFuZCcpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoYWN0aW9uLnZhbHVlICYmIHR5cGVvZiBhY3Rpb24udmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpcy5jb21tYW5kc1BpcGVbY2hhbm5lbF0ubmV4dCh7XG4gICAgICAgICAgbmFtZTogYWN0aW9uLmNvbW1hbmQsXG4gICAgICAgICAgdmFsdWU6IGFjdGlvbi52YWx1ZSh2YWx1ZSlcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNvbW1hbmRzUGlwZVtjaGFubmVsXS5uZXh0KHtcbiAgICAgICAgICBuYW1lOiBhY3Rpb24uY29tbWFuZCxcbiAgICAgICAgICB2YWx1ZTogYWN0aW9uLnZhbHVlIHx8IHZhbHVlXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB1bmRvKGNoYW5uZWwsIGFjdGlvbiwgdmFsdWU/KSB7XG4gICAgY29uc3QgbWFwcGluZyA9IHRoaXMuYWN0aW9uTWFwcGluZ1thY3Rpb25dLnVuZG87XG4gICAgLy8gVE9ET1xuICB9XG59XG4iXX0=