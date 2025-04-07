import { RouteObject } from 'react-router-dom';
import RequestsPage from '../pages/requestsPage/RequestsPage';


const RequestsRoutes: RouteObject[] = [
  {
    path: 'requests',
    element: <RequestsPage />,
  },
];

export default RequestsRoutes;
