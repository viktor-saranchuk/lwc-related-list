import { LightningElement, api, wire } from 'lwc';
import { CurrentPageReference } from "lightning/navigation";
import FORM_FACTOR from "@salesforce/client/formFactor";

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
        label: 'Column Sort',
        name: 'columnsort',
        iconName: 'utility:sort'
    },
    listViewControls: {
        label: 'List View Controls',
        name: 'listviewcontrols',
        iconName: 'utility:settings'
    },
    refresh: {
        label: 'Refresh',
        name: 'refresh',
        iconName: 'utility:refresh'
    },
    resetColumnSorting: {
        label: 'Reset Column Sorting',
        name: 'resetcolumnsorting'
    },
    resetColumnWidths: {
        label: 'Reset Column Widths',
        name: 'resetcolumnwidths'
    },
    showQuickFilters: {
        label: 'Show Quick Filters',
        name: 'showquickfilters',
        iconName: 'utility:filterList'
    }
}

const DEFAULT_NUMBER_OF_RECORDS_TO_DISPLAY = 10;
const DEFAULT_NUMBER_OF_ACTION_BUTTONS = 3;

const DEFAULT_SORTING_INFO = {
    isMultiColumnSort: false,
    fieldName: 'Id',
    fieldNames: ['Id'],
    sortDirection: 'asc',
    sortDirections: ['asc']
};
export default class CustomRelatedList extends LightningElement {
    _mode;
    _type;
    _data;
    _columns;
    _breadcrumbs;
    _numberOfRecordsToDisplay;
    _showListViewActionBar;
    _sortingConfig = DEFAULT_SORTING_INFO;

    controls = CONTROLS;

    initialColumnWidths;
    isResetColumnWidthsDisabled = true;
    isResetColumnSortingDisabled = true;

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
        if (Array.isArray(value)) {
            this._data = value;
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
    get numberOfRecordsToDisplay() {
        return this._numberOfRecordsToDisplay || DEFAULT_NUMBER_OF_RECORDS_TO_DISPLAY;
    }
    set numberOfRecordsToDisplay(value) {
        const numberOfRecords = Number(value);
        if (Number.isInteger(numberOfRecords) && numberOfRecords >= 0) {
            this._numberOfRecordsToDisplay = numberOfRecords;
        }
    }

    @api
    get showListViewActionBar() {
        return this._showListViewActionBar && Array.isArray(this.listViewActions) && !!this.listViewActions?.length;
    }
    set showListViewActionBar(value) {
        this._showListViewActionBar = !!value && value !== 'false';
    }

    @api
    get title() {
        if (this.viewMode.isCompact) {
            return `${this._title}${this.data ? ` (${this.data.length > this.numberOfRecordsToDisplay ? `${this.numberOfRecordsToDisplay}+` : this.data.length})` : ''}`;
        }

        return this._title
    }
    set title(value) {
        this._title = value;
    }

    @api
    iconName;

    @api
    viewAllUrl;

    @api
    listViewActions;

    @wire(CurrentPageReference)
    currentPageReference;

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

        return `${this.data.length} item${this.data.length !== 1 ? 's' : ''}`
    }

    get listViewActionButtons() {
        let numberOfButtons = DEFAULT_NUMBER_OF_ACTION_BUTTONS;

        if (this.viewMode.isCompact) {
            numberOfButtons = this.formFactor.isLarge ? 3 : 1;
        } else if (this.viewMode.isFull) {
            numberOfButtons = this.formFactor.isLarge ? 5 : 3;
        }

        return this.listViewActions?.slice(0, numberOfButtons);
    }

    get listViewActionMenuItems() {
        return this.listViewActions?.slice(this.listViewActionButtons?.length);
    }

    get isDataLoaded() {
        return !!this.data;
    }

    get hasData() {
        return !!this.data?.length;
    }

    get sortingConfig() {
        return this._sortingConfig || DEFAULT_SORTING_INFO;
    }
    set sortingConfig(value) {
        this.sortData(value);
        this._sortingConfig = value;
    }

    handleActionClick(event) {
        this.dispatchEvent(new CustomEvent('action', { detail: { name: event.target.name || event.detail.value } }));
    }

    handleControlClick(event) {
        if (event.detail.value === CONTROLS.resetColumnWidths.name) {
            this.isResetColumnWidthsDisabled = true;
            this.columns = [...this.columns];
        } else if (event.detail.value === CONTROLS.resetColumnSorting.name) {
            this.isResetColumnSortingDisabled = true;
            this.sortingConfig = DEFAULT_SORTING_INFO;
        }
    }

    handleColumnsResize(event) {
        if (!this.initialColumnWidths) {
            this.initialColumnWidths = event.detail;
            return;
        }
        this.isResetColumnWidthsDisabled = false;
    }

    applySorting(event) {
        this.isResetColumnSortingDisabled = false;
        this.sortingConfig = event.detail;
    }

    sortData(sortingConfig) {
        const clonedData = [...this.data];
        clonedData.sort(this.sortByMulti(sortingConfig));

        this.data = clonedData;
    }

    sortByMulti({ fieldNames, sortDirections }) {
        return (a, b) => {
            for (let i = 0; i < fieldNames.length; i++) {
                const field = fieldNames[i];
                const direction = sortDirections[i] === 'asc' ? 1 : -1;

                let aVal = a[field];
                let bVal = b[field];

                aVal = aVal ?? '';
                bVal = bVal ?? '';

                const isNumber =
                    typeof aVal === 'number' && typeof bVal === 'number';

                const comparison = isNumber
                    ? aVal - bVal
                    : String(aVal).localeCompare(String(bVal));

                if (comparison !== 0) {
                    return comparison * direction;
                }
            }
            return 0;
        };
    }
}