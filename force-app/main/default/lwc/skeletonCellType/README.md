# skeletonCellType

A `lightning-datatable` custom type registrar. Registers the `skeleton` column type, which renders a `c-skeleton` shimmer placeholder in every cell. Injected via the `customdatatypes` slot — not used standalone.

## Usage

Always used as a slot child of `lightning-datatable`:

```html
<lightning-datatable columns={columns} data={data} key-field="id">
    <c-skeleton-cell-type slot="customdatatypes"></c-skeleton-cell-type>
</lightning-datatable>
```

Columns using this type:

```javascript
columns = [
    { label: 'Name',   fieldName: 'name',   type: 'skeleton' },
    { label: 'Status', fieldName: 'status', type: 'skeleton' }
];
```

## API

### Methods (`@api`)

| Method          | Returns  | Description |
|-----------------|----------|-------------|
| `getDataTypes()` | Object  | Called by `lightning-datatable` during registration. Returns the type map consumed by the datatable |

#### Registered types

| Type key    | Template       | `standardCellLayout` | Description |
|-------------|----------------|----------------------|-------------|
| `skeleton`  | `skeletonCell` | `false`              | Renders `c-skeleton` shimmer in the cell; no standard cell chrome |

## Notes

- `skeletonCell` is a separate template file (`skeletonCell.html`) imported alongside the component — it renders `<c-skeleton>`.
- `standardCellLayout: false` gives full control of cell rendering to the template, bypassing the default datatable cell wrapper.
- `--skeleton-width` and shimmer tokens consumed by `c-skeleton` can be set on a parent — see [`c-skeleton` docs](../skeleton/README.md) and [`c-related-list-body-initial` docs](../relatedListBodyInitial/README.md).
