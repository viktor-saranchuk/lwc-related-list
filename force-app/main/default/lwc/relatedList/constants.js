import formFactor from "@salesforce/client/formFactor";
import { FILTER_TYPES } from 'c/filtersPane';

export const DEFAULT_NUMBER_OF_ACTION_BUTTONS = 3;

export const DEFAULT_SORT_CONFIG = {
    isMultiColumnSort: false,
    fieldName: null,
    fieldNames: null,
    sortDirection: null,
    sortDirections: null
};

export const FORM_FACTOR = {
    isSmall: formFactor === 'Small',
    isMedium: formFactor === 'Medium',
    isLarge: formFactor === 'Large'
};

export const ICON_SIZE = {
    small: 'small',
    medium: 'medium'
};

export const LABELS = {
    columnSort: 'Column Sort',
    listViewControls: 'List View Controls',
    loading: 'Loading',
    refresh: 'Refresh',
    resetColumnSorting: 'Reset Column Sorting',
    resetColumnWidths: 'Reset Column Widths',
    showQuickFilters: 'Show Quick Filters',
    updatedAFewSecondsAgo: 'Updated a few seconds ago',
    updatedAMinuteAgo: 'Updated a minute ago',
    updatedAnHourAgo: 'Updated an hour ago',
    updatedLongTimeAgo: 'Updated long time ago',
    viewAll: 'View All'
};

export const LIST_TYPE = {
    basic: 'basic',
    enhanced: 'enhanced',
    tiles: 'tiles'
};

export const PAGE_TYPE = {
    standardRecordPage: 'standard__recordPage',
    standardComponent: 'standard__component'
};

export const VIEW_MODE = {
    compact: 'compact',
    full: 'full'
};

export const CONTROLS = {
    columnSort: {
        label: LABELS.columnSort,
        name: 'columnsort',
        iconName: 'utility:sort'
    },
    listViewControls: {
        label: LABELS.listViewControls,
        name: 'listviewcontrols',
        iconName: 'utility:settings'
    },
    refresh: {
        label: LABELS.refresh,
        name: 'refresh',
        iconName: 'utility:refresh'
    },
    resetColumnSorting: {
        label: LABELS.resetColumnSorting,
        name: 'resetcolumnsorting'
    },
    resetColumnWidths: {
        label: LABELS.resetColumnWidths,
        name: 'resetcolumnwidths'
    },
    showQuickFilters: {
        label: LABELS.showQuickFilters,
        name: 'showquickfilters',
        iconName: 'utility:filterList'
    }
};

export const COLUMN_FILTER_TYPES_MAPPING = {
    boolean: FILTER_TYPES.checkboxgroup,
    currency: FILTER_TYPES.number,
    date: FILTER_TYPES.date,
    email: FILTER_TYPES.text,
    number: FILTER_TYPES.number,
    percent: FILTER_TYPES.number,
    phone: FILTER_TYPES.tel,
    text: FILTER_TYPES.text,
    url: FILTER_TYPES.text
}