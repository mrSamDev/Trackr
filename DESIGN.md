---
name: Sijo Sam
description: Playful cartoon UI.
colors:
  ink: "#21204c"
  panel: "#fff7dc"
  panel-2: "#ffffff"
  yellow: "#f9d84a"
  pink: "#ff7fb4"
  pink-cta: "#ff82b2"
  pink-cta-deep: "#ff5d97"
  pink-cta-shadow: "#ca3e74"
  pink-error: "#972959"
  melon: "#ff9f6e"
  mint: "#92efc5"
  bluey: "#6d8cff"
typography:
  display-hero:
    fontFamily: Baloo 2
    fontSize: clamp(3.1rem, 8vw, 5.9rem)
    fontWeight: 800
    lineHeight: "0.9"
  display-sub:
    fontFamily: Baloo 2
    fontSize: clamp(1.15rem, 2.2vw, 1.6rem)
    fontWeight: 800
    lineHeight: "1.1"
  display-card:
    fontFamily: Baloo 2
    fontSize: clamp(2rem, 4vw, 3.2rem)
    fontWeight: 700
    lineHeight: "0.95"
  display-section:
    fontFamily: Baloo 2
    fontSize: 2rem
    fontWeight: 700
    lineHeight: "1"
  body-md:
    fontFamily: Nunito
    fontSize: 1.05rem
    fontWeight: 500
    lineHeight: "1.55"
  body-base:
    fontFamily: Nunito
    fontSize: 1rem
    fontWeight: 500
    lineHeight: "1.65"
  label-caps:
    fontFamily: Nunito
    fontSize: 0.82rem
    fontWeight: 700
    letterSpacing: 0.08em
  label-ui:
    fontFamily: Nunito
    fontSize: 0.95rem
    fontWeight: 800
  stat-value:
    fontFamily: Nunito
    fontSize: 1.35rem
    fontWeight: 800
  badge:
    fontFamily: Nunito
    fontSize: 0.75rem
    fontWeight: 800
    letterSpacing: 0.08em
rounded:
  sm: 8px
  md: 16px
  lg: 24px
  input: 20px
  xl: 32px
  pill: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
components:
  panel:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.xl}"
    padding: 32px
  stat-card-hero:
    backgroundColor: "rgba(255,255,255,0.8)"
    rounded: "{rounded.pill}"
    padding: 12px 16px
  stat-card-show:
    backgroundColor: "{colors.panel-2}"
    rounded: "{rounded.lg}"
    padding: 12px 16px
  badge-label:
    backgroundColor: "{colors.mint}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: 8px 16px
  chip-type-movie:
    backgroundColor: "{colors.pink}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: 8px 12px
  chip-type-series:
    backgroundColor: "{colors.bluey}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: 8px 12px
  chip-neutral:
    backgroundColor: "{colors.panel-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: 8px 12px
  chip-genre:
    backgroundColor: "{colors.mint}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: 8px 12px
  button-shuffle:
    backgroundColor: "linear-gradient(180deg, {colors.pink-cta} 0%, {colors.pink-cta-deep} 100%)"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: 15px 18px
  button-shuffle-hover:
    backgroundColor: "linear-gradient(180deg, {colors.pink-cta} 0%, {colors.pink-cta-deep} 100%)"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
  button-secondary:
    backgroundColor: "{colors.panel-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: 14px 16px
  button-secondary-hover:
    backgroundColor: "{colors.panel-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
  button-open-player:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: 14px 16px
  select-input:
    backgroundColor: "{colors.panel-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.input}"
    padding: 15px 16px
  streaming-container:
    backgroundColor: "rgba(255,255,255,0.7)"
    rounded: "{rounded.lg}"
    padding: 16px
---

## Overview

Cartoon Chaos meets Gumdrop Machine. ShowShuffle is a high-energy, playful UI built for people who can't decide what to watch. The aesthetic is deliberately loud and fun — think a Saturday morning cartoon crossed with a bubble tea shop menu. Bold outlines, chunky rounded corners, pastel candy gradients, and a wobbly sense of joy.

The design avoids the sterile minimalism of most streaming apps. Every panel has weight and presence. Borders are thick (3–4px, always ink). Shadows drop hard and dark. Colors pop. The goal is to make "picking something random" feel like pulling a lever on a prize machine.

## Colors

The palette is built on a single deep navy ink paired with a full candy shop of accent pastels.

- **Ink (#21204c):** Deep midnight navy for all text, borders, and structural outlines. Creates the cartoon "drawn" effect when used as borders.
- **Panel (#fff7dc):** Warm cream for primary card surfaces. Softer than white, avoids sterile look.
- **Panel-2 (#ffffff):** Pure white for secondary or nested surfaces, inputs, and stat cards.
- **Yellow (#f9d84a):** Secondary action color. Used for the "Open player" CTA and decorative background shapes. Not the shuffle button.
- **Pink (#ff7fb4):** Chip color for "movie" type tags.
- **Pink-CTA (#ff82b2 → #ff5d97):** The actual shuffle button uses a vertical gradient from this lighter to deeper pink. This is the primary action color. The hard shadow beneath it uses `#ca3e74`.
- **Pink-error (#972959):** Dark rose used for error text — a deepened version of the CTA pink family.
- **Melon (#ff9f6e):** Warm coral for the FilterPanel background accent gradient.
- **Mint (#92efc5):** Fresh green for the hero badge label and genre chips.
- **Bluey (#6d8cff):** Periwinkle for the "series" type chip and the poster offset shadow block.

The full-page background is a radial + linear gradient — sky blue top corners fading to mint-green at the bottom.

## Typography

Two fonts do all the work. Baloo 2 handles display and headlines; Nunito handles body and UI labels. Both are rounded, friendly, and avoid the sharpness of grotesques.

**Baloo 2** (display font) is used for the app name (`display-hero`), show titles (`display-card`), and section headers like "Tune the machine" (`display-section`). Always 700–800 weight. Line height is tight (0.9–1.0) to create a punchy, stacked headline feel.

**Nunito** (body font) is used for descriptions, filter labels, stat numbers, and all UI chrome. Use `label-ui` (0.95rem, 800 weight) for filter field labels. Use `label-caps` for small uppercase metadata below stat numbers.

Uppercase tracking (`0.08em`) is used on badge text and small stat labels — keeps it readable without shouting.

## Layout

The layout is card-first. Everything lives in panels. Panels have:
- `border-radius: 32px` (the signature "gumdrop" shape)
- `border: 4px solid #21204c`
- A stacked box-shadow: `0 18px 0 rgba(33,32,76,0.18), 0 24px 50px rgba(33,32,76,0.16)`

On mobile (max-sm), panels collapse to `border-radius: 24px` with reduced padding (16px).

The ShowCard uses a two-column grid on desktop (`280px` poster + fluid content), stacking to single column on mobile.

Spacing follows an 8px base unit. Common values: 8, 16, 24, 32px. Gaps between chips and inline elements use `10px` (gap-2.5).

## Elevation & Depth

Depth is achieved through the hard cartoon shadow rather than blur-heavy elevation. The panel formula:
- Layer 1: `0 18px 0 rgba(33,32,76,0.18)` — the solid dark drop
- Layer 2: `0 24px 50px rgba(33,32,76,0.16)` — soft ambient spread

The shuffle button has its own hard shadow: `0 8px 0 #ca3e74` — a solid ink-style drop in deep rose. On hover, buttons lift `translateY(-2px)` (not the shadow itself).

**Poster offset block:** Behind every show poster sits a bluey-colored div inset by `0.8rem` on top-left and offset by `-0.8rem` on bottom-right (`inset: 0.8rem -0.8rem -0.8rem 0.8rem`). This creates the cartoon "sticker stack" depth effect. It uses 4px ink border and 28px radius.

Decorative rotated shapes (the yellow rectangle in the hero, the "Fresh pick" label rotated −8deg) add playful depth without changing layout hierarchy.

## Shapes

Roundness is a core identity marker:
- **pill (9999px):** all chips (type, year, rating, genre), all buttons, badge labels, hero stat cards
- **xl (32px):** main content panels (4px border)
- **lg (24px):** show stat cards (seasons/episodes), streaming container, poster image, poster offset block (28px)
- **input (20px):** select dropdowns and form controls
- **sm (8px):** minor UI elements

Never use sharp corners. If it's interactive or contains content, round it.

## Components

**Panels** are the primary container. Cream background, 4px ink border, 32px radius, hard double shadow. Each panel can have its own gradient overlay on top of the base cream color.

**Stat cards — hero:** White/80 background, 3px ink border, pill radius. Used in the HeroSection for genreCount, rating, seed. Flex column: large bold number on top, small-caps label below.

**Stat cards — show:** Solid white background, 3px ink border, 24px radius (not pill). Used in ShowCard for seasons/episodes counts. Same flex column layout as hero stat cards.

**Chips:** All use pill radius + 3px ink border. Three variants:
- Movie type: pink background, white text
- Series type: bluey background, white text
- Neutral (year, rating): white background, ink text
- Genre: mint background, ink text

**Badge label:** The "Random watch picker" tag. Mint background, 3px ink border, pill, all-caps Nunito 0.75rem 800 weight, 0.08em tracking.

**Shuffle button (primary CTA):** Vertical gradient from `#ff82b2` to `#ff5d97`, white text, pill radius, 3px ink border, hard shadow `0 8px 0 #ca3e74`. Contains a circular white badge showing "GO" or "..." for loading state. Hover lifts `translateY(-2px)`.

**Secondary buttons:** White background, ink text, 3px ink border, pill radius. Used for "Another surprise", "Reset dials". Hover lifts `translateY(-2px)`.

**Open player button:** Yellow background, ink text, 3px ink border, pill radius. Includes an arrow icon. Same hover lift.

**Select inputs:** White background, 3px ink border, 20px radius, inset bottom shadow `inset 0 -4px 0 rgba(33,32,76,0.08)` to simulate a pressed-in bottom edge. `appearance: none` removes native chrome.

**Range slider:** Uses `accent-pink` (the pink token) for the thumb and track fill.

**Streaming container:** White/70 background, 3px dashed ink border, 24px radius. The dashed border variant is exclusive to this component — it signals "external source" and is not used elsewhere.

**"Fresh pick" label:** Small rotated pill label (`rotate(-8deg)`) positioned over the poster top-left. Yellow background, black text, 3px ink border, pill radius. Applied as an absolute positioned overlay.

## Do's and Don'ts

**Do:**
- Use 3–4px ink borders on every interactive and card element
- Apply the hard-drop panel shadow (`0 18px 0` + `0 24px 50px`) to panels
- Apply the hard CTA shadow (`0 8px 0 #ca3e74`) to the shuffle button only
- Use Baloo 2 for anything display-size (≥1.5rem)
- Keep backgrounds gradient or pastel — never plain white for full-page backgrounds
- Use `translateY(-2px)` on hover for buttons, not shadow changes
- Use the poster offset block (bluey div behind image) whenever displaying a show poster
- Use dashed border only for the streaming services container

**Don't:**
- Use sharp corners anywhere in the UI
- Use gray text — use `ink` at reduced opacity (`ink/60`, `ink/80`) instead
- Confuse the CTA colors: pink gradient = shuffle (primary), yellow = open player (secondary)
- Use the panel double-shadow on anything other than top-level panels
- Use fonts outside Baloo 2 / Nunito
- Apply `accent-pink` outside the range slider context
