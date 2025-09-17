import { useState } from "react";
import { useAuth } from "~/lib/firebase";
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

type Props = {
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger';
};

export const SignOutButton = ({ className = '', variant = 'danger' }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      const auth = useAuth();
      await auth.signOut();
    } catch (error) {
      console.error("Sign out error:", error);
      setIsLoading(false);
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500';
      case 'secondary':
        return 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500';
      case 'danger':
      default:
        return 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500';
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      type="button"
      className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all ${getVariantClasses()} ${className}`}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Signing out...
        </>
      ) : (
        <>
          <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
          Sign Out
        </>
      )}
    </button>
  );
};
