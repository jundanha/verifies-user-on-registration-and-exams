import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import PhotoVerifPage from './pages/photoverif';
import FaceRegisterPage from './pages/faceregister';
import StreamVideoPage from './pages/streamvideo';
import Layout from './layout';
import NotFoundPage from './pages/notfound';
import HomePage from './pages/home';
<<<<<<< HEAD
import StartExamPage from './pages/startexam';
import getTokenPage from './pages/gettoken';
=======
import ExamHistoryPage from './pages/examhistory';
import ExamDetailPage from './pages/examdetail';
>>>>>>> 96a629238b5a00b2f5a5066e96a49f9a945d9f32

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
<<<<<<< HEAD
          { path: '/startexam', element: <StartExamPage /> },
          { path: '/gettoken', element: <getTokenPage /> },
=======
          { path: '/examhistory', element: <ExamHistoryPage />},
          {
            path: '/examhistory/:examID',
            element: <ExamDetailPage />
          },
>>>>>>> 96a629238b5a00b2f5a5066e96a49f9a945d9f32
          { path: '*', element: <NotFoundPage /> }
        ]
      }]
    }
  ]);

  return <RouterProvider router={router} />;
}
