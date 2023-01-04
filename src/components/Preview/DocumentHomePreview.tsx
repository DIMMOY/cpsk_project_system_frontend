import React, { Component } from 'react'
import { Container, Box, IconButton, Button, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { fontFamily, fontWeight, Stack } from '@mui/system'
import { KeyObjectType } from 'crypto'
import { padding } from '@mui/system/spacing'
import { Link, useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import { ListPreviewButton } from '../../styles/layout/_button'

const exampleDocument = [
  {
    id: 1,
    name: 'Proposal',
    dueDate: '2022-10-20 23:59',
    status: 0,
    // statusType: 'ยังไม่ส่ง'
  },
  {
    id: 2,
    name: 'Draft 1-2',
    dueDate: '2022-10-18 23:59',
    status: 1,
    // statusType: 'ส่งแล้ว'
  },
  {
    id: 3,
    name: 'Draft 1-2',
    dueDate: '2022-10-13 23:59',
    status: 2,
    // statusType: 'ส่งช้า'
  },
  {
    id: 4,
    name: 'Draft 1-2',
    dueDate: '2022-10-13 23:59',
    status: 2,
    // statusType: 'ส่งช้า'
  },
  {
    id: 5,
    name: 'Draft 1-2',
    dueDate: '2022-10-13 23:59',
    status: 2,
    // statusType: 'ส่งช้า'
  }
]

interface PreviewProps {
  isStudent: boolean
}

const DocumentHomePreview = ({ isStudent }: PreviewProps) => {
  const navigate = useNavigate()
  const isBigScreen = useMediaQuery({ query: '(min-width: 600px)' })
  const statusList = [{color: '#FF5454', message: 'ยังไม่ส่ง'}, {color: '#43BF64', message: 'ส่งแล้ว'}, {color: '#FBBC05', message: 'ส่งช้า'}]
  isStudent = true

  return (
    <Box className="common-preview-container" sx={{}}>
      <Box sx={{ display: 'flex', padding: '0 auto' }}>
        <Link to="/">
          <IconButton
            disableRipple
            sx={{ 
              marginRight: '1.25rem',
              '& svg': {
                color: '#AD68FF'
              } 
            }}
            disableFocusRipple
          >
            <ArrowBackIosNewIcon fontSize="large" />
          </IconButton>
        </Link>
        <Typography
          className="fs-30 fw-600 maincolor"
          sx={{ fontSize: '1.875rem', fontWeight: '600' }}
        >
          เอกสาร
        </Typography>
      </Box>
      <Box sx={{ flexDirection: 'column', display: 'flex' }}>
        {exampleDocument.map((document) => (
            <ListPreviewButton
              key={document.id}
              onClick = {() => {navigate(`/document/${document.id}`,
                {replace: true, state: {id: document.id, name: document.name, status: document.status, 
                statusType: statusList[document.status].message, dueDate: document.dueDate}})}}
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
                  top: isBigScreen ? '1.5rem' : '1.95rem' ,
                  right: 'calc(20px + 1vw)',
                  position: 'absolute',
                  fontSize: isBigScreen ? 'calc(30px + 0.2vw)' : 'calc(15px + 2vw)',
                  color: statusList[document.status].color,
                  fontWeight: 600
                }}
              >
                {statusList[document.status].message}
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
            </ListPreviewButton>
        ))}
      </Box>
    </Box>
  )
}

export default DocumentHomePreview
