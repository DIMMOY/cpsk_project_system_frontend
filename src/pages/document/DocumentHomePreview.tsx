import React, { Component, useEffect, useState } from 'react'
import { Container, Box, IconButton, Button, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { fontFamily, fontWeight, Stack } from '@mui/system'
import { KeyObjectType } from 'crypto'
import { padding } from '@mui/system/spacing'
import { Link, useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import { ListPreviewButton } from '../../styles/layout/_button'
import { listSendDocumentInClass } from '../../utils/document'
import moment from 'moment'
import { CommonPreviewContainer } from '../../styles/layout/_preview/_previewCommon'
import { theme } from '../../styles/theme'

interface PreviewProps {
  isStudent: boolean
}

const DocumentHomePreview = ({ isStudent }: PreviewProps) => {
  const [documents, setDocuments] = useState<Array<any>>([])
  const navigate = useNavigate()
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
      const result = await listSendDocumentInClass({sort: 'createdAtDESC'}, classId, projectId)
      setDocuments(result.data as Array<any>)
    }
    getData()
  }, [])

  return (
    <CommonPreviewContainer>
      <Box sx={{ display: 'flex', padding: '0 auto' }}>
        <Link to="/">
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
        <Typography
          sx={{ 
            fontSize: '1.875rem', 
            fontWeight: '600',
            color: theme.color.text.primary 
          }}
        >
          เอกสาร
        </Typography>
      </Box>
      <Box sx={{ flexDirection: 'column', display: 'flex' }}>
        {documents.map((document) => (
            <ListPreviewButton
              key={document._id}
              onClick = {() => {navigate(`/document/${document._id}`,
                {replace: true, state: {id: document._id, name: document.name, status: document.sendStatus, 
                statusType: statusList[document.sendStatus].message, dueDate: moment(document.endDate).format('DD/MM/YYYY HH:mm')}})}}
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
                {document.name}
              </Typography>
              <Typography
                sx={{
                  top: isBigScreen ? '1.5rem' : '1.95rem' ,
                  right: 'calc(20px + 1vw)',
                  position: 'absolute',
                  fontSize: isBigScreen ? 'calc(30px + 0.2vw)' : 'calc(15px + 2vw)',
                  color: statusList[document.sendStatus].color,
                  fontWeight: 600
                }}
              >
                {statusList[document.sendStatus].message}
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
                ภายในวันที่ {moment(document.endDate).format('DD/MM/YYYY HH:mm')}
              </Typography>
            </ListPreviewButton>
        ))}
      </Box>
    </CommonPreviewContainer>
  )
}

export default DocumentHomePreview
