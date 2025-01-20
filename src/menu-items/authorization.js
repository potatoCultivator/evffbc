// assets
import { IconDashboard } from '@tabler/icons-react';

// constant
const icons = { IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const authorization = {
  id: 'authorization',
  title: 'Authorization',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Authorization',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.IconDashboard,
      breadcrumbs: false
    }
  ]
};

export default authorization;
