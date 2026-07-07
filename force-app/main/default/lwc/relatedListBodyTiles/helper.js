export const createTileData = (data, rowActions) => {
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
