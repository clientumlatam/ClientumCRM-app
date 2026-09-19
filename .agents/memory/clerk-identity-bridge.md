---
name: Clerk identity bridge
description: Guardrails for synchronizing Clerk's user state into React application state.
---

The Clerk-to-application bridge must synchronize only when the Clerk `userId` changes, and must not depend on context callbacks recreated on every render.

**Why:** Calling state setters from an effect whose dependencies include unstable context functions can create a render loop; in this app it surfaced as a blank preview and Clerk session refresh warnings.

**How to apply:** Keep the bridge idempotent with a last-seen user identifier, stabilize the sync callback with `useCallback`, and avoid adding non-memoized context actions to the bridge effect dependencies.

The initial sentinel for the last user must be distinct from the loaded signed-out
value: use `undefined` for “Clerk has not reported yet” and `null` for “loaded,
signed out”. Any bridge action consumed through `useCRM()` must also be present in
the `CRMContext.Provider` value; TypeScript may not catch an omitted context value
when the provider is not explicitly typed.

**Why:** A missing `syncClerkAuth` provider entry caused the entire React tree to
blank, while treating the initial signed-out state as already synchronized left
private routes stuck on the auth-loading screen.

**How to apply:** When changing Clerk bridge methods or context types, verify both
the bridge effect and the provider value, then load `/` and `/app` in preview
before publishing.