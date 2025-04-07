import { RouteObject } from 'react-router-dom';
import ClubSchedulePage from '../pages/club-schedule/ClubSchedule';


const ClubBookingRoutes: RouteObject[] = [
  {
    path: 'club-bookings',
    element: <ClubSchedulePage />,
  },
];

export default ClubBookingRoutes;