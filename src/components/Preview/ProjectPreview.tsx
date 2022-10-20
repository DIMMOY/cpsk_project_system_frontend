import React, { Component } from 'react'
import { Container, Box, IconButton, Button, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import DescriptionIcon from '@mui/icons-material/Description'
import GroupsIcon from '@mui/icons-material/Groups'
import GradingIcon from '@mui/icons-material/Grading'
import { PreviewButton } from '../../styles/layout/_button'
import { useMediaQuery } from 'react-responsive'
import { Link } from 'react-router-dom'

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
      sx={{ top: '5.625rem', flexDirection: 'column' }}
    >
      <Box className="project-preview-detail">
        <Typography>เคยูโปรเจกต์ (ชื่อภาษาไทย)</Typography>
        <Typography>KU Project (ชื่อภาษาอังกฤษ)</Typography>
        <Typography>คำอธิบายโปรเจกต์</Typography>
      </Box>
      <Box sx={{ padding: '20px 50px 50px 20px' }}>
        <Link to = "/document" style={{ textDecoration: 'none' }}>
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
            href="/document"
          >
            ส่งเอกสาร
            <IconButton className={classes.iconSize} disabled>
              <DescriptionIcon />
            </IconButton>
          </Button>
        </Link>
        {!isCommittee && (
          <Link to = "/meetingschedule" style={{ textDecoration: 'none' }}>
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
              href="/meetingschedule"
            >
              รายงานอาจารย์ที่ปรึกษา
              <IconButton className={classes.iconSize} disabled>
                <GroupsIcon />
              </IconButton>
            </Button>
          </Link>
        )}
        <Link to = "/score" style={{ textDecoration: 'none' }}>
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
        </Link>
      </Box>
    </Box>
  )
}
