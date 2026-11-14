import { useState, type FormEvent } from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import { ErrorNotice } from '@/components/ui';
import { useAuth } from '@/lib/auth';

type Mode = 'signin' | 'signup';

export function AuthPanel() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setNotice(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setNotice(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError('Please enter your email and password.');
      return;
    }
    if (mode === 'signup' && password.length < 6) {
      setError('Please use a password with at least 6 characters.');
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'signin') {
        const message = await signIn(trimmedEmail, password);
        if (message) setError(message);
      } else {
        const result = await signUp(trimmedEmail, password);
        if (result.error) {
          setError(result.error);
        } else if (result.needsConfirmation) {
          setNotice('Your account is ready. Please sign in with your email and password.');
          setMode('signin');
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isSignIn = mode === 'signin';

  return (
    <div className="card mx-auto w-full max-w-md p-6 sm:p-8">
      <div className="mb-6 grid grid-cols-2 gap-2 rounded-full bg-cream-200 p-1" role="tablist">
        {(['signin', 'signup'] as Mode[]).map((option) => (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={mode === option}
            onClick={() => switchMode(option)}
            className={`rounded-full py-2 text-sm font-bold transition ${
              mode === option ? 'bg-white text-mint-900 shadow-soft' : 'text-ink-700 hover:text-ink-900'
            }`}
          >
            {option === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="label" htmlFor="auth-email">Email</label>
          <input id="auth-email" type="email" autoComplete="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            type="password"
            autoComplete={isSignIn ? 'current-password' : 'new-password'}
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <ErrorNotice message={error} />}
        {notice && (
          <div className="rounded-2xl border border-mint-200 bg-mint-50 px-4 py-3 text-sm font-semibold text-mint-900" role="status">
            {notice}
          </div>
        )}

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {isSignIn ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
          {submitting ? 'Please wait...' : isSignIn ? 'Sign in' : 'Create my account'}
        </button>
      </form>
    </div>
  );
}
