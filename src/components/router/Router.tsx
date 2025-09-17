import { lazy, Suspense } from 'react';
import { Outlet, RouteObject, useRoutes, BrowserRouter } from 'react-router-dom';
import Navbar from '~/components/shared/Navbar';

const Loading = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// Lazy load screens
const LandingScreen = lazy(() => import('~/components/screens/Landing'));
const DashboardScreen = lazy(() => import('~/components/screens/Dashboard'));
const ProfileScreen = lazy(() => import('~/components/screens/Profile'));
const AboutScreen = lazy(() => import('~/components/screens/About'));
const Page404Screen = lazy(() => import('~/components/screens/404'));

function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export const Router = () => {
  return (
    <BrowserRouter>
      <InnerRouter />
    </BrowserRouter>
  );
};

const InnerRouter = () => {
  const routes: RouteObject[] = [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: <LandingScreen />,
        },
        {
          path: '/dashboard',
          element: <DashboardScreen />,
        },
        {
          path: '/profile',
          element: <ProfileScreen />,
        },
        {
          path: '/about',
          element: <AboutScreen />,
        },
        {
          path: '*',
          element: <Page404Screen />,
        },
      ],
    },
  ];
  const element = useRoutes(routes);
  return (
    <div>
      <Suspense fallback={<Loading />}>{element}</Suspense>
    </div>
  );
};
