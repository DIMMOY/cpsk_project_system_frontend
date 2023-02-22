import React from "react";
import { observer } from "mobx-react-lite";
import { Route, Navigate, Outlet } from "react-router-dom";
import applicationStore from "../stores/applicationStore";

const InClassRouteForStudent = observer(() => {
  const { user } = applicationStore;

  return <Outlet />;
});

export default InClassRouteForStudent;
