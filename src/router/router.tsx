import { createBrowserRouter, Navigate } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: '',
    children: [
      { index: true, element: <Navigate to="/spreadsheets" replace /> },
      { path: 'spreadsheets', element: '' },
      { path: '*', element: '' },
    ],
  },
]);
