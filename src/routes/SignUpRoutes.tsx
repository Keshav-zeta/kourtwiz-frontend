import { RouteObject } from 'react-router-dom';
import SignUp from '../features/signup/signup';
import MemberRegistrationSignupPage from '../pages/registration/MemberRegistrationSignup';
import MemberRegistrationClubPage from '../pages/registration/MemberRegistrationClub';

const SignUpRoutes: RouteObject[] = [
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/member-registration/clubs',
    element: <MemberRegistrationClubPage />,
  },
  {
    path: '/member-registration/signup',
    element: <MemberRegistrationSignupPage />,
  },
];

export default SignUpRoutes;
