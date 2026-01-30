import tailwindcssAnimate from 'tailwindcss-animate'
import typography from '@tailwindcss/typography'
import { headings, body } from './tokens/resolve.mjs'

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  plugins: [tailwindcssAnimate, typography],
  prefix: '',
  safelist: [
    'lg:col-span-4',
    'lg:col-span-6',
    'lg:col-span-8',
    'lg:col-span-12',
    'border-border',
    'bg-card',
    'border-error',
    'bg-error/30',
    'border-success',
    'bg-success/30',
    'border-warning',
    'bg-warning/30',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        '2xl': '2rem',
        DEFAULT: '1rem',
        lg: '2rem',
        md: '2rem',
        sm: '1rem',
        xl: '2rem',
      },
      screens: {
        '2xl': '86rem',
        lg: '64rem',
        md: '48rem',
        sm: '40rem',
        xl: '80rem',
      },
    },
    extend: {
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        // New surface system
        surface: {
          DEFAULT: 'var(--surface-base)',
          foreground: 'var(--surface-foreground)',
          accent: 'var(--surface-accent)',
          alt: {
            DEFAULT: 'var(--surface-alt-base)',
            foreground: 'var(--surface-alt-foreground)',
            accent: 'var(--surface-alt-accent)',
          },
          overlay: {
            DEFAULT: 'var(--surface-overlay-base)',
            foreground: 'var(--surface-overlay-foreground)',
            accent: 'var(--surface-overlay-accent)',
          },
          elevated: {
            DEFAULT: 'var(--surface-elevated-base)',
            foreground: 'var(--surface-elevated-foreground)',
            accent: 'var(--surface-elevated-accent)',
          },
          emphasis: {
            DEFAULT: 'var(--surface-emphasis-base)',
            foreground: 'var(--surface-emphasis-foreground)',
            accent: 'var(--surface-emphasis-accent)',
          },
          muted: {
            DEFAULT: 'var(--surface-muted-base)',
            foreground: 'var(--surface-muted-foreground)',
            accent: 'var(--surface-muted-accent)',
          },
          contrast: {
            DEFAULT: 'var(--surface-contrast-base)',
            foreground: 'var(--surface-contrast-foreground)',
            accent: 'var(--surface-contrast-accent)',
          },
        },

        // Primitive palette
        primitive: {
          sage: 'var(--color-sage)',
          blush: 'var(--color-blush)',
          coral: 'var(--color-coral)',
          olive: 'var(--color-olive)',
          plum: 'var(--color-plum)',
          mahogany: 'var(--color-mahogany)',
          cashmere: 'var(--color-cashmere)',
          charcoal: 'var(--color-charcoal)',
          black: 'var(--color-black)',
          white: 'var(--color-white)',
          flame: {
            100: 'var(--color-flame-100)',
            200: 'var(--color-flame-200)',
            300: 'var(--color-flame-300)',
            400: 'var(--color-flame-400)',
          },
          sky: {
            50: 'var(--color-sky-50)',
            100: 'var(--color-sky-100)',
            200: 'var(--color-sky-200)',
            300: 'var(--color-sky-300)',
          },
          gray: {
            50: 'var(--color-gray-50)',
            100: 'var(--color-gray-100)',
            200: 'var(--color-gray-200)',
            300: 'var(--color-gray-300)',
            400: 'var(--color-gray-400)',
            500: 'var(--color-gray-500)',
            600: 'var(--color-gray-600)',
            700: 'var(--color-gray-700)',
            800: 'var(--color-gray-800)',
            900: 'var(--color-gray-900)',
            950: 'var(--color-gray-950)',
          },
        },

        // Legacy aliases (backward-compatible)
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        background: 'var(--background)',
        border: 'var(--border)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        foreground: 'var(--foreground)',
        input: 'var(--input)',
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        ring: 'var(--ring)',
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        success: 'var(--success)',
        error: 'var(--error)',
        warning: 'var(--warning)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
        'neue-york': ['var(--font-neue-york-normal)', 'sans'],
        'neue-york-condensed': ['var(--font-neue-york-condensed)', 'sans'],
        'neue-york-narrow': ['var(--font-neue-york-narrow)', 'sans'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      typography: () => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': 'var(--foreground)',
            '--tw-prose-headings': 'var(--foreground)',
            // Map HTML elements to resolved token styles
            p: body.base,
            h1: { ...headings.large, marginBottom: '0.25em' },
            h2: headings.standard,
            h3: headings.small,
            h4: headings.xs,
            h5: body.large,
          },
        },
      }),
    },
  },
}

export default config
