import { LightningElement, api } from 'lwc';
import FORM_FACTOR from "@salesforce/client/formFactor";

const VIEW_MODE = {
    compact: 'compact',
    full: 'full'
}

const TYPE = {
    basic: 'basic',
    enhanced: 'enhanced',
    tiles: 'tiles'
}

export default class CustomRelatedListBody extends LightningElement {
    _mode;
    _type;
    _data;
    _columns;

    @api
    get mode() {
        return this._mode || VIEW_MODE.compact;
    }
    set mode(value) {
        if (value && Object.values(VIEW_MODE).includes(value)) {
            this._mode = value;
        }
    }

    @api
    get type() {
        return this._type || TYPE.basic;
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
        return this._columns?.map((item, index) => ({
            ...item,
            key: `item-${index}`
        }));
    }
    set columns(value) {
        if (Array.isArray(value)) {
            this._columns = value;
        }
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

    get listType() {
        return {
            isBasic: this.type === TYPE.basic,
            isEnhanced: this.type === TYPE.enhanced,
            isTiles: this.type === TYPE.tiles
        }
    }

    get skeletonLines() {
        return Array.from({length: (this.viewMode.isCompact ? 6 : 50) - 1}, (_, i) => i + 1);
    }
}