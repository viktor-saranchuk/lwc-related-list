import { LightningElement, api, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { FILTER_TYPES } from 'c/filtersPane';
import ColumnSortModal from 'c/columnSortModal';

import {
    CONTROLS,
    DEFAULT_NUMBER_OF_ACTION_BUTTONS,
    DEFAULT_COMPACT_PAGE_SIZE,
    DEFAULT_SORT_CONFIG,
    FORM_FACTOR,
    ICON_SIZE,
    LABELS,
    TYPE,
    PAGE_TYPE,
    VIEW_MODE,
    COLUMN_FILTER_TYPES_MAPPING
} from './constants'

import {areArraysEqual, calculateDelay} from './helper'

export default class RelatedList extends LightningElement {
    /** private properties */

    _mode;
    _type;
    _data;
    _hasMoreData;
    _pageSize;
    _columns;
    _initialColumnWidths;
    _filters;
    _breadcrumbs;
    _sortConfig;
    _initialSortConfig;
    _lastDataSetAt;
    _lastDataSetAtCheckedAt;
    _lastDataSetAtCheckedAtTimoutId;

    instanceId = crypto.randomUUID();

    formFactor = FORM_FACTOR;
    labels = LABELS;
    controls = CONTROLS;
    isResetColumnWidthsDisabled = true;
    showQuickFilters = false;

    /** public properties */

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
    get type() {
        if (!!this._type) {
            return this._type;
        }

        return TYPE.basic;
    }
    set type(value) {
        if (value && Object.values(TYPE).includes(value)) {
            this._type = value;
        }
    }

    @api
    get data() {
        return this._data;
    }
    set data(value) {
        this.isLoading = false;
        this.lastDataSetAt = Date.now();
        if (Array.isArray(value)) {
            this._data = value;
        }
    }

    @api
    get columns() {
        const {isEnhanced, isNotEnhanced} = this.listType;
        const {isFull} = this.viewMode
        return this._columns?.map(column => ({
            ...column, 
            hideDefaultActions: Object.hasOwn(column, 'hideDefaultActions') ? column.hideDefaultActions : isNotEnhanced, 
            sortable: Object.hasOwn(column, 'sortable') ? column.sortable : (isEnhanced && column.type !== 'action')
        }));
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
    get pageSize() {
        return this._pageSize ?? this.viewMode.isCompact ? DEFAULT_COMPACT_PAGE_SIZE :  null;
    }
    set pageSize(value) {
        if (Number.isInteger(value) && value >= 0) {
            this._pageSize = value;
        }
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
        const columns = this.columns;
        return {
            ...(this._sortConfig || DEFAULT_SORT_CONFIG),
            get calculatedSortApplied() {
                return this.fieldNames?.map((name, index) => (!!name && !!this.sortDirections?.[index] ? {
                    value: name, 
                    direction: this.sortDirections?.[index]
                } : null)).filter(Boolean) ?? [];
            },
            get calculatedSortOptions() {
                return this.options ?? columns?.map(({label, fieldName, sortable}) => (sortable ? {label, value: fieldName} : null)).filter(Boolean) ?? [];
            }
        };
    }
    set sortConfig(value) {
        if (!this._initialSortConfig) {
            this._initialSortConfig = structuredClone(value);
        }

        this._sortConfig = structuredClone(value);
    }

    @api
    isLoading;

    @api
    iconName;

    @api
    viewAllUrl;

    @api
    listViewActions;

    /** wire adaptors */

    @wire(CurrentPageReference)
    currentPageReference;

    /** calculated properties (getters) */

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

    get listType() {
        const type = this.type;
        const formFactor = this.formFactor;
        const viewMode = this.viewMode;
        return {
            get isBasic() { return formFactor.isLarge && type === TYPE.basic; },
            get isEnhanced() { return formFactor.isLarge && (type === TYPE.enhanced || viewMode.isFull);  },
            get isTiles() { 
                return (formFactor.isSmall && viewMode.isFull) ||
                (formFactor.isMedium && (viewMode.isFull || type === TYPE.tiles)) ||
                (formFactor.isLarge && (viewMode.isCompact && type === TYPE.tiles)) ||
                false;
            },
            get isNotEnhanced() { return !this.isEnhanced; },
            get isTable() { return this.isBasic || this.isEnhanced; }
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
                ? `Sorted by ${this.columns?.filter(({fieldName}) => this.sortConfig?.fieldNames?.includes(fieldName)).map(({label}) => label).join(', ')}`
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

    get isResetColumnSortingDisabled() {
        return areArraysEqual(this._sortConfig?.fieldNames, this._initialSortConfig?.fieldNames) && areArraysEqual(this._sortConfig?.sortDirections, this._initialSortConfig?.sortDirections);
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

    get columnWidthMode() {
        return this.viewMode.isFull && this.listType.isEnhanced ? 'fixed' : 'auto';
    }

    /** methods */

    setLastDataSetAtCheckedAt = () => {
        this.lastDataSetAtCheckedAt = Date.now();

        if (this._lastDataSetAtCheckedAtTimoutId) {
            clearTimeout(this._lastDataSetAtCheckedAtTimoutId);
        }

        const delay = calculateDelay(this.lastDataSetAtCheckedAt - this.lastDataSetAt);

        if (!!delay) {
            this._lastDataSetAtCheckedAtTimoutId = setTimeout(this.setLastDataSetAtCheckedAt, delay);
        }
    }

    /** event handlers */

    handleActionClick(event) {
        this.dispatchEvent(new CustomEvent('action', { detail: { name: event.target.name || event.detail.value } }));
    }

    async handleControlClick(event) {
        if (event.detail.value === CONTROLS.resetColumnWidths.name) {
            this.handleColumnsResize({detail: {columnWidths: this._initialColumnWidths, isUserTriggered: false}});
        } else if (event.detail.value === CONTROLS.resetColumnSorting.name) {
            this.sortConfig = structuredClone(this._initialSortConfig);
            this.dispatchEvent(new CustomEvent('sort', {detail: this._initialSortConfig}));
        } else if (event.target.name === CONTROLS.refresh.name) {
            this.dispatchEvent(new CustomEvent('refresh'));
        } else if (event.target.name === CONTROLS.showQuickFilters.name) {
            this.showQuickFilters = !this.showQuickFilters;
        } else if (event.target.name === CONTROLS.columnSort.name) {
            const result = await ColumnSortModal.open({
                label: CONTROLS.columnSort.label,
                size: 'small',
                columnLimit: this.sortConfig.columnLimit,
                options: this.sortConfig.calculatedSortOptions,
                applied: this.sortConfig.calculatedSortApplied
            });

            if (result) {
                const newSortConfig = Object.create(
                    Object.getPrototypeOf(DEFAULT_SORT_CONFIG),
                    Object.getOwnPropertyDescriptors(DEFAULT_SORT_CONFIG)
                );
                newSortConfig.fieldNames = result.map(({value}) => value);
                newSortConfig.sortDirections = result.map(({direction}) => direction);
                newSortConfig.isMultiColumnSort = newSortConfig.fieldNames.length > 1;

                this.sortConfig = newSortConfig;
                this.dispatchEvent(new CustomEvent('sort', {detail: newSortConfig}));
            }
        }
    }

    handleColumnsResize(event) {
        if (!event.detail.isUserTriggered) {
            this.isResetColumnWidthsDisabled = true;
            this._initialColumnWidths = event.detail.columnWidths;
        }

        this.isResetColumnWidthsDisabled = !event.detail.isUserTriggered
        this.columns = structuredClone(this._columns).map((column, index) => ({...column, initialWidth: event.detail.columnWidths[index]}));
    }

    handleColumnsSort(event) {
        this.sortConfig = event.detail;
        this.dispatchEvent(new CustomEvent('sort', {detail: event.detail}))
    }

    handleRowAction(event) {
        this.dispatchEvent(new CustomEvent('rowaction', {detail: structuredClone(event.detail)}))
    }

    closeFilters() {
        this.showQuickFilters = !this.showQuickFilters;
        this.template.querySelector(`lightning-button-icon-stateful[data-name="${CONTROLS.showQuickFilters.name}"]`)?.focus();
    }

    applyFilters(event) {
        this.filters = event.detail.filters;
        this.dispatchEvent(new CustomEvent('applyfilters', {detail: structuredClone(event.detail)}))
    }

    /** lifecycle hooks */

    disconnectedCallback() {
        if (this._lastDataSetAtCheckedAtTimoutId) {
            clearTimeout(this._lastDataSetAtCheckedAtTimoutId);
        }
    }
}