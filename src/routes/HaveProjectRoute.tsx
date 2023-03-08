import React from "react";
import { observer } from "mobx-react-lite";
import { Navigate, Outlet } from "react-router-dom";
import applicationStore from "../stores/applicationStore";
import NotFound from "../pages/other/NotFound";
import ProjectEdit from "../pages/project/ProjectEdit";
import ProfileEdit from "../pages/other/ProfileEdit";

const HaveProjectOrDisplayNameRoute = observer(() => {
  const { project, currentRole, isStudent, user } = applicationStore;
  if (currentRole === 0 && isStudent) {
    return project ? <Outlet /> : <ProjectEdit newProject={true} />;
  } else
    return <Outlet />
});

export default HaveProjectOrDisplayNameRoute;
