
// components/ProtectedRoute.js - Single component for all protection
'use client';
import { useAuth } from '../lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ProtectedRoute = ({ 
  children, 
  department, 
  departments,
  fallbackPath = '/login',
  loading: LoadingComponent = () => <div>Loading...</div>
}) => {
  const { authority, loading, isAuthenticated, hasDepartment, hasAnyDepartment } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated()) {
      router.push(fallbackPath);
      return;
    }

    if (authority?.status !== 'approved') {
      router.push('/unauthorized?reason=not-approved');
      return;
    }

    if (department && !hasDepartment(department)) {
      router.push('/unauthorized?reason=department-access');
      return;
    }

    if (departments && !hasAnyDepartment(departments)) {
      router.push('/unauthorized?reason=department-access');
      return;
    }
  }, [loading, authority, department, departments]);

  if (loading) return <LoadingComponent />;
  if (!isAuthenticated() || authority?.status !== 'approved') return null;
  if (department && !hasDepartment(department)) return null;
  if (departments && !hasAnyDepartment(departments)) return null;

  return children;
};

export default ProtectedRoute;

// Additional utility components and hooks in same file
export const ConditionalContent = ({ department, departments, children, fallback = null }) => {
  const { hasDepartment, hasAnyDepartment } = useAuth();
  
  if (department && !hasDepartment(department)) return fallback;
  if (departments && !hasAnyDepartment(departments)) return fallback;
  
  return children;
};

// Quick department hooks
export const useIsPolice = () => useAuth().hasDepartment('police');
export const useIsTourism = () => useAuth().hasDepartment('tourism');
export const useIsEmergency = () => useAuth().hasDepartment('emergency');
export const useIsCustoms = () => useAuth().hasDepartment('customs');
export const useIsTransport = () => useAuth().hasDepartment('transport');
export const useIsAdministration = () => useAuth().hasDepartment('administration');
