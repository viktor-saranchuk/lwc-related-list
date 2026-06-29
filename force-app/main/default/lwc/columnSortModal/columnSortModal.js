import { api } from 'lwc';
import LightningModal from 'lightning/modal';

import { LABELS, DEFAULT_COLUMN_LIMIT, DIRECTION_OPTIONS, COMBOBOX_COMPONENT, DEFAULT_NEW_COLUMN} from './constants'

export default class ColumnSortModal extends LightningModal {
    _applied;
    _initialApplied;
    _columnLimit;

    labels = LABELS;
    directions = DIRECTION_OPTIONS;

    @api
    options;

    hasDuplciates = false;
    hasEmpty = false;

    @api
    get applied() {
        const items = this._applied ?? [structuredClone(DEFAULT_NEW_COLUMN)];
        const last = items.length - 1;

        this.hasDuplciates = new Set(items.map(({value}) => value)).size !== items.length;
        this.hasEmpty = items.some(({value}) => !value);

        return (items).map((item, index) => ({
            ...item,
            upDisabled: index === 0,
            downDisabled: index === last,
            deleteDisabled: last === 0,
            key: `key-${index}`
        }));
    }
    set applied(value) {
        if (Array.isArray(value) && !!value.length) {
            this._applied = structuredClone(value);
            if (!this._initialApplied) {
                this._initialApplied = structuredClone(value);
            }
        } else {
            this._applied = [structuredClone(DEFAULT_NEW_COLUMN)];
            if (!this._initialApplied) {
                this._initialApplied = [structuredClone(DEFAULT_NEW_COLUMN)];
            }
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

    get hasChanges() {
        return JSON.stringify(this._applied) !== JSON.stringify(this._initialApplied);
    }

    get limitReached() {
        return this.applied.length === this.columnLimit;
    }

    get addSortColumnDisabled() {
        return this.limitReached || this.hasDuplciates || this.hasEmpty;
    }

    get applyDisabled() {
        return this.hasDuplciates || this.hasEmpty || !this.hasChanges;
    }

    get clearDisabled() {
        return this.applied.length === 1 && !this.applied[0].value;
    }

    moveUp(event) {
        const index = +event.target.dataset.index;
        const applied = [...this._applied];
        [applied[index], applied[index - 1]] = [applied[index - 1], applied[index]];
        this.applied = applied;
    }

    moveDown() {
        const index = +event.target.dataset.index;
        const applied = [...this._applied];
        [applied[index], applied[index + 1]] = [applied[index + 1], applied[index]];
        this.applied = applied;
    }

    changeColumn(event) {
        const duplicate = this.applied.find(({value}) => value === event.detail.value);

        this._applied[+event.target.dataset.index] = {
            ...structuredClone(this.options.find(({value}) => value === event.detail.value)),
            direction: this._applied[+event.target.dataset.index].direction
        };
        this.applied = [...this._applied];

        event.target.setCustomValidity(!!duplicate ? this.labels.selectColumnThatYouHaventSelected : '');
        event.target.reportValidity();
    }
    
    changeDirection(event) {
        this._applied[+event.target.dataset.index].direction = event.detail.value;
        this.applied = [...this._applied];
    }

    deleteItem(event) {
        this._applied.splice(+event.target.dataset.index, 1);
        this.applied = [...this._applied];
    }

    async addItem() {
        this._applied.push(structuredClone(DEFAULT_NEW_COLUMN));
        this.applied = [...this._applied];
        await Promise.resolve();
        [...this.template.querySelectorAll(COMBOBOX_COMPONENT)].at(-1)?.focus();
    }

    handleClear() {
        this.applied = [structuredClone(DEFAULT_NEW_COLUMN)];
    }

    handleCancel() {
        this.close();
    }

    handleApply() {
        this.close(structuredClone(this._applied));
    }
}