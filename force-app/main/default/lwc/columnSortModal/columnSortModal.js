import { api } from 'lwc';
import LightningModal from 'lightning/modal';

import { LABELS, DEFAULT_COLUMN_LIMIT, DEFAULT_DIRECTION, DIRECTION_OPTIONS } from './constants'

export default class ColumnSortModal extends LightningModal {
    _applied;
    _columnLimit;

    labels = LABELS;
    directions = DIRECTION_OPTIONS;

    @api
    options;

    @api
    get applied() {
        const items = this._applied ?? [{direction: DEFAULT_DIRECTION}];
        const last = items.length - 1;
        return (items).map((item, index) => ({
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

    changeColumn(event) {
        this._applied[+event.target.dataset.index] = {
            ...structuredClone(this.options.find(({value}) => value === event.detail.value)),
            direction: this._applied[+event.target.dataset.index].direction
        };
        this.applied = [...this._applied];
    }
    
    changeDirection(event) {
        this._applied[+event.target.dataset.index].direction = event.detail.value;
        this.applied = [...this._applied];
    }

    deleteItem(event) {
        this._applied.splice(+event.target.dataset.index, 1);
        this.applied = [...this._applied];
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