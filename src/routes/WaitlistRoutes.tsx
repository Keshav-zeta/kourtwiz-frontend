import { RouteObject } from 'react-router-dom';
import WaitListPage from '../pages/waitlist/WaitListPage';



const WaitlistRoutes: RouteObject[] = [
  {
    path: 'waitlist',
    element: <WaitListPage/>,
  },
];

export default WaitlistRoutes;