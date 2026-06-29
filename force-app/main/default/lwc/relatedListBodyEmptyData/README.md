# relatedListBodyEmptyData

A static empty-state illustration displayed when a related list has no records. Renders the standard SLDS large illustration layout with a fixed header and body message.

## Usage

```html
<c-related-list-body-empty-data></c-related-list-body-empty-data>
```

No properties required. Drop in as-is.

## API

No `@api` properties, events, or CSS tokens.

## Content

Labels are hardcoded internally and not configurable via properties:

| Label    | Value |
|----------|-------|
| `header` | `'Nothing to see here'` |
| `body`   | `'There's nothing in your list yet. Try adding a new record.'` |

## Notes

- The illustration SVG is inline and self-contained — no external assets.
- Uses SLDS illustration classes (`slds-illustration`, `slds-illustration_large`, `slds-illustration__stroke-secondary`, etc.) so appearance follows the active SLDS theme.
