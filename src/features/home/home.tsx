import React, { useContext, useEffect } from "react";
import "./home.css";

import { useUserInfo } from "../../context/UserInfoContext";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const { userInfo } = useUserInfo();
  const {user}= useContext(AuthContext)!;
  const navigate=useNavigate();
  useEffect(() => {
    if (
      user?.userOrganizationRole?.some(
        (role) => role.roleName === "MasterAdmin"
      )
    ) {
      navigate("/requests");
    }
  }, [user, navigate]);
  return (
    <div className="homePage--main-container">
      <p>{userInfo.firstName}</p>
    </div>
  );
};

export default Home;
