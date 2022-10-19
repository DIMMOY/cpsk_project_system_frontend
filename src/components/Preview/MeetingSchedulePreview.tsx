import { Container, Box, IconButton, Button, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { fontFamily, fontWeight, Stack } from '@mui/system'
import React, { Component } from 'react'
import { KeyObjectType } from 'crypto'
import { padding } from '@mui/system/spacing'

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

const MeetingSchedulePreview = ({ isStudent }: PreviewProps) => {
  const classes = useStyles()
  isStudent = true

  const statusColorList = {
    ส่งแล้ว: '#43BF64',
    ส่งช้า: '#FBBC05',
    ยังไม่ส่ง: '#FF5454'
  }

  return (
    <Box className="common-preview-container" sx={{}}>
      <Box sx={{ display: 'flex', padding: '0 auto' }}>
        <IconButton
          disableRipple
          className={classes.iconSize}
          sx={{ marginRight: '1.25rem' }}
          disableFocusRipple
        >
          <ArrowBackIosNewIcon fontSize="large" />
        </IconButton>
        <Typography
          className="fs-30 fw-600 maincolor"
          sx={{ fontSize: '1.875rem', fontWeight: '600' }}
        >
          รายงานการพบอาจารย์ที่ปรึกษา
        </Typography>
      </Box>
      <Box sx={{ flexDirection: 'column', display: 'flex' }}>
        {exampleDocument.map((document) => (
          <Button
            key={document.id}
            className="ml-96 common-preview-button"
            sx={{
              position: 'relative',
              borderRadius: '20px',
              background: '#F3F3F3',
              margin: '1.25rem 0 1.25rem 0',
              display: 'flex',
              textTransform: 'none',
              color: '#AD68FF'
            }}
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
              {document.name}
            </Typography>
            <Typography
              sx={{
                top: '1.5rem',
                right: 'calc(20px + 1vw)',
                position: 'absolute',
                fontSize: 'calc(30px + 0.2vw)',
                color: '#686868',
                fontWeight: 600
              }}
            >
              {document.statusType}
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
              ภายในวันที่ {document.dueDate}
            </Typography>
          </Button>
        ))}
      </Box>
    </Box>
  )
}

export default MeetingSchedulePreview
