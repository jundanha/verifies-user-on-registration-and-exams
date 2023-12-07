import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import StreamVideoPage from './pages/streamvideo';
import Layout from './layout';
import NotFoundPage from './pages/notfound';
import HomePage from './pages/home';
import StartExamPage from './pages/startexam';
import ExamHistoryPage from './pages/examhistory';
import ExamDetailPage from './pages/examdetail';
import NewExamPage from './pages/newexam';

export function AppRouter() {
  const router = createBrowserRouter([
    {
      path: '/',
      children: [{
        element: <Layout />,
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/streamvideo', element: <StreamVideoPage /> },
          { path: '/startexam', element: <StartExamPage /> },
          { path: '/examhistory', element: <ExamHistoryPage />},
          { path: '/newexam', element: <NewExamPage />},
          { path: '/examhistory/:examID', element: <ExamDetailPage />},
          { path: '*', element: <NotFoundPage /> }
        ]
      }]
    }
  ]);

  return <RouterProvider router={router} />;
}
