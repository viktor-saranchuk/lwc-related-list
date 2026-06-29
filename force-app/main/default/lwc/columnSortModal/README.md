# columnSortModal

A `LightningModal` subclass for configuring multi-column sort order. Renders a list of sort items (column + direction), each reorderable and removable. Closes with the applied sort configuration or `undefined` on cancel.

## Usage

Open imperatively via `LightningModal.open()`:

```javascript
import ColumnSortModal from 'c/columnSortModal';

const result = await ColumnSortModal.open({
    options: this.columnOptions,
    applied: this.currentSort,
    columnLimit: 3
});

// result is undefined when cancelled, or SortItem[] when applied
if (result) {
    this.currentSort = result;
}
```

## API

### Properties (`@api`)

| Property      | Type         | Default | Description |
|---------------|--------------|---------|-------------|
| `options`     | Option[]     | —       | Available columns to sort by — see [Option shape](#option-shape). Passed to each row's combobox |
| `applied`     | SortItem[]   | `[{ value: null, direction: 'asc' }]` | Current sort configuration. Non-empty arrays are deep-cloned on set; the initial value is snapshot for change detection. Invalid values fall back to a single empty item |
| `columnLimit` | Number (int) | `5`     | Maximum number of sort items allowed. Must be a positive integer; invalid values are ignored and the default is used |

#### Option shape

Matches `lightning-combobox` option format. The full option object is merged into the sort item on column selection, so any extra fields you include will be present in the `close()` result.

| Field   | Type   | Description              |
|---------|--------|--------------------------|
| `label` | String | Display label in combobox |
| `value` | String | Column identifier         |

#### SortItem shape

| Field       | Type                | Description |
|-------------|---------------------|-------------|
| `value`     | String \| null      | Column value matching an entry in `options` |
| `direction` | `'asc'` \| `'desc'` | Sort direction. Defaults to `'asc'` |

### Return value (`close`)

| Scenario        | Value         |
|-----------------|---------------|
| **Apply**       | `SortItem[]` — deep clone of the configured sort items |
| **Cancel**      | `undefined`   |

## Behaviour notes

- **Change detection** — **Apply** is disabled until the current state differs from the initially set `applied` value (compared via `JSON.stringify`).
- **Validation** — **Apply** and **Add a sort column** are both disabled when any item has no column selected or when duplicate columns exist. Duplicate selection is also reported inline via `setCustomValidity` on the affected combobox.
- **Column limit** — once `columnLimit` is reached, **Add a sort column** is disabled and a destructive "limit reached" message is shown. Below the limit, the current count and limit are shown in a neutral style.
- **Reordering** — up/down arrow buttons move items; the first item's up and the last item's down buttons are disabled. The single remaining item's delete button is also disabled.
- **Clear** — resets to a single empty sort item (same as initial state for an empty `applied`). Disabled when already in that state.
- **Focus** — after adding a new sort item, focus is moved to the last combobox automatically (async, after re-render).
