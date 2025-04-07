import { RouteObject } from 'react-router-dom';
import UserManagmentGetUpdate from '../pages/user-managment-get-put/UserManagmentGetUpdate';

const UserDetailsRoutes: RouteObject[] = [
  {
    path: '/user-managment-get-put',
    element: <UserManagmentGetUpdate />,
  },
];

export default UserDetailsRoutes;