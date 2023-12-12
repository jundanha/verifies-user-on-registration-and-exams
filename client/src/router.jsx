import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import StreamVideoPage from './pages/streamvideo';
import Layout from './layout';
import NotFoundPage from './pages/notfound';
import HomePage from './pages/home';
import StartExamPage from './pages/startexam';
import ExamHistoryPage from './pages/examhistory';
import ExamDetailPage from './pages/examdetail';
import NewExamPage from './pages/newexam';
import FaceRecognitonPage from './pages/facerecognition';
import UploadVideoPage from './pages/uploadvideo';

export function AppRouter() {
  const router = createBrowserRouter([
    {
      path: '/',
      children: [{
        element: <Layout />,
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/newexam', element: <NewExamPage />},
          { path: '/startexam', element: <StartExamPage /> },
          { path: '/facerecognition', element: <FaceRecognitonPage />},
          { path: '/streamvideo', element: <StreamVideoPage /> },
          { path: '/uploadvideo', element: <UploadVideoPage /> },
          { path: '/examhistory', element: <ExamHistoryPage />},
          { path: '/examhistory/:examID', element: <ExamDetailPage />},
          { path: '*', element: <NotFoundPage /> }
        ]
      }]
    }
  ]);

  return <RouterProvider router={router} />;
}
