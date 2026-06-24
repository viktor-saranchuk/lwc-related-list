import { LightningElement } from 'lwc';

const LABELS = {
    apply: 'Apply',
    cancel: 'Cancel',
    clearAllFilters: 'Clear All Filters',
    close: 'Close',
    columnSort: 'Column Sort',
    filters: 'Filters',
    listViewControls: 'List View Controls',
    loading: 'Loading',
    quickFilters: 'Quick Filters',
    quickFiltersHelpText: 'Quick filters can\'t be saved and apply only to your current session. Quick filters that you apply don\'t affect anyone else\'s view',
    refresh: 'Refresh',
    resetColumnSorting: 'Reset Column Sorting',
    resetColumnWidths: 'Reset Column Widths',
    showQuickFilters: 'Show Quick Filters',
    updatedAFewSecondsAgo: 'Updated a few seconds ago',
    viewAll: 'View All'
}

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