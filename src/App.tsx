import './styles/globals.scss'
import React, { Component } from 'react'
import { NavBar } from './components/Navbar/Navbar'
import Login from './pages/login'
import StudentHomePage from './pages/student/homepage'
import ProjectPreview from './components/Preview/ProjectPreview'
import DocumentPreview from './components/Preview/DocumentPreview'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { Box } from '@mui/material'
import MeetingSchedulePreview from './components/Preview/MeetingSchedulePreview'
import ScorePreview from './components/Preview/ScorePreview'

const THEME = createTheme({
  typography: {
    fontFamily: '"Prompt", "Roboto"'
  }
})

const App = () => {
  return (
    <ThemeProvider theme={THEME}>
      {/* <NavBar/> */}
      <Box>
        {/* <StudentHomePage hasClassroom={false} hasProject={false}></StudentHomePage> */}
        <Login></Login>
        {/* <MeetingSchedulePreview isStudent={true}></MeetingSchedulePreview> */}
        {/* <ScorePreview isStudent={true}></ScorePreview> */}
      </Box>
    </ThemeProvider>
  )
}

export default App
