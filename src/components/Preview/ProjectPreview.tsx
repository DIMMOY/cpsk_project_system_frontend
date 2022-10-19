import React, { Component } from 'react'
import { Container, Box, IconButton, Button, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import DescriptionIcon from '@mui/icons-material/Description'
import GroupsIcon from '@mui/icons-material/Groups'
import GradingIcon from '@mui/icons-material/Grading'
import { PreviewButton } from '../../styles/layout/_button'
import { useMediaQuery } from 'react-responsive'

const useStyles = makeStyles({
  iconSize: {
    '& svg': {
      fontSize: '500%',
      color: '#AD68FF'
    }
  }
})

export default function ProjectPreview (props: { isCommittee: boolean }) {
  const { isCommittee } = props
  const classes = useStyles()
  // const newClasses = PreviewButton();
  const isBigScreen = useMediaQuery({ query: '(min-width: 1440px)' })

  return (
    <Box
      className="project-preview-container"
      sx={{ top: '5.625rem', position: 'absolute', flexDirection: 'column' }}
    >
      <Box className="project-preview-detail">
        <Typography>เคยูโปรเจกต์ (ชื่อภาษาไทย)</Typography>
        <Typography>KU Project (ชื่อภาษาอังกฤษ)</Typography>
        <Typography>คำอธิบายโปรเจกต์</Typography>
      </Box>
      <Box sx={{ padding: '20px 50px 50px 20px' }}>
        <Button
          className="project-preview-button"
          sx={{
            fontSize: isBigScreen ? '1.6vw' : '1.5rem',
            color: '#AD68FF',
            fontFamily: 'Prompt',
            background: '#F3F3F3',
            margin: '60px 2.22vw 0 2.22vw',
            flexDirection: 'column',
            borderRadius: '20px'
          }}
        >
          ส่งเอกสาร
          <IconButton className={classes.iconSize} disabled>
            <DescriptionIcon />
          </IconButton>
        </Button>
        {!isCommittee && (
          <Button
            className="project-preview-button"
            sx={{
              fontSize: isBigScreen ? '1.6vw' : '1.5rem',
              color: '#AD68FF',
              fontFamily: 'Prompt',
              background: '#F3F3F3',
              margin: '60px 2.22vw 0 2.22vw',
              flexDirection: 'column',
              borderRadius: '20px'
            }}
          >
            รายงานอาจารย์ที่ปรึกษา
            <IconButton className={classes.iconSize} disabled>
              <GroupsIcon />
            </IconButton>
          </Button>
        )}
        <Button
          className="project-preview-button"
          sx={{
            fontSize: isBigScreen ? '1.6vw' : '1.5rem',
            color: '#AD68FF',
            fontFamily: 'Prompt',
            background: '#F3F3F3',
            margin: '60px 2.22vw 0 2.22vw',
            flexDirection: 'column',
            borderRadius: '20px'
          }}
        >
          คะแนน
          <IconButton className={classes.iconSize} disabled>
            <GradingIcon />
          </IconButton>
        </Button>
      </Box>
    </Box>
  )
}
