import React, { Component, SetStateAction, useState } from 'react'
import { Box, IconButton, Button, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { fontFamily, fontWeight, Stack } from '@mui/system'
import { KeyObjectType } from 'crypto'
import { padding } from '@mui/system/spacing'
import { Link, useLocation } from 'react-router-dom'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useMediaQuery } from 'react-responsive'
import { CommonPreviewContainer } from '../../styles/layout/_preview/_previewCommon'
import { theme } from '../../styles/theme'

interface PreviewProps {
  isStudent?: boolean
  id?: string
  name?: string,
  dueDate?: string,
  status?: number,
  statusType?: string
}

const DocumentDetail = ({ isStudent }: PreviewProps) => {
  isStudent = true
  const location = useLocation();
  const isBigScreen = useMediaQuery({ query: '(min-width: 600px)' })
  const { success, warning, error, secondary } = theme.color.text
  const statusList 
    = [{color: error, message: 'ยังไม่ส่ง'}, 
      {color: success, message: 'ส่งแล้ว'}, 
      {color: warning, message: 'รอยืนยัน'}, 
      {color: warning, message: 'ส่งช้า'}, 
      {color: secondary, message: "----"}]
  const {name, dueDate, status} = location.state
  const [files, setFiles] = useState<Array<any>>([])

  const handleChange = (e: any) => {
    setFiles(Array.from(e.target.files));
  }

  console.log(files)

  return (
    <CommonPreviewContainer>
      <Box sx={{ display: 'flex', padding: '0 auto' }}>
        <Link to="/document">
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
      <Box
          className="ml-96 common-preview-button"
          sx={{
            position: "relative",
            borderRadius: '20px',
            background: theme.color.button.default,
            margin: '1.25rem 0 0 0',
            display: 'flex',
            textTransform: 'none',
            zIndex: '1'
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
              background: theme.color.background.tertiary,
              borderRadius: "20px",
              padding: "7rem 2vw 2rem 2vw",
              textAlign: "center"
          }}
        >

          <Box sx={{marginBottom: "2rem", display: "flex", flexDirection: "row", flexWrap: "wrap"}}>
            {files.map((file, index) => (
                <Box key={`file-${index}`} 
                  sx={{
                    margin: "1rem 1rem 1rem 1rem", 
                    padding: "0.5rem", 
                    background: theme.color.button.default, 
                    borderRadius: "10px",
                    width: '12rem', 
                    height: '10rem'
                  }}>
                  {file.type.startsWith('image/') ? (
                    <img style={{ width: '12rem', height: '8rem', borderRadius: "10px" }} src={URL.createObjectURL(file)} alt="" />
                  ) : (
                    <a href={URL.createObjectURL(file)}>{file.name.length <= 20 ? file.name : file.name.slice(0, 19) + '...'}</a>
                  )}
                  <Typography>{file.name.length <= 20 ? file.name : file.name.slice(0, 19) + '...'}</Typography>
                </Box>
            ))}
            { isStudent ?
              <Box
                sx={{
                  margin: "1rem 1rem 1rem 1rem", 
                  padding: "0.5rem",
                  width: '12rem', 
                  height: '10rem',
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}>
                <IconButton sx={{width: '8rem', height: '8rem'}}
                  aria-label="upload" 
                  component="label">
                  <input hidden accept="*" type="file" multiple onChange={handleChange}/>
                  <AddCircleIcon sx={{fontSize: "450%", color: theme.color.background.secondary}}/>
                </IconButton> 
              </Box>
              : <></>
            }
            </Box>
            
            <Button sx={{
              width: "7rem",
              height: "2.8rem",
              fontSize: 20,
              textAlign: "center",
              justifyContent: "center",
              background: theme.color.button.primary,
              borderRadius: '10px',
              color: theme.color.text.default,
              boxShadow: 'none',
              textTransform: 'none',
              '&:hover': { background: '#B07CFF' },
            }}>
                ยืนยัน
            </Button>
        </Box>
      </CommonPreviewContainer>
      
  )
}

export default DocumentDetail
