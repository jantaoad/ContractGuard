# Error Handling & Loading States Documentation

## Overview

ContractGuard implements comprehensive error handling and loading states across the entire application to provide a smooth user experience and help users understand what's happening at all times.

## Architecture

### Error Handling Layers

```
┌─────────────────────────────────────────────────┐
│          Error Boundary (Global)                │
│     Catches all React component errors          │
└────────────┬────────────────────────────────────┘
             │
┌────────────▼────────────────────────────────────┐
│        Toast Notifications (Local)              │
│   Success, error, and info messages            │
└────────────┬────────────────────────────────────┘
             │
┌────────────▼────────────────────────────────────┐
│        Error Alerts & Validation                │
│   Form and operation-specific errors           │
└────────────┬────────────────────────────────────┘
             │
┌────────────▼────────────────────────────────────┐
│         Service Layer Error Handling            │
│   API calls, data operations                   │
└─────────────────────────────────────────────────┘
```

## Components

### 1. ErrorBoundary Component

**Location**: `src/components/ErrorBoundary.tsx`

**Purpose**: Catches unhandled React errors and displays a user-friendly error page.

**Features**:
- Catches render errors from child components
- Logs errors to console
- Provides reload button for recovery
- Shows error message to user

**Usage**:
```tsx
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### 2. ToastNotification Component

**Location**: `src/components/ToastNotification.tsx`

**Purpose**: Displays temporary, non-intrusive notifications for success, error, and info messages.

**Features**:
- Auto-dismiss after configurable duration
- Different styles for success, error, info
- Close button for manual dismissal
- Smooth slide-in animation
- Stacks multiple toasts

**Types**:
- `success`: Green background, for successful operations
- `error`: Red background, for error messages
- `info`: Blue background, for informational messages

**Usage**:
```tsx
const { toasts, showToast, removeToast } = useToast();

showToast('Contract uploaded!', 'success', 3000);
showToast('Upload failed', 'error', 5000);
showToast('Processing...', 'info', 0); // 0 = no auto-dismiss
```

### 3. ErrorAlert Component

**Location**: `src/components/ErrorAlert.tsx`

**Purpose**: Displays prominent error messages with optional retry and dismiss buttons.

**Features**:
- Left-aligned red border for visual prominence
- Error icon
- Retry button for action-specific retry logic
- Dismiss button to close alert
- Full-width display

**Usage**:
```tsx
{error && (
  <ErrorAlert
    error={error}
    onDismiss={() => setError(null)}
    onRetry={handleRetry}
  />
)}
```

### 4. LoadingSpinner Component

**Location**: `src/components/LoadingSpinner.tsx`

**Purpose**: Indicates loading state during async operations.

**Features**:
- 3 size options: sm, md, lg
- Optional loading message
- Full-screen variant for major operations
- Animated spinning indicator
- Can be embedded or full-screen

**Usage**:
```tsx
{loading ? (
  <LoadingSpinner 
    size="md" 
    message="Loading contracts..." 
  />
) : (
  <YourContent />
)}

// Full screen
<LoadingSpinner 
  size="lg" 
  message="Processing..." 
  fullScreen 
/>
```

## Hooks

### useToast Hook

**Location**: `src/hooks/useToast.ts`

**Purpose**: Manages toast notification state and provides methods to show, remove, and clear toasts.

**Returns**:
```ts
{
  toasts: Toast[];          // Array of current toasts
  showToast: Function;      // Show a new toast
  removeToast: Function;    // Remove a specific toast
  clear: Function;          // Clear all toasts
}
```

**Example**:
```tsx
const { toasts, showToast, removeToast } = useToast();

// Show toast
showToast('Operation successful', 'success', 3000);

// Remove specific toast
removeToast(toastId);

// Clear all toasts
clear();
```

## Utilities

### errorUtils.ts

**Location**: `src/utils/errorUtils.ts`

**Purpose**: Provides error classification and handling utilities.

**Functions**:

#### classifyError(error: any): ErrorInfo
Classifies errors and returns structured error information.

```ts
const errorInfo = classifyError(error);
// Returns: { type, message, originalError, retryable }
```

**Error Types**:
- `validation`: Form/input validation errors
- `network`: Network connection errors (retryable)
- `auth`: Authentication errors
- `file`: File upload/processing errors
- `unknown`: Unclassified errors

#### safeAsync(fn, errorHandler?)
Wraps async operations with built-in error handling.

```ts
const result = await safeAsync(
  () => apiCall(),
  (error) => showToast(error.message, 'error')
);
```

#### retryAsync(fn, maxRetries, delay)
Retries failed operations with exponential backoff.

```ts
const result = await retryAsync(
  () => uploadFile(),
  3,  // max retries
  1000  // initial delay
);
```

#### logError(error, context?)
Logs errors with context for debugging/monitoring.

```ts
logError(errorInfo, { userId, action: 'upload' });
```

## Implementation Patterns

### Pattern 1: Form Validation with Error Display

```tsx
const [error, setError] = useState<string | null>(null);

const handleSubmit = async () => {
  setError(null);
  
  // Validation
  if (!email) {
    setError('Email is required');
    return;
  }

  try {
    await authService.login(email, password);
    showToast('Login successful', 'success');
  } catch (err) {
    const errorInfo = classifyError(err);
    setError(errorInfo.message);
  }
};

return (
  <>
    {error && <ErrorAlert error={error} onDismiss={() => setError(null)} />}
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  </>
);
```

### Pattern 2: Async Operation with Loading State

```tsx
const [loading, setLoading] = useState(false);
const { showToast } = useToast();

const handleUpload = async (file: File) => {
  setLoading(true);
  try {
    await uploadFile(file);
    showToast('Upload successful', 'success');
  } catch (err) {
    const errorInfo = classifyError(err);
    showToast(errorInfo.message, 'error');
  } finally {
    setLoading(false);
  }
};

return (
  <>
    {loading ? (
      <LoadingSpinner message="Uploading..." />
    ) : (
      <button onClick={() => handleUpload(file)}>Upload</button>
    )}
  </>
);
```

### Pattern 3: Retry Logic

```tsx
const handleRetry = async () => {
  setLoading(true);
  try {
    const result = await retryAsync(() => failedOperation(), 3, 1000);
    showToast('Operation successful', 'success');
  } catch (err) {
    showToast('Operation failed after retries', 'error');
  } finally {
    setLoading(false);
  }
};
```

## Error Messages

### User-Friendly Messages

All error messages shown to users should be:
- **Clear**: Use plain English, avoid technical jargon
- **Actionable**: Suggest what the user can do to fix the issue
- **Specific**: Identify the exact problem when possible

**Examples**:

❌ Bad: `Error: ENOENT`
✅ Good: `File not found. Please check the file path and try again.`

❌ Bad: `Network timeout`
✅ Good: `Connection timeout. Check your internet connection and try again.`

❌ Bad: `Invalid input`
✅ Good: `Password must be at least 6 characters.`

### Error Classification

```
Network Errors
├─ "Network connection error. Check internet."
├─ "Request timeout. Try again."
└─ "Server unavailable. Try again later."

Validation Errors
├─ "Email is required."
├─ "Password must be 6+ characters."
└─ "File size exceeds 10MB limit."

File Errors
├─ "Invalid file type. Upload PDF, TXT, or DOCX."
├─ "File is corrupted. Try uploading again."
└─ "File upload failed. Try again."

Auth Errors
├─ "Invalid email or password."
├─ "Session expired. Please log in again."
└─ "Unauthorized access."

Unknown Errors
└─ "Unexpected error. Please try again."
```

## Loading States

### Loading Indicators

1. **Toast Messages** (for notifications)
   ```tsx
   showToast('Processing...', 'info', 0);
   ```

2. **Spinners** (for visual feedback)
   ```tsx
   <LoadingSpinner message="Loading..." />
   ```

3. **Button States** (for actions)
   ```tsx
   <button disabled={loading}>
     {loading ? 'Processing...' : 'Submit'}
   </button>
   ```

4. **Progress Bars** (for uploads)
   ```tsx
   <div className="w-full bg-gray-200 h-2">
     <div style={{ width: `${progress}%` }} 
          className="bg-indigo-600 h-2 transition-all" />
   </div>
   ```

### Loading Timeouts

Set timeouts for long operations:

```tsx
useEffect(() => {
  const timeout = setTimeout(() => {
    if (loading) {
      showToast('Operation taking longer than expected. Please wait...', 'info');
    }
  }, 5000); // 5 seconds

  return () => clearTimeout(timeout);
}, [loading]);
```

## Best Practices

### 1. Provide Context
Always show what operation failed, not just "Error".

```tsx
// Good
showToast('Failed to upload contract. Try again.', 'error');

// Less helpful
showToast('Error', 'error');
```

### 2. Show Loading States
Always indicate when something is processing.

```tsx
// Show loading before async operation
const handleAction = async () => {
  setLoading(true);
  try {
    // Action
  } finally {
    setLoading(false); // Always clear loading, even on error
  }
};
```

### 3. Handle All Code Paths
Catch errors in all async operations.

```tsx
// Good practice
const operation = async () => {
  try {
    // Do something
  } catch (error) {
    const errorInfo = classifyError(error);
    showToast(errorInfo.message, 'error');
    logError(errorInfo);
  } finally {
    setLoading(false); // Clean up always
  }
};
```

### 4. Specific Error Messages
Provide actionable feedback for each error type.

```ts
if (file.size > MAX_SIZE) {
  return 'File is too large. Maximum size is 10MB.';
}

if (!ALLOWED_TYPES.includes(file.type)) {
  return 'Invalid file type. Please upload PDF, TXT, or DOCX.';
}
```

### 5. Dismiss Errors
Let users dismiss error alerts to clear the UI.

```tsx
{error && (
  <ErrorAlert 
    error={error}
    onDismiss={() => setError(null)}
  />
)}
```

## Testing Error States

### Test Cases to Cover

1. **Network Errors**
   - Offline mode
   - Slow connection
   - Timeout scenarios

2. **Validation Errors**
   - Empty fields
   - Invalid formats
   - File size violations

3. **Auth Errors**
   - Expired tokens
   - Invalid credentials
   - Permission denied

4. **File Errors**
   - Unsupported formats
   - Corrupted files
   - Upload cancellations

5. **Unhandled Errors**
   - Unexpected exceptions
   - Missing data
   - API failures

### Mock Error Handling

```tsx
// For testing, mock services to return errors
jest.mock('@/services/contractService', () => ({
  uploadContract: jest.fn().mockRejectedValue(
    new Error('Upload failed')
  ),
}));

// Then test error handling in components
test('shows error message on upload failure', async () => {
  const { getByText } = render(<ContractUpload />);
  
  // Trigger error
  await userEvent.click(getByText('Upload'));
  
  // Assert error message
  expect(getByText('Upload failed')).toBeInTheDocument();
});
```

## Monitoring & Analytics

### Events to Track

1. **Error Events**
   - Error type
   - Error message
   - Component/page where it occurred
   - Severity level

2. **User Actions**
   - Retry attempts
   - Error dismissals
   - Navigation after errors

3. **Performance**
   - Operation duration
   - Retry count
   - Success/failure rates

### Integration Example (Sentry)

```ts
// In errorUtils.ts
import * as Sentry from "@sentry/react";

export const logError = (error: ErrorInfo, context?: Record<string, any>) => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error.originalError, {
      contexts: {
        error: {
          type: error.type,
          retryable: error.retryable,
        },
        ...context,
      },
    });
  }
};
```

## Accessibility

### Screen Reader Compatibility

Ensure error messages are announced:

```tsx
<div role="alert" aria-live="polite" aria-atomic="true">
  {error && <ErrorAlert error={error} />}
</div>
```

### Keyboard Navigation

Ensure all error recovery actions are keyboard accessible:

```tsx
<button 
  onClick={handleRetry}
  onKeyPress={(e) => e.key === 'Enter' && handleRetry()}
>
  Retry
</button>
```

## Future Enhancements

1. **Error Recovery Suggestions**: AI-powered suggestions to fix errors
2. **Offline Support**: Queue operations and retry when online
3. **Error Analytics**: Dashboard showing most common errors
4. **Auto-Retry**: Automatic retry for transient errors
5. **Error Context**: Breadcrumb trails for debugging
6. **Multi-language**: Localized error messages

---

**Version**: 1.0.0  
**Last Updated**: February 6, 2026
