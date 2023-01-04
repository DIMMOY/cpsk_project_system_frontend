import React, { Component } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import DescriptionIcon from '@mui/icons-material/Description'
import GroupsIcon from '@mui/icons-material/Groups'
import GradingIcon from '@mui/icons-material/Grading'
import { ProjectPreviewButton } from '../../styles/layout/_button'
import { useMediaQuery } from 'react-responsive'
import { Link } from 'react-router-dom'
import { ProjectPreviewContainer, ProjectPreviewDetail } from '../../styles/layout/_preview/_previewProject'

const useStyles = makeStyles({
  iconSize: {
    '& svg': {
      fontSize: '500%',
      color: '#AD68FF'
    }
  }
})


const ProjectHomePreview = (props: { isCommittee: boolean }) => {
  const { isCommittee } = props
  const classes = useStyles()
  const isBigScreen = useMediaQuery({ query: '(min-width: 1440px)' })

  const scrollTop = () => {
    window.scrollTo(0, 0);
  }

  return (
    <ProjectPreviewContainer>
      <ProjectPreviewDetail>
        <Typography sx={{fontSize: 50, fontWeight: 500, color: '#AD68FF'}}>เคยูโปรเจกต์ (ชื่อภาษาไทย)</Typography>
        <Typography sx={{fontSize: 30, fontWeight: 500, color: '#686868'}}>KU Project (ชื่อภาษาอังกฤษ)</Typography>
        <Typography sx={{fontSize: 30, fontWeight: 500, color: '#686868'}}>คำอธิบายโปรเจกต์</Typography>
      </ProjectPreviewDetail>
      <Box sx={{textAlign: 'center'}}>
        <Link to = "/document" style={{ textDecoration: 'none' }}>
          <ProjectPreviewButton isBigScreen={isBigScreen}
            onClick={scrollTop}
          >
            ส่งเอกสาร
            <IconButton className={classes.iconSize} disabled>
              <DescriptionIcon />
            </IconButton>
          </ProjectPreviewButton>
        </Link>
        {!isCommittee && (
          <Link to = "/meetingschedule" style={{ textDecoration: 'none' }}>
            <ProjectPreviewButton isBigScreen={isBigScreen}
              onClick={scrollTop}
            >
              รายงานอาจารย์ที่ปรึกษา
              <IconButton className={classes.iconSize} disabled>
                <GroupsIcon />
              </IconButton>
            </ProjectPreviewButton>
          </Link>
        )}
        <Link to = "/score" style={{ textDecoration: 'none' }}>
          <ProjectPreviewButton isBigScreen={isBigScreen}
            onClick={scrollTop}
            disabled
          >
            คะแนน
            <IconButton className={classes.iconSize} disabled>
              <GradingIcon />
            </IconButton>
          </ProjectPreviewButton>
        </Link>
      </Box>
    </ProjectPreviewContainer>
  )
}

export default ProjectHomePreview 
