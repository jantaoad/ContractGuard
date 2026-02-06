# ContractGuard - AI-Powered Contract Analysis Platform

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org)

A modern, responsive web application for analyzing contracts using artificial intelligence, identifying risks, and managing contract renewals. Built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **AI-Powered Contract Analysis** - Automatic extraction and analysis of contract text using Claude API
- **Risk Assessment** - Intelligent risk scoring and categorization (Low, Medium, High)
- **Contract Management** - Upload, store, and organize contracts with detailed metadata
- **Smart Alerts** - Automated renewal reminders and high-risk contract notifications
- **Compliance Tracking** - Real-time compliance scoring for each contract
- **Responsive Design** - Fully optimized for mobile, tablet, and desktop devices
- **Data Persistence** - Local storage ensures your data persists across browser sessions
- **Form Validation** - Comprehensive client-side validation for all user inputs
- **Error Handling** - Global error boundaries with user-friendly error messages
- **Real-time Notifications** - Toast notifications for user feedback

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Development](#development)
- [Building](#building)
- [Architecture](#architecture)
- [Technologies](#technologies)
- [API Integration](#api-integration)
- [Data Persistence](#data-persistence)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 📦 Prerequisites

- **Node.js** 16.0.0 or higher
- **npm** 7.0.0 or higher (or yarn)
- **Modern web browser** (Chrome, Firefox, Safari, Edge)
- **Anthropic API Key** (for contract analysis features)

## 🔧 Installation

### 1. Clone or download the repository

```bash
cd Janta
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables (Optional)

For production use with the Anthropic API:

```bash
# Create a .env file in the root directory
VITE_ANTHROPIC_API_KEY=your_api_key_here
```

### 4. Start the development server

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or next available port).

### 5. Build for production

```bash
npm run build
```

Production files will be in the `dist/` directory.

## 📁 Project Structure

```
contract-guard/
├── src/
│   ├── components/              # Reusable React components
│   │   ├── shared/             # Core UI components (buttons, alerts, spinners)
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── ErrorAlert.tsx
│   │   │   ├── ToastNotification.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── ContractTable.tsx
│   │   │   ├── ContractUpload.tsx
│   │   │   └── index.ts
│   │   ├── layout/             # Navigation and layout components
│   │   │   ├── Navigation.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   └── index.ts
│   │   ├── modals/             # Modal and dialog components
│   │   │   ├── AlertsModal.tsx
│   │   │   ├── ContractDetailsModal.tsx
│   │   │   └── index.ts
│   │   ├── charts/             # Data visualization components
│   │   │   ├── RiskDistributionChart.tsx
│   │   │   ├── ContractPerformanceChart.tsx
│   │   │   └── index.ts
│   │   └── index.ts            # Main export file
│   ├── pages/                   # Page-level components
│   │   ├── AuthPage.tsx         # Login/signup page
│   │   └── Dashboard.tsx        # Main application dashboard
│   ├── services/                # Business logic and API calls
│   │   ├── authService.ts       # Authentication and user persistence
│   │   ├── contractService.ts   # Contract upload and analysis
│   │   ├── alertService.ts      # Alert management and notifications
│   │   └── storageService.ts    # Local storage wrapper
│   ├── hooks/                   # Custom React hooks
│   │   ├── useContractData.ts   # Contract and alert data management
│   │   ├── useFormValidation.ts # Form state and validation
│   │   └── useToast.ts          # Toast notification management
│   ├── types/                   # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/                   # Utility functions
│   │   ├── validationUtils.ts   # Form validation functions
│   │   └── errorUtils.ts        # Error handling utilities
│   ├── App.tsx                  # Root application component
│   ├── main.tsx                 # React entry point
│   └── index.css                # Global styles and Tailwind imports
├── docs/                         # Additional documentation
├── public/                       # Static assets
├── index.html                    # HTML entry point
├── package.json                  # Project dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts               # Vite configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── postcss.config.js            # PostCSS configuration
└── README.md                     # This file
```

## 💻 Usage

### Authentication

1. **Sign Up**: Create a new account with email, password, and name
2. **Log In**: Access existing account with email and password
3. **Session Persistence**: Your session persists across browser refreshes

### Uploading Contracts

1. Click "Upload New Contract" in the dashboard
2. Select a file (PDF, TXT, or DOCX)
3. Wait for AI analysis to complete
4. Review the contract details and risk assessment

### Managing Alerts

1. Alerts are automatically generated for:
   - Contracts renewing within 30 days
   - High-risk contracts
2. View alerts in the "Alerts" modal
3. Mark alerts as sent when actions are taken

### Contract Analysis Features

- **Risk Level**: Low, Medium, or High severity classification
- **Risk Score**: 0-100 numeric risk rating
- **Compliance Score**: 0-100 compliance rating
- **Renewal Date**: Automatic reminders for upcoming renewals
- **Auto-Renewal**: Detection of auto-renewal clauses
- **Notice Period**: Extraction of notice period requirements

## 🛠️ Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Development Guidelines

1. **Component Organization**
   - Use the appropriate subfolder in `/components`
   - Keep components focused and single-responsibility
   - Export components from subfolder `index.ts` files

2. **Typing**
   - Always use TypeScript for new components
   - Define interfaces for component props
   - Update `/types/index.ts` for shared types

3. **Styling**
   - Use Tailwind CSS utility classes
   - Implement mobile-first responsive design
   - Follow existing color schemes and patterns

4. **Form Validation**
   - Use validation functions from `validationUtils.ts`
   - Use the `useFormValidation` hook for form state
   - Show errors only on touched fields

5. **Error Handling**
   - Use error boundaries for component-level error handling
   - Use `useToast` hook for user notifications
   - Log errors appropriately for debugging

## 🏗️ Architecture

### State Management

- **React Hooks**: useState for local component state
- **Custom Hooks**: useContractData for app-wide data
- **Local Storage**: Browser storage for user and contract data persistence

### Data Flow

```
App.tsx
├── Loads persisted user on mount
├── Provides user context to Dashboard
└── Dashboard
    ├── Uses useContractData hook
    ├── Manages contracts and alerts
    └── Renders components with data
```

### Service Layer

- **authService**: Handles user authentication and persistence
- **contractService**: Manages contract uploads and analysis
- **alertService**: Handles alert generation and management
- **storageService**: Abstracts browser storage operations

## 🔌 Technologies

- **Frontend Framework**: React 18.2+
- **Language**: TypeScript 5.2+
- **Build Tool**: Vite 5.0+
- **Styling**: Tailwind CSS 3.3+
- **Components**: Lucide React (icons), Recharts (charts)
- **Runtime**: Node.js 16+

### Optional Dependencies

- **Claude API**: For AI-powered contract analysis
- **PDF.js**: For PDF text extraction (included in Claude API)

## 🤖 API Integration

### Anthropic Claude API

The application uses the Anthropic Claude API for contract analysis:

1. **Text Extraction**: Extracts text from uploaded documents
2. **Contract Analysis**: Analyzes contracts for risks, compliance, renewal dates
3. **Risk Scoring**: Provides numerical risk assessments

**API Endpoints Used:**
- POST `/v1/messages` - Contract analysis and text extraction

**Response Format:**
```json
{
  "contractType": "Service Agreement",
  "vendor": "Company Name",
  "summary": "Brief contract summary",
  "riskLevel": "Medium",
  "riskScore": 45,
  "risks": [...],
  "renewalDate": "2024-12-31",
  "autoRenews": true,
  "noticePeriod": "30 days",
  "value": "$50,000",
  "complianceScore": 78
}
```

## 💾 Data Persistence

### Storage Strategy

All data is stored in the browser's localStorage:

- **currentUser**: Currently logged-in user
- **contracts_{userId}**: User's uploaded contracts
- **alerts_{userId}**: User's generated alerts

### Data Structure

```typescript
// User
{
  id: string;
  name: string;
  email: string;
  password: string; // Hashed in production
}

// Contract
{
  id: string;
  fileName: string;
  uploadedAt: string;
  contractType: string;
  vendor: string;
  riskLevel: "Low" | "Medium" | "High";
  riskScore: number;
  // ... additional fields
}

// Alert
{
  id: string;
  contractId: string;
  type: "renewal" | "risk";
  message: string;
  sent: boolean;
}
```

## ⚠️ Troubleshooting

### Port Already in Use

```bash
# If port 5173 is in use, Vite will use 5174, 5175, etc.
# Or manually specify a port:
npm run dev -- --port 3000
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -r node_modules
npm install
```

### Build Errors

```bash
# Clear build cache and rebuild
rm -r dist
npm run build
```

### Data Not Persisting

- Check browser localStorage is enabled
- Open DevTools → Application → Local Storage
- Verify `currentUser` key exists
- Check for localStorage quota exceeded errors

### Components Not Updating

```bash
# Clear Vite cache
rm -r .vite
npm run dev
```

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes and test thoroughly
3. Ensure TypeScript compilation passes: `npm run build`
4. Commit with clear messages: `git commit -m "Add feature description"`
5. Push and create a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For issues, questions, or feedback:

1. Check the [docs/](docs/) folder for additional documentation
2. Review existing issues and documentation files
3. Create a new issue with detailed description

## 🗺️ Roadmap

- [ ] Backend API integration
- [ ] Advanced contract comparison
- [ ] Negotiation recommendation engine
- [ ] Document annotations and markup
- [ ] Export to PDF/Excel reports
- [ ] Advanced filtering and search
- [ ] Dark mode support
- [ ] Multi-language support
- [ ] Team collaboration features

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide)
- [Anthropic API Docs](https://docs.anthropic.com)

---

**Last Updated**: February 2026

**Version**: 0.0.1
