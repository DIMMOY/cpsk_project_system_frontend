import React, { Component } from 'react'
import { Box, IconButton, Button, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { fontFamily, fontWeight, Stack } from '@mui/system'
import { KeyObjectType } from 'crypto'
import { padding } from '@mui/system/spacing'
import { Link, useLocation } from 'react-router-dom'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useMediaQuery } from 'react-responsive'

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

  const statusColorList = {
    ส่งแล้ว: '#43BF64',
    ส่งช้า: '#FBBC05',
    ยังไม่ส่ง: '#FF5454'
  }

  const location = useLocation();
  const isBigScreen = useMediaQuery({ query: '(min-width: 600px)' })
  const {name, dueDate, statusType} = location.state

  return (
    <Box className="common-preview-container" sx={{textAlign: "center",}}>
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
              color: '#686868',
              fontWeight: 600
            }}
          >
            {statusType}
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
              height: "23rem",
              background: "#EBEBEB",
              borderRadius: "20px",
          }}
        >
          { isStudent &&
          <>
            <IconButton sx={{
              top: "7rem", 
              display: "flex", 
              left: "3.5vw", 
              position: "absolute"
            }}
              aria-label="upload" 
              component="label">
              <input hidden accept="*" type="file" />
              <AddCircleIcon sx={{fontSize: "450%", color: '#686868'}}/>
            </IconButton>
            
            <Button sx={{
              top: "18rem",
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
              '&:hover': { background: '#AD50FF' }
            }}>
                ยืนยัน
              </Button>
          </> }
        </Box>
      </Box>
      
  )
}

export default DocumentDetail
