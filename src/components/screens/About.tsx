import { Head } from '~/components/shared/Head';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, CodeBracketIcon, ShieldCheckIcon, BoltIcon } from '@heroicons/react/24/outline';

const technologies = [
  {
    name: 'React 18',
    description: 'Modern React with concurrent features and improved performance.',
    version: '18.2.0',
  },
  {
    name: 'TypeScript',
    description: 'Type-safe development with enhanced developer experience.',
    version: '5.3.3',
  },
  {
    name: 'Vite',
    description: 'Lightning-fast build tool with hot module replacement.',
    version: '4.4.9',
  },
  {
    name: 'Firebase Auth',
    description: 'Secure authentication with Google and other providers.',
    version: '9.23.0',
  },
  {
    name: 'Tailwind CSS',
    description: 'Utility-first CSS framework for rapid UI development.',
    version: '3.4.1',
  },
  {
    name: 'React Router',
    description: 'Declarative routing for React applications.',
    version: '6.21.3',
  },
];

export default function About() {
  return (
    <>
      <Head title="About - AuthTest" />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link
                  to="/"
                  className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                  Back
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">About AuthTest</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
              <CodeBracketIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Built for Modern Web Development
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              AuthTest is a modern authentication system showcasing best practices in React, TypeScript,
              and Firebase integration. Perfect for learning and rapid prototyping.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4">
                <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure by Default</h3>
              <p className="text-gray-600">
                Built with Firebase Authentication, providing enterprise-grade security
                with support for multiple authentication providers.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4">
                <BoltIcon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">
                Powered by Vite for instant development feedback and optimized production builds
                with modern bundling techniques.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4">
                <CodeBracketIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Developer Friendly</h3>
              <p className="text-gray-600">
                Full TypeScript support with modern React patterns, comprehensive tooling,
                and clear project structure for maintainable code.
              </p>
            </div>
          </div>

          {/* Technologies */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-12">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Technologies Used</h2>
              <p className="text-gray-600 mt-1">Modern stack for building scalable web applications</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {technologies.map((tech) => (
                  <div key={tech.name} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900">{tech.name}</h3>
                        <span className="text-sm text-gray-500">v{tech.version}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{tech.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Project Structure */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Key Features</h2>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <strong className="text-gray-900">Authentication Flow:</strong>
                    <span className="text-gray-600 ml-1">Complete sign-in/sign-out with Google OAuth</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <strong className="text-gray-900">Protected Routes:</strong>
                    <span className="text-gray-600 ml-1">Automatic redirection based on auth state</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <strong className="text-gray-900">User Dashboard:</strong>
                    <span className="text-gray-600 ml-1">Personalized interface with user information</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <strong className="text-gray-900">Profile Management:</strong>
                    <span className="text-gray-600 ml-1">Comprehensive user profile with edit capabilities</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <strong className="text-gray-900">Modern UI:</strong>
                    <span className="text-gray-600 ml-1">Responsive design with Tailwind CSS and Heroicons</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}