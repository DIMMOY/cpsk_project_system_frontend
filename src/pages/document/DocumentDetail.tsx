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

const exampleDocument = [
  {
    id: 1,
    name: 'Proposal',
    dueDate: '2022-10-20 23:59',
    status: 0,
    statusType: 'ส่งแล้ว'
  },
  {
    id: 2,
    name: 'Draft 1-2',
    dueDate: '2022-10-18 23:59',
    status: 1,
    statusType: 'ยังไม่ส่ง'
  },
  {
    id: 3,
    name: 'Draft 1-2',
    dueDate: '2022-10-13 23:59',
    status: 2,
    statusType: 'ส่งช้า'
  },
  {
    id: 4,
    name: 'Draft 1-2',
    dueDate: '2022-10-13 23:59',
    status: 2,
    statusType: 'ส่งช้า'
  },
  {
    id: 5,
    name: 'Draft 1-2',
    dueDate: '2022-10-13 23:59',
    status: 2,
    statusType: 'ส่งช้า'
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
  isStudent?: boolean
  id?: string
  name?: string,
  dueDate?: string,
  status?: number,
  statusType?: string
}

const DocumentDetail = ({ isStudent }: PreviewProps) => {
  const classes = useStyles()
  isStudent = true
  const location = useLocation();
  const isBigScreen = useMediaQuery({ query: '(min-width: 600px)' })
  const statusList = [{color: '#FF5454', message: 'ยังไม่ส่ง'}, {color: '#43BF64', message: 'ส่งแล้ว'}, {color: '#FBBC05', message: 'ส่งช้า'}]
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
            className={classes.iconSize}
            sx={{ marginRight: '1.25rem' }}
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
            background: '#F3F3F3',
            margin: '1.25rem 0 0 0',
            display: 'flex',
            textTransform: 'none',
            color: '#AD68FF',
            zIndex: '1'
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
              color: '#686868',
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
              background: "#EBEBEB",
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
                    background: "#F3F3F3", 
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
                  <AddCircleIcon sx={{fontSize: "450%", color: '#686868'}}/>
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
              background: '#AD68FF',
              borderRadius: '10px',
              color: '#FFFFFF',
              boxShadow: 'none',
              textTransform: 'none',
              '&:hover': { background: '#AD50FF' },
            }}>
                ยืนยัน
            </Button>
        </Box>
      </CommonPreviewContainer>
      
  )
}

export default DocumentDetail
