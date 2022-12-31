import { Typography, Toolbar, Box, AppBar, Menu, Fade, MenuItem, Divider, IconButton } from '@mui/material'
import { observer } from 'mobx-react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import defaulProfile from '../../assets/images/default_profile.png'
import applicationStore from '../../stores/applicationStore'
import { signOutWithGoogle } from '../../utils/auth'
import { changeCurrentRole } from '../../utils/user'

export const NavBar = observer(() => {
  const navigate = useNavigate()
  const {currentRole, isAdmin, isAdvisor, isStudent, classroom} = applicationStore

  const { userId } = applicationStore // สำหรับทดสอบเท่านั้น

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [menuItems, setMenuItems] = useState<Array<any>>([])
  const open = Boolean(anchorEl);

  const profile: string | null = applicationStore.user && applicationStore.user.photoURL ? applicationStore.user.photoURL : defaulProfile

  const onGoogleLogOut = async () => {
    setAnchorEl(null);
    const res = await signOutWithGoogle();
    if (res.statusCode === 200) {
      navigate('/signin')
    }
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeCurrentRole = async (role: number) => {
    const change = await changeCurrentRole({userId, role})
    if (change.statusCode === 200) {
      navigate('/')
      window.location.reload()
    }
  }


  useEffect(() => {
    console.log('การเปลี่ยน role นี้เป็นการใช้วิธีชั่วคราวโดยการส่ง userId ไปโดยตรง กรุณากลับมาแก้ไขถ้าพร้อมแล้ว')
    const menuItems = []
    if (isAdmin && currentRole !== 2) menuItems.push({name: "เปลี่ยนโหมด 'ผู้ดูแลระบบ'" as string, role: 2 as number})
    if (isAdvisor && currentRole !== 1) menuItems.push({name: "เปลี่ยนโหมด 'อาจารย์ที่ปรึกษา'" as string, role: 1 as number})
    if (isStudent && currentRole !== 0) menuItems.push({name: "เปลี่ยนโหมด 'นิสิต'" as string, role: 0 as number})
    setMenuItems(menuItems)
  }, [])

  return (
    <AppBar
      position="sticky"
      sx={{ 
        background: '#AD68FF', display: applicationStore.isShowNavBar ?  "flex" : "none", 
        minWidth: '30rem', 
        justifyContent: 'center', 
        textAlign: 'center',
        height: '4.5rem',
        paddingLeft: '4vw',
        paddingRight: '4vw',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Toolbar disableGutters>
        <Link to="/">
          <img style={{width: '3.125rem', height: '3.125rem', display: 'flex', alignItems: 'center'}} src={logo} alt="logo"/>
        </Link>
        { classroom ? <Typography sx={{fontSize: 20, marginLeft: '1vw', fontWeight: 500}}>{'Classroom: ' + classroom}</Typography> : <></> }
        <Box sx={{ position: 'absolute', display: 'flex', alignItems: 'center', right: 0 }}>
          <Typography sx={{fontSize: 20, margin: '0.6vw', fontWeight: 500}}>{applicationStore.user?.displayName?.split(' ')[0].toUpperCase()}</Typography>
          <IconButton disableFocusRipple>
          <img 
            style={{width: '3rem', height: '3rem', borderRadius: '50%' }} 
            src={profile} 
            alt="profile" 
            onClick={handleClick} 
          />
          </IconButton>
        </Box>
        <Menu
          id="fade-menu"
          MenuListProps={{
            'aria-labelledby': 'fade-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          TransitionComponent={Fade}
          disableScrollLock
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          sx={{top: '0.5rem'}}
        >
          <MenuItem onClick={handleClose} disabled>แก้ไขโปรไฟล์</MenuItem>
          {
            menuItems.map((menu) => (
              <MenuItem key={menu.role} onClick={() => handleChangeCurrentRole(menu.role)}>
                {menu.name as string}
              </MenuItem>
            ))
          }
          <Divider sx={{ my: 0.5 }} />
          <MenuItem onClick={onGoogleLogOut}>ออกจากระบบ</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
})
