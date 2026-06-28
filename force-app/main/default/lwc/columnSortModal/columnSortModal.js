import { api } from 'lwc';
import LightningModal from 'lightning/modal';

import { LABELS, DEFAULT_COLUMN_LIMIT, DEFAULT_SORT_DIRECTION } from './constants'

export default class ColumnSortModal extends LightningModal {
    _applied;
    _columnLimit;

    labels = LABELS;

    @api
    options;

    @api
    get applied() {
        return this._applied ?? [{DEFAULT_SORT_DIRECTION}];
    }
    set applied(value) {
        if (Array.isArray(value) && !!value.length) {
            this._applied = value;
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