# Project Setup Guide

## Quick Start

This guide helps you get ContractGuard up and running on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 16.0.0 or higher - [Download](https://nodejs.org)
- **npm** 7.0.0 or higher (comes with Node.js)
- **Git** (optional, for cloning the repository)
- **Code Editor** - VS Code recommended - [Download](https://code.visualstudio.com)

### Checking Your Installation

```bash
# Verify Node.js version
node --version  # Should be v16.0.0 or higher

# Verify npm version
npm --version   # Should be 7.0.0 or higher
```

## Step-by-Step Installation

### 1. Obtain the Project

**Option A: Clone from Git**
```bash
git clone <repository-url>
cd Janta
```

**Option B: Download ZIP**
- Download the project ZIP file
- Extract to your desired location
- Open terminal/command prompt in the project folder

### 2. Install Dependencies

```bash
npm install
```

This command will:
- Download all required packages listed in `package.json`
- Create a `node_modules` folder (~500MB)
- Generate a `package-lock.json` file

**Troubleshooting:**
- If installation fails, try clearing the npm cache: `npm cache clean --force`
- Ensure you have internet connection
- Try deleting `node_modules` folder and `package-lock.json`, then run `npm install` again

### 3. Verify Installation

```bash
# Check if all packages are installed correctly
npm list
```

You should see a tree of installed packages without errors.

### 4. Start Development Server

```bash
npm run dev
```

Expected output:
```
  VITE v5.4.21  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Configuration

### Environment Variables (Optional)

For production features, create a `.env` file in the project root:

```bash
# .env
VITE_ANTHROPIC_API_KEY=your_api_key_here
```

### Editor Configuration (VS Code)

Install recommended extensions:

1. **ES7+ React/Redux/React-Native snippets**
   - ID: `dsznajder.es7-react-js-snippets`

2. **TypeScript Vue Plugin (Volar)**
   - ID: `Vue.vscode-typescript-vue-plugin`

3. **Tailwind CSS IntelliSense**
   - ID: `bradlc.vscode-tailwindcss`

4. **ESLint**
   - ID: `dbaeumer.vscode-eslint`

5. **Prettier - Code formatter**
   - ID: `esbenp.prettier-vscode`

## Development Workflow

### Daily Development

```bash
# Start with hot reload - changes reflect immediately
npm run dev

# In another terminal, lint your code
npm run lint
```

### Making Changes

1. Edit files in the `src/` directory
2. Vite hot reload updates your browser automatically
3. If you get errors, check TypeScript compilation: `npm run build`

### Building for Production

```bash
# Create optimized production build
npm run build

# Preview the production build
npm run preview
```

The `dist/` folder contains files ready for deployment.

## Folder Navigation

### After Installation, Your Project Structure:

```
Janta/
├── node_modules/        # Package dependencies (created by npm install)
├── src/                 # Your source code
│   ├── components/      # React components
│   ├── pages/          # Page components
│   ├── services/       # Business logic
│   ├── hooks/          # Custom React hooks
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Root component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── dist/               # Production build (created by npm run build)
├── package.json        # Project configuration
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
└── README.md           # This project's documentation
```

## Common Tasks

### Create a New Component

1. Create file in appropriate folder: `src/components/[subfolder]/MyComponent.tsx`
2. Write your component with TypeScript
3. Export from the subfolder's `index.ts`
4. Use in other components: `import { MyComponent } from '@/components'`

### Add a New Dependency

```bash
# Install and save to package.json
npm install package-name

# Install dev dependency
npm install --save-dev package-name
```

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update all packages
npm update

# Update specific package
npm install package-name@latest
```

## Troubleshooting

### "npm: command not found"

Node.js and npm are not installed or not in your PATH.

**Solution:**
- Install Node.js from [nodejs.org](https://nodejs.org)
- Restart your terminal after installation
- Verify: `node --version`

### "Port 5173 already in use"

Another application is using the same port.

**Solution:**
```bash
# Vite will automatically try the next port (5174, 5175...)
npm run dev

# Or specify a different port
npm run dev -- --port 3000
```

### "Module not found" errors

Dependencies are not installed or corrupted.

**Solution:**
```bash
# Clear cache and reinstall
npm cache clean --force
rm -r node_modules
rm package-lock.json
npm install
```

### "Failed to parse .env file"

Syntax error in `.env` file.

**Solution:**
- Check `.env` file for syntax errors
- Format: `KEY=value` (no quotes needed)
- No spaces around `=` sign
- Remove any special characters

### App loads but shows blank page

Vite cache might be corrupted.

**Solution:**
```bash
# Clear Vite cache
rm -r .vite

# Restart development server
npm run dev
```

## Browser Requirements

- Chrome 60+ (recommended)
- Firefox 55+
- Safari 12+
- Edge 79+

Modern browsers needed for ES2020+ features.

## Next Steps

After successful setup:

1. Read the [README.md](../README.md) for feature overview
2. Check [ARCHITECTURE.md](./ARCHITECTURE.md) for codebase structure
3. Review [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines
4. Explore the `src/` folder to understand the project structure

## Getting Help

- Check this guide's troubleshooting section
- Review [README.md](../README.md)
- Check build errors: `npm run build`
- Review browser console for JavaScript errors
- Check terminal output for detailed error messages

---

**Happy coding! 🚀**
