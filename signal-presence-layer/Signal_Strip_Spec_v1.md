# Signal Strip Spec v1

## Purpose
Define the ambient UI layer for TV, browser, and mobile that shows state instead of text-heavy interaction.

## UI Model
Bottom-edge, auto-hide strip.
- Appears on hover, trigger, or interaction.
- Semi-transparent.
- Minimal width.

## Dials (max 5)
- Momentum
- Confidence
- Pressure
- Moment Potential
- Insight Available

## States
1. Passive
   - Thin, subtle, low animation.

2. Active
   - Slight expansion.
   - Small label or colour change.

3. Detail
   - Tap → micro-card above strip.
   - One sentence max.

## Rules
- No interruption of primary content.
- <1 second comprehension.
- No scrolling UI.
- No long text blocks.

## Output Hierarchy
Signal → Short text → Detail (only if requested)
