import React, { useEffect, useState } from 'react'
import { Box, Button, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, IconButton } from '@mui/material'
import { Link } from 'react-router-dom';

// Icon
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import DescriptionIcon from '@mui/icons-material/Description'
import GroupsIcon from '@mui/icons-material/Groups'
import GradingIcon from '@mui/icons-material/Grading'
import PeopleIcon from '@mui/icons-material/People';
import ClassIcon from '@mui/icons-material/Class';
import Typography from '@mui/material/Typography';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'


interface MainProps {
  currentSelect: string;
}

const AdminSidebar = ({ currentSelect }: MainProps) => {

    return (
        <Drawer
        variant="permanent"
        sx={{
          width: 300,
          position: 'relative',
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 300, boxSizing: 'border-box', background: '#FCFCFC' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70%', minHeight: '20rem', flexDirection: 'column'}}>
          <List>
            {['คลาส', 'โปรเจกต์', 'เอกสาร', 'รายงานพบอาจารย์ที่ปรึกษา', 'ประเมิน', 'จับคู่กรรมการคุมสอบ'].map((text) => (
              <ListItem key={text} disablePadding sx={{fontWeight: 100}}>
                <ListItemButton>
                  <ListItemIcon sx={{color: text === currentSelect ? '#AD68FF' : '#8C8C8C'}}>
                    {
                      text === 'คลาส' ? <ClassIcon/> :
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
                        color: text === currentSelect ? '#AD68FF' : '#8C8C8C',
                        fontWeight: text === currentSelect ? 500 : 400,
                        fontSize: text === currentSelect ? 18 : 16,
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
}

export default AdminSidebar