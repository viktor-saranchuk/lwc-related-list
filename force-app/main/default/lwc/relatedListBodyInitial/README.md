# relatedListBodyInitial

A skeleton loading state for a related list datatable. Renders a `lightning-datatable` with all columns forced to `skeleton` type and all rows disabled. Row count is either provided externally or calculated dynamically from available viewport height via `ResizeObserver`.

Fades out at the bottom via a CSS mask, and sets `--skeleton-width: 75%` so skeleton cells render at a realistic partial width.

## Usage

```html
<c-related-list-body-initial
    columns={tableColumns}
    number-of-rows={rowCount}
    show-row-number-column
    hide-checkbox-column>
</c-related-list-body-initial>
```

## API

### Properties (`@api`)

| Property              | Type      | Default | Description |
|-----------------------|-----------|---------|-------------|
| `columns`             | Object[]  | —       | Column definitions — see [Column shape](#column-shape). All columns are rendered as `skeleton` type; original `type` is overridden |
| `numberOfRows`        | Number    | —       | Fixed row count. When provided, auto-calculation and `ResizeObserver` are skipped entirely |
| `showRowNumberColumn` | Boolean   | —       | Passed through to `lightning-datatable` |
| `hideCheckboxColumn`  | Boolean   | —       | Passed through to `lightning-datatable` |

#### Column shape

Standard `lightning-datatable` column definition. The getter overrides a few fields before passing to the datatable:

| Field           | Override behaviour |
|-----------------|--------------------|
| `type`          | Always set to `'skeleton'` |
| `hideDefaultActions` | Always `true` |
| `sortable`      | Always `false` |
| `initialWidth`  | Preserved if already set. If absent: `50` for `action` columns, `undefined` for all others |

### CSS Custom Tokens

| Token              | Value  | Description |
|--------------------|--------|-------------|
| `--skeleton-width` | `75%`  | Set on `:host`; consumed by `c-skeleton-cell-type` to render cells at partial width, simulating real content |

This token is set internally and does not need to be provided by the parent. It can be overridden from outside if a different width is needed.

## Behaviour notes

- **Row count auto-calculation** — when `numberOfRows` is not set, row count is derived from available viewport height below the component: `Math.ceil((windowHeight - containerTop - headerHeight) / rowHeight)`, minimum 1. Constants: `ROW_HEIGHT_REM = 2`, `HEADER_HEIGHT_REM = 2`.
- **`ResizeObserver`** — attached in `renderedCallback` on first render (when `numberOfRows` is absent). Recalculates on container resize. Disconnected in `disconnectedCallback`.
- **Fade mask** — `:host` applies a vertical CSS mask (`black 30% → transparent 100%`) to give the skeleton a natural fade-out rather than a hard cutoff at the bottom.
- **`c-skeleton-cell-type`** — injected via `slot="customdatatypes"` to register the custom `skeleton` datatable column type. Must be present for the datatable to render correctly.
- **All rows disabled** — `disabledRows` always contains every row index, preventing interaction with skeleton rows.
- **`resize-column-disabled`** — hardcoded on the datatable; column resizing is not available in skeleton state.
