Remove all haptic vibration on touch devices.

- `src/components/tap-glow.tsx`: delete the `navigator.vibrate?.(6)` call inside `onTouch`.
- `src/components/magnetic-button.tsx`: delete the `navigator.vibrate?.(8)` call inside `handleClick` (keep `onClick` passthrough).

Visual tap glow + active scale stay; only vibration is removed.