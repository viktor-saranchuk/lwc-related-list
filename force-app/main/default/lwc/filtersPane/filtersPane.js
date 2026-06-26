import { LightningElement, api } from 'lwc';

import { FILTER_TYPES, LABELS, PROP_NAMES } from './constants';
import { isPlainObject } from './helper';

export default class FiltersPane extends LightningElement {
    _filters;
    _draftValues;

    labels = LABELS;
    focusClose = true;

    @api
    get filters() {
        return this._filters;
    }
    set filters(value) {
        if (Array.isArray(value)) {
            this._filters = value?.filter(({type}) => !type || Object.values(FILTER_TYPES).includes(type)).map(filter => {
                const type = filter.type || FILTER_TYPES.text;
                const requiresStartEndRange = type === FILTER_TYPES.date;
                const requiresMinMaxRange = type === FILTER_TYPES.number;
                const requiresCheckboxGroup = type === FILTER_TYPES.checkboxgroup;

                const isFilterValueObject = isPlainObject(filter.value);

                let value = filter.value;

                if (requiresStartEndRange) {
                    value = {
                        start: isFilterValueObject ? value.start : value,
                        end: isFilterValueObject ? value.end : value

                    }
                } else if (requiresMinMaxRange) {
                    value = {
                        min: isFilterValueObject ? value.min : value,
                        max: isFilterValueObject ? value.max : value
                    }
                }

                return {
                    ...filter,
                    type,
                    isGroup: requiresStartEndRange || requiresMinMaxRange || requiresCheckboxGroup,
                    requiresStartEndRange,
                    requiresMinMaxRange,
                    requiresCheckboxGroup,
                    value
                };
            });
        }
    }

    handleCloseFilters() {
        this.dispatchEvent(new CustomEvent('close'));
    }

    handleCancel() {
        this.dispatchEvent(new CustomEvent('cancel'));
    }

    handleClearAllFilters() {
        this.dispatchEvent(new CustomEvent('clearall'));
    }

    handleApplyFilters() {
        this.dispatchEvent(new CustomEvent('apply'));
    }

    handleChange(event) {
        if (!event.target.checkValidity()) {
            event.target.value = null;
            event.target.setCustomValidity('');
            event.target.reportValidity();
            return;
        }
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