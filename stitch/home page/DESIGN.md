# Design System Strategy: The Kinetic Gallery

## 1. Overview & Creative North Star
The North Star for this design system is **"The Kinetic Gallery."** 

We are moving away from the "SaaS-standard" boxy layout. Instead, we are treating the UI as a high-velocity, editorial space where content feels curated and motion is implied even in static states. By leveraging the airy expansiveness of `surface` (#F5F6F7) and `surface-container-lowest` (#FFFFFF), we create a "Light Mode" that feels like a premium showroom rather than a data table. 

We break the "template" look through **Intentional Asymmetry**. Large `display-lg` headlines should often be offset from their following body text, and images should use staggered placements to create a sense of forward momentum—the "Forest Wheel" in motion.

## 2. Colors & Tonal Architecture
This system relies on atmospheric depth rather than structural lines.

*   **The "No-Line" Rule:** 1px solid borders are strictly prohibited for sectioning or containment. Boundaries are defined solely through background shifts. For instance, a `surface-container-low` section should sit directly against a `surface` background to define its edge.
*   **Surface Hierarchy & Nesting:** Treat the UI as layers of fine paper. 
    *   **Base:** `surface` (#F5F6F7)
    *   **Sections:** `surface-container-low` (#EFF1F2) for large secondary areas.
    *   **Cards/High Importance:** `surface-container-lowest` (#FFFFFF) to make elements "pop" forward.
*   **The "Glass & Gradient" Rule:** To reflect high-velocity ignition, use semi-transparent `surface-container-lowest` with a 12px-20px backdrop blur for floating navigation bars or overlays.
*   **Signature Textures:** Main CTAs must not be flat. Use a subtle linear gradient (Top-Left to Bottom-Right) transitioning from `primary` (#8A4C00) to `primary-container` (#FA9118). This creates a "glow" effect that mimics the heat of ignition.

## 3. Typography: The Editorial Voice
The contrast between the technical precision of **Inter** and the expressive geometry of **Plus Jakarta Sans** (our high-end substitute for Outfit to enhance the "Premium" feel) drives the brand's authority.

*   **Display & Headlines (Plus Jakarta Sans):** These are your "Speed Marks." Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) for hero moments. The boldness of the headers conveys the "Ignition" strength.
*   **Body & Labels (Inter):** These represent the "Engineering." Inter provides maximum readability at `body-md` (0.875rem). Use `label-md` in all-caps with increased letter-spacing (+0.05em) for small metadata to maintain an airy, technical aesthetic.
*   **Hierarchy as Identity:** Always pair a `headline-lg` with a `body-lg`. The dramatic scale jump between headers and body text is what prevents the UI from looking like a generic template.

## 4. Elevation & Depth: Tonal Layering
We do not use shadows to simulate height; we use light and opacity.

*   **The Layering Principle:** Depth is achieved by stacking. A `surface-container-highest` (#DADDDF) element should only be used for small, high-utility items (like search bars) sitting on a `surface` background.
*   **Ambient Shadows:** If a floating state (like a Modal) is required, use an "Atmospheric Shadow": `0px 24px 48px rgba(44, 47, 48, 0.06)`. The shadow must be tinted with the `on-surface` color (#2C2F30) to feel like natural light passing through a premium lens.
*   **The "Ghost Border" Fallback:** For accessibility in form inputs, use the `outline-variant` (#ABADAE) at **15% opacity**. This provides a "hint" of a container without breaking the airy aesthetic.
*   **Glassmorphism:** Use `surface-container-lowest` at 80% opacity with a `blur(16px)` for headers. This allows the vibrant `primary` orange accents of the content to bleed through as the user scrolls, maintaining the "High-Velocity" energy.

## 5. Components
All components follow the **Roundedness Scale**, primarily utilizing `lg` (0.5rem) for a modern, sophisticated feel that isn't overly "bubbly."

*   **Buttons:**
    *   *Primary:* Gradient fill (Primary to Primary-Container), `white` text, `full` rounding (pill-shape).
    *   *Secondary:* `surface-container-high` fill with `primary` text. No border.
*   **Input Fields:** Use `surface-container-low` as the fill. Upon focus, transition to `surface-container-lowest` with a 1px "Ghost Border" in `primary`.
*   **Cards:** Forbid the use of divider lines. Separate card header from body using a 24px `spacing-lg` block or a subtle shift from `surface-container-low` to `surface-container-lowest`.
*   **Chips:** Use `surface-container-highest` for unselected and the vibrant `primary-fixed` (#FA9118) for active states.
*   **Velocity Indicators (Custom Component):** Use 2px thick horizontal lines of varying lengths in `primary-container` to act as decorative accents under titles, reinforcing the "Forest Wheel" speed.

## 6. Do’s and Don’ts

### Do:
*   **Do** use extreme whitespace. If you think there is enough room, add 16px more.
*   **Do** use `primary` orange sparingly. It is a high-energy accent; overusing it devalues its "Ignition" impact.
*   **Do** align text-heavy content to a strict grid, but allow images and decorative elements to "break" the grid lines.

### Don't:
*   **Don't** use black (#000000). Use `on-surface` (#2C2F30) for all text to keep the "Airy" feel.
*   **Don't** use standard 1px dividers. If you need to separate content, use a background tonal shift or a 16px vertical gap.
*   **Don't** use "Drop Shadows" on buttons. Use the gradient fill to provide the necessary visual weight.