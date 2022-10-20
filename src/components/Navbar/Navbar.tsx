import { Typography, Toolbar, Box, AppBar, Button } from '@mui/material'
import { observer } from 'mobx-react'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import defaulProfile from '../../assets/images/default_profile.png'
import applicationStore from '../../stores/applicationStore'
import { signOutWithGoogle } from '../../utils/auth'

export const NavBar = observer(() => {
  const navigate = useNavigate()

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

  const profile: string | null = applicationStore.user ? applicationStore.user.photoURL : defaulProfile

  // console.log(applicationStore.user)

  const onGoogleLogOut = async () => {
    const res = await signOutWithGoogle();
    if (res.statusCode === 200) {
      navigate('/signin')
    }
  }


  return (
    <AppBar
      position="sticky"
      className="navbar"
      sx={{ background: '#AD68FF', display: applicationStore.isShowNavBar ?  "block" : "none" }}
    >
      <Toolbar disableGutters>
        <Link to="/">
          <img style={{left: '5vw'}} className="logo-navbar" src={logo} alt="logo"/>
        </Link>
        <Box sx={{ position: 'absolute', right: '10vw', top: '8px', flexDirection: 'row', display: 'flex', justifyContent: 'center', textAlign: 'center', alignItems: 'center' }}>
          <img style={{width: '50px', height: '50px', borderRadius: '50%', margin: '0.6vw' }} src={applicationStore?.user?.photoURL || defaulProfile} alt="profile"/>
          <Typography sx={{fontSize: 20, margin: '0.6vw'}}>{applicationStore.user?.displayName?.split(' ')[0].toUpperCase()}</Typography>
          <Button sx={{background: '#FFFFFF', borderRadius: '10px', color: '#AD68FF', boxShadow: 'none', textTransform: 'none', '&:hover': { background: '#FFFFFF' }}} 
            disableTouchRipple onClick={onGoogleLogOut}>
              LogOut ปุ่มชั่วคราว
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
})
