import { EventEmitter } from '@angular/core';
import { FateDropdown } from '../fate-dropdown.interface';
export declare class FateLinkDropdownComponent implements FateDropdown {
    value: string;
    valueChange: EventEmitter<string>;
    changeValue(value: any): void;
    selectNext(): void;
    selecPrevious(): void;
    confirmSelection(): void;
}
