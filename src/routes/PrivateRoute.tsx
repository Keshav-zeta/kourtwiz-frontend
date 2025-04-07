import { JSX } from "react";
import { UserInfoProvider } from "../context/UserInfoContext";
import ManualLoginProvider from "../features/login/ManualLoginProvider";

import Sidebar from "../features/sidebar/Sidebar";

function PrivateRoute(): JSX.Element {
  return (
    <UserInfoProvider>
      <ManualLoginProvider>
        <Sidebar />
        </ManualLoginProvider>
    </UserInfoProvider>
  );
}

export default PrivateRoute;
