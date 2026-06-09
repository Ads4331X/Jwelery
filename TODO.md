Update the project with the following requirements:

### Product Management (Admin)

* Add a `metal` field to products (Gold, Silver, Platinum, etc.).
* Product form should only require:

  * Image
  * Title
  * Badge
* Price must be optional since this is not an e-commerce site.
* Update validation and types accordingly.
* Display the metal type clearly on product cards and product details.

### Product Card UI

* Improve `ProductCard.tsx` UI.
* Use cleaner spacing, typography, and badge styling.
* Maintain consistent image ratios.
* Improve hover effects without overcomplicating the design.
* Ensure the design works well on mobile, tablet, and desktop.

### Product Filters

* Allow users to select multiple filters at the same time.
* Support OR filtering (e.g., Gold + Silver should show products matching either option).
* Improve filter UX and mobile experience.
* Show active filter count if appropriate.

### Responsiveness

* Audit the entire application.
* Fix mobile overflow, spacing, and layout issues.
* Ensure every component and page is fully responsive.
* Verify common breakpoints work correctly.

### Performance & Build Optimization

Fix the Vite warning:

```txt
[plugin builtin:vite-reporter]
(!) Some chunks are larger than 500 kB after minification.
```

Tasks:

* Implement route-based code splitting using dynamic imports where appropriate.
* Lazy load heavy pages/components.
* Remove unused dependencies.
* Remove unused imports.
* Reduce bundle size without changing functionality.
* Ensure production build completes without warnings when reasonably possible.

### Code Cleanup

* Remove dead code.
* Remove unused files, folders, components, utilities, and assets.
* Remove duplicate logic.
* Remove commented-out code.
* Keep the codebase clean and maintainable.
* Do not leave unused variables, functions, imports, interfaces, or types.
* TypeScript must compile with zero errors.

### Folder Structure

Review and improve the current folder structure.

* Keep a feature-based architecture.
* Remove unnecessary nesting.
* Move reusable code into shared locations.
* Improve maintainability and consistency.
* Do not create unnecessary abstraction layers.

### Code Quality Rules

* Keep implementations short and simple.
* Avoid over-engineering.
* Do not create code that is declared but never used.
* Do not introduce TypeScript, ESLint, or build errors.
* Reuse existing code where possible.
* Preserve existing functionality unless a change is required.
* Prioritize readability, maintainability, responsiveness, and performance.
* Return production-ready, error-free code only.

Before removing any file or folder, verify it is not used anywhere in the project.
