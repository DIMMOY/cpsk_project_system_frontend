import { AppBar, IconButton, Typography, Toolbar } from "@mui/material"
import AdbIcon from '@mui/icons-material/Adb';
import { Menu as MenuIcon } from '@material-ui/icons'
import React from "react";
import { Box, Container } from "@material-ui/core";
import logo from '../assets/images/logo.png'

export const NavBar = () => {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    return (
        <AppBar position="static" >
            <Container maxWidth="xl" className="navbar">
                <Toolbar disableGutters>
                    <img className="logo-navbar" src={logo} alt="logo"/>
                    <div className="default-profile"></div>
                </Toolbar>
            </Container>
        </AppBar>
    )
}