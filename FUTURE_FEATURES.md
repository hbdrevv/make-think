# Future Features

Local reference for planned enhancements. Not committed to repo.

---

## Work Completed This Branch

### Content Block Media Support

Extended the Content block to support media in columns alongside text.

**Schema additions to columns:**
- `contentType`: 'text' | 'media' | 'empty'
- `media.image`: Upload relationship
- `media.contain`: Checkbox to switch from cover to contain mode
- `media.height`: 'sm' | 'md' | 'lg' (conditional, shown when contain is checked)
- `media.caption`: Plain text, left-aligned below image
- `media.decorative`: Checkbox for empty alt text (a11y)

**Key design decisions:**

1. **Aspect ratios derived from column width** — No per-item aspect ratio picker. Column size determines ratio:
   - oneThird → 3:4 (portrait)
   - half → 4:3 (landscape)
   - twoThirds → 4:3 (landscape)
   - full → 16:9 (cinematic)

2. **Cover vs Contain modes:**
   - Cover (default): Image fills aspect ratio container, crops with object-cover
   - Contain (override): Full image visible, constrained to height scale (sm/md/lg)

3. **Contain uses max-height, not fixed height** — This ensures captions always sit directly below the image, not at the bottom of a fixed container. Uses CSS custom property: `--contain-height` with clamp values.

4. **Empty columns for negative space** — Third content type option. Hidden on mobile (`hidden lg:block`) to avoid wasted vertical space.

5. **Global vertical alignment via SiteSettings** — Column alignment (top/center/bottom) is site-wide, not per-block. Reduces editor decisions, ensures consistency.

6. **Contain mode respects global alignment** — Uses `object-top`, `object-center`, or `object-bottom` based on SiteSettings.

7. **Row labels show content type and width** — "Text (1/2)", "Media (Full)", "Empty (1/3)" for quick scanning in collapsed state.

### SiteSettings Global

Created new global for site-wide design settings.

**Files:**
- `src/SiteSettings/config.ts`
- `src/SiteSettings/hooks/revalidateSiteSettings.ts`

**Current fields:**
- `columnVerticalAlign`: 'top' | 'center' | 'bottom'

**Design rationale:**
- Single source of truth for design tokens that should be consistent across a site
- CMS-editable without code deployment
- Positioned as foundation for multi-site starter kit — each deployment can customize

### CTA Block Adjustment

Changed container from full-width to `w-fit max-w-full` so it wraps content tightly instead of spanning full width.

---

## Focal Point Support for Media

**Status:** Data stored, UI available, rendering not implemented

**Background:**
- Media collection has `focalX` and `focalY` fields (0-1 range)
- Payload admin has focal point picker UI (`focalPoint: true` in upload config)
- Applying `objectPosition` style in `ImageMedia` component breaks hero and carousel rendering

**Investigation needed:**
- Why does adding `style={{ objectPosition }}` to NextImage break rendering?
- May be related to Next.js Image component internals or SSR hydration

**Potential solutions:**
1. Fix globally in `src/components/Media/ImageMedia/index.tsx`
2. Apply only in Content block component (targeted, lower risk)
3. Use CSS custom properties instead of inline styles

---

## SiteSettings Extensions

**Current:** Column vertical alignment (top/center/bottom)

**Potential additions:**

### Grid & Layout
- `gridGap` — gap spacing (sm/md/lg or custom values)
- `containerMaxWidth` — max content width
- `breakpoints` — custom responsive breakpoints

### Media Defaults
- `defaultContainHeight` — default height scale for contain mode
- `defaultAspectRatios` — override column→ratio mappings per site

### Typography
- `captionAlignment` — left/center/right (currently hardcoded left)
- `captionSize` — text size scale

---

## Content Block Enhancements

### Additional Column Content Types
- **Embed** — YouTube, Vimeo, or other embeds
- **Code** — syntax highlighted code blocks
- **Quote** — styled blockquote with attribution

### Responsive Aspect Ratios
- Allow aspect ratio to change at breakpoints
- Example: 16:9 on desktop → 4:3 on tablet → 1:1 on mobile
- Focal point becomes critical for this

### Column Ordering
- Mobile-specific column order override
- Example: image first on mobile, text first on desktop

---

## Media Carousel / Works Carousel

### Unified Component
- Consider merging MediaCarousel and WorksCarousel into one flexible component
- Configurable slide content (image only, image+caption, work card)

### Video Support in Content Columns
- Currently images only (video handled by MediaBlock)
- Could add video support with autoplay/loop/muted options

---

## Technical Notes & Gotchas

### Aspect Ratio Implementation

**Cover mode uses padding-bottom trick:**
```css
padding-bottom: 75%; /* 4:3 ratio */
```
More reliable than `aspect-ratio` CSS property when used with Next.js Image `fill` mode.

**Contain mode uses max-height with CSS custom property:**
```jsx
<div
  className="[&_img]:max-h-[var(--contain-height)]"
  style={{ '--contain-height': 'clamp(320px, 40vw, 480px)' }}
>
```
This lets the image determine its natural height up to the max, so captions follow directly.

### Media Component Architecture

- `src/components/Media/index.tsx` — Router (image vs video)
- `src/components/Media/ImageMedia/index.tsx` — Image rendering with Next.js Image
- `src/components/Media/VideoMedia/index.tsx` — Video rendering

**Critical:** Changes to ImageMedia affect ALL media site-wide (hero, carousels, content blocks, etc.). Test thoroughly.

### URL Resolution for S3/R2

Media URLs are resolved via `getPublicMediaURLFromResource()`. In production with S3/R2, this constructs CDN URLs from `NEXT_PUBLIC_S3_PUBLIC_URL`. Locally, it uses `/media/filename`.

### Global Fetching Pattern

```typescript
const siteSettings = await getCachedGlobal('site-settings', 0)()
```
- Uses Next.js `unstable_cache` with tag-based revalidation
- Revalidation hook triggers on save: `revalidateTag('global_site-settings')`

### Conditional Fields in Payload

Used extensively for clean editor UX:
```typescript
admin: {
  condition: (_data, siblingData) => siblingData?.contentType === 'media',
}
```

---

## Notes

- SiteSettings global is designed to scale — add fields as needed
- Keep editor UI simple — hide complexity behind sensible defaults
- Test changes to ImageMedia carefully — it affects entire site
- When adding new content types, update RowLabel component to display them
