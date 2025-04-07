import { RouteObject } from "react-router-dom";
import ClubLandingPage from "../features/Clubs-Landing-Page/ClubLandingPage";
import WebcamCapture from "../features/authentication/authentication";

const ClubsRoute: RouteObject[] = [
  {
    path: "/clubs/:id",
    element: <ClubLandingPage />,
   
  },
  {
    path:"/clubs/:id",
    children: [
      {
        path: 'authentication',
        element: <WebcamCapture />,
      },
    ],
  }
];

export default ClubsRoute;
