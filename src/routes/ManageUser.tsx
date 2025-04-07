import { RouteObject } from 'react-router-dom';
import Usermanagementpage from '../pages/manage-user/Usermanagementpage';

export const ManageUsers: RouteObject[] = [
  {
    path: '/manage-user',
    element: <Usermanagementpage />,
  },
];
