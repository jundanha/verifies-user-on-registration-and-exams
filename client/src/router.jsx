import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import PhotoVerifPage from './pages/photoverif';
import FaceRegisterPage from './pages/faceregister';
import StreamVideoPage from './pages/streamvideo';
import Layout from './layout';
import NotFoundPage from './pages/notfound';
import HomePage from './pages/home';

export function AppRouter() {
  const router = createBrowserRouter([
    {
      path: '/',
      children: [{
        element: <Layout />,
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
          { path: '/photoverif', element: <PhotoVerifPage /> },
          { path: '/faceregister', element: <FaceRegisterPage /> },
          { path: '/streamvideo', element: <StreamVideoPage /> },
          { path: '*', element: <NotFoundPage /> }
        ]
      }]
    }
  ]);

  return <RouterProvider router={router} />;
}
