import { LightningElement, api, wire } from 'lwc';
import { CurrentPageReference } from "lightning/navigation";
import FORM_FACTOR from "@salesforce/client/formFactor";

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

const PAGE_TYPE = {
    standardRecordPage: 'standard__recordPage',
    standardComponent: 'standard__component'
}

const VIEW_MODE = {
    compact: 'compact',
    full: 'full'
}

const TYPE = {
    basic: 'basic',
    enhanced: 'enhanced',
    tiles: 'tiles'
}

const CONTROLS = {
    columnSort: {
        label: LABELS.columnSort,
        name: 'columnsort',
        iconName: 'utility:sort'
    },
    listViewControls: {
        label: LABELS.listViewControls,
        name: 'listviewcontrols',
        iconName: 'utility:settings'
    },
    refresh: {
        label: LABELS.refresh,
        name: 'refresh',
        iconName: 'utility:refresh'
    },
    resetColumnSorting: {
        label: LABELS.resetColumnSorting,
        name: 'resetcolumnsorting'
    },
    resetColumnWidths: {
        label: LABELS.resetColumnWidths,
        name: 'resetcolumnwidths'
    },
    showQuickFilters: {
        label: LABELS.showQuickFilters,
        name: 'showquickfilters',
        iconName: 'utility:filterList'
    }
}

const DEFAULT_NUMBER_OF_ACTION_BUTTONS = 3;

const DEFAULT_SORT_CONFIG = {
    isMultiColumnSort: false,
    fieldName: null,
    fieldNames: null,
    sortDirection: null,
    sortDirections: null
};

const ICON_SIZE = {
    small: 'small',
    medium: 'medium'
}
export default class CustomRelatedList extends LightningElement {
    _mode;
    _type;
    _data;
    _hasMoreData;
    _columns;
    _breadcrumbs;
    _sortConfig;
    _lastDataSetAt;
    _lastDataSetAtCheckedAt;
    _lastDataSetAtCheckedAtTimoutId;

    labels = LABELS;
    controls = CONTROLS;
    initialColumnWidths;
    isResetColumnWidthsDisabled = true;
    isRefresh = false;
    showQuickFilters = false;
    focusQuickFiltersClose = false;

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

    get formFactor() {
        return {
            isSmall: FORM_FACTOR === 'Small',
            isMedium: FORM_FACTOR === 'Medium',
            isLarge: FORM_FACTOR === 'Large'
        }
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
            updatedAgo = `Updated long time ago`;
        }  else if (diffHours > 1) {
            updatedAgo = `Updated ${diffHours} hours ago`;
        } else if (diffHours == 1) {
            updatedAgo = `Updated an hour ago`;
        } else if (diffMinutes > 1) {
            updatedAgo = `Updated ${diffMinutes} minutes ago`;
        } else if (diffMinutes == 1) {
            updatedAgo = `Updated a minute ago`;
        } else {
            updatedAgo = `Updated a few seconds ago`;
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
            this.focusQuickFiltersClose = !this.focusQuickFiltersClose;
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

    handleCloseFilters() {
        this.showQuickFilters = !this.showQuickFilters;
        this.template.querySelector(`lightning-button-icon-stateful[data-name="${CONTROLS.showQuickFilters.name}"]`)?.focus();
    }

    handleClearFilters() {
        console.warn('NOT IMPLEMENTED');
    }

    handleApplyFilters() {
        console.warn('NOT IMPLEMENTED');
    }

    renderedCallback() {
        if (this.focusQuickFiltersClose) {
            const button = this.template.querySelector('lightning-button-icon[data-name="closeQuickFilters"]');

            if (button) {
                button.focus();
                this.focusQuickFiltersClose = false;
            }
        }
    }

    disconnectedCallback() {
        if (this._lastDataSetAtCheckedAtTimoutId) {
            clearTimeout(this._lastDataSetAtCheckedAtTimoutId);
        }
    }
}