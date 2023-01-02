import './styles/globals.scss'
import React, { Component } from 'react'
import { NavBar } from './components/Navbar/Navbar'
import Login from './pages/login'
import StudentHomePage from './pages/student/homepage'
import ProjectHomePreview from './components/Preview/ProjectHomePreview'
import DocumentPreview from './components/Preview/DocumentPreview'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { Box } from '@mui/material'
import MeetingSchedulePreview from './components/Preview/MeetingSchedulePreview'
import ScorePreview from './components/Preview/ScorePreview'
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
