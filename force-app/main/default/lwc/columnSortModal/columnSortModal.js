import { api } from 'lwc';
import LightningModal from 'lightning/modal';

import { LABELS, DEFAULT_COLUMN_LIMIT, DEFAULT_DIRECTION, DIRECTION_OPTIONS } from './constants'

export default class ColumnSortModal extends LightningModal {
    _applied;
    _columnLimit;

    labels = LABELS;
    directionOptions = DIRECTION_OPTIONS;

    @api
    options;

    @api
    get applied() {
        const last = (this._applied ?? [{direction: DEFAULT_DIRECTION}]).length - 1;
        return (this._applied ?? [{direction: DEFAULT_DIRECTION}]).map((item, index) => ({
            ...item,
            upDisabled: index === 0,
            downDisabled: index === last,
            deleteDisabled: last === 0
        }));
    }
    set applied(value) {
        if (Array.isArray(value) && !!value.length) {
            this._applied = structuredClone(value);
        }
    }

    @api
    get columnLimit() {
        return this._columnLimit || DEFAULT_COLUMN_LIMIT;
    }
    set columnLimit(value) {
        if (Number.isInteger(value) && value > 0) {
            this._columnLimit = value;
        }
    }

    get isAppliedEmpty() {
        return this.applied.length === 1 && !this.applied[0].fieldName;
    }

    moveUp() {

    }

    moveDown() {

    }

    deleteItem() {

    }

    handleClear() {
        console.log('here', 'handleClear', 'NOT IMPLEMENTED');
    }

    handleCancel() {
        this.close();
    }

    handleApply() {
        console.log('here', 'handleApply', 'NOT IMPLEMENTED');
    }
}