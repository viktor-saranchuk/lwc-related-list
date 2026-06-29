export const LABELS = {
    addSortColumn: 'Add a sort column',
    apply: 'Apply',
    ascending: 'Ascending',
    cancel: 'Cancel',
    clear: 'Clear',
    columnLimit: 'column limit',
    columnLimitReached: 'column limit reached',
    columnSort: 'Column Sort',
    descending: 'Descending',
    moveSortColumnDown: 'Move sort column down',
    moveSortColumnUp: 'Move sort column up',
    selectColumn: 'Select a column',
    selectColumnOrDeleteSortItem: 'Select a column or delete this sort item.',
    selectColumnThatYouHaventSelected: 'Select a column that you haven\'t already selected.',
    sortBy: 'Sort by',
    thenBy: 'Then by'
};

export const DEFAULT_COLUMN_LIMIT = 5;

export const DEFAULT_DIRECTION = 'asc';

export const DEFAULT_NEW_COLUMN = {
    value: null,
    direction: DEFAULT_DIRECTION
}

export const DIRECTION_OPTIONS = [
    {label: 'Ascending', value: 'asc'},
    {label: 'Descending', value: 'desc'}
];

export const COMBOBOX_COMPONENT = 'lightning-combobox';