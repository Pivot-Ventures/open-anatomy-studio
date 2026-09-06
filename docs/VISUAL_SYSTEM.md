# Visual system

> Visual System v1.2: structured learning, editorial clarity, focused 3D workspace

- Status: implemented in `app/globals.css`; automated checks and desktop and mobile browser acceptance done; a full manual WCAG audit is still pending.
- Upstream document: `docs/DESIGN_STYLE_DECISION.md`.
- Purpose: translate the style direction into tokens, rules, and acceptance criteria that can be written straight into CSS.

## 1. Direction

| Layer | Source style | Responsibility |
| --- | --- | --- |
| Structure | Soft documentation | Information grouping, learning feedback, reading rhythm |
| Hierarchy | Swiss editorial | Heading levels, numbering, grid discipline |
| Stage | Dark focused workspace | The 3D stage stays dark, quiet, and high-focus |

Not used: neubrutalism inside the learning workspace, a terminal look as the global shell, fictional XP, gems, or mascots.

## 2. Colour

- Brand accent: teal `--accent` (dark `#75d5d1`, light `#147d79`), used only for interaction and system feedback.
- Organ accent: `--organ-accent`, at most one per organ page, for recognition only.
- Scientific colours are reserved for the model: artery red, vein blue, and tissue tones belong to the specimen, never to the interface.
- Feedback colours `--danger` and `--success` are used only for quizzes and status.
- Surfaces: `--bg`, `--surface`, `--surface-2`, `--surface-3`, `--panel`, with `--line` and `--line-strong` for borders. Both themes define every token.

## 3. Type

| Token | Size | Use |
| --- | --- | --- |
| `--fs-micro` | 9px | Decorative numbering, coordinates, captions |
| `--fs-label` | 10px | Section labels, uppercase with tracking |
| `--fs-ui` | 11.5px | Controls |
| `--fs-body` | 12.5px | Body text |
| `--fs-lead` | 17px | Lead paragraph, serif |

Display font is Geist with a system sans fallback; monospace is Geist Mono for numbering, coordinates, and semantic object names.

## 4. Layout

- Three-column explorer: library (286px), stage (fluid), notes (382px); collapses to a single column under 720px with a fixed mobile navigation.
- Panels float on the background with 10px radius (`--r-panel`); controls use 6px (`--r-ctl`).
- The stage keeps its own dark ground in both themes; labels use `--hotspot-bg` and `--hotspot-text`.

## 5. Interaction

- Every control has hover, focus-visible, and active states using `--line-strong` and `--surface-3`.
- Selection on the stage is shown with an emissive accent on the structure and a fade on everything else.
- Reduced motion disables auto rotation and transitions.

## 6. Acceptance

- Contrast of body text on all surfaces meets WCAG AA in both themes.
- Keyboard: J and K change organ, Space pauses rotation, L labels, S section, E explode, Escape closes dialogs.
- No horizontal scrolling on the page body at any width; wide content scrolls inside its own container.
