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
  const [meetingSchedules, setMeetingSchedules] = useState<Array<any>>([])
  const classes = useStyles()
  const navigate = useNavigate();
  const isBigScreen = useMediaQuery({ query: '(min-width: 600px)' })
  const { success, warning, error, secondary } = theme.color.text
  const statusList 
    = [{color: error, message: 'ยังไม่ส่ง'}, 
      {color: success, message: 'ส่งแล้ว'}, 
      {color: warning, message: 'รอยืนยัน'}, 
      {color: warning, message: 'ส่งช้า'}, 
      {color: secondary, message: "----"}]

  isStudent = true

  //ชั่วคราว
  const classId = '63b133a7529ab2ab1a0606f8'
  const projectId = '63b5593616aea7a2dd63be34'

  useEffect(() => {
    async function getData() {
      const result = await listSendMeetingScheduleInClass({sort: 'createdAtDESC'}, classId, projectId)
      setMeetingSchedules(result.data as Array<any>)
    }
    getData()
  }, [])

  return (
    <CommonPreviewContainer>
      <Box sx={{ display: 'flex', padding: '0 auto' }}>
        <Link to="/">
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
            onClick = {() => {navigate(`/meeting-schedule/${mtSchedule.meetingScheduleId}`,
                {replace: true, state: {id: mtSchedule._id, name: mtSchedule.name, status: mtSchedule.sendStatus, detail: mtSchedule.detail ? mtSchedule.detail : '',
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
}

export default MeetingScheduleHomePreview
