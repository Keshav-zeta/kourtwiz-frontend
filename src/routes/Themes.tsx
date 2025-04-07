import { RouteObject } from 'react-router-dom';
import ThemesSettings from '../pages/themes/themes';

const ThemeRoutes: RouteObject[] = [
  {
    path: '/settings-themes',
    element: <ThemesSettings />,
  },
];

export default ThemeRoutes;
