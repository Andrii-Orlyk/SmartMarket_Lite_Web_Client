import { LoadingState } from '../../../components/feedback';

export function AuthLoadingState() {
  return (
    <LoadingState
      message="Checking your session…"
      ariaLabel="Checking session"
      className="rounded-2xl p-6 shadow-sm ring-1 ring-slate-200"
    />
  );
}
