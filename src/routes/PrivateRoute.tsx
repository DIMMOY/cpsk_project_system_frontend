import React from "react";
import { observer } from "mobx-react-lite";
import { Navigate, Outlet } from "react-router-dom";
import applicationStore from "../stores/applicationStore";
import ProfileEdit from "../pages/other/ProfileEdit";

const PrivateRoute = observer(() => {
  const { user } = applicationStore;
  const isLogin = !!user;
  applicationStore.setIsShowNavBar(isLogin);

  if (!isLogin) {
    return <Navigate to="/signin" />;
  }

  return user.displayName ? <Outlet /> : <ProfileEdit/>;
});

export default PrivateRoute;
