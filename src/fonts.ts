import localFont from 'next/font/local'

export const neueYorkNormal = localFont({
  src: [
    {
      path: '../public/fonts/pp-neue-york/PPNeueYork-NormalRegular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/pp-neue-york/PPNeueYork-NormalMedium.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-neue-york-normal',
  display: 'swap',
})

export const neueYorkCondensed = localFont({
  src: [
    {
      path: '../public/fonts/pp-neue-york/PPNeueYork-CondensedRegular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/pp-neue-york/PPNeueYork-CondensedExtrabold.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-neue-york-condensed',
  display: 'swap',
})

export const neueYorkNarrow = localFont({
  src: [
    {
      path: '../public/fonts/pp-neue-york/PPNeueYork-NarrowMedium.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-neue-york-narrow',
  display: 'swap',
})
