import { lazy } from 'react';
import PublicLayout from 'layout/PublicLayout';
import Loadable from 'ui-component/Loadable';

const OnlineRegistration = Loadable(lazy(() => import('views/online-registration')));
const InvoicePage = Loadable(lazy(() => import('views/invoice')));
const OnsiteRegistration = Loadable(lazy(() => import('views/onsite-registration')));

const PublicRoutes = {
    path: '/',
    element: <PublicLayout />,
    children: [
        {
            path: 'prereg',
            element: <OnlineRegistration />
        },
        {
            path: 'invoice',
            element: <InvoicePage />
        },
        {
            path: 'onsite',
            element: <OnsiteRegistration />
        }
    ]
};

export default PublicRoutes;
