import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import PhotoVerifPage from './pages/photoverif';
import FaceRegisterPage from './pages/faceregister';
import StreamVideoPage from './pages/streamvideo';
import Layout from './layout';
import NotFoundPage from './pages/notfound';
import HomePage from './pages/home';
import StartExamPage from './pages/startexam';
import getTokenPage from './pages/gettoken';
import ExamHistoryPage from './pages/examhistory';
import ExamDetailPage from './pages/examdetail';

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
          { path: '/startexam', element: <StartExamPage /> },
          { path: '/gettoken', element: <getTokenPage /> },
          { path: '/examhistory', element: <ExamHistoryPage />},
          {
            path: '/examhistory/:examID',
            element: <ExamDetailPage />
          },
          { path: '*', element: <NotFoundPage /> }
        ]
      }]
    }
  ]);

  return <RouterProvider router={router} />;
}
