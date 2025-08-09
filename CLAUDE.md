## Project Overview

- **The website is built with Astro** - a static site builder, version 4.x

### Project Structure

```
oktech-web/
├── content/                     # Static content and data - do not touch!
├── src/                         # Source code
│   ├── components/              # React and Astro components
│   ├── layouts/                 # Page layouts
│   ├── pages/                   # Astro pages (routes)
│   ├── styles/                  # Global CSS
│   └── utils/                   # Utility functions
├── scripts/                     # Build and data scripts
├── test/                        # Test files
│   ├── e2e/                     # End-to-end tests
│   └── screenshots/             # Visual regression tests
├── package.json                 # NPM dependencies and scripts
├── astro.config.ts              # Astro framework configuration
└── tsconfig.json                # TypeScript configuration
```

## Agent Behavior

- **Never assume missing context** - liberally ask questions if even slightly uncertain
- **Only install libraries if you need to** - our framework may support much of what you need already
- **Never hallucinate libraries or functions** - only use verified packages from package.json
- **Always confirm file paths and module names** exist before referencing them
- **Use the `context7` MCP tool** for unfamiliar or updated libraries
- **Never make git commands** unless explicitly instructed
- **Do what has been asked; nothing more, nothing less**
- **Always prefer editing existing files** over creating new ones
- **Never create files unless absolutely necessary**
- **Never proactively create documentation files** (\*.md) unless explicitly requested
- **Clean up after yourself** - remove unused imports, variables, functions, and components
- **Actively identify and remove dead code** - if code isn't being used, delete it

## Development Workflow

- **We are running a dev server in the background** - don't start your own
- **Use TDD for new features** - create failing tests first, then implement
- **Update existing tests** when logic changes
- **Never use `--headed` or `--debug`** with playwright tests - use default headless mode
- **Use `npm run checks`** frequently to verify imports (it's cheap)
- **Use `npm run test -- my-test-name`** during development to run a single test

## Code Structure & Modularity

- **Never create a file longer than 150 lines of code** - refactor into modules or helper files
- **Use consistent naming conventions, file structure, and architecture patterns**
- **Organize code into clearly separated modules**, grouped by feature or responsibility
- **Use `@/` imports** unless the component is a direct `./` sibling, avoid `../` imports
- **For React components, use `export default function ComponentName`** pattern, not named exports
- **Prefer React components (.tsx) over Astro components (.tsx)**, save Astro components for pages and layouts
- **Follow existing patterns** and check neighboring files for style/structure

## Style & Conventions

- **Always use TypeScript**, never JavaScript
- **Follow the DRY principle** - avoid duplication
- **Keep comments minimal** - only for important or unintuitive nuances, use `// Reason:` for complex logic
- **Never use `any`, `// eslint-disable-next-line`**, or similar type shortcuts
- **Astro templates require opening and closing frontmatter fences (---)** with TypeScript code in between
- **We are using daisy ui v5**, so always use these components when possible, and use its theme classes
- **Use Tailwind classes instead of inline styles** - prefer `className="text-[2vw]"` over `style={{ fontSize: '2vw' }}`
- **Always use `flex` on divs in OG image templates** - this is a limitation of the og image generator.

## Icons & Components

- **Icon libraries**: Use `lucide:` for Astro and `lu` for React for general icons, and `fa6` for brand icons
- **For Astro components**: use astro-icon - `import { Icon } from "astro-icon/components"` with `<Icon name="lucide:home" />`
- **For React components**: use react-icons - `import { Home } from "react-icons/lu"` and `import { FaGoogle } from "react-icons/fa6"` for brands
- **Use the `client:visible` directive** when importing interactive React components in Astro files - add it only if the component needs client-side interactivity (e.g., `<MyComponent client:visible />`)

## Internal Links

- **Use LinkAstro and LinkReact components** as they handle URL prefixing
- **Import for Astro**: `import Link from "@/components/Common/LinkAstro.astro"`
- **Import for React**: `import Link from "@/components/Common/LinkReact"`

## Testing Guidelines

- **Use descriptive test names** that clearly indicate what is being tested
- **Follow existing test patterns** in each directory for consistency
- **Use playwright conventional data-testid attributes for testing** - `data-testid="tag"` and `getByTestId("tag")`
- **ALWAYS use data-testid selectors** - avoid using h1, h3, class selectors, or other CSS selectors. If an element needs to be tested, it should have a data-testid attribute
- **All tests go in the `/test/e2e/**.spec.ts`or`/test/screenshots/**.test.ts` directory** - never create test files outside this location
- **E2E tests go in `/test/e2e`** - for testing user flows, navigation, and feature interactions, checking elements exist, etc. but not for visual tests, and should not take screenshots.
- **Visual tests go in `/test/screenshots`** - for UI consistency, layout verification, overflowing, etc. and should always take at least screenshot and a simple dom element existance check. do not test for logical correctness, just visual correctness. check with multiple viewports when necessary using `VIEWPORTS.forEach((viewport) => {`
- **Use the `takeScreenshot` helper** - `import { takeScreenshot } from "../helpers/screenshot"` for all screenshot operations in tests
- **Use the `VIEWPORTS` helper** - `import { VIEWPORTS } from "../helpers/viewports"` for all viewport operations in tests
- **Screenshot naming** - use descriptive names without file extensions, the helper adds `.png` automatically
- **Visual test screenshots are stored in `/test/screenshots/output`** - you can reference these for visual checks
