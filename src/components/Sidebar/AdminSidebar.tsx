import React, { useEffect, useState } from 'react'
import { Box, Button, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, IconButton } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom';

// Icon
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import DescriptionIcon from '@mui/icons-material/Description'
import GroupsIcon from '@mui/icons-material/Groups'
import GradingIcon from '@mui/icons-material/Grading'
import PeopleIcon from '@mui/icons-material/People';
import ClassIcon from '@mui/icons-material/Class';
import Typography from '@mui/material/Typography';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { theme } from '../../styles/theme';
import { useMediaQuery } from 'react-responsive';
import applicationStore from '../../stores/applicationStore';
import { observer } from 'mobx-react';

const AdminSidebar = observer(() => {
    const { pathname } = window.location
    const navigate = useNavigate();
    const params = ['project', 'document', 'meeting-schedule', 'score', 'committee']
    const menuText = ['โปรเจกต์', 'เอกสาร', 'รายงานพบอาจารย์ที่ปรึกษา', 'ประเมิน', 'จับคู่กรรมการคุมสอบ']
    const [currentSelect, setCurrentSelect] = useState<null | string>(null)
    const isBigScreen = useMediaQuery({ query: '(min-width: 900px)' })

    const [show, setShow] = useState(applicationStore.isShowSideBar);
  
    const toggleDrawer =
      (open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event.type === 'keydown' &&
          ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
          return;
        }
  
        applicationStore.setIsShowSideBar(open);
      };

    const handleOnClick = (param: string, text: string) => {
      if (text !== currentSelect) {
        const path = pathname.substring(0, pathname.lastIndexOf('/'));
        setCurrentSelect(text)
        navigate(path + '/' + param)
        applicationStore.setIsShowSideBar(false)
      }
    }

    useEffect(() => {
      const index = params.findIndex((p) => p === pathname.substring(pathname.lastIndexOf('/') + 1))
      if (index === -1) {
        navigate('/')
      }
      setCurrentSelect(menuText[index])
    }, [currentSelect])

    useEffect(() => {
      setShow(applicationStore.isShowSideBar)
    }, [applicationStore.isShowSideBar])

    return (
        <Drawer
          // anchor={anchor}
          open={show}
          onClose={toggleDrawer(false)}
          variant={isBigScreen ? "permanent" : "temporary"}
          sx={{
            width: 300,
            position: 'relative',
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: 
              { 
                width: 300, 
                boxSizing: 'border-box', 
                background: theme.color.background.default 
              },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70%', minHeight: '20rem', flexDirection: 'column'}}>
            <List>
              {menuText.map((text, index) => (
                <ListItem key={text} disablePadding sx={{fontWeight: 100}}>
                  {/*ปิดชั่วคราว index >= 3*/}
                  <ListItemButton onClick={() => handleOnClick(params[index], text)} disabled={index >= 3}>
                    <ListItemIcon sx={{color: text === currentSelect ? theme.color.text.primary : theme.color.text.secondary }}>
                      {
                        text === 'โปรเจกต์' ? <FolderSharedIcon/> : 
                        text === 'เอกสาร' ? <DescriptionIcon/> :
                        text === 'รายงานพบอาจารย์ที่ปรึกษา' ? <GroupsIcon/> :
                        text === 'ประเมิน' ? <GradingIcon/> :
                        text === 'จับคู่กรรมการคุมสอบ' ? <PeopleIcon/> :
                        <PeopleIcon/>
                      }
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                      <Typography 
                        sx={{ 
                          color: text === currentSelect ? theme.color.text.primary : theme.color.text.secondary,
                          fontWeight: text === currentSelect ? 500 : 400,
                          fontSize: 16,
                          textDecoration: text === currentSelect ? 'underline' : 'none',
                        }}>
                          {text}
                      </Typography>
                      }/>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
      </Drawer>
    )
})

export default AdminSidebar