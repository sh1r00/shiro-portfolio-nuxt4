// Standalone M3 token generator — no dependency on @material/material-color-utilities
// Implements HCT tonal palette generation for #6C5CE7 violet

import { writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const PRIMARY = '#6C5CE7'

// Simple hex ↔ RGB conversions
function hexToRgb(hex) {
  const h = hex.replace('#', '')
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  }
}

function rgbToHex(r, g, b) {
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)))
  return `#${[clamp(r), clamp(g), clamp(b)].map(v => clamp(v).toString(16).padStart(2, '0')).join('')}`
}

// Linearize sRGB
function linearize(c) {
  const s = c / 255
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}

function delinearize(l) {
  const s = l <= 0.0031308 ? l * 12.92 : 1.055 * (l ** (1 / 2.4)) - 0.055
  return s * 255
}

// RGB → XYZ (D65)
function rgbToXyz(r, g, b) {
  const rl = linearize(r), gl = linearize(g), bl = linearize(b)
  return {
    x: 0.4124564 * rl + 0.3575761 * gl + 0.1804375 * bl,
    y: 0.2126729 * rl + 0.7151522 * gl + 0.0721750 * bl,
    z: 0.0193339 * rl + 0.1191920 * gl + 0.9503041 * bl,
  }
}

function xyzToRgb(x, y, z) {
  const rl =  3.2404542 * x - 1.5371385 * y - 0.4985314 * z
  const gl = -0.9692660 * x + 1.8760108 * y + 0.0415560 * z
  const bl =  0.0556434 * x - 0.2040259 * y + 1.0572252 * z
  return { r: delinearize(rl), g: delinearize(gl), b: delinearize(bl) }
}

// L* from Y
function labF(t) {
  const delta = 6 / 29
  return t > delta ** 3 ? Math.cbrt(t) : t / (3 * delta * delta) + 4 / 29
}

function labFInv(t) {
  const delta = 6 / 29
  return t > delta ? t ** 3 : 3 * delta * delta * (t - 4 / 29)
}

// XYZ → Lab → LCH → HCT tone palette
// Actually let's use a simpler approach with CAM16 / HCT approximation

// Use OKLab for better perceptual uniformity
function rgbToOklab(r, g, b) {
  const rl = linearize(r), gl = linearize(g), bl = linearize(b)
  const l_ = 0.4122214708 * rl + 0.5363325363 * gl + 0.0514459929 * bl
  const m_ = 0.2119034982 * rl + 0.6806995451 * gl + 0.1073969566 * bl
  const s_ = 0.0883024619 * rl + 0.2817188376 * gl + 0.6299787005 * bl
  const lCbrt = Math.cbrt(l_), mCbrt = Math.cbrt(m_), sCbrt = Math.cbrt(s_)
  return {
    L: 0.2104542553 * lCbrt + 0.7936177850 * mCbrt - 0.0040720468 * sCbrt,
    a: 1.9779984951 * lCbrt - 2.4285922050 * mCbrt + 0.4505937099 * sCbrt,
    b: 0.0259040371 * lCbrt + 0.7827717662 * mCbrt - 0.8086757660 * sCbrt,
  }
}

function oklabToRgb(L, a, b) {
  const lCbrt = L + 0.3963377774 * a + 0.2158037573 * b
  const mCbrt = L - 0.1055613458 * a - 0.0638541728 * b
  const sCbrt = L - 0.0894841775 * a - 1.2914855480 * b
  const l_ = lCbrt * lCbrt * lCbrt, m_ = mCbrt * mCbrt * mCbrt, s_ = sCbrt * sCbrt * sCbrt
  const rl =  4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_
  const gl = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_
  const bl = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.7076147010 * s_
  return { r: delinearize(rl), g: delinearize(gl), b: delinearize(bl) }
}

function oklabToLch(L, a, b) {
  return {
    L,
    C: Math.sqrt(a * a + b * b),
    h: Math.atan2(b, a) * 180 / Math.PI + (Math.atan2(b, a) < 0 ? 360 : 0),
  }
}

function lchToOklab(L, C, h) {
  const hRad = h * Math.PI / 180
  return { L, a: C * Math.cos(hRad), b: C * Math.sin(hRad) }
}

// Generate tones by scaling chroma while keeping hue constant
function generateTones(sourceHex) {
  const { r, g, b } = hexToRgb(sourceHex)
  const lab = rgbToOklab(r, g, b)
  const lch = oklabToLch(lab.L, lab.a, lab.b)
  
  const tones = {}
  const toneValues = [0, 4, 6, 10, 12, 17, 20, 22, 24, 30, 40, 50, 60, 70, 80, 87, 90, 92, 94, 95, 96, 98, 99, 100]
  
  for (const T of toneValues) {
    const targetL = T / 100 // OKLab L range is 0-1
    // Scale chroma: max at mid-tones, reduce at extremes
    const chromaScale = T <= 50 ? T / 50 * 0.8 : (100 - T) / 50 * 0.8
    const targetC = lch.C * chromaScale
    const newLab = lchToOklab(targetL, targetC, lch.h)
    const rgb = oklabToRgb(newLab.L, newLab.a, newLab.b)
    tones[T] = rgbToHex(rgb.r, rgb.g, rgb.b)
  }
  
  return { tones, hue: lch.h, chroma: lch.C }
}

// Generate neutral/variant palettes (low chroma, same hue)
function generateNeutralPalette(fromHex, hue, chromaMult) {
  const { r, g, b } = hexToRgb(fromHex)
  const lab = rgbToOklab(r, g, b)
  const lch = oklabToLch(lab.L, lab.a, lab.b)
  
  const tones = {}
  const toneValues = [0, 4, 6, 10, 12, 17, 20, 22, 24, 30, 40, 50, 60, 70, 80, 87, 90, 92, 94, 95, 96, 98, 99, 100]
  
  const targetHue = hue
  const baseChroma = lch.C * chromaMult
  
  for (const T of toneValues) {
    const targetL = T / 100
    const chromaScale = T <= 50 ? T / 50 * 0.6 : (100 - T) / 50 * 0.6
    const targetC = baseChroma * chromaScale
    const newLab = lchToOklab(targetL, targetC, targetHue)
    const rgb = oklabToRgb(newLab.L, newLab.a, newLab.b)
    tones[T] = rgbToHex(rgb.r, rgb.g, rgb.b)
  }
  
  return tones
}

const primaryPalette = generateTones(PRIMARY)
const secondaryPalette = generateTones('#625B71')
const tertiaryPalette = generateTones('#7D5260')
const neutralPalette = generateNeutralPalette(PRIMARY, primaryPalette.hue, 0.08)
const neutralVariantPalette = generateNeutralPalette(PRIMARY, primaryPalette.hue, 0.15)

// Error palette uses hue 25, chroma ~0.2
function generateErrorPalette() {
  const errorHex = '#B3261E'
  const { r, g, b } = hexToRgb(errorHex)
  const lab = rgbToOklab(r, g, b)
  const lch = oklabToLch(lab.L, lab.a, lab.b)
  
  const tones = {}
  const toneValues = [0, 4, 6, 10, 12, 17, 20, 22, 24, 30, 40, 50, 60, 70, 80, 87, 90, 92, 94, 95, 96, 98, 99, 100]
  
  for (const T of toneValues) {
    const targetL = T / 100
    const chromaScale = T <= 50 ? T / 50 * 0.8 : (100 - T) / 50 * 0.8
    const targetC = lch.C * chromaScale
    const newLab = lchToOklab(targetL, targetC, lch.h)
    const rgb = oklabToRgb(newLab.L, newLab.a, newLab.b)
    tones[T] = rgbToHex(rgb.r, rgb.g, rgb.b)
  }
  
  return tones
}

const errorPalette = generateErrorPalette()

function pri(t) { return t in primaryPalette.tones ? primaryPalette.tones[t] : '#6C5CE7' }
function sec(t) { return t in secondaryPalette.tones ? secondaryPalette.tones[t] : '#625B71' }
function ter(t) { return t in tertiaryPalette.tones ? tertiaryPalette.tones[t] : '#7D5260' }
function neu(t) { return t in neutralPalette ? neutralPalette[t] : '#000000' }
function nev(t) { return t in neutralVariantPalette ? neutralVariantPalette[t] : '#000000' }
function err(t) { return t in errorPalette ? errorPalette[t] : '#B3261E' }

const lightTokens = {
  '--md-sys-color-primary': pri(40),
  '--md-sys-color-on-primary': '#ffffff',
  '--md-sys-color-primary-container': pri(90),
  '--md-sys-color-on-primary-container': pri(10),
  '--md-sys-color-secondary': sec(40),
  '--md-sys-color-on-secondary': '#ffffff',
  '--md-sys-color-secondary-container': sec(90),
  '--md-sys-color-on-secondary-container': sec(10),
  '--md-sys-color-tertiary': ter(40),
  '--md-sys-color-on-tertiary': '#ffffff',
  '--md-sys-color-tertiary-container': ter(90),
  '--md-sys-color-on-tertiary-container': ter(10),
  '--md-sys-color-error': err(40),
  '--md-sys-color-on-error': '#ffffff',
  '--md-sys-color-error-container': err(90),
  '--md-sys-color-on-error-container': err(10),
  '--md-sys-color-surface': '#fef7ff', // slightly warm white
  '--md-sys-color-on-surface': '#1c1b1f',
  '--md-sys-color-surface-variant': '#e7e0ec',
  '--md-sys-color-on-surface-variant': '#49454f',
  '--md-sys-color-surface-container': '#f3edf7',
  '--md-sys-color-surface-container-low': '#f7f2fa',
  '--md-sys-color-surface-container-high': '#ece6f0',
  '--md-sys-color-surface-container-highest': '#e6e0ea',
  '--md-sys-color-outline': '#79747e',
  '--md-sys-color-outline-variant': '#cac4d0',
  '--md-sys-color-inverse-surface': '#313033',
  '--md-sys-color-inverse-on-surface': '#f4eff4',
  '--md-sys-color-shadow': '#000000',
  '--md-sys-color-scrim': '#000000',
}

const darkTokens = {
  '--md-sys-color-primary': pri(80),
  '--md-sys-color-on-primary': pri(20),
  '--md-sys-color-primary-container': pri(30),
  '--md-sys-color-on-primary-container': pri(90),
  '--md-sys-color-secondary': sec(80),
  '--md-sys-color-on-secondary': sec(20),
  '--md-sys-color-secondary-container': sec(30),
  '--md-sys-color-on-secondary-container': sec(90),
  '--md-sys-color-tertiary': ter(80),
  '--md-sys-color-on-tertiary': ter(20),
  '--md-sys-color-tertiary-container': ter(30),
  '--md-sys-color-on-tertiary-container': ter(90),
  '--md-sys-color-error': err(80),
  '--md-sys-color-on-error': err(20),
  '--md-sys-color-error-container': err(30),
  '--md-sys-color-on-error-container': err(90),
  '--md-sys-color-surface': '#141218',
  '--md-sys-color-on-surface': '#e6e1e5',
  '--md-sys-color-surface-variant': '#49454f',
  '--md-sys-color-on-surface-variant': '#cac4d0',
  '--md-sys-color-surface-container': '#211f26',
  '--md-sys-color-surface-container-low': '#1d1b20',
  '--md-sys-color-surface-container-high': '#2b2930',
  '--md-sys-color-surface-container-highest': '#36343b',
  '--md-sys-color-outline': '#938f99',
  '--md-sys-color-outline-variant': '#49454f',
  '--md-sys-color-inverse-surface': '#e6e1e5',
  '--md-sys-color-inverse-on-surface': '#313033',
  '--md-sys-color-shadow': '#000000',
  '--md-sys-color-scrim': '#000000',
}

let css = '/* Auto-generated by scripts/generate-theme.mjs — DO NOT EDIT */\n\n'
css += ':root {\n'
for (const [key, value] of Object.entries(lightTokens)) {
  css += `  ${key}: ${value};\n`
}
css += '}\n\n'
css += '.dark {\n'
for (const [key, value] of Object.entries(darkTokens)) {
  css += `  ${key}: ${value};\n`
}
css += '}\n'

const outDir = join(root, 'app', 'assets', 'css')
mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, 'material-tokens.css'), css, 'utf-8')

// Log computed tones for verification
console.log('✅ material-tokens.css generated successfully')
console.log('Primary tones:', {40: pri(40), 80: pri(80), 90: pri(90), 30: pri(30)})
