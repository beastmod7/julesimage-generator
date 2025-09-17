import { useState } from "react";
import { PhoneIcon } from '@heroicons/react/24/outline';
import { PhoneAuthModal } from './PhoneAuthModal';

type Props = {
  className?: string;
  variant?: 'primary' | 'secondary';
  mode?: 'signin' | 'link';
};

export const PhoneAuthButton = ({
  className = '',
  variant = 'secondary',
  mode = 'signin'
}: Props) => {
  const [showModal, setShowModal] = useState(false);

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500';
      case 'secondary':
      default:
        return 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500';
    }
  };

  const getButtonText = () => {
    return mode === 'link' ? 'Link Phone Number' : 'Sign in with Phone';
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        type="button"
        className={`inline-flex items-center justify-center px-6 py-3 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all min-w-48 ${getVariantClasses()} ${className}`}
      >
        <PhoneIcon className="w-5 h-5 mr-3" />
        {getButtonText()}
      </button>

      {showModal && (
        <PhoneAuthModal
          mode={mode}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
          }}
        />
      )}
    </>
  );
};