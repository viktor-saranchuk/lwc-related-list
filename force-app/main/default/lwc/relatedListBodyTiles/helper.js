import { UNSUPPORTED_FIELDS, UNSUPPORTED_COLUMN_TYPES, SUPPORTED_COLUMN_TYPES } from './constants';

export const createTileData = (data, rowActions, columns) => {
    return data?.map(record => ({
        record,
        actions: getTileRowActions(record, rowActions),
        get id() {
            return record.Id
        },
        get title() {
            return {
                label: record.Name,
                value: `/${record.Id}`
            }
        },
        get fields() {
            return columns?.filter(
                ({fieldName, type}) => 
                    !UNSUPPORTED_FIELDS.includes(fieldName) && !UNSUPPORTED_COLUMN_TYPES.includes(type)
            ).slice(0, 3).map(
                column => ({
                    column: {
                        ...column,
                        typeAttributes: column.typeAttributes ?? {}
                    },
                    value: record[column.fieldName],
                    label: record[column?.typeAttributes?.label?.fieldName],
                    tooltip: record[column?.typeAttributes?.toolip?.fieldName],
                    latitude: record[column?.typeAttributes?.latitude?.fieldName],
                    longitude: record[column?.typeAttributes?.longitude?.fieldName],
                    get isBoolean() {
                        return column.type === SUPPORTED_COLUMN_TYPES.boolean;
                    },
                    get isDate() {
                        return column.type === SUPPORTED_COLUMN_TYPES.date;
                    },
                    get isEmail() {
                        return column.type === SUPPORTED_COLUMN_TYPES.email;
                    },
                    get isLocation() {
                        return column.type === SUPPORTED_COLUMN_TYPES.location;
                    },
                    get isNumber() {
                        return [SUPPORTED_COLUMN_TYPES.currency, SUPPORTED_COLUMN_TYPES.number, SUPPORTED_COLUMN_TYPES.percent].includes(column.type);
                    },
                    get isPhone() {
                        return column.type === SUPPORTED_COLUMN_TYPES.phone;
                    },
                    get isUrl() {
                        return column.type === SUPPORTED_COLUMN_TYPES.url;
                    },
                    get isText() {
                        return SUPPORTED_COLUMN_TYPES.text || !(this.isBoolean || this.isDate || this.isEmail || this.isLocation || this.isNumber || this.isPhone || this.isUrl);
                    }
                })
            );
        }
    }));
}

export const getTileRowActions = (record, rowActions) => {
    if (Array.isArray(rowActions)) return rowActions;
    if (typeof rowActions === 'function') {
        let result = [];
        rowActions(record, (resolved) => { result = resolved ?? []; });
        return result;
    }
    return [];
}
