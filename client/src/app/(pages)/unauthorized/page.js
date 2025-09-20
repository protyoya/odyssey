'use client';
import { useSearchParams } from 'next/navigation';

export default function UnauthorizedPage() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');

  const message = reason === 'not-approved' 
    ? 'Your account is not yet approved. Please contact an administrator.'
    : 'You do not have permission to access this area.';

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}