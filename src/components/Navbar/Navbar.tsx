import { Typography, Toolbar, Box, AppBar, Menu, Fade, MenuItem, Divider, IconButton, useScrollTrigger, Container } from '@mui/material'
import { observer } from 'mobx-react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import defaulProfile from '../../assets/images/default_profile.png'
import applicationStore from '../../stores/applicationStore'
import { signOutWithGoogle } from '../../utils/auth'
import { changeCurrentRole } from '../../utils/user'
import Button from '@mui/material/Button';
import { useMediaQuery } from 'react-responsive'
import Tooltip from '@mui/material/Tooltip'

// Icon
import DescriptionIcon from '@mui/icons-material/Description'
import GroupsIcon from '@mui/icons-material/Groups'
import ClassIcon from '@mui/icons-material/Class';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';

export const NavBar = observer(() => {
  const navigate = useNavigate()
  const {currentRole, isAdmin, isAdvisor, isStudent, classroom} = applicationStore

  const { userId } = applicationStore // สำหรับทดสอบเท่านั้น

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [menuItems, setMenuItems] = useState<Array<any>>([])
  const isBigScreen = useMediaQuery({ query: '(min-width: 900px)' })
  const responsePadding = isBigScreen ? '1.12rem 3rem 1.12rem 3rem' : '1.12rem 1.5rem 1.12rem 1.5rem'
  const open = Boolean(anchorEl);
  const buttons = ['คลาส', 'เอกสาร', 'รายงานพบอาจารย์ที่ปรึกษา']
  const linkButtons = ['class', 'document', 'meetingschedule']
  const firstPathname = (window.location.pathname).split('/')

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

  const handleOnClick = (index: number) => {
    navigate(linkButtons[index])
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
        background: '#AD68FF', 
        display: applicationStore.isShowNavBar ?  "flex" : "none", 
        minWidth: '30rem', 
        justifyContent: 'center', 
        textAlign: 'center',
        height: '4.5rem',
        paddingLeft: '4vw',
        paddingRight: '4vw',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        flex: {flex: 1},
      }}
    >
      <Toolbar disableGutters>
        <Link to="/">
          <img 
            style={{
              width: '3.125rem', height: '3.125rem', display: 'flex', 
              alignItems: 'center', zIndex: 2, position: 'relative'
            }} src={logo}
            alt="logo"/>
        </Link>
        { classroom ? <Typography sx={{fontSize: 20, marginLeft: '1vw', fontWeight: 500}}>{'Classroom: ' + classroom}</Typography> : <></> }
        { 
          currentRole === 2 ? 
          <Box sx={{position: 'absolute', left: 0, right: 0, zIndex: 1}}>
            {buttons.map((name, index) => (
              <Tooltip 
              key={index}
              title={name}
              enterNextDelay={500}
              placement={"bottom"} 
              componentsProps={{
              tooltip: {
                  sx: {
                    color: "#F8F8F8",
                    backgroundColor: "#686868",
                    fontSize: 16,
                    fontWeight: 300,
                  }
                }
              }}
            >   
              <span>
                <Button
                  sx={{
                    padding: responsePadding,
                    boxSizing: 'border-box',
                    MozBoxSizing: 'border-box',
                    WebkitBoxSizing: 'border-box',
                    color: '#F8F8F8', 
                    borderRadius: (firstPathname[1] === linkButtons[index]) || (index === 0 && firstPathname[1] === '') ? 0 : '0.75rem', 
                    '&:hover': {
                      backgroundColor: '#b67bfd',
                    },
                    marginRight: '1rem',
                    borderBottom: (firstPathname[1] === linkButtons[index]) || (index === 0 && firstPathname[1] === '') ? '5px solid' : 'none'
                  }}
                  disableRipple
                  disableFocusRipple
                  disableTouchRipple
                  disabled={(firstPathname[1] === linkButtons[index]) || (index === 0 && firstPathname[1] === '')}
                  onClick={() => handleOnClick(index)}
                >
                    {index === 0 ? ((firstPathname[1] === linkButtons[index]) || (index === 0 && firstPathname[1] === '') ? <ClassIcon sx={{fontSize: 30}}/> : <ClassOutlinedIcon sx={{fontSize: 30}}/>) :
                     index === 1 ? ((firstPathname[1] === linkButtons[index]) ? <DescriptionIcon sx={{fontSize: 30}}/> : <DescriptionOutlinedIcon sx={{fontSize: 30}}/>) :
                     (firstPathname[1] === linkButtons[index]) ? <GroupsIcon sx={{fontSize: 30}}/> : <GroupsOutlinedIcon sx={{fontSize: 30}}/>}
                </Button>
              </span>
            </Tooltip>
            ))
            }
          </Box> : <></> 
        }
        <Box sx={{ position: 'absolute', display: 'flex', alignItems: 'center', right: 0, zIndex: 2 }}>
          {isBigScreen ? <Typography sx={{fontSize: 20, margin: '0.6vw', fontWeight: 500}}>{applicationStore.user?.displayName?.split(' ')[0].toUpperCase()}</Typography> : <></>}
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
