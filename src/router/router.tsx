import { createBrowserRouter, Navigate } from 'react-router';
import { RootLayout } from '../layouts/RootLayout';
import { SpreadsheetsPage } from '../pages/SpreadsheetsPage';
import { SpreadsheetPage } from '../pages/SpreadsheetPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Navigate to="/spreadsheets" replace /> },
      { path: 'spreadsheets', element: <SpreadsheetsPage /> },
    ],
  },
  {
    path: '/spreadsheets/:id',
    element: <SpreadsheetPage />,
  },
]);
