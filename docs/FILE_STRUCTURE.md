# Project File Structure

Complete directory tree and file organization guide for ContractGuard.

## Root Directory

```
Janta/
├── src/                       # Source code directory
├── docs/                      # Documentation files
├── dist/                      # Production build output (generated)
├── node_modules/              # Dependencies (generated)
├── .gitignore                 # Git ignore rules
├── .editorconfig              # Editor configuration
├── index.html                 # HTML entry point
├── package.json               # Project configuration
├── package-lock.json          # Dependency lock file
├── tsconfig.json              # TypeScript configuration
├── tsconfig.node.json         # TypeScript config for build files
├── vite.config.ts             # Vite build configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
└── README.md                  # Main project documentation
```

## `/src` - Source Code

### Structure

```
src/
├── components/               # React components (organized by type)
├── pages/                    # Full-page components
├── services/                 # Business logic and API calls
├── hooks/                    # Custom React hooks
├── types/                    # TypeScript type definitions
├── utils/                    # Utility functions
├── App.tsx                   # Root component
├── main.tsx                  # React application entry point
└── index.css                 # Global styles and Tailwind imports
```

## `/src/components` - React Components

### Organization Strategy

Components are organized by their **type and purpose** rather than by feature. This allows for better code reuse and clarity.

```
components/
├── shared/                   # Core reusable UI components
│   ├── ErrorBoundary.tsx     # Error boundary for catching React errors
│   ├── ErrorAlert.tsx        # Error message display component
│   ├── ToastNotification.tsx # Toast notification system
│   ├── LoadingSpinner.tsx    # Loading indicator component
│   ├── StatCard.tsx          # Statistics card component
│   ├── ContractTable.tsx     # Contract list (responsive table/cards)
│   ├── ContractUpload.tsx    # File upload interface
│   └── index.ts              # Barrel export
│
├── layout/                   # Navigation and page structure
│   ├── Navigation.tsx        # Desktop navigation bar
│   ├── MobileNav.tsx         # Mobile hamburger menu and drawer
│   └── index.ts              # Barrel export
│
├── modals/                   # Dialog and modal components
│   ├── AlertsModal.tsx       # Email alerts display modal
│   ├── ContractDetailsModal.tsx  # Contract details viewer modal
│   └── index.ts              # Barrel export
│
├── charts/                   # Data visualization components
│   ├── RiskDistributionChart.tsx  # Pie chart for risk levels
│   ├── ContractPerformanceChart.tsx  # Bar chart for performance
│   └── index.ts              # Barrel export
│
└── index.ts                  # Main barrel export (aggregates all)
```

### Component Categories

#### `shared/` - Reusable UI Components
Used across multiple pages and features. These are generic, single-purpose components.

- **ErrorBoundary.tsx** (45 lines)
  - Catches React component errors
  - Shows fallback UI with reload button
  - Prevents entire app from crashing

- **ErrorAlert.tsx** (45 lines)
  - Displays error messages to users
  - Shows error icon and dismiss button
  - Red border styling for visibility

- **ToastNotification.tsx** (70 lines)
  - Toast notification system
  - Auto-dismiss functionality
  - Multiple toast support
  - Types: success, error, info

- **LoadingSpinner.tsx** (30 lines)
  - Animated loading indicator
  - Multiple size options
  - Optional message text
  - Full-screen variant

- **StatCard.tsx** (25 lines)
  - Statistics display card
  - Icon support
  - Number formatting
  - Trend indication

- **ContractTable.tsx** (125 lines)
  - Responsive contract list
  - Mobile: card-based layout
  - Desktop: traditional table
  - Click handlers for details

- **ContractUpload.tsx** (128 lines)
  - File upload interface
  - Drag-and-drop support
  - Progress indicator
  - File validation feedback

#### `layout/` - Navigation Components
Page-level structure and navigation elements.

- **Navigation.tsx** - Desktop navigation bar
  - User profile display
  - Alerts badge counter
  - Desktop-only (hidden on mobile)
  
- **MobileNav.tsx** - Mobile navigation
  - Hamburger menu trigger
  - Drawer navigation panel
  - Mobile-only (hidden on desktop)

#### `modals/` - Dialog Components
Modal and dialog windows for user interaction.

- **AlertsModal.tsx** (71 lines)
  - Display email alerts
  - Renewal and risk alerts
  - Send alert functionality
  - Mobile bottom-sheet layout

- **ContractDetailsModal.tsx** - Contract detail viewer
  - Display full contract information
  - Risk breakdown
  - Key metrics
  - Responsive sizing

#### `charts/` - Data Visualization
Chart and graph components using Recharts library.

- **RiskDistributionChart.tsx** - Pie chart
  - Shows distribution of Low/Medium/High risks
  - Color-coded segments
  - Interactive legend

- **ContractPerformanceChart.tsx** - Bar chart
  - Compares risk vs compliance scores
  - Multiple contracts
  - Y-axis scales

### Barrel Export Pattern

Each subfolder has an `index.ts` that exports its components:

```typescript
// src/components/shared/index.ts
export { StatCard } from './StatCard';
export { ErrorBoundary } from './ErrorBoundary';
// ... more exports
```

Main export file aggregates all:

```typescript
// src/components/index.ts
export * from './shared';
export * from './charts';
export * from './modals';
export * from './layout';
```

**Benefits:**
- Clean imports: `import { ErrorAlert } from '@/components'`
- Easy reorganization: Move files without changing imports
- Better code organization: Related components grouped together

## `/src/pages` - Page Components

```
pages/
├── AuthPage.tsx              # Login/signup page
│   └── Components: Input fields, form validation, auth buttons
│
└── Dashboard.tsx             # Main application page
    └── Components: Stats, charts, contracts table, alerts
```

### AuthPage.tsx (200 lines)
- **Purpose**: User authentication interface
- **Features**:
  - Login form
  - Signup form with name field
  - Email/password validation
  - Switch between login/signup modes
  - Error display
  - Loading state

### Dashboard.tsx (166 lines)
- **Purpose**: Main application dashboard
- **Features**:
  - User stats display
  - Contracts list with search/filter
  - Risk distribution chart
  - Contract performance chart
  - Alerts modal
  - Contract details modal
  - Contract upload
  - Error handling

## `/src/services` - Business Logic

```
services/
├── authService.ts            # User authentication and persistence
├── contractService.ts        # Contract upload and analysis
├── alertService.ts           # Alert generation and management
└── storageService.ts         # Browser storage abstraction
```

### authService.ts
```typescript
async signup(email, password, name): User
async login(email, password): User
async getCurrentUser(): User | null
async setCurrentUser(user): void
async logout(): void
```

### contractService.ts
```typescript
async uploadAndAnalyzeContract(file): Contract
async loadContracts(userId): Contract[]
async saveContracts(userId, contracts): void
extractTextFromFile(file): Promise<string>
analyzeContractText(text): Promise<ContractAnalysis>
calculateStats(contracts): Statistics
getChartData(contracts): ChartData
```

### alertService.ts
```typescript
async loadAlerts(userId): Alert[]
async saveAlerts(userId, alerts): void
checkContractAlerts(contract): Alert[]
sendAlert(alertId, alerts): Alert[]
```

### storageService.ts
```typescript
async get(key): { value: string } | null
async set(key, value): void
async remove(key): void
async clear(): void
```

## `/src/hooks` - Custom React Hooks

```
hooks/
├── useContractData.ts        # Contract and alert state management
├── useFormValidation.ts      # Form validation and state
└── useToast.ts               # Toast notification management
```

### useContractData(user)
- Manages contracts and alerts state
- Auto-loads data on user change
- Provides: contracts, alerts, addContract, markAlertSent

### useFormValidation({ validate, onSubmit })
- Form state management with validation
- Touched field tracking
- Error management
- Provides: errors, touched, handleChange, handleBlur, handleSubmit

### useToast()
- Toast notification lifecycle
- Auto-dismiss after duration
- Provides: toasts, showToast, removeToast, clear

## `/src/types` - TypeScript Definitions

```
types/
└── index.ts                  # All type definitions
```

### Type Definitions
```typescript
interface User { ... }        # User account data
interface Contract { ... }    # Contract metadata
interface Alert { ... }       # Alert notification
interface ContractAnalysis { ... }
interface Risk { ... }
interface ValidationError { ... }
type RiskLevel = 'Low' | 'Medium' | 'High'
```

## `/src/utils` - Utility Functions

```
utils/
├── validationUtils.ts        # Form validation functions
└── errorUtils.ts             # Error handling utilities
```

### validationUtils.ts
```typescript
validateEmail(email): string | null
validatePassword(password): string | null
validateName(name): string | null
validateFile(file, options): string | null
validateSignupForm(...): ValidationResult
validateLoginForm(...): ValidationResult
getFieldError(errors, fieldName): string | null
hasFieldError(errors, fieldName): boolean
```

### errorUtils.ts
```typescript
classifyError(error): ErrorType
safeAsync(fn, errorHandler): Promise
retryAsync(fn, maxRetries, delay): Promise
logError(error, context): void
```

## `/docs` - Documentation

```
docs/
├── SETUP.md                  # Installation and setup guide
├── ARCHITECTURE.md           # Technical architecture
├── CONTRIBUTING.md           # Contributing guidelines
└── FILE_STRUCTURE.md         # This file
```

### SETUP.md
Step-by-step guide for:
- Prerequisites
- Installation
- Configuration
- Development workflow
- Troubleshooting

### ARCHITECTURE.md
Technical overview including:
- System design
- Data flow
- State management
- Error handling
- Performance considerations
- Security recommendations

### CONTRIBUTING.md
Development guidelines:
- Code style
- Commit conventions
- PR process
- Testing requirements
- Documentation standards

## Configuration Files

### `tsconfig.json`
TypeScript compiler configuration:
- Module resolution
- Target ES version
- Path aliases (@/)
- Strict mode enabled

### `vite.config.ts`
Build tool configuration:
- React plugin
- Path aliases
- Development server
- Build output settings

### `tailwind.config.js`
CSS framework configuration:
- Theme customization
- Color palette
- Typography
- Responsive breakpoints

### `postcss.config.js`
CSS processing:
- Tailwind CSS integration
- Autoprefixer

### `package.json`
Project metadata:
- Name, version, description
- Dependencies
- Dev dependencies
- Build scripts
- Engine requirements

## Ignored Files (`.gitignore`)

```
node_modules/        # Dependencies
dist/                # Build output
.env.local           # Local environment variables
.DS_Store            # macOS files
*.log                # Log files
```

## Import Path Strategy

The project uses path aliases for cleaner imports:

```typescript
// Instead of:
import { User } from '../../../types'

// Use:
import { User } from '@/types'

// Configured in tsconfig.json:
// "@/*": ["./src/*"]
```

Alias prefix: `@/`

Available aliases:
- `@/components` - Component directory
- `@/pages` - Page components
- `@/services` - Services
- `@/hooks` - Custom hooks
- `@/types` - Type definitions
- `@/utils` - Utility functions

## File Size Reference

```
src/
├── components/
│   ├── shared/        ~600 lines total
│   ├── layout/        ~150 lines total
│   ├── modals/        ~150 lines total
│   └── charts/        ~200 lines total
├── pages/
│   ├── AuthPage       ~200 lines
│   └── Dashboard      ~166 lines
├── services/          ~500 lines total
├── hooks/             ~220 lines total
├── types/             ~80 lines
├── utils/             ~300 lines total
└── App.tsx            ~129 lines
```

**Total**: ~2,700 lines of application code

## How to Add New Files

### New Component
```bash
# 1. Create in appropriate subfolder
# src/components/shared/NewComponent.tsx

# 2. Add to subfolder index.ts
# export { NewComponent } from './NewComponent';

# 3. Already exported from main index.ts
# import { NewComponent } from '@/components'
```

### New Utility Function
```bash
# 1. Add to appropriate utils file
# src/utils/validationUtils.ts

# 2. Export in the file
# export const newUtil = () => { ... }

# 3. Import where needed
# import { newUtil } from '@/utils/validationUtils'
```

### New Page
```bash
# 1. Create page component
# src/pages/NewPage.tsx

# 2. Add to App.tsx if needed
# import { NewPage } from '@/pages/NewPage'
```

---

This organization supports clean code, easy maintenance, and scalable development. Each file has a clear purpose and logical placement.
