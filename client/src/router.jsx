import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import PhotoVerifPage from './pages/photoverif';
import FaceRegisterPage from './pages/faceregister';
import StreamVideoPage from './pages/streamvideo';

export function AppRouter() {
  const router = createBrowserRouter([
    {
      path: '/',
      action: () => {
        return { redirect: '/login' };
      },
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/register',
      element: <RegisterPage />,
    },
    {
      path: '/photoverif',
      element: <PhotoVerifPage />,
    },
    {
      path: '/faceregister',
      element: <FaceRegisterPage />,
    },
    {
      path: '/streamvideo',
      element: <StreamVideoPage />,
    },
  ]);

  return <RouterProvider router={router} />;
}
