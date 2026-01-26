# MakeThink Design Token System

A plan to create a tokenized design system that syncs between Figma and the codebase.

---

## Current State

### What Exists
- **CSS Custom Properties** in `globals.css` (colors, radius)
- **Tailwind config** references variables via `hsl(var(--token))`
- **Light/dark themes** via `[data-theme]` attribute
- **Geist font family** (sans + mono)

### What's Missing
- Tokens not in a portable format (JSON)
- No single source of truth
- Spacing, typography, shadows not tokenized
- No Figma sync tooling

---

## Recommended Approach

### Token Format: W3C Design Tokens (DTCG)

Use the emerging [W3C Design Token Community Group](https://tr.designtokens.org/format/) format. This is supported by:
- **Tokens Studio for Figma** (free plugin)
- **Style Dictionary** (build tool)
- Most modern design token tools

### Sync Flow

```
┌─────────────────┐      sync       ┌─────────────────┐
│                 │ ◄─────────────► │                 │
│  Figma          │                 │  tokens/        │
│  (Tokens Studio)│                 │  ├── color.json │
│                 │                 │  ├── space.json │
└─────────────────┘                 │  ├── type.json  │
                                    │  └── ...        │
                                    └────────┬────────┘
                                             │
                                             ▼ build (Style Dictionary)
                    ┌────────────────────────────────────────┐
                    │                                        │
                    │  Generated Outputs:                    │
                    │  • src/styles/variables.css            │
                    │  • src/styles/tokens.ts                │
                    │  • tailwind.config tokens              │
                    │                                        │
                    └────────────────────────────────────────┘
```

---

## Token Structure

### Recommended Categories

```
tokens/
├── color/
│   ├── primitives.json    # Raw color palette (gray-50, blue-500, etc.)
│   └── semantic.json      # Applied colors (background, foreground, primary)
├── space.json             # 4, 8, 12, 16, 24, 32, 48, 64, 96, 128
├── typography/
│   ├── font-family.json   # sans, mono
│   ├── font-size.json     # xs, sm, base, lg, xl, 2xl, 3xl, 4xl
│   ├── font-weight.json   # normal, medium, semibold, bold
│   ├── line-height.json   # tight, normal, relaxed
│   └── letter-spacing.json
├── radius.json            # none, sm, md, lg, xl, full
├── shadow.json            # sm, md, lg, xl
└── motion.json            # duration, easing
```

### Example Token File (W3C Format)

**tokens/color/semantic.json**
```json
{
  "color": {
    "background": {
      "$value": "{color.primitive.white}",
      "$type": "color",
      "$description": "Default page background"
    },
    "foreground": {
      "$value": "{color.primitive.gray-900}",
      "$type": "color"
    },
    "primary": {
      "DEFAULT": {
        "$value": "{color.primitive.gray-900}",
        "$type": "color"
      },
      "foreground": {
        "$value": "{color.primitive.white}",
        "$type": "color"
      }
    },
    "muted": {
      "DEFAULT": {
        "$value": "{color.primitive.gray-100}",
        "$type": "color"
      },
      "foreground": {
        "$value": "{color.primitive.gray-600}",
        "$type": "color"
      }
    }
  }
}
```

**tokens/space.json**
```json
{
  "space": {
    "0": { "$value": "0px", "$type": "dimension" },
    "1": { "$value": "4px", "$type": "dimension" },
    "2": { "$value": "8px", "$type": "dimension" },
    "3": { "$value": "12px", "$type": "dimension" },
    "4": { "$value": "16px", "$type": "dimension" },
    "6": { "$value": "24px", "$type": "dimension" },
    "8": { "$value": "32px", "$type": "dimension" },
    "12": { "$value": "48px", "$type": "dimension" },
    "16": { "$value": "64px", "$type": "dimension" },
    "24": { "$value": "96px", "$type": "dimension" }
  }
}
```

---

## Tools

### 1. Tokens Studio for Figma (Required)
- Free Figma plugin
- Exports/imports W3C format JSON
- Syncs with GitHub (or local)
- Supports light/dark themes as "sets"

**Setup:**
1. Install [Tokens Studio](https://tokens.studio/) plugin in Figma
2. Connect to GitHub repo (or use local JSON sync)
3. Point to `tokens/` directory

### 2. Style Dictionary (Required)
- Build tool that transforms tokens → code
- Outputs CSS variables, JS/TS, Tailwind config
- Highly configurable

**Install:**
```bash
pnpm add -D style-dictionary
```

### 3. Token Sync GitHub Action (Optional)
- Auto-generate code when tokens change
- Opens PR with changes for review

---

## Implementation Steps

### Phase 1: Extract Current Tokens
1. Create `tokens/` directory structure
2. Extract existing CSS variables into JSON format
3. Document current color palette

### Phase 2: Set Up Build Pipeline
1. Install Style Dictionary
2. Create `style-dictionary.config.js`
3. Configure outputs:
   - `src/styles/variables.css` (CSS custom properties)
   - `src/styles/tokens.ts` (TypeScript constants)
4. Add build script: `"tokens:build": "style-dictionary build"`

### Phase 3: Connect Figma
1. Set up Tokens Studio in Figma
2. Import existing tokens from JSON
3. Configure GitHub sync (or manual export workflow)
4. Create Figma styles from tokens

### Phase 4: Expand Token Coverage
1. Add spacing scale
2. Add typography tokens
3. Add shadow tokens
4. Add motion/animation tokens

### Phase 5: Component Tokens (Advanced)
1. Create component-specific tokens
2. Map carousel, button, card tokens
3. Document token usage per component

---

## Style Dictionary Config

**style-dictionary.config.js**
```javascript
module.exports = {
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'src/styles/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
          options: {
            selector: ':root',
          },
        },
      ],
    },
    ts: {
      transformGroup: 'js',
      buildPath: 'src/styles/',
      files: [
        {
          destination: 'tokens.ts',
          format: 'javascript/es6',
        },
      ],
    },
    // Dark theme
    cssDark: {
      transformGroup: 'css',
      buildPath: 'src/styles/',
      files: [
        {
          destination: 'variables-dark.css',
          format: 'css/variables',
          filter: (token) => token.filePath.includes('dark'),
          options: {
            selector: '[data-theme="dark"]',
          },
        },
      ],
    },
  },
}
```

---

## Migration from Current Setup

### Mapping Current Variables to Tokens

| Current CSS Variable | Token Path |
|---------------------|------------|
| `--background` | `color.semantic.background` |
| `--foreground` | `color.semantic.foreground` |
| `--primary` | `color.semantic.primary.DEFAULT` |
| `--primary-foreground` | `color.semantic.primary.foreground` |
| `--muted` | `color.semantic.muted.DEFAULT` |
| `--muted-foreground` | `color.semantic.muted.foreground` |
| `--card` | `color.semantic.card.DEFAULT` |
| `--border` | `color.semantic.border` |
| `--radius` | `radius.DEFAULT` |

### Tailwind Integration

After generating tokens, update `tailwind.config.mjs` to import from generated file:

```javascript
import { tokens } from './src/styles/tokens'

const config = {
  theme: {
    extend: {
      colors: tokens.color,
      spacing: tokens.space,
      borderRadius: tokens.radius,
      // ...
    },
  },
}
```

---

## Figma Structure Recommendations

### Pages
- **Tokens** — Visual documentation of all tokens
- **Components** — Component library
- **Patterns** — Common UI patterns

### Token Organization in Tokens Studio
```
📁 Global
  📁 Color
    📁 Primitive (gray, blue, etc.)
    📁 Semantic (background, primary, etc.)
  📁 Space
  📁 Typography
  📁 Radius
  📁 Shadow

📁 Themes
  📁 Light (references Global)
  📁 Dark (overrides for dark mode)
```

---

## Resources

- [W3C Design Tokens Format](https://tr.designtokens.org/format/)
- [Tokens Studio Documentation](https://docs.tokens.studio/)
- [Style Dictionary](https://amzn.github.io/style-dictionary/)
- [Tailwind + Design Tokens](https://tailwindcss.com/docs/theme)

---

## Next Steps

1. **Audit current styles** — Document all colors, spacing, typography in use
2. **Choose sync method** — GitHub sync vs manual export
3. **Start with colors** — Easiest to validate visually
4. **Iterate** — Add token categories incrementally
