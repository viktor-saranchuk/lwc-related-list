import { LightningElement, api } from 'lwc';

export default class RelatedListBodyInitial extends LightningElement {
    _columns;

    @api
    get columns() {
        return this._columns?.map((item, index) => ({
            ...item,
            key: `item-${index}`
        }));
    }
    set columns(value) {
        this._columns = value;
    }

    @api
    numberOfRows;

    get rows() {
        return Array.from({length: (this.numberOfRows)}, (_, i) => i + 1);
    }
}