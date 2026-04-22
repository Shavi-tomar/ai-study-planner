# Design Brief: AI Study Planner

**Purpose & Tone**: Personalized productivity app for students generating daily study schedules. Motivating, professional, focused—approachable without cuteness. Minimal visual decoration maximizes information clarity and task focus.

**Differentiation**: Color-coded priority system (red=high, yellow=medium, green=low) integrated throughout cards and UI. Two-column/stacked layout (form + results) with clear visual hierarchy. Completed task feedback via checkbox states.

## Color Palette (OKLCH)

| Token | Light (L C H) | Dark (L C H) | Usage |
|-------|---|---|---|
| Primary | 0.62 0.18 253 | 0.72 0.22 253 | CTAs, form focus, schedule buttons |
| Destructive | 0.58 0.28 25 | 0.68 0.31 25 | High priority badge, urgent alerts |
| Accent | 0.65 0.19 283 | 0.75 0.26 283 | Secondary interactions, regenerate button |
| Foreground | 0.18 0 0 | 0.96 0 0 | Body text, form labels |
| Background | 0.98 0 0 | 0.12 0 0 | Page surface |
| Card | 1.0 0 0 | 0.16 0 0 | Form container, schedule cards, elevated surfaces |
| Border | 0.93 0 0 | 0.25 0 0 | Card dividers, input borders |
| Muted | 0.92 0 0 | 0.2 0 0 | Disabled states, secondary text |

## Typography

| Tier | Font | Size | Weight | Usage |
|------|------|------|--------|-------|
| Display | General Sans | 28px–32px | 700 | Page title, section headings |
| Body | DM Sans | 14px–16px | 400 | Form fields, card text, labels |
| Mono | Geist Mono | 12px–13px | 400 | Study hour values, time displays, code-like data |

## Structural Zones

| Zone | Background | Border | Elevation | Purpose |
|------|------------|--------|-----------|---------|
| Header | Same as page | None | None | Branding, minimal nav (if needed) |
| Form Section | Card (elevated) | subtle border | md shadow | Subject input, difficulty scale, date picker, hours input |
| Results Section | Background | None | None | Schedule card grid container |
| Schedule Cards | Card (elevated) | Left color accent | md shadow | Individual subject + priority + hours allocation |
| Footer | Background with light border | border-top | None | Total study hours summary, stats |

## Spacing & Rhythm

- **Grid**: 8px base unit (gaps: 8px tight, 16px standard, 24px loose, 32px section break)
- **Form density**: 16px between fields, 24px between sections
- **Card rhythm**: 16px inner padding, 16px outer gaps
- **Breathing room**: Key interactive areas (buttons, CTAs) surrounded by 12–16px space

## Component Patterns

- **Buttons**: Primary (teal bg, white text, no outline) / Secondary (outline only) / Destructive (red bg)
- **Cards**: Rounded 8px (`rounded-lg`), white bg with 1px border, box-shadow-md. Left border accent (4px) for priority indicator.
- **Forms**: Inline labels, 8px input padding, rounded 6px inputs, border on focus via ring token
- **Priority badges**: Semantic color background (red/yellow/green) with matching text, 4px rounded pill shape
- **Progress**: Checkbox with accent color on check, smooth transition

## Motion

- **Transitions**: All interactive elements use `transition-smooth` (300ms cubic-bezier for natural feel)
- **Entry**: New schedule cards slide-up with fade (staggered 50–100ms per card)
- **Loading**: Pulse animation on submit button during generation
- **Feedback**: Checkbox check receives 200ms ease-out scale + color transition

## Constraints

- No full-page gradients or decorative orbs (productivity focus)
- No rainbow color palettes; semantic color mapping only (red=urgent, yellow=medium, green=calm)
- Avoid blur effects (clarity over aesthetics)
- Keep form to single column on mobile, two-column on desktop
- Schedule cards always single column (stacked) to prioritize readability

## Signature Detail

**Left-border priority indicator**: Each schedule card features a solid 4px left border matching its priority color (red/yellow/green). This creates visual scanability while maintaining the professional tone. The border extends full card height, reinforcing priority hierarchy at a glance.

## Responsive Behavior

- **Mobile**: Form full width, results below form. Buttons full width. Cards single column.
- **Tablet**: Form 50% width left, results 50% width right. Cards 2-column grid.
- **Desktop**: Form 40% width left sidebar, results 60% width main. Cards 3-column grid if space allows, else 2-column.
