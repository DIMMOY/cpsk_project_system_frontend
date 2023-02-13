import './styles/globals.scss'
import React, { Component } from 'react'
import { NavBar } from './components/Navbar/Navbar'
import Login from './pages/login/login'
import StudentHomePage from './pages/student/homepage'
import ProjectHomePreview from './pages/project/ProjectHomePreview'
import DocumentHomePreview from './pages/document/DocumentHomePreview'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { Box } from '@mui/material'
import MeetingScheduleHomePreview from './pages/meetingschedule/MeetingScheduleHomePreview'
import AssessmentPreview from './pages/assessment/AssessmentPreview'
import Routers from './routes'

const THEME = createTheme({
  typography: {
    fontFamily: '"Prompt", "Roboto"'
  }
})

const App = () => {
  return (
    <ThemeProvider theme={THEME}>
      <Routers/>
    </ThemeProvider>
  )
}

export default App
