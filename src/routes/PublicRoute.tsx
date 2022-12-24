import React from 'react'
import { observer } from "mobx-react-lite";
import { Route, Navigate, Outlet } from 'react-router-dom'
import applicationStore from "../stores/applicationStore";



const PublicRoute = observer(
    () => {
        const { user } = applicationStore
        const isLogin = !!user
        applicationStore.setIsShowNavBar(isLogin)


        return isLogin ? <Navigate to = "/" /> : <Outlet />
    }
)

export default PublicRoute