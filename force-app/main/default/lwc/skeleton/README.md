# CSS Custom Tokens — Skeleton / Shimmer

Tokens used to style the skeleton loading state. All have defaults and are optional.

## Shimmer Animation

| Token                       | Default     | Description                                      |
|-----------------------------|-------------|--------------------------------------------------|
| `--skeleton-shimmer-color-1` | `#f3f3f3`  | Start and end color of the shimmer gradient      |
| `--skeleton-shimmer-color-2` | `#ecebeb`  | Mid-point (highlight) color of the shimmer       |
| `--skeleton-shimmer-color-3` | `#f3f3f3`  | Mirrors color-1; creates a smooth looping effect |

The three colors form a `90deg` linear gradient animating left-to-right over 1.2s.
Override all three together to retheme the shimmer (e.g. dark mode).

## Skeleton Size

| Token              | Default  | Description                        |
|--------------------|----------|------------------------------------|
| `--skeleton-width`  | `100%`  | Width of the skeleton placeholder  |
| `--skeleton-height` | `1rem`  | Height of the skeleton placeholder |

## Usage Example

```css
/* Dark mode override */
c-skeleton {
    --skeleton-shimmer-color-1: #2e2e2e;
    --skeleton-shimmer-color-2: #3a3a3a;
    --skeleton-shimmer-color-3: #2e2e2e;
}

/* Fixed-size skeleton block */
c-skeleton {
    --skeleton-width: 200px;
    --skeleton-height: 1.5rem;
}
```

## Notes

- Tokens are scoped to the component host — set them on the component selector or a parent.
- In LWC, CSS custom properties **cross the shadow boundary**, so parent styles apply.
- `border-radius: 4px` is hardcoded and not configurable via token.
