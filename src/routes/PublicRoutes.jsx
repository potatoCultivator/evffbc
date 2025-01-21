import { lazy } from 'react';
import PublicLayout from 'layout/PublicLayout';
import Loadable from 'ui-component/Loadable';

const OnlineRegistration = Loadable(lazy(() => import('views/online-registration')));
const InvoicePage = Loadable(lazy(() => import('views/invoice')));

const PublicRoutes = {
    path: '/',
    element: <PublicLayout />,
    children: [
        {
            path: 'online-registration',
            element: <OnlineRegistration />
        },
        {
            path: 'invoice',
            element: <InvoicePage />
        }
    ]
};

export default PublicRoutes;
