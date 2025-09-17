import { Link } from 'react-router-dom';
import { Head } from "~/components/shared/Head";
import { ExclamationTriangleIcon, HomeIcon } from '@heroicons/react/24/outline';

function Page404() {
  return (
    <>
      <Head title="Page Not Found - AuthTest" />
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-20 h-20 bg-red-100 rounded-full">
              <ExclamationTriangleIcon className="h-10 w-10 text-red-600" />
            </div>
          </div>

          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-3xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
          <p className="text-xl text-gray-500 mb-8 max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for.
            It might have been moved, deleted, or you entered the wrong URL.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <HomeIcon className="h-5 w-5 mr-2" />
              Go Home
            </Link>

            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Go Back
            </button>
          </div>

          <div className="mt-12">
            <p className="text-sm text-gray-400">
              If you think this is an error, please contact support.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Page404;
