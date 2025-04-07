import { RouteObject } from 'react-router-dom';
import OpenPlayList from '../pages/openplaylist/OpenPlayList';



const OpenPlayListRoutes: RouteObject[] = [
  {
    path: 'openplay',
    element: <OpenPlayList/>,
  },
];

export default OpenPlayListRoutes;