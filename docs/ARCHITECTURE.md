# Project Architecture

## Overview

ContractGuard is built with a layered architecture that separates concerns into components, services, and utilities. This document outlines the technical structure and data flow.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              React Components (Functional)                 │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │  Pages: AuthPage, Dashboard                          │  │ │
│  │  │  Components: Charts, Modals, Tables, Cards           │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                      State Management                            │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Custom Hooks (React Hooks API)                            │ │
│  │  ├── useContractData: App-wide data management             │ │
│  │  ├── useFormValidation: Form state and validation          │ │
│  │  └── useToast: Notification management                     │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                          │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Services (API calls and data processing)                  │ │
│  │  ├── authService: Authentication & user persistence        │ │
│  │  ├── contractService: Contract analysis & upload           │ │
│  │  ├── alertService: Alert generation & management           │ │
│  │  └── storageService: Data persistence abstraction          │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    External Services                             │
│  ├── Browser localStorage API                                  │
│  ├── Anthropic Claude AI API                                   │
│  └── File API (for file uploads)                               │
└─────────────────────────────────────────────────────────────────┘
```

## Directory Structure and Responsibilities

### `/src/components/` - UI Components

Organized into logical subfolders:

#### `shared/` - Reusable UI Components
- **ErrorBoundary.tsx** - Catches React errors and displays fallback UI
- **ErrorAlert.tsx** - Displays error messages to users
- **ToastNotification.tsx** - Toast notification system
- **LoadingSpinner.tsx** - Loading indicators
- **StatCard.tsx** - Statistics display cards
- **ContractTable.tsx** - Dual-view contract list (table/cards)
- **ContractUpload.tsx** - File upload interface

#### `layout/` - Navigation and Structure
- **Navigation.tsx** - Desktop navigation bar
- **MobileNav.tsx** - Mobile hamburger menu and drawer

#### `modals/` - Dialog Components
- **AlertsModal.tsx** - Email alerts display modal
- **ContractDetailsModal.tsx** - Contract detail viewer

#### `charts/` - Data Visualization
- **RiskDistributionChart.tsx** - Pie chart showing risk distribution
- **ContractPerformanceChart.tsx** - Bar chart comparing contracts

### `/src/pages/` - Page Components

Full-page components that compose smaller components:

- **AuthPage.tsx** - Login/signup page (no authentication required)
- **Dashboard.tsx** - Main app dashboard (requires authentication)

### `/src/services/` - Business Logic

Service layer handling domain logic and API calls:

```typescript
// authService.ts
- signup(email, password, name): Creates new user account
- login(email, password): Authenticates user
- getCurrentUser(): Retrieves persisted user
- setCurrentUser(user): Persists user session
- logout(): Clears user session

// contractService.ts
- uploadAndAnalyzeContract(file): Uploads and analyzes contract
- loadContracts(userId): Retrieves user's contracts
- saveContracts(userId, contracts): Persists contracts
- authenticateContract(file): Analyzes with Claude API
- calculateStats(contracts): Generates statistics

// alertService.ts
- loadAlerts(userId): Retrieves user's alerts
- saveAlerts(userId, alerts): Persists alerts
- checkContractAlerts(contract): Generates new alerts
- sendAlert(alertId, alerts): Marks alert as sent

// storageService.ts
- get(key): Retrieves from localStorage
- set(key, value): Saves to localStorage
- remove(key): Deletes from localStorage
- clear(): Clears all localStorage
```

### `/src/hooks/` - Custom React Hooks

Encapsulate component logic and state:

```typescript
// useContractData(user)
- Manages contracts and alerts state
- Handles loading and error states
- Provides methods: addContract, markAlertSent
- Auto-loads data when user changes

// useFormValidation({ validate, onSubmit })
- Generic form state management
- Real-time validation with touched field tracking
- Methods for field validation and error management

// useToast()
- Manages toast notification stack
- Auto-dismiss after duration
- Methods: showToast, removeToast, clear
```

### `/src/types/` - TypeScript Definitions

```typescript
// User
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

// Contract
interface Contract {
  id: string;
  fileName: string;
  uploadedAt: string;
  contractType: string;
  vendor: string;
  summary: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  riskScore: number;
  risks: Risk[];
  renewalDate: string;
  autoRenews: boolean;
  noticePeriod: string;
  value: string;
  complianceScore: number;
}

// Alert
interface Alert {
  id: string;
  contractId: string;
  type: 'renewal' | 'risk';
  message: string;
  sent: boolean;
}
```

### `/src/utils/` - Utility Functions

Helper functions and algorithms:

```typescript
// validationUtils.ts
- validateEmail(email): Email validation
- validatePassword(password): Password validation
- validateName(name): Name validation
- validateFile(file): File validation
- validateSignupForm(email, password, name): Combined validation
- validateLoginForm(email, password): Combined validation

// errorUtils.ts
- classifyError(error): Error classification
- safeAsync(fn, handler): Error handling wrapper
- retryAsync(fn, maxRetries): Retry logic
```

## Data Flow

### Authentication Flow

```
User inputs credentials
    ↓
AuthPage.tsx
    ├── handleSubmit()
    ├── validateForm() in validationUtils
    └── authService.login/signup()
         ├── Validates credentials
         ├── storageService.set(currentUser)
         └── Returns User object
    ↓
App.tsx updates state
    ↓
Redirect to Dashboard
```

### Contract Upload Flow

```
User selects file
    ↓
ContractUpload.tsx
    ├── validateFile() in validationUtils
    ├── onUploadStart()
    └── contractService.uploadAndAnalyzeContract()
         ├── extractTextFromFile()
         ├── Calls Claude API for analysis
         ├── Creates Contract object
         └── Returns Contract
    ↓
useContractData.addContract()
    ├── Updates contracts state
    ├── contractService.saveContracts()
    ├── Generates alerts via alertService
    └── Updates UI
```

### Alert Generation Flow

```
Contract uploaded
    ↓
alertService.checkContractAlerts()
    ├── Checks renewal date (within 30 days?)
    ├── Checks risk level (High?)
    └── Creates Alert objects
    ↓
useContractData.saveAlerts()
    ├── Updates alerts state
    └── storageService.set(alerts)
    ↓
AlertsModal displays alerts
```

## State Management Strategy

### Local Component State
- Form inputs (typing in input fields)
- Modal open/close state
- Temporary UI state (dropdowns, tabs)

### Custom Hook State
- **useContractData**: Contracts, alerts, loading state
- **useFormValidation**: Form fields, errors, touched state
- **useToast**: Toast notification stack

### Persistent State
- **localStorage**: Current user, contracts, alerts
- **Restored on app mount** by authService.getCurrentUser()

## Error Handling Strategy

### Error Types
1. **Validation Errors** - Form input validation
2. **Network Errors** - API failures
3. **Auth Errors** - Login/permissions issues
4. **File Errors** - Upload/parsing failures
5. **System Errors** - Unexpected runtime errors

### Error Handling Mechanisms

```
Component Error
    ↓
ErrorBoundary.tsx (catches render errors)
    ├── Logs error
    └── Shows fallback UI + reload button
    
OR
    
try-catch in async operations
    ├── classifyError(error)
    ├── Show user-friendly message
    └── useToast() for notification
    
OR
    
Component-level error state
    ├── Catch in handler
    ├── Display ErrorAlert component
    └── useToast() for notification
```

## Performance Considerations

### Optimizations
- **Lazy loading**: Components loaded on demand
- **Memoization**: Props and callbacks memoized where needed
- **Event delegation**: Modal backdrops use event delegation
- **Local storage**: Minimizes API calls

### Potential Improvements
- React Query for caching API responses
- Code splitting for bundle optimization
- Service worker for offline support
- Virtual scrolling for large contract lists

## Testing Architecture

### Component Testing
- Each component is independently testable
- Props are clearly defined via interfaces
- Unit tests can mock services

### Service Testing
- Services are pure functions
- Input/output easily testable
- Can mock storage and API calls

### Integration Testing
- Test full user flows
- Mock localStorage
- Test error boundaries

## Scalability Considerations

### Current Limitations
- localStorage limited to ~5-10MB per origin
- No authentication server
- No real database

### Future Improvements
- Migrate to backend API
- Implement real user authentication
- Move data to database
- Add caching layer (Redis)
- Implement request queuing
- Add background job processing

## Security Considerations

### Current Implementation
- Client-side validation
- No sensitive data transmission
- localStorage for frontend storage only

### Production Recommendations
- Implement HTTPS
- Server-side validation
- Password hashing (bcrypt)
- JWT authentication
- CORS configuration
- Rate limiting
- Input sanitization
- XSS prevention

## Dependencies

### Core Technologies
- **React 18.2**: UI framework
- **TypeScript 5.2**: Type safety
- **Vite 5.0**: Build tool
- **Tailwind CSS 3.3**: Styling

### UI Libraries
- **Lucide React**: Icon library
- **Recharts**: Charts and graphs

### Development Tools
- **PostCSS**: CSS processing
- **ESLint**: Code linting
- **TypeScript**: Type checking

## Configuration Files

### `vite.config.ts`
- Defines build configuration
- Path aliases (@/...)
- Plugin configuration
- Development server settings

### `tsconfig.json`
- TypeScript compiler options
- Module resolution
- Path alias mapping

### `tailwind.config.js`
- Tailwind theme customization
- Custom colors, fonts
- PostCSS integration

### `package.json`
- Project metadata
- Dependencies and versions
- Build scripts
- Engine requirements

---

This architecture supports:
- ✅ Clear separation of concerns
- ✅ Easy testing and maintenance
- ✅ Scalable component structure
- ✅ Type-safe development
- ✅ Responsive design patterns
- ✅ Error handling and recovery
