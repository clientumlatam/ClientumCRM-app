---
name: Boolean navigation handlers
description: Prevent React event objects from being interpreted as force flags in navigation callbacks.
---

Event handlers that accept an optional boolean control argument must be wrapped in a zero-argument callback at the JSX call site.

**Why:** React passes a MouseEvent to direct event handlers. A truthy event object can accidentally bypass authentication or other guards intended for an explicit `true` flag.

**How to apply:** Use `onClick={() => enterApp()}` for guarded navigation callbacks, and reserve explicit boolean arguments for intentional programmatic calls.