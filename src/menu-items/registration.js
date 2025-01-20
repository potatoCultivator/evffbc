// assets
import { IconKey } from '@tabler/icons-react';

// constant
const icons = {
  IconKey
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const registration = {
  id: 'registration_management',
  title: 'Registration Management',
  caption: 'Overview of Registration Pages and Processes',
  type: 'group',
  children: [
    {
      id: 'registrationf',
      title: 'Registrationf',
      type: 'collapse',
      icon: icons.IconKey,
      children: [
        {
          id: 'confirmation',
          title: 'Confirmation',
          type: 'item',
        //   url: '/pages/login/login3',
          target: true
        },
        {
          id: 'registered_conferee',
          title: 'Registered Conferee',
          type: 'item',
        //   url: '/pages/register/register3',
          target: true
        },
        {
          id: 'id_release',
          title: 'ID Release',
          type: 'item',
        //   url: '/pages/register/register3',
          target: true
        }
      ]
    }
  ]
};

export default registration;
