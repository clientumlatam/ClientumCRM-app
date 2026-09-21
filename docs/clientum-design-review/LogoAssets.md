# Logo Assets

- **Principal Branding Asset**: `public/favicon.svg`
    - This is the anchor for Clientum branding across the suite.
- **Secondary Branding Asset**: `public/logo.png`
    - Used where a full-color logo with text is required.
- **Guidelines**:
    - Never stretch, colorize, or rotate assets.
    - Use against the designated background surfaces (`#F5F7FA` or `#022046`) for maximum contrast.
- **Implementation**: All components must import assets via the centralized `useClientumAssets` hook to ensure consistency and prevent broken path references across the suite.
