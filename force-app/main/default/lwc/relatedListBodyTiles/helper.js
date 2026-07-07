export const createTileData = (data, rowActions, columns) => {
    return data.map(record => ({
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
                    !['Id', 'Name'].includes(fieldName) && !['action', 'button', 'button-icon'].includes(type)
            ).slice(0, 3).map(
                column => ({
                    column: {
                        ...column,
                        typeAttributes: column.typeAttributes ?? {}
                    },
                    value: record[column.fieldName],
                    get isBoolean() {
                        return column.type === 'boolean';
                    },
                    get isDate() {
                        return column.type === 'date';
                    },
                    get isEmail() {
                        return column.type === 'email';
                    },
                    get isLocation() {
                        return column.type === 'location';
                    },
                    get isNumber() {
                        return ['currency', 'number', 'percent'].includes(column.type);
                    },
                    get isPhone() {
                        return column.type === 'phone';
                    },
                    get isUrl() {
                        return column.type === 'url';
                    },
                    get isText() {
                        return !(this.isBoolean || this.isDate || this.isEmail || this.isLocation || this.isNumber || this.isPhone || this.isUrl);
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
