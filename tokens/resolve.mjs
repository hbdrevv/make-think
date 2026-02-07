/**
 * Design Token Resolver
 *
 * Reads foundation.json and semantic-typography.json and resolves
 * all token references ({scale.4}, {line-height.loose}, etc.) into
 * concrete CSS values. Import the exports into tailwind.config.mjs
 * or any other build-time config.
 */
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const foundation = JSON.parse(readFileSync(join(__dirname, 'foundation.json'), 'utf-8'))
const typographyTokens = JSON.parse(
  readFileSync(join(__dirname, 'typography/semantic-typography.json'), 'utf-8'),
)

// ── Scale (4px grid) ────────────────────────────────────────────
// Pre-resolve every scale step to a pixel number so downstream
// code never has to evaluate the "{scale.1} *N" expressions.
const SCALE_PX = {
  '0': 0,
  '1': 4,
  '2': 8,
  '3': 12,
  '3_5': 14,
  '4': 16,
  '5': 20,
  '6': 24,
  '7': 28,
  '8': 32,
  '9': 36,
  '10': 40,
  '11': 44,
  '12': 48,
  '13': 56, // scale.1 * 14
  '14': 64, // scale.2 * 8
  '15': 128, // scale.14 * 2
  '16': 140, // scale.7 * 5
  '17': 192, // scale.14 * 3
  '18': 256, // scale.15 * 2
  '19': 384, // scale.15 * 3
  '20': 512, // scale.15 * 4
}

// ── Lookup tables ───────────────────────────────────────────────
const FONT_FAMILY_MAP = {
  '{neue-york-normal}': 'var(--font-neue-york-normal), serif',
  '{neue-york-condensed}': 'var(--font-neue-york-condensed), serif',
  '{neue-york-narrow}': 'var(--font-neue-york-narrow), serif',
}

const FONT_WEIGHT_MAP = {
  '{normal-regular}': '400',
  '{normal-medium}': '500',
  '{normal-extrabold}': '800',
  '{condensed-regular}': '400',
  '{condensed-extrabold}': '800',
  '{narrow-medium}': '500',
}

const LINE_HEIGHT_MAP = Object.fromEntries(
  Object.entries(foundation['line-height']).map(([key, token]) => [
    `{line-height.${key}}`,
    String(parseFloat(token.value) / 100),
  ]),
)

const LETTER_SPACING_MAP = Object.fromEntries(
  Object.entries(foundation['letter-spacing']).map(([key, token]) => {
    const pct = parseFloat(token.value)
    return [`{letter-spacing.${key}}`, pct === 0 ? '0' : `${pct / 100}em`]
  }),
)

const TEXT_CASE_MAP = {
  '{none}': 'none',
  '{uppercase}': 'uppercase',
}

// ── Resolver ────────────────────────────────────────────────────
function pxToRem(px) {
  return `${px / 16}rem`
}

/**
 * Fluid Typography Configuration
 * For larger sizes, we use clamp() to scale between mobile and desktop.
 * Format: { minPx, vwFactor, basePx }
 * Result: clamp(minPx, vwFactor*vw + basePx, maxPx)
 */
const FLUID_TYPOGRAPHY = {
  '13': { minPx: 36, vwFactor: 6, basePx: 32 },   // 56px max → hits max at ~400px viewport
  '16': { minPx: 56, vwFactor: 12, basePx: 64 },  // 140px max → hits max at ~633px viewport
  '17': { minPx: 64, vwFactor: 16, basePx: 80 },  // 192px max → hits max at ~700px viewport
  '18': { minPx: 72, vwFactor: 20, basePx: 96 },  // 256px max → hits max at ~800px viewport
}

function fluidFontSize(px, scaleKey) {
  const fluid = FLUID_TYPOGRAPHY[scaleKey]
  if (!fluid) {
    return pxToRem(px)
  }

  const minRem = pxToRem(fluid.minPx)
  const maxRem = pxToRem(px)
  const preferred = `${fluid.vwFactor}vw + ${pxToRem(fluid.basePx)}`

  return `clamp(${minRem}, ${preferred}, ${maxRem})`
}

function resolveStyle(tokenValue) {
  const style = {}

  if (tokenValue.fontFamily) {
    style.fontFamily = FONT_FAMILY_MAP[tokenValue.fontFamily] ?? tokenValue.fontFamily
  }
  if (tokenValue.fontWeight) {
    style.fontWeight = FONT_WEIGHT_MAP[tokenValue.fontWeight] ?? tokenValue.fontWeight
  }
  if (tokenValue.fontSize) {
    const scaleKey = tokenValue.fontSize.replace(/\{scale\.(.+?)\}/, '$1')
    const px = SCALE_PX[scaleKey]
    if (px !== undefined) style.fontSize = fluidFontSize(px, scaleKey)
  }
  if (tokenValue.lineHeight) {
    style.lineHeight = LINE_HEIGHT_MAP[tokenValue.lineHeight] ?? tokenValue.lineHeight
  }
  if (tokenValue.letterSpacing) {
    style.letterSpacing = LETTER_SPACING_MAP[tokenValue.letterSpacing] ?? tokenValue.letterSpacing
  }
  if (tokenValue.textCase) {
    const tc = TEXT_CASE_MAP[tokenValue.textCase]
    if (tc && tc !== 'none') style.textTransform = tc
  }

  return style
}

function resolveGroup(group) {
  return Object.fromEntries(
    Object.entries(group).map(([key, token]) => [key, resolveStyle(token.value)]),
  )
}

// ── Exports ─────────────────────────────────────────────────────
export const headings = resolveGroup(typographyTokens.text.heading)
export const body = resolveGroup(typographyTokens.text.body)
export const labels = resolveGroup(typographyTokens.text.label)
export const scale = SCALE_PX
