import { Container, Box, IconButton, Button, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { fontFamily, fontWeight, Stack } from '@mui/system'
import React, { Component, useEffect, useState } from 'react'
import { KeyObjectType } from 'crypto'
import { padding } from '@mui/system/spacing'
import { Link, useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import { ListPreviewButton } from '../../styles/layout/_button'
import { listSendMeetingScheduleInClass } from '../../utils/meetingSchedule'
import moment from 'moment'
import { CommonPreviewContainer } from '../../styles/layout/_preview/_previewCommon'
import { theme } from '../../styles/theme'
import { observer } from 'mobx-react'
import applicationStore from '../../stores/applicationStore'
import NotFound from '../other/NotFound'

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

const MeetingScheduleHomePreview = observer(({ isStudent }: PreviewProps) => {
  const [meetingSchedules, setMeetingSchedules] = useState<Array<any>>([])
  const [notFound, setNotFound] = useState<number>(2)
  const { currentRole, classroom, project } = applicationStore
  const classes = useStyles()
  const navigate = useNavigate();
  const isBigScreen = useMediaQuery({ query: '(min-width: 600px)' })
  const { success, warning, error, secondary } = theme.color.text
  const statusList 
    = [{color: error, message: 'ยังไม่ส่ง'}, 
      {color: success, message: 'ส่งแล้ว'}, 
      {color: warning, message: 'ส่งช้า'},
      {color: warning, message: 'รอยืนยัน'},  
      {color: secondary, message: "----"}]
  
  const currentPathName = 
    window.location.pathname.endsWith('/') ? 
      window.location.pathname.slice(0, -1) : 
      window.location.pathname

  const pathname = currentPathName.split('/')
  const classId = isStudent ? classroom._id : pathname[2]
  const projectId = isStudent ? project._id : pathname[4]

  useEffect(() => {
    async function getData() {
      const meetingScheduleData = await listSendMeetingScheduleInClass({sort: 'createdAtDESC'}, classId, projectId)
      if (!meetingScheduleData.data) {
        setNotFound(0)
      } else {
        setMeetingSchedules(meetingScheduleData.data as Array<any>)
        setNotFound(1)
      }
    }
    getData()
  }, [])

  if (notFound === 1) {
    return (
      <CommonPreviewContainer>
        <Box sx={{ display: 'flex', padding: '0 auto' }}>
          <Link to={isStudent ? "/" : currentPathName.slice(0, currentPathName.lastIndexOf('/'))}>
            <IconButton
              disableRipple
              className={classes.iconSize}
              sx={{ 
                marginRight: '1.25rem',
                '& svg': {
                  color: theme.color.background.primary
                }
              }}
              disableFocusRipple
              href='/'
            >
              <ArrowBackIosNewIcon fontSize="large" />
            </IconButton>
          </Link>
          <Typography
            sx={{ 
              fontSize: '1.875rem', 
              fontWeight: '600', 
              color: theme.color.text.primary 
            }}
          >
            รายงานการพบอาจารย์ที่ปรึกษา
          </Typography>
        </Box>
        <Box sx={{ flexDirection: 'column', display: 'flex' }}>
          {meetingSchedules.map((mtSchedule) => (
            <ListPreviewButton
              key={mtSchedule._id}
              onClick = {() => {navigate(isStudent ? `/meeting-schedule/${mtSchedule.meetingScheduleId as string}` : `${currentPathName}/${mtSchedule.meetingScheduleId as string}`,
                  {replace: true, state: {name: mtSchedule.name, status: mtSchedule.sendStatus, detail: mtSchedule.detail ? mtSchedule.detail : '',
                  statusType: mtSchedule.statusType, dueDate: moment(mtSchedule.endDate).format('DD/MM/YYYY HH:mm')}})}}
            >
              <Typography
                sx={{
                  top: '1.5rem',
                  left: 'calc(20px + 1vw)',
                  position: 'absolute',
                  fontSize: 'calc(30px + 0.2vw)',
                  fontFamily: 'Prompt',
                  fontWeight: 600,
                  color: theme.color.text.primary
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
                  color: statusList[mtSchedule.sendStatus].color,
                  fontWeight: 600
                }}
              >
                {statusList[mtSchedule.sendStatus].message}
              </Typography>
              <Typography
                sx={{
                  top: '5rem',
                  left: 'calc(20px + 1vw)',
                  position: 'absolute',
                  fontSize: 'calc(15px + 0.3vw)',
                  color: theme.color.text.secondary,
                  fontWeight: 600
                }}
              >
                ภายในวันที่ {moment(mtSchedule.endDate).format('DD/MM/YYYY HH:mm')}
              </Typography>
            </ListPreviewButton>
          ))}
        </Box>
      </CommonPreviewContainer>
    )
  } else if (notFound === 2) {
    return <CommonPreviewContainer/>
  } else {
    return <NotFound/>
  }
})

export default MeetingScheduleHomePreview
