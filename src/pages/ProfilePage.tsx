import { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import { AuthPanel } from '@/components/AuthPanel';
import { ChildProfileForm } from '@/components/ChildProfileForm';
import { ErrorNotice, LoadingBlock, PageHeader } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { EMPTY_CHILD_PROFILE, fetchChildProfile, type ChildProfile } from '@/lib/passportApi';

export function ProfilePage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [profile, setProfile] = useState<ChildProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileVersion, setProfileVersion] = useState(0);

  useEffect(() => {
    if (!user) return;
    let active = true;
    (async () => {
      setProfileLoading(true);
      setError(null);
      try {
        const data = await fetchChildProfile();
        if (active) setProfile(data ?? EMPTY_CHILD_PROFILE);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Could not load your child profile.');
      } finally {
        if (active) setProfileLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [user, profileVersion]);

  if (authLoading) return <LoadingBlock label="Checking your account..." />;

  if (!user) {
    return (
      <div className="mx-auto max-w-5xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Your profile"
          title="Sign in to SnackMate"
          description="Create an account to save your child's preferences, keep your passport and add your own products."
        />
        <AuthPanel />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader eyebrow="Your profile" title="Child preference profile" description="Keep your child's tastes, allergies and budget up to date. Explore Snacks can use these to filter suggestions for you." />
        <button type="button" onClick={() => signOut()} className="btn-secondary shrink-0">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>

      <p className="text-sm font-semibold text-ink-700">Signed in as {user.email}</p>

      <section className="card p-6 sm:p-10">
        {error && <ErrorNotice message={error} />}
        {profileLoading || !profile ? (
          <LoadingBlock label="Loading your profile..." />
        ) : (
          <ChildProfileForm key={profileVersion} initial={profile} onSaved={() => setProfileVersion((v) => v + 1)} />
        )}
      </section>
    </div>
  );
}
