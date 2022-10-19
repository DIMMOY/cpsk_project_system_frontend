import { Typography, Toolbar, Box, AppBar } from '@mui/material'
import React from 'react'
import logo from '../../assets/images/logo.png'

export const NavBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  )
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  )

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }
  return (
    <AppBar
      position="sticky"
      className="navbar"
      sx={{ background: '#AD68FF' }}
    >
      <Toolbar disableGutters>
        <img className="logo-navbar" src={logo} alt="logo" />
        <Box className="default-profile"></Box>
      </Toolbar>
    </AppBar>
  )
}
