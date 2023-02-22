import React from "react";
import { observer } from "mobx-react-lite";
import { Navigate, Outlet } from "react-router-dom";
import applicationStore from "../stores/applicationStore";

const PrivateRoute = observer(() => {
  const { user } = applicationStore;
  const isLogin = !!user;
  applicationStore.setIsShowNavBar(isLogin);

  return isLogin ? <Outlet /> : <Navigate to="/signin" />;
});

export default PrivateRoute;
