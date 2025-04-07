import CreateClub from '../pages/createClub/CreateClub';
import ClubMembershipPage from '../pages/club-memberships/ClubMembership';

const SignUpRoutes = [
  {
    path: '/createClub',
    element: <CreateClub />,
  },
  {
    path: '/club-memberships',
    element: <ClubMembershipPage />,
  },
];

export default SignUpRoutes;
