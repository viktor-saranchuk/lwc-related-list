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

const DEFAULT_NUMBER_OF_RECORDS_TO_DISPLAY = 10;
export default class CustomRelatedList extends LightningElement {
    _mode;
    _type;
    _data;
    _numberOfRecordsToDisplay;
    _showListViewActionBar;

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
        this._data = value;
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
        return this._showListViewActionBar;
    }
    set showListViewActionBar(value) {
        this._showListViewActionBar = !!value && value !== 'false' && this.listViewActions && Array.isArray(this.listViewActions) && this.listViewActions.length
    }

    @api
    iconName;

    @api
    title;

    @api
    url;

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

    get compactTitle() {
        return `${this.title}${this.data ? ` (${this.data.length > this.numberOfRecordsToDisplay ? `${this.numberOfRecordsToDisplay}+` : this.data.length})` : ''}`
    }

    get firtsListViewActions() {
        return this.listViewActions?.slice(0, 3);
    }

    get remainingListViewAction() {
        return this.listViewActions?.slice(this.firtsListViewActions?.length);
    }
}