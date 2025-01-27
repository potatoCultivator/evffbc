import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
import Loadable from 'ui-component/Loadable';

// routes
import MainRoutes from './MainRoutes';
import LoginRoutes from './AuthenticationRoutes';
import PublicRoutes from './PublicRoutes';

const Error404 = Loadable(lazy(() => import('views/pages/error/Error404')));

// ==============================|| ROUTING RENDER ||============================== //
const router = createBrowserRouter([
  LoginRoutes,
  MainRoutes,
  PublicRoutes,
  {
    path: '*',
    element: <Error404 />
  }
], {
  basename: import.meta.env.VITE_APP_BASE_NAME
});

export default router;
