import ClubCourtPage from '../pages/club-courts/ClubCourtPage';
import CreateClubMembershipsPage from '../pages/club-memberships-create/CreateClubMembershipsPage';
import ClubMembersPage from '../pages/clubMembersPage/ClubMembersPage';
import ClubsListPage from '../pages/clubsListPage/ClubsListPage';
const ClubsListRoutes = [
  {
    path: '/clubs',
    element: <ClubsListPage />,
  },
  {
    path: '/clubs/members/:clubId',
    element: <ClubMembersPage />,
  },
  {
    path: 'club/court',
    element: <ClubCourtPage />,
  },
  {
    path: '/club/memberships',
    element: <CreateClubMembershipsPage />,
  },
];

export default ClubsListRoutes;
