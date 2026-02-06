# Contributing to ContractGuard

Thank you for your interest in contributing to ContractGuard! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Welcome diverse perspectives
- Focus on constructive feedback
- Report issues professionally

## Getting Started

### Prerequisites

- Node.js 16+
- npm 7+
- Git
- Familiarity with React, TypeScript, and Tailwind CSS

### Fork and Clone

```bash
# Fork the repository on GitHub

# Clone your fork
git clone https://github.com/your-username/Janta.git
cd Janta

# Add upstream remote
git remote add upstream https://github.com/original/Janta.git

# Create a feature branch
git checkout -b feature/your-feature-name
```

### Setup Development Environment

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# In another terminal, run linter
npm run lint
```

## Development Guidelines

### Code Style

#### TypeScript
- Use strict TypeScript (`strictNullChecks: true`)
- Define all types explicitly
- Avoid `any` type
- Use interfaces for object shapes

```typescript
// ❌ Avoid
const handleClick = (e: any) => { ... }

// ✅ Good
interface ButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  label: string;
}
```

#### React Components
- Use functional components with hooks
- Keep components focused and single-responsibility
- Extract complex logic into custom hooks
- Use proper naming conventions

```typescript
// ✅ Good component structure
interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: number;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend 
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      {/* Component JSX */}
    </div>
  );
};
```

#### Styling
- Use Tailwind CSS utility classes
- Follow mobile-first approach
- Use consistent color schemes
- Implement responsive design

```tsx
// ✅ Mobile-first responsive design
<div className="p-4 sm:p-6 md:p-8 text-sm sm:text-base md:text-lg">
  Content
</div>
```

### File Organization

#### Component Placement
```
src/components/
├── shared/          # Reusable UI components
├── layout/          # Navigation and structure
├── modals/          # Dialog components
├── charts/          # Data visualization
└── index.ts         # Barrel exports
```

#### Naming Conventions
- **Files**: PascalCase for components (e.g., `StatCard.tsx`)
- **Functions**: camelCase (e.g., `calculateRisk()`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`)
- **Types**: PascalCase (e.g., `ContractAnalysis`)

#### Import Order
```typescript
// 1. External dependencies
import React from 'react';
import { IconName } from 'lucide-react';

// 2. Internal absolute imports
import { User } from '@/types';
import { contractService } from '@/services/contractService';

// 3. Relative imports
import { LoadingSpinner } from '../shared/LoadingSpinner';

// 4. Styles
import './Component.css';
```

### TypeScript Best Practices

#### Define Interfaces for Props
```typescript
interface MyComponentProps {
  title: string;
  count: number;
  onSubmit: (data: FormData) => Promise<void>;
  disabled?: boolean;
}

export const MyComponent: React.FC<MyComponentProps> = ({ 
  title, 
  count 
}) => {
  // Implementation
};
```

#### Create Reusable Types
Add shared types to `src/types/index.ts`:

```typescript
// Instead of inline types
interface Result {
  isValid: boolean;
  errors: string[];
}

// Use React.FC with proper typing
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}
```

#### Use Union Types for Options
```typescript
// ✅ Good
type AlertType = 'success' | 'error' | 'info';
type RiskLevel = 'Low' | 'Medium' | 'High';

// ❌ Avoid
type AlertType = string;
```

### Performance Guidelines

#### Avoid Unnecessary Re-renders
```typescript
// ❌ Creates new function every render
const Component = () => {
  const handleClick = () => { /* ... */ };
  return <button onClick={handleClick}>Click</button>;
};

// ✅ Use useCallback for stable reference
const Component = () => {
  const handleClick = useCallback(() => { /* ... */ }, []);
  return <button onClick={handleClick}>Click</button>;
};
```

#### Optimize Dependencies
```typescript
// ✅ Include all dependencies
useEffect(() => {
  // effect code
}, [dependency1, dependency2]); // Include all used values

// ❌ Avoid missing dependencies
useEffect(() => {
  doSomething(dependency1);
}, []); // Missing dependency1!
```

### Component Testing

Each component should be testable:

```typescript
// ✅ Easy to test
export const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  label 
}) => (
  <button onClick={onClick} className="...">
    {label}
  </button>
);

// ❌ Hard to test (tightly coupled)
export const HomeButton = () => {
  const navigate = useNavigate();
  return <button onClick={() => navigate('/')}>Home</button>;
};
```

## Commit Guidelines

### Commit Message Format

```
type(scope): subject

body

footer
```

#### Types
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Adding tests
- `chore`: Build, dependencies, tooling

#### Examples
```bash
# Feature
git commit -m "feat(auth): add remember me functionality"

# Bug fix
git commit -m "fix(upload): prevent duplicate file submissions"

# Documentation
git commit -m "docs(setup): clarify installation steps"

# Refactor
git commit -m "refactor(contracts): simplify alert logic"
```

### Commit Best Practices

- Make small, logical commits
- One feature per commit when possible
- Include relevant context in commit message
- Reference issues: `fix #123`

```bash
git commit -m "fix(validation): correct email regex pattern

The previous pattern didn't accept plus addressing (+).
Now correctly validates emails with plus signs.

Fixes #456"
```

## Pull Request Process

### Before Submitting

1. **Update from upstream**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run tests and checks**
   ```bash
   npm run lint
   npm run build
   npm run type-check  # If available
   ```

3. **Test manually**
   - Test your changes in the browser
   - Test responsive design (desktop, tablet, mobile)
   - Test error scenarios

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation

## Related Issues
Fixes #123

## Testing
- [ ] Manual testing completed
- [ ] Tested on mobile/tablet
- [ ] Updated related types
- [ ] No console errors

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for clarity
- [ ] Documentation updated
- [ ] No new warnings generated
```

### PR Guidelines

- **Title**: Clear, descriptive summary
- **Description**: What changed and why
- **Screenshots**: For UI changes
- **Testing**: How to test the changes
- **Breaking Changes**: Clearly marked if any

## Testing Requirements

### Manual Testing Checklist

- [ ] Feature works as expected
- [ ] Mobile view is responsive
- [ ] Tablet view is responsive
- [ ] Desktop view works properly
- [ ] Error states are handled
- [ ] Loading states are shown
- [ ] Success states work correctly
- [ ] Form validation works
- [ ] Data persists after refresh
- [ ] Navigation works correctly
- [ ] No console errors or warnings

### Component Testing

Test components for:
- Props validation
- Event handlers
- Conditional rendering
- Empty states
- Error states
- Loading states
- Accessibility

## Documentation Requirements

### Code Comments

```typescript
// ✅ Good - explains WHY
// Filter contracts renewed in the next 30 days to show urgent alerts
const upcomingRenewals = contracts.filter(c => {
  const daysUntilRenewal = getDaysUntil(c.renewalDate);
  return daysUntilRenewal > 0 && daysUntilRenewal <= 30;
});

// ❌ Bad - states the obvious
// Get upcoming renewals
const upcomingRenewals = contracts.filter(...);
```

### JSDoc for Functions

```typescript
/**
 * Validates an email address format
 * @param email - The email string to validate
 * @returns null if valid, error message if invalid
 * @example
 * const error = validateEmail('test@example.com');
 * if (!error) { // valid email }
 */
export const validateEmail = (email: string): string | null => {
  // Implementation
};
```

### Update README for Major Changes

- New features should be documented
- Configuration changes should be explained
- Breaking changes must be noted

## ReviewProcess

### What Maintainers Look For

- ✅ Code quality and style adherence
- ✅ TypeScript correctness
- ✅ Component organization
- ✅ Performance considerations
- ✅ Error handling
- ✅ Accessibility compliance
- ✅ Testing and documentation
- ✅ No breaking changes (unless necessary)

### Common Review Comments

**"Please extract this to a custom hook"**
- Complex state logic should be in hooks
- Makes testing easier
- Improves reusability

**"This component is doing too much"**
- Break into smaller components
- Each component should have single responsibility
- Easier to test and maintain

**"Missing type definition"**
- Define interface for props
- Use TypeScript strictly
- Avoid `any` type

## Common Tasks

### Adding a New Component

1. **Create file** in appropriate subfolder
2. **Define props interface**
3. **Implement component**
4. **Export from subfolder index.ts**
5. **Add to documentation** if public

```bash
# Create new shared component
touch src/components/shared/NewComponent.tsx

# Update src/components/shared/index.ts
export { NewComponent } from './NewComponent';

# Update src/components/index.ts (auto-exports via main index)
```

### Adding Validation

1. **Add function** to `src/utils/validationUtils.ts`
2. **Define ValidationError interface** if needed
3. **Add tests** (in PR comments at minimum)
4. **Use in hook** via `useFormValidation`

### Adding a New Service

1. **Create file** in `src/services/`
2. **Define clear interfaces** for parameters and returns
3. **Add error handling**
4. **Export from services**
5. **Document in code**

### Adding New Route/Page

1. **Create page component** in `src/pages/`
2. **Add to App.tsx** (simple for demo, would use router in larger app)
3. **Import required services** and components
4. **Handle authentication** if needed
5. **Add to documentation**

## Debugging Guide

### Browser DevTools

```javascript
// Check localStorage
Object.keys(localStorage)
localStorage.getItem('currentUser')

// Check component render
console.log('Component rendered', { props })

// Check network requests
// Network tab shows API calls to Anthropic
```

### Common Issues

**Blank page after login**
- Check localStorage for `currentUser`
- Check browser console for errors
- Verify user object has required fields

**Styles not applying**
- Clear browser cache
- Run `npm run dev` again
- Check Tailwind class spelling
- Verify CSS loads (index.css imported in main.tsx)

**File upload not working**
- Check file size (max 10MB)
- Check file type (PDF, TXT, DOCX)
- Check browser console for fetch errors
- Verify API key if using real API

## Getting Help

- **Questions**: Create a discussion issue
- **Bugs**: Report with reproduction steps
- **Ideas**: Start a discussion first
- **Code reviews**: Ask in PR comments

## Contributor Recognition

Contributors will be recognized in:
- Project README
- Release notes
- GitHub contributors page

Thank you for contributing! 🎉
