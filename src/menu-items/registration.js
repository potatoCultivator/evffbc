// assets
import { IconUserPlus, IconUsersGroup, IconClipboardList } from '@tabler/icons-react';

// constant
const icons = {
  IconUserPlus,
  IconUsersGroup,
  IconClipboardList
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const registration = {
  id: 'registration',
  title: 'Registration Management',
  caption: 'Overview of Registration Pages',
  type: 'group',
  children: [
    {
      id: 'online-registration-pending',
      title: 'Online Registration',
      type: 'item',
      url: '/prereg-pending',
      icon: icons.IconUserPlus,      // Changed to user plus icon for registration
      caption: 'For Pre-Event Registration'
    },
    {
      id: 'onsite-registration-pending',
      title: 'Onsite Registration',
      type: 'item',
      url: '/onsitereg-pending',
      icon: icons.IconUserPlus,      // Same icon as it's also for registration
      caption: 'For Event Day Registration'
    },
    {
      id: 'registered-conferee',
      title: 'Registered Conferee',
      type: 'item',
      icon: icons.IconClipboardList, // Changed to clipboard list for viewing registrants
      caption: 'List of Registered Conferee',
      url: '/registered-conferee'
    },
  ]
};

export default registration;
