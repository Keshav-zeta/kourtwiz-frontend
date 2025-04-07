import { RouteObject } from 'react-router-dom';
import CreateOpenPlay from '../pages/club-openplay/CreateOpenPlay';



const OpenPlayCreationRoutes: RouteObject[] = [
  {
    path: 'open-play',
    element: <CreateOpenPlay />,
  },
];

export default OpenPlayCreationRoutes;