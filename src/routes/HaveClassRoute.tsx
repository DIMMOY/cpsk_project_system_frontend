import React from "react";
import { observer } from "mobx-react-lite";
import { Outlet } from "react-router-dom";
import applicationStore from "../stores/applicationStore";
import ClassJoining from "../pages/class/ClassJoining";

const HaveClassRoute = observer(() => {
  const { classroom, currentRole, isStudent } = applicationStore;
  if (currentRole === 0 && isStudent)
    return classroom ? <Outlet /> : <ClassJoining />;
  else return <Outlet />;
});

export default HaveClassRoute;
