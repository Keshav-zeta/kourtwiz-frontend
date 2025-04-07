import { RouteObject } from 'react-router-dom';
import CreateCoachPage from '../pages/add-coach/CreateCoachPage';


const AddCoachesRoutes: RouteObject[] = [
  {
    path: 'add-coach',
    element: <CreateCoachPage />,
  },
];

export default AddCoachesRoutes;