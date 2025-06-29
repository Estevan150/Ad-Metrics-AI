
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthPage } from '@/components/AuthPage';
import { useAuth } from '@/hooks/useAuth';

const Auth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <AuthPage />;
};

export default Auth;
