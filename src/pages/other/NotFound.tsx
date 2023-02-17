import React, { useEffect, useState } from 'react'
import { CommonPreviewContainer } from "../../styles/layout/_preview/_previewCommon"
import { Box, Typography } from '@mui/material'
import { theme } from '../../styles/theme'


const NotFound = () => {
  return (
    <CommonPreviewContainer>
      <Box sx={{display: 'flex', width: '100%', justifyContent: 'center', height: '35rem', textAlign: 'center', flexDirection: 'column', alignItems: 'center'}}>
        <Typography
            sx={{ fontSize: 100, fontWeight: 500, color: theme.color.text.primary }}
          >
          {"404 :("}
        </Typography> 
        <Typography
            sx={{ fontSize: 40, fontWeight: 500, color: theme.color.text.secondary }}
          >
          The requested URL was not found on this server.
        </Typography>
      </Box>
    </CommonPreviewContainer>
  )
}

export default NotFound