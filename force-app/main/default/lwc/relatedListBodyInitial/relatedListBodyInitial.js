import { LightningElement, api } from 'lwc';

const ROW_HEIGHT_REM = 2;
const HEADER_HEIGHT_REM = 2;

const CSS_CLASS__CARD_BODY_DESKTOP = 'card-body-desktop';
const TABLE_TYPE__SKELETON = 'skeleton';

export default class RelatedListBodyInitial extends LightningElement {
    _columns;
    _numberOfRows = 0;
    _numberOfRowsCalculated = false;
    _resizeObserver = null;

    @api
    get columns() {
        return this._columns?.map((column) => ({
            ...column,
            type: TABLE_TYPE__SKELETON,
            hideDefaultActions: true,
            sortable: false,
            initialWidth: Object.hasOwn(column, 'initialWidth') ? column.initialWidth : (column.type === 'action' ? 50 : undefined)
        }));
    }
    set columns(value) {
        this._columns = value;
    }

    @api
    numberOfRows;

    @api
    showRowNumberColumn;

    @api
    hideCheckboxColumn;

    get rows() {
        return Array.from({ length: this.numberOfRows ?? this._numberOfRows }, (_, i) => ({ index: i }));
    }

    get disabledRows() {
        return this.rows?.map(({index}) => index) ?? [];
    }

    get container() {
        return this.template.querySelector(`.${CSS_CLASS__CARD_BODY_DESKTOP}`);
    }

    calculateRows() {
        if (!this.container) return;

        const remPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
        const top = this.container.getBoundingClientRect().top;
        const availableHeight = window.innerHeight - top;
        const rowHeightPx = ROW_HEIGHT_REM * remPx;
        const headerHeightPx = HEADER_HEIGHT_REM * remPx;

        const calculated = Math.ceil((availableHeight - headerHeightPx) / rowHeightPx);
        this._numberOfRows = Math.max(1, calculated);
    }

    renderedCallback() {
        if (this.numberOfRows || this._numberOfRowsCalculated) return;

        this.calculateRows();
        
        if (!this.container) return;

        this._resizeObserver = new ResizeObserver(() => this.calculateRows());
        this._resizeObserver.observe(this.container);
        this._numberOfRowsCalculated = true;
    }

    disconnectedCallback() {
        this._resizeObserver?.disconnect();
    }
}