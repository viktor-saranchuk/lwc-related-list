import { LightningElement, api, track } from 'lwc';

import { FILTER_TYPES, LABELS, PROP_NAMES } from './constants';
import { isPlainObject, areArraysEqual, areFilterValuesEqual } from './helper';

const _state = new Map();

export default class FiltersPane extends LightningElement {
    _filters;

    @track
    _draftFilters;

    labels = LABELS;
    propNames = PROP_NAMES;
    focusClose = true;

    @api
    instanceId;

    @api
    get filters() {
        return this._filters?.map(filter => ({
            ...filter,
            value: structuredClone(
                Object.hasOwn(this._draftFilters || {}, filter.name)
                    ? this._draftFilters[filter.name].value
                    : filter.value
            )
        }));
    }
    set filters(value) {
        if (Array.isArray(value)) {
            this._filters = value?.filter(({type}) => !type || Object.values(FILTER_TYPES).includes(type)).map(filter => {
                const type = filter.type || FILTER_TYPES.text;
                const requiresStartEndRange = type === FILTER_TYPES.date;
                const requiresMinMaxRange = type === FILTER_TYPES.number;
                const requiresCheckboxGroup = type === FILTER_TYPES.checkboxgroup;

                const isFilterValueObject = isPlainObject(filter.value);

                let value = filter.value || null;

                if (requiresStartEndRange) {
                    value = {
                        [PROP_NAMES.start]: isFilterValueObject ? value[PROP_NAMES.start] : value,
                        [PROP_NAMES.end]: isFilterValueObject ? value[PROP_NAMES.end] : value
                    }
                } else if (requiresMinMaxRange) {
                    value = {
                        [PROP_NAMES.min]: isFilterValueObject ? value[PROP_NAMES.min] : value,
                        [PROP_NAMES.max]: isFilterValueObject ? value[PROP_NAMES.max] : value
                    }
                } else if (requiresCheckboxGroup) {
                    value = value || [];
                }

                return {
                    ...filter,
                    type,
                    requiresRange: requiresStartEndRange || requiresMinMaxRange,
                    requiresStartEndRange,
                    requiresMinMaxRange,
                    requiresCheckboxGroup,
                    value
                };
            });
        }
    }

    get noDraftFilters() {
        return !Object.values(this._draftFilters || {}).length;
    }

    get hasDraftFilters() {
        return !!this._draftFilters && Object.values(this._draftFilters || {}).length;
    }

    get isFiltersSet() {
        return this.filters?.some(({type, value}) => {
            if (type === FILTER_TYPES.date) {
                return !!(value?.[PROP_NAMES.start] || value?.[PROP_NAMES.end]);
            } else if (type === FILTER_TYPES.number) {
                return !!(value?.[PROP_NAMES.min] || value?.[PROP_NAMES.max]);
            } else if (type === FILTER_TYPES.checkboxgroup) {
                return !!value?.length
            }

            return !!value;
        });
    }

    get showFooter() {
        return this.isFiltersSet || this.hasDraftFilters;
    }

    handleCloseFilters() {
        this.dispatchEvent(new CustomEvent('close'));
    }

    handleCancel() {
        this._draftFilters = {};
        _state.get(this.instanceId).filters = {};
    }

    handleClearAllFilters() {
        this._draftFilters = this.filters.reduce((acc, filter) => {
            acc[filter.name] = {
                ...filter
            }
            if (filter.requiresStartEndRange) {
                acc[filter.name].value = {
                    [PROP_NAMES.start]: null,
                    [PROP_NAMES.end]: null
                };
            } else if (filter.requiresMinMaxRange) {
                acc[filter.name].value = {
                    [PROP_NAMES.min]: null,
                    [PROP_NAMES.max]: null
                };
            } else if (filter.requiresCheckboxGroup) {
                acc[filter.name].value = [];
            } else {
                acc[filter.name].value = null
            }

            return acc;
        }, {});

        _state.get(this.instanceId).filters = this._draftFilters;
    }

    handleApplyFilters() {
        const applied = this.filters;
        this._filters = applied;
        this.handleCancel();
        this.dispatchEvent(new CustomEvent('apply', {detail: {filters: applied}}));
    }

    handleChange(event) {
        event.stopPropagation();

        if (!event.target.checkValidity()) {
            event.target.value = null;
            event.target.setCustomValidity('');
            event.target.reportValidity();
            return;
        }

        const filter = this.filters.find(({name}) => name === event.target.name);

        let value = structuredClone(event.detail.value ?? null);

        if (filter.requiresRange) {
            const pair = [...this.template.querySelectorAll(`[data-name="${event.target.name}"]`)];

            if (event.target.type === FILTER_TYPES.date) {
                value = {
                    [PROP_NAMES.start]: pair.find(({dataset: {subName}}) => subName === PROP_NAMES.start).value,
                    [PROP_NAMES.end]: pair.find(({dataset: {subName}}) => subName === PROP_NAMES.end).value
                }
            } else if (event.target.type === FILTER_TYPES.number) {
                value = {
                    [PROP_NAMES.min]: pair.find(({dataset: {subName}}) => subName === PROP_NAMES.min).value,
                    [PROP_NAMES.max]: pair.find(({dataset: {subName}}) => subName === PROP_NAMES.max).value
                }
            }
        } else if (filter.requiresCheckboxGroup) {
            value = value ?? [];
        }

        if (areFilterValuesEqual(filter.value, value)) {
            const { [filter.name]: _, ...rest } = this._draftFilters;
            this._draftFilters = rest;
        } else {
            this._draftFilters = { ...this._draftFilters, [filter.name]: { ...filter, value } };
        }

        _state.get(this.instanceId).filters = this._draftFilters;
    }

    connectedCallback() {
        if (!_state.has(this.instanceId)) {
            _state.set(this.instanceId, { filters: {} });
        }
        this._draftFilters = _state.get(this.instanceId).filters;
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