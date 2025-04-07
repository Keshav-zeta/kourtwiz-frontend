import { RouteObject } from 'react-router-dom';
import SubscriptionPage from '../pages/subscription';

const SubscriptionRoutes: RouteObject[] = [
  {
    path: 'subscription',
    element: <SubscriptionPage />,
  },
];

export default SubscriptionRoutes;
