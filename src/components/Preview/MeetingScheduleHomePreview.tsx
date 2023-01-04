import { Container, Box, IconButton, Button, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { fontFamily, fontWeight, Stack } from '@mui/system'
import React, { Component } from 'react'
import { KeyObjectType } from 'crypto'
import { padding } from '@mui/system/spacing'
import { Link, useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import { ListPreviewButton } from '../../styles/layout/_button'

const exampleDocument = [
  {
    id: 1,
    name: 'Meeting Schedule 5',
    dueDate: '2022-10-20 23:59',
    status: 0,
    statusType: 'ยังไม่ส่ง'
  },
  {
    id: 2,
    name: 'Meeting Schedule 4',
    dueDate: '2022-10-18 23:59',
    status: 1,
    statusType: 'ส่งช้า'
  },
  {
    id: 3,
    name: 'Meeting Schedule 3',
    dueDate: '2022-10-13 23:59',
    status: 2,
    statusType: 'ส่งช้า'
  },
  {
    id: 4,
    name: 'Meeting Schedule 2',
    dueDate: '2022-10-13 23:59',
    status: 2,
    statusType: 'ส่งแล้ว'
  },
  {
    id: 5,
    name: 'Meeting Schedule 1',
    dueDate: '2022-10-13 23:59',
    status: 2,
    statusType: 'ส่งแล้ว'
  }
]

const useStyles = makeStyles({
  iconSize: {
    '& svg': {
      color: '#AD68FF'
    }
  }
})

interface PreviewProps {
  isStudent: boolean
}

const MeetingScheduleHomePreview = ({ isStudent }: PreviewProps) => {
  const classes = useStyles()
  const navigate = useNavigate();
  const isBigScreen = useMediaQuery({ query: '(min-width: 600px)' })
  const statusList = [{color: '#FF5454', message: 'ยังไม่ส่ง'}, {color: '#43BF64', message: 'ส่งแล้ว'}, {color: '#FBBC05', message: 'ส่งช้า'}]
  isStudent = true

  const statusColorList = {
    ส่งแล้ว: '#43BF64',
    ส่งช้า: '#FBBC05',
    ยังไม่ส่ง: '#FF5454'
  }

  return (
    <Box className="common-preview-container" sx={{}}>
      <Box sx={{ display: 'flex', padding: '0 auto' }}>
        <Link to="/">
          <IconButton
            disableRipple
            className={classes.iconSize}
            sx={{ marginRight: '1.25rem' }}
            disableFocusRipple
            href='/'
          >
            <ArrowBackIosNewIcon fontSize="large" />
          </IconButton>
        </Link>
        <Typography
          className="fs-30 fw-600 maincolor"
          sx={{ fontSize: '1.875rem', fontWeight: '600' }}
        >
          รายงานการพบอาจารย์ที่ปรึกษา
        </Typography>
      </Box>
      <Box sx={{ flexDirection: 'column', display: 'flex' }}>
        {exampleDocument.map((mtSchedule) => (
          <ListPreviewButton
            key={mtSchedule.id}
            onClick = {() => {navigate(`/meeting-schedule/${mtSchedule.id}`,
                {replace: true, state: {id: mtSchedule.id, name: mtSchedule.name, status: mtSchedule.status, 
                statusType: mtSchedule.statusType, dueDate: mtSchedule.dueDate}})}}
          >
            <Typography
              className="maincolor"
              sx={{
                top: '1.5rem',
                left: 'calc(20px + 1vw)',
                position: 'absolute',
                fontSize: 'calc(30px + 0.2vw)',
                fontFamily: 'Prompt',
                fontWeight: 600
              }}
            >
              {mtSchedule.name}
            </Typography>
            <Typography
              sx={{
                top: isBigScreen ? '1.5rem' : '1.95rem' ,
                right: 'calc(20px + 1vw)',
                position: 'absolute',
                fontSize: isBigScreen ? 'calc(30px + 0.2vw)' : 'calc(15px + 2vw)',
                color: statusList[mtSchedule.status].color,
                fontWeight: 600
              }}
            >
              {statusList[mtSchedule.status].message}
            </Typography>
            <Typography
              sx={{
                top: '5rem',
                left: 'calc(20px + 1vw)',
                position: 'absolute',
                fontSize: 'calc(15px + 0.3vw)',
                color: '#686868',
                fontWeight: 600
              }}
            >
              ภายในวันที่ {mtSchedule.dueDate}
            </Typography>
          </ListPreviewButton>
        ))}
      </Box>
    </Box>
  )
}

export default MeetingScheduleHomePreview
