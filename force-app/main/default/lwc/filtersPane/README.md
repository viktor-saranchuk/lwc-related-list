# filtersPane

A slide-in filter panel rendering a dynamic list of quick filters. Supports text, tel, date (start/end range), number (min/max range), and checkbox group inputs. Maintains draft state per instance across DOM removal/re-insertion via module-level cache.

## Usage

```html
<c-filters-pane
    instance-id={filtersInstanceId}
    filters={filterDefs}
    onapply={handleApply}
    onclose={handleClose}>
</c-filters-pane>
```

## API

### Properties (`@api`)

| Property     | Type     | Default | Description |
|--------------|----------|---------|-------------|
| `instanceId` | String   | —       | Unique key used to persist draft filter state in a module-level `Map`. Required when the component may be removed and re-inserted (e.g. toggled visibility). Use the same value across mounts to restore state |
| `filters`    | Object[] | `[]`    | Array of filter descriptors — see [Filter shape](#filter-shape) below |

#### Filter shape

The setter validates entries and enriches them. Only filters with a recognized `type` are kept (unknown types are dropped silently).

| Field            | Type             | Required | Description |
|------------------|------------------|----------|-------------|
| `name`           | String           | ✓        | Unique identifier for the filter; used as `data-name` and key |
| `label`          | String           | ✓        | Display label |
| `type`           | `FILTER_TYPES`   |          | Input type — see [Filter types](#filter-types). Defaults to `text` |
| `value`          | String \| Object \| Array | | Initial value. For range types, can be a plain object with the correct sub-keys or a scalar (applied to both sub-fields) |
| `placeholder`    | String           |          | Input placeholder |
| `disabled`       | Boolean          |          | Disables the input |
| `fieldLevelHelp` | String           |          | Tooltip shown via field-level help icon |
| `formatter`      | String           |          | `lightning-input` formatter (number type) |
| `inputmode`      | String           |          | HTML `inputmode` attribute |
| `max`            | String \| Number |          | Max value / date |
| `min`            | String \| Number |          | Min value / date |
| `maxLength`      | Number           |          | Max character length (text/tel) |
| `minLength`      | Number           |          | Min character length (text/tel) |
| `pattern`        | String           |          | Validation regex pattern. Falls back to a built-in pattern per type (tel: `[^a-zA-Z]{0,15}`) |
| `autocomplete`   | String           |          | HTML `autocomplete` attribute |
| `checked`        | Boolean          |          | Initial checked state (checkbox type) |
| `indeterminate`  | Boolean          |          | Indeterminate state (checkbox type) |
| `step`           | Number           |          | Step for number inputs |
| `dateAccessKey`  | String           |          | `date-access-key` passed to `lightning-input` |
| `dateStyle`      | String           |          | `date-style` passed to `lightning-input` |
| `options`        | Object[]         |          | Options for `checkboxgroup` type — `{ label, value }` |
| `variant`        | String           |          | `lightning-checkbox-group` variant |

#### Filter types

Exported as `FILTER_TYPES` from the component module:

```javascript
import { FILTER_TYPES } from 'c/filtersPane';
```

| Constant        | Value           | Renders                            | Value shape                        |
|-----------------|-----------------|------------------------------------|------------------------------------|
| `text`          | `'text'`        | Single `lightning-input`           | `String`                           |
| `tel`           | `'tel'`         | Single `lightning-input`           | `String`                           |
| `date`          | `'date'`        | Two `lightning-input` (Start / End) | `{ start: String, end: String }`  |
| `number`        | `'number'`      | Two `lightning-input` (Min / Max)  | `{ min: String, max: String }`    |
| `checkboxgroup` | `'checkboxgroup'` | `lightning-checkbox-group`       | `String[]`                         |

### Events

| Event   | Detail shape              | Description |
|---------|---------------------------|-------------|
| `apply` | `{ filters: Object[] }`   | Fired when the user clicks **Apply** and all inputs are valid. `filters` is the full enriched filter array with current values merged in |
| `close` | —                         | Fired when the user clicks the **×** close button |

## Behaviour notes

- **Draft state** — changes are held as drafts until **Apply** is clicked. Clicking **Cancel** discards drafts. The footer only appears when there are active filter values or pending drafts.
- **State persistence** — drafts survive DOM removal/re-insertion via a module-level `Map` keyed by `instanceId`. Provide a stable `instanceId` to restore state across toggles.
- **Validation** — **Apply** is blocked if any `lightning-input` fails `checkValidity()`. Invalid date inputs are cleared automatically on change.
- **Focus management** — on mount the close button receives focus (`focusClose` flag, cleared after first render).
- **Clear per filter** — a **Clear** button appears per filter only when that filter has a value (`hasValue`). For ranges, having either sub-field set counts as having a value.
- **Clear all** — visible in the footer when any filter has a value. Delegates to per-filter clear logic.
