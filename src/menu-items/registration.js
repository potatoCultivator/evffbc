// assets
import { IconForms, IconListCheck, IconUserEdit } from '@tabler/icons-react';

// constant
const icons = {
  IconForms,
  IconListCheck,
  IconUserEdit
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const registration = {
  id: 'registration',
  title: 'Registration Management',
  caption: 'Overview of Registration Pages',
  type: 'group',
  children: [
    {
      id: 'online-registration',
      title: 'Online Registration',
      type: 'collapse',
      icon: icons.IconForms,
      caption: 'For Pre-Event Registration',
      children: [
        {
          id: 'confirmation',
          title: 'Pending Registrants',
          type: 'item',
          url: '/registration/confirmation',
          icon: icons.IconUserEdit
        },
        {
          id: 'registered-conferee',
          title: 'Registered Conferee',
          type: 'item',
          url: '/registration/registered-conferee',
          icon: icons.IconListCheck
        }
      ]
    },
    {
      id: 'onsite-registration',
      title: 'Onsite Registration',
      type: 'collapse',
      icon: icons.IconForms,
      caption: 'For Event Day Registration',
      children: [
        {
          id: 'pre-registrwwtion',
          title: 'Pre-Registration',
          type: 'item',
          url: '/registration/confirmation',
          icon: icons.IconUserEdit
        },
        {
          id: 'registered-coenferwee',
          title: 'Onsite Registration',
          type: 'item',
          url: '/registration/registered-conferee',
          icon: icons.IconListCheck
        }
      ]
    }
  ]
};

export default registration;

