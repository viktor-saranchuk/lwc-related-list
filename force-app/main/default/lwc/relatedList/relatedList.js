import { LightningElement, api, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { FILTER_TYPES } from 'c/filtersPane';

import {
    CONTROLS,
    DEFAULT_NUMBER_OF_ACTION_BUTTONS,
    DEFAULT_SORT_CONFIG,
    FORM_FACTOR,
    ICON_SIZE,
    LABELS,
    LIST_TYPE,
    PAGE_TYPE,
    VIEW_MODE,
    COLUMN_FILTER_TYPES_MAPPING
} from './constants'

export default class RelatedList extends LightningElement {
    _mode;
    _listType;
    _data;
    _hasMoreData;
    _columns;
    _filters;
    _breadcrumbs;
    _sortConfig;
    _lastDataSetAt;
    _lastDataSetAtCheckedAt;
    _lastDataSetAtCheckedAtTimoutId;

    instanceId = crypto.randomUUID();

    formFactor = FORM_FACTOR;
    labels = LABELS;
    controls = CONTROLS;
    initialColumnWidths;
    isResetColumnWidthsDisabled = true;
    isRefresh = false;
    showQuickFilters = false;

    @api
    get mode() {
        if (!!this._mode) {
            return this._mode;
        } else if (this.currentPageReference?.type === PAGE_TYPE.standardRecordPage) {
            return VIEW_MODE.compact;
        } else if (this.currentPageReference?.type === PAGE_TYPE.standardComponent) {
            return VIEW_MODE.full;
        }
    }
    set mode(value) {
        if (value && Object.values(VIEW_MODE).includes(value)) {
            this._mode = value;
        }
    }
    
    @api
    get listType() {
        if (!!this._listType) {
            return this._listType;
        }

        return LIST_TYPE.basic;
    }
    set listType(value) {
        if (value && Object.values(LIST_TYPE).includes(value)) {
            this._listType = value;
        }
    }

    @api
    get data() {
        return this._data;
    }
    set data(value) {
        this.isRefresh = false;
        this.lastDataSetAt = Date.now();
        if (Array.isArray(value)) {
            this._data = JSON.parse(JSON.stringify(value));
        }
    }

    @api
    get columns() {
        return this._columns;
    }
    set columns(value) {
        if (Array.isArray(value)) {
            this._columns = value;
        }
    }

    @api
    get filters() {
        return this._filters ?? this.columns?.map(column => {

            const type = COLUMN_FILTER_TYPES_MAPPING[column.type ?? FILTER_TYPES.text];

            if (!type) {
                return null;
            }

            return {
                label: column.label,
                name: column.fieldName,
                type
            }
        })?.filter(Boolean) ?? [];
    }
    set filters(value) {
        if (Array.isArray(value)) {
            this._filters = value;
        }
    }

    @api
    get breadcrumbs() {
        return this._breadcrumbs?.map((item, index) => ({
            ...item,
            key: `item-${index}`
        }));
    }
    set breadcrumbs(value) {
        if (Array.isArray(value) && !!value.length) {
            this._breadcrumbs = value;
        }
    }

    @api
    get hasMoreData() {
        return !!(this.data && this._hasMoreData);
    }
    set hasMoreData(value) {
        this._hasMoreData = value;
    }

    @api
    get title() {
        if (this.viewMode.isCompact) {
            return `${this._title}${this.data ? ` (${this.data.length}${this.hasMoreData ? '+' : ''})` : ''}`;
        }

        return this._title
    }
    set title(value) {
        this._title = value;
    }

    @api
    get sortConfig() {
        return this._sortConfig || DEFAULT_SORT_CONFIG;
    }
    set sortConfig(value) {
        this._sortConfig = value;
    }

    @api
    iconName;

    @api
    viewAllUrl;

    @api
    listViewActions;

    @wire(CurrentPageReference)
    currentPageReference;

    get iconSize() {
        if (this.viewMode.isCompact) {
            return ICON_SIZE.small;
        } else if (this.viewMode.isFull) {
            return ICON_SIZE.medium;
        }

        return ICON_SIZE.medium;
    }

    get viewMode() {
        return {
            isCompact: this.mode === VIEW_MODE.compact,
            isFull: this.mode === VIEW_MODE.full
        }
    }

    get info() {
        if (!this.data) {
            return null;
        }

        return [
            `${this.data.length}${this.hasMoreData ? '+' : ''} item${this.data.length !== 1 ? 's' : ''}`,
            `${
                !!this.sortConfig.fieldNames?.length
                ? `Sorted by ${this.columns.filter(({fieldName}) => this.sortConfig.fieldNames.includes(fieldName)).map(({label}) => label).join(', ')}`
                : ''
            }`,
            this.dataUpdatedAgo
        ].filter(Boolean).join(' • ')
    }

    get listViewActionButtons() {
        let numberOfButtons = DEFAULT_NUMBER_OF_ACTION_BUTTONS;

        if (this.viewMode.isCompact) {
            numberOfButtons = this.formFactor.isLarge ? 3 : 1;
        } else if (this.viewMode.isFull) {
            numberOfButtons = this.formFactor.isLarge ? 5 : 3;
        }

        return this.listViewActions?.slice(0, numberOfButtons) || [];
    }

    get listViewActionMenuItems() {
        return this.listViewActions?.slice(this.listViewActionButtons?.length) || [];
    }

    get isDataLoaded() {
        return !!this.data;
    }

    get isResetColumnSortingDisabled() {
        return this.sortConfig === DEFAULT_SORT_CONFIG;
    }

    get lastDataSetAt() {
        return this._lastDataSetAt || Date.now();
    }
    set lastDataSetAt(value) {
        if (Number.isInteger(value)) {
            this._lastDataSetAt = value;
            this.setLastDataSetAtCheckedAt();
        }
    }

    get lastDataSetAtCheckedAt() {
        return this._lastDataSetAtCheckedAt >= this.lastDataSetAt  ? this._lastDataSetAtCheckedAt : this.lastDataSetAt;
    }
    set lastDataSetAtCheckedAt(value) {
        if (Number.isInteger(value)) {
            this._lastDataSetAtCheckedAt = value;
        }
    }

    get dataUpdatedAgo() {
        const diffMs = this.lastDataSetAtCheckedAt - this.lastDataSetAt;
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);

        let updatedAgo;

        if (diffHours >= 24) {
            updatedAgo = this.labels.updatedLongTimeAgo;
        }  else if (diffHours > 1) {
            updatedAgo = `Updated ${diffHours} hours ago`;
        } else if (diffHours == 1) {
            updatedAgo = this.labels.updatedAnHourAgo;
        } else if (diffMinutes > 1) {
            updatedAgo = `Updated ${diffMinutes} minutes ago`;
        } else if (diffMinutes == 1) {
            updatedAgo = this.labels.updatedAMinuteAgo;
        } else {
            updatedAgo = this.labels.updatedAFewSecondsAgo;
        }

        return updatedAgo;
    }

    get numberOfSkeletonRows() {
        return this.viewMode.isCompact ? 6 : 50;
    }

    setLastDataSetAtCheckedAt = () => {
        this.lastDataSetAtCheckedAt = Date.now();

        if (this._lastDataSetAtCheckedAtTimoutId) {
            clearTimeout(this._lastDataSetAtCheckedAtTimoutId);
        }

        const diffMs = this.lastDataSetAtCheckedAt - this.lastDataSetAt;
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);

        let delay;

        if (diffHours < 1) {
            delay = 1000 * 60;
        } else if (diffHours < 24) {
            delay = 1000 * 60 * 60;
        } else {
            return;
        }

        this._lastDataSetAtCheckedAtTimoutId = setTimeout(this.setLastDataSetAtCheckedAt, delay);
    }

    handleActionClick(event) {
        this.dispatchEvent(new CustomEvent('action', { detail: { name: event.target.name || event.detail.value } }));
    }

    handleControlClick(event) {
        if (event.detail.value === CONTROLS.resetColumnWidths.name) {
            this.isResetColumnWidthsDisabled = true;
            this.columns = [...this.columns];
        } else if (event.detail.value === CONTROLS.resetColumnSorting.name) {
            this.dispatchEvent(new CustomEvent('sort'))
            this.sortConfig = null;
        } else if (event.target.name === CONTROLS.refresh.name) {
            this.isRefresh = true;
            this.dispatchEvent(new CustomEvent('refresh'));
        } else if (event.target.name === CONTROLS.showQuickFilters.name) {
            this.showQuickFilters = !this.showQuickFilters;
        }
    }

    handleColumnsResize(event) {
        if (!this.initialColumnWidths) {
            this.initialColumnWidths = event.detail;
            return;
        }
        this.isResetColumnWidthsDisabled = false;
    }

    handleColumnsSort(event) {
        this.dispatchEvent(new CustomEvent('sort', {detail: event.detail}))
        this.sortConfig = event.detail;
    }

    closeFilters() {
        this.showQuickFilters = !this.showQuickFilters;
        this.template.querySelector(`lightning-button-icon-stateful[data-name="${CONTROLS.showQuickFilters.name}"]`)?.focus();
    }

    applyFilters(event) {
        this.filters = event.detail.filters;
        this.dispatchEvent(new CustomEvent('applyfilters', {detail: structuredClone(event.detail)}))
    }

    disconnectedCallback() {
        if (this._lastDataSetAtCheckedAtTimoutId) {
            clearTimeout(this._lastDataSetAtCheckedAtTimoutId);
        }
    }
}