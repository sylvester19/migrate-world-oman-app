# Copilot Instructions for Migrate World Oman

## Project Overview
This is a Next.js 14 application for the Oman Investor Residency Program registration system. It's a multi-step form application with internationalization support for English, Dutch, and Arabic.

## Tech Stack & Dependencies
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + DaisyUI (light theme only)
- **Language**: TypeScript
- **Key Libraries**: 
  - `react-select`, `react-international-phone` for form inputs
  - `country-state-city`, `localized-countries` for location data
  - `persona` for identity verification
  - `@nine-thirty-five/material-symbols-react` for icons

## Architecture Patterns

### Internationalization (i18n)
- **Route Structure**: Uses `[lang]` dynamic routes (`/en/`, `/ar/`, `/nl/`)
- **Dictionary System**: Centralized translations in `src/common/dictionaries/`
- **Server-Side**: `getDictionary()` function loads translations server-side only (`'server-only'`)
- **RTL Support**: Arabic sets `dir="rtl"` automatically in layout
- **Pattern**: Always pass `content` prop with translations and `lang` prop to components

```tsx
// Example usage
const t = await getDictionary(lang);
<Portal content={t.portal} lang={lang} />
```

### Form Architecture
- **Multi-Stage Flow**: Portal → Verification → Form (5 stages: ResidencyOption → PersonalInformation → Dependents → UploadDocuments → Payment → PersonaVerification)
- **State Management**: Props drilling pattern with setter functions passed down
- **Stage Control**: Numeric stage state (0-5) controls which form component renders
- **Data Flow**: Each stage updates shared state objects (`personalInformation`, `residencyOption`, etc.)

### Component Structure
- **Client Components**: All form components are marked with `"use client"`
- **Naming Convention**: PascalCase for component folders and files
- **Props Pattern**: Always include `content` (translations), `lang`, and relevant state setters
- **Timeline Component**: Visual progress indicator that syncs with form stage

## Key Development Patterns

### Component Props Interface
Every form component follows this pattern:
```tsx
interface Props {
  stageSet: (stage: number) => void;
  formId: any;
  content: any;
  lang: string;
  // + component-specific props
}
```

### Translation Access
- Nest translations in JSON matching component hierarchy
- Access via dot notation: `content.steps.step1.title`
- Always provide fallbacks for missing translations

### Form Validation & Flow
- Components handle their own validation before calling `stageSet(nextStage)`
- `refNo` and `formId` are passed through entire form flow for tracking
- Verification must complete before form access

## File Organization
- **Components**: Organized by feature in `src/components/`
- **Forms**: Sub-components in `src/components/form/[ComponentName]/`
- **Shared**: Layout components in `src/components/layout/`
- **Config**: Middleware and shared config in `src/common/config/`

## Development Workflow
- **Dev Server**: `npm run dev`
- **Build**: `npm run build` 
- **Linting**: `npm run lint`
- **No custom middleware**: Standard Next.js routing with dynamic `[lang]` segments

## Critical Integration Points
- **Persona SDK**: Used for identity verification in final stage
- **Country/State/City**: Dropdowns populated from `country-state-city` library
- **Phone Input**: International phone validation with `react-international-phone`
- **File Uploads**: Handled in `UploadDocuments` component with `UploadFile` sub-component

When working on this codebase, always maintain the established patterns for i18n, prop drilling, and stage-based form flow.