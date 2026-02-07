import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AuthPage } from '@/pages/AuthPage';
import './index.css';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthPage onAuthSuccess={(user) => {
        console.log('🎉 User logged in:', user);
      }} />
    </ErrorBoundary>
  );
}
