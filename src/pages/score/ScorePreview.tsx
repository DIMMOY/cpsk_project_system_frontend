import React, { Component } from 'react'
import { Container, Box, IconButton, Button, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { fontFamily, fontWeight, Stack } from '@mui/system'
import { KeyObjectType } from 'crypto'
import { padding } from '@mui/system/spacing'
import { Link } from 'react-router-dom'

const exampleScore = [
  {
    id: 1,
    name: 'ประเมินๆๆๆ',
    score: '70'
  },
  {
    id: 2,
    name: 'ประเมินๆๆๆ',
    score: '??'
  },
  {
    id: 3,
    name: 'ประเมินๆๆๆ',
    score: '??'
  },
  {
    id: 4,
    name: 'ประเมินๆๆๆ',
    score: '??'
  },
  {
    id: 5,
    name: 'ประเมินๆๆๆ',
    score: '??'
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

const ScorePreview = ({ isStudent }: PreviewProps) => {
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
        <Link to="/">
          <IconButton
            disableRipple
            className={classes.iconSize}
            sx={{ marginRight: '1.25rem' }}
            disableFocusRipple
          >
            <ArrowBackIosNewIcon fontSize="large" />
          </IconButton>
        </Link>
        <Typography
          className="fs-30 fw-600 maincolor"
          sx={{ fontSize: '1.875rem', fontWeight: '600' }}
        >
          คะแนน
        </Typography>
      </Box>
      <Box sx={{ flexDirection: 'column', display: 'flex' }}>
        {exampleScore.map((document) => (
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
                right: 'calc(20px + 1vw)',
                position: 'absolute',
                fontSize: 'calc(30px + 0.2vw)',
                color: '#686868',
                fontWeight: 600
              }}
            >
              {document.score} / 100
            </Typography>
          </Button>
        ))}
      </Box>
    </Box>
  )
}

export default ScorePreview
