import { LightningElement, api } from 'lwc';

import { createTileData } from './helper'

export default class RelatedListBodyTiles extends LightningElement {
    _data;
    _columns;

    @api
    iconName;

    @api
    get data() {
        const rowActions = this.columns?.find(({ type }) => type === 'action')?.typeAttributes?.rowActions;
        return createTileData(this._data, rowActions);
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

    handleSelect(event) {
        const tile = this.data.find(({id}) => id === event.target.dataset.id);
        this.dispatchEvent(new CustomEvent('rowaction', {
            detail: {
                action: tile.actions.find(({name}) => name === event.detail.value),
                row: tile.record
            }
        }));
    }
}