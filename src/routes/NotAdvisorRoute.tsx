import React from "react";
import { observer } from "mobx-react-lite";
import { Navigate, Outlet } from "react-router-dom";
import applicationStore from "../stores/applicationStore";
import NotFound from "../pages/other/NotFound";

const NotAdvisorRoute = observer(() => {
  const { currentRole } = applicationStore;
  return currentRole === 1 ? <NotFound /> : <Outlet />;
});

export default NotAdvisorRoute;
