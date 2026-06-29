# radioGroup

A custom radio button group component rendering a horizontal list of labeled radio inputs.

## Usage

```html
<c-radio-group
    name="priority"
    value={selectedValue}
    options={radioOptions}
    onchange={handleChange}>
</c-radio-group>
```

```javascript
radioOptions = [
    { value: 'low',    label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high',   label: 'High' },
];
```

## API

### Properties (`@api`)

| Property  | Type     | Default | Description                                                                 |
|-----------|----------|---------|-----------------------------------------------------------------------------|
| `name`    | String   | —       | Logical name for the group. Unused for native radio grouping — component uses an internal `instanceId` (`crypto.randomUUID()`) as the `name` attribute on inputs to prevent conflicts when multiple instances are on the same page |
| `value`   | String   | —       | Value of the currently selected option. Drives `checked` state on render    |
| `options` | Object[] | `[]`    | Array of option descriptors — see [Option shape](#option-shape) below        |

#### Option shape

| Field   | Type   | Description                              |
|---------|--------|------------------------------------------|
| `value` | String | Submitted value; matched against `value` prop to determine `checked` state |
| `label` | String | Display text rendered next to the radio input |

### Events

| Event    | Detail shape        | Description                          |
|----------|---------------------|--------------------------------------|
| `change` | `{ value: String }` | Fired when the user selects an option |

## CSS Custom Tokens

| Token                      | Default                          | Description                                      |
|----------------------------|----------------------------------|--------------------------------------------------|
| `--radio-group-height`      | `2rem`                          | Host element height                              |
| `--radio-group-line-height` | `2rem`                          | Host element line-height; aligns text vertically |
| `--radio-group-gap`         | `--slds-g-spacing-4` → `1rem`   | Gap between radio options in the group           |
| `--radio-option-gap`        | `--slds-g-spacing-1` → `.25rem` | Gap between the radio input and its label        |

`--radio-group-gap` and `--radio-option-gap` fall back to SLDS spacing tokens when available, then to a hardcoded value.

### Token usage example

```css
c-radio-group {
    --radio-group-height: 2.5rem;
    --radio-group-line-height: 2.5rem;
    --radio-group-gap: 1.5rem;
    --radio-option-gap: .5rem;
}
```

## Notes

- Options array is validated — non-array values are silently ignored.
- `checked` state is computed on read from `options` getter; mutating the array externally has no effect without re-assigning the `options` property.
- CSS custom properties cross the LWC shadow boundary — set tokens on the component selector from a parent stylesheet.
