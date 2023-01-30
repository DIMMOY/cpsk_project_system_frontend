import React, { useEffect, useState } from 'react'
import { Box, IconButton, Button, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { Link, useLocation } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import { useMediaQuery } from 'react-responsive'
import { observer } from 'mobx-react'
import moment from 'moment'
import { cancelSendMeetingSchedule, getSendMeetingScheduleInClass, sendMeetingSchedule } from '../../utils/meetingSchedule'
import { LoadingButton } from '@mui/lab'
import CancelModal from '../../components/Modal/CancelModal'
import { CommonPreviewContainer } from '../../styles/layout/_preview/_previewCommon'
import { theme } from '../../styles/theme'

interface PreviewProps {
  isStudent: boolean
}

const MeetingScheduleDetail = observer(({ isStudent }: PreviewProps) => {
  isStudent = true

  const location = useLocation()
  const isBigScreen = useMediaQuery({ query: '(min-width: 600px)' })
  const [detail, setDetail] = useState<string>('')
  const { success, warning, error, secondary } = theme.color.text
  const statusList 
    = [{color: error, message: 'ยังไม่ส่ง'}, 
      {color: success, message: 'ส่งแล้ว'}, 
      {color: warning, message: 'รอยืนยัน'}, 
      {color: warning, message: 'ส่งช้า'}, 
      {color: secondary, message: "----"}]
  const [id, setId] = useState<string | null>(null)
  const [name, setName] = useState<string>('กำลังโหลด...')
  const [dueDate, setDueDate] = useState<string>('--/--/---- --:--')
  const [status, setStatus] = useState<number>(4)
  const [loading, setLoading] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [submit, setSubmit] = useState<boolean>(false)

  // ชั่วคราว
  const classId = '63b133a7529ab2ab1a0606f8'
  const projectId = '63b5593616aea7a2dd63be34'
  const meetingScheduleId = window.location.pathname.split('/')[2]

  const getData = async (detail: string) => {
    const result = await getSendMeetingScheduleInClass(classId, projectId, meetingScheduleId)
    console.log(result.data)
    setName(result.data.meetingSchedule.name)
    setDueDate(moment(result.data.endDate).format('DD/MM/YYYY HH:mm'))
    setStatus(result.data.sendStatus)
    setId(result.data.meetingScheduleId)
    setDetail(result.data.detail ? result.data.detail : detail)
    setSubmit(result.data.detail || detail !== '')
  }
  

  useEffect(() => {
    window.history.replaceState({}, document.title)
    if (location.state) {
      setName(location.state.name)
      setDueDate(location.state.dueDate)
      setStatus(location.state.status)
      setId(location.state.id)
      setDetail(location.state.detail)
      setSubmit(location.state.detail)
    } else {
      getData('')
    }
  }, [])

  const handleOnDescriptionChange = (description: string) => {
    if ((description.replace(/(\r\n|\n|\r)/gm, '').replace(/\s/g,'') == '')) setSubmit(false)
    else setSubmit(true)
    setDetail(description)
  }

  const handleOnSubmit = async () => {
    setLoading(true)
    const result = await sendMeetingSchedule({ detail }, projectId, meetingScheduleId)
    if (result.statusCode === 200) {
      setTimeout(async () => {
        await getData('')
        setLoading(false)
      }, 1300)
    }
    else setLoading(false)
  }

  const handleOnOpenModal = () => setOpen(true)
  const handleOnCloseModal = () => setOpen(false)

  const handleOnCancel = async () => {
    const result = await cancelSendMeetingSchedule(projectId, meetingScheduleId)
    if (result.statusCode === 200) {
      await getData(detail)
    }
  }

  return (
    <CommonPreviewContainer sx={{textAlign: "center"}}>
      <Box sx={{ display: 'flex', padding: '0 auto' }}>
        <Link to="/meeting-schedule">
          <IconButton
            disableRipple
            sx={{ 
              marginRight: '1.25rem',
              '& svg': {
                color: theme.color.background.primary
              }
            }}
            disableFocusRipple
          >
            <ArrowBackIosNewIcon fontSize="large" />
          </IconButton>
        </Link>
      </Box>
      <Box sx={{ flexDirection: 'column', display: 'flex', justifyContent: "center",}}>
          <Box
            className="ml-96 common-preview-button"
            sx={{
              position: "relative",
              borderRadius: '20px',
              background: theme.color.button.default,
              margin: '1.25rem 0 0 0',
              display: 'flex',
              textTransform: 'none',
              zIndex: '1',
            }}
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
              {name}
            </Typography>
            <Typography
              sx={{
                top: isBigScreen ? '1.5rem' : '1.95rem' ,
                right: 'calc(20px + 1vw)',
                position: 'absolute',
                fontSize: isBigScreen ? 'calc(30px + 0.2vw)' : 'calc(15px + 2vw)',
                color: statusList[status].color,
                fontWeight: 600
              }}
            >
              {statusList[status].message}
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
              ภายในวันที่ {dueDate}
            </Typography>
          </Box>

          <Box
            sx={{
                top: "-5rem",
                position: "relative",
                height: "23rem",
                background: theme.color.background.tertiary,
                borderRadius: "20px",
            }}
          >
          { isStudent &&
          <>
            <TextField
              id="outlined-multiline-flexible"
              disabled={status ? true : false}
              placeholder={`กรุณาใส่ข้อความ`}
              value={detail}
              multiline
              maxRows={4}
              minRows={4}
              
              size="medium"
              sx={{
                top: "7rem",
                width: "88vw",
                left: "0",
                right: "0",
                marginLeft: "auto",
                marginRight: "auto",
                position: "absolute",
                "& fieldset": { border: 'none' },
                "& .MuiOutlinedInput-root": {
                  padding: "1rem 1.25rem 1rem 1.25rem",
                  backgroundColor: theme.color.background.default,
                  borderRadius: "20px",
                  fontSize: 20,
                  color: theme.color.text.secondary,
                  fontWeight: 500,
                },
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: theme.color.text.secondary,
                },
              }}
              onChange={e => handleOnDescriptionChange(e.target.value)}
            />

            <CancelModal 
              open={open}
              onClose={handleOnCloseModal}
              onSubmit={handleOnCancel}
              title={`ยกเลิกการส่ง ${name}`}
              description='เมื่อยกเลิกแล้วจะต้องให้ที่ปรึกษายืนยันใหม่อีกครั้ง'           
            />
            
            { status != 4 ? 
              <LoadingButton 
                loading={loading}
                sx={{
                  top: "18rem",
                  width: "7rem",
                  height: "2.8rem",
                  fontSize: 20,
                  textAlign: "center",
                  justifyContent: "center",
                  background: status ? theme.color.button.error : theme.color.button.primary,
                  borderRadius: '10px',
                  color: theme.color.text.default,
                  boxShadow: 'none',
                  textTransform: 'none',
                  '&:hover': { background: status ? '#FF545E' : '#B07CFF' },
                  "&:disabled": {
                    backgroundColor: theme.color.button.disable,
                }
                }}
                onClick={status ? handleOnOpenModal : handleOnSubmit}
                disabled={!submit}
              >
                  {status ? 'ยกเลิก' : 'ยืนยัน'}
                </LoadingButton> 
              : <></>
              }
          </> }
        </Box>

          
      </Box>
    </CommonPreviewContainer>
  )
})

export default MeetingScheduleDetail
