import { ArrowRightIcon, ShieldCheckIcon, BoltIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useAuthState } from '~/components/contexts/UserContext';
import { SignInButton } from '~/components/domain/auth/SignInButton';
import { PhoneAuthButton } from '~/components/domain/auth/PhoneAuthButton';
import { FirebaseTest } from '~/components/debug/FirebaseTest';
import { Head } from '~/components/shared/Head';
import { Link } from 'react-router-dom';

const features = [
  {
    name: 'Secure Authentication',
    description: 'Enterprise-grade security with Firebase Auth and multi-factor authentication support.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Lightning Fast',
    description: 'Built with modern React 18, Vite, and optimized for performance.',
    icon: BoltIcon,
  },
  {
    name: 'Team Collaboration',
    description: 'Designed for teams with role-based access and collaborative features.',
    icon: UserGroupIcon,
  },
];

export default function Landing() {
  const { state } = useAuthState();

  return (
    <>
      <Head title="Welcome to AuthTest" />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AuthTest
              </span>
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-blue-100">
              A modern authentication system built with React, TypeScript, and Firebase.
              Secure, fast, and ready for production.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
              {state.state === 'SIGNED_OUT' ? (
                <>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <SignInButton />
                    <PhoneAuthButton mode="signin" variant="secondary" />
                  </div>
                  <Link
                    to="/about"
                    className="inline-flex items-center px-6 py-3 border border-blue-300 text-base font-medium rounded-md text-blue-100 hover:bg-blue-800 transition-colors"
                  >
                    Learn More
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </Link>
                </>
              ) : (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
                >
                  Go to Dashboard
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Everything you need to get started
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
              Built with modern technologies and best practices for authentication and user management.
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-md bg-gradient-to-r from-blue-500 to-purple-600 text-white mx-auto">
                  <feature.icon className="h-8 w-8" aria-hidden="true" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">{feature.name}</h3>
                <p className="mt-2 text-base text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-xl overflow-hidden">
            <div className="px-6 py-12 sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Ready to get started?
                </h2>
                <p className="mt-3 max-w-3xl text-lg text-blue-100">
                  Sign in with your Google account and explore the dashboard.
                </p>
              </div>
              <div className="mt-8 lg:mt-0 lg:flex-shrink-0">
                {state.state === 'SIGNED_OUT' ? (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <SignInButton />
                    <PhoneAuthButton mode="signin" variant="secondary" />
                  </div>
                ) : (
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-50 transition-colors"
                  >
                    View Dashboard
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Section (Development Only) */}
      {import.meta.env.DEV && (
        <div className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">🔧 Firebase Diagnostics</h2>
              <p className="text-gray-600">Development tools for troubleshooting Firebase issues</p>
            </div>
            <FirebaseTest />
          </div>
        </div>
      )}
    </>
  );
}