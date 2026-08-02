/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      fontFamily: {
        // Body text - Modern, clean, tech-forward
        sans: ['Exo 2', 'system-ui', 'sans-serif'],
        // Headings - tight grotesk, set on h1-h6 in index.css
        display: ['Inter Tight', 'Exo 2', 'sans-serif'],
        // Brand mark only. Orbitron is a display face: it is deliberately not
        // used for headings, where it slows down reading at body lengths.
        wordmark: ['Orbitron', 'Exo 2', 'sans-serif'],
      },
      keyframes: {
        orbit: {
          '0%': {
            transform: 'rotate(calc(var(--angle) * 1deg)) translateX(calc(var(--radius) * 1px)) rotate(calc(var(--angle) * -1deg))',
          },
          '100%': {
            transform: 'rotate(calc(360deg + var(--angle) * 1deg)) translateX(calc(var(--radius) * 1px)) rotate(calc(-360deg - var(--angle) * 1deg))',
          },
        },
      },
      animation: {
        orbit: 'orbit var(--duration) linear infinite',
      },
      // ═══════════════════════════════════════════════════════════════════
      // SURFACE / BORDER TOKENS
      // ═══════════════════════════════════════════════════════════════════
      // The dark glass UI had grown ~20 near-identical white tints doing the
      // job of five. These tokens are the canonical set. Their values were
      // chosen by counting real usage in src/, not invented.
      //
      // ADDITIVE ONLY — every existing bg-white/* and border-white/* utility
      // still works. Migration is a separate mechanical codemod using the
      // mapping below.
      //
      // ── Surfaces ───────────────────────────────────────────────────────
      // bg-surface-1  rgba(255,255,255,0.03)  recessed: inset rows, wells,
      //                                       table stripes, disabled fills
      //   ← bg-white/[0.02] (4)  bg-white/[0.03] (7)  bg-white/[0.04] (17)
      //
      // bg-surface-2  rgba(255,255,255,0.05)  default: cards, panels, inputs
      //   ← bg-white/5 (60)  bg-white/[0.05] (6)  bg-white/[0.06] (2)
      //
      // bg-surface-3  rgba(255,255,255,0.10)  raised: hover, active, chips
      //   ← bg-white/10 (45)  bg-white/[0.08] (2)  bg-white/[0.1] (3)
      //     bg-white/[0.10] (1)  bg-white/15 (2)  bg-white/20 (5)
      //
      // Rule: a surface's hover state is the next level up.
      //       surface-1 → surface-2 → surface-3. Nothing hovers past 3.
      //
      // ── Borders ────────────────────────────────────────────────────────
      // border-hairline-1  rgba(255,255,255,0.10)  default edge on any surface
      //   ← border-white/5 (17)  border-white/10 (39)  border-white/[0.04] (1)
      //     border-white/[0.06] (19)  border-white/[0.07] (1)
      //     border-white/[0.08] (5)  border-white/[0.10] (1)
      //
      // border-hairline-2  rgba(255,255,255,0.20)  emphasis / hover / focus edge
      //   ← border-white/15 (1)  border-white/20 (22)  border-white/25 (1)
      //     border-white/30 (3)  border-white/40 (1)  border-white/[0.12] (3)
      //     border-white/[0.14] (1)  border-white/[0.2] (2)
      //
      // Note for the codemod: the ~26 call sites currently at 0.04–0.08 get
      // marginally brighter at hairline-1, and the 5 call sites at 0.25–0.40
      // get marginally dimmer at hairline-2. That convergence is the point.
      // ═══════════════════════════════════════════════════════════════════
      colors: {
        surface: {
          1: 'rgb(255 255 255 / 0.03)',
          2: 'rgb(255 255 255 / 0.05)',
          3: 'rgb(255 255 255 / 0.10)',
        },
        hairline: {
          1: 'rgb(255 255 255 / 0.10)',
          2: 'rgb(255 255 255 / 0.20)',
        },
      },
      // ═══════════════════════════════════════════════════════════════════
      // RADIUS TOKENS
      // ═══════════════════════════════════════════════════════════════════
      // 348 radius classes across four sizes with no rule. Three tokens plus
      // the built-in rounded-full cover every real case.
      //
      // rounded-control  0.5rem   buttons, inputs, selects, small chips, badges
      //   ← rounded-lg (118)  rounded-md (5)  rounded (bare)
      //
      // rounded-card     0.75rem  cards, list items, nested panels, tooltips
      //   ← rounded-xl (119)
      //
      // rounded-panel    1rem     modals, page-level sections, top-level glass
      //   ← rounded-2xl (102)  rounded-3xl (3)
      //
      // rounded-full stays as-is (133 uses) for pills, avatars and dots.
      //
      // Nesting rule: a child's radius is one step below its parent's.
      // A control inside a card inside a panel reads 8 / 12 / 16.
      // ═══════════════════════════════════════════════════════════════════
      borderRadius: {
        control: '0.5rem',
        card: '0.75rem',
        panel: '1rem',
      },
    },
  },
  plugins: [],
}