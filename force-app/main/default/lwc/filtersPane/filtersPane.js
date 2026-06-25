import { LightningElement } from 'lwc';

import { LABELS } from './constants';

export default class FiltersPane extends LightningElement {
    labels = LABELS;

    focusClose = true;

    handleCloseFilters() {
        this.dispatchEvent(new CustomEvent('close'));
    }

    handleClearFilters() {
        this.dispatchEvent(new CustomEvent('clearall'));
    }

    handleApplyFilters() {
        this.dispatchEvent(new CustomEvent('apply'));
    }

    renderedCallback() {
        if (this.focusClose) {
            const button = this.template.querySelector('lightning-button-icon[data-name="close"]');

            if (button) {
                button.focus();
                this.focusClose = false;
            }
        }
    }
}