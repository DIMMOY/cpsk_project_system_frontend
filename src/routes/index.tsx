import React from 'react'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import PublicRoute from './PublicRoute'
import PrivateRoute from './PrivateRoute'

import { NavBar } from "../components/Navbar/Navbar"
import Login from '../pages/login'
import ProjectHomePreview from '../components/Preview/ProjectHomePreview'
import DocumentHomePreview from '../components/Preview/DocumentHomePreview'
import MeetingScheduleHomePreview from '../components/Preview/MeetingScheduleHomePreview'
import ScorePreview from '../components/Preview/ScorePreview'
import ClassPreview from '../components/Preview/ClassPreview'
import AdminProjectPreview from '../components/Admin/AdminProjectPreview'
import DocumentDetail from '../components/Detail/DocumentDetail'
import MeetingScheduleDetail from '../components/Detail/MeetingScheduleDetail'
import applicationStore from '../stores/applicationStore'
import HomePage from '../pages/home'
import ProjectPreview from '../components/Preview/ProjectPreview'
import DocumentPage from '../pages/document'
import MeetingSchedulePage from '../pages/meetingschedule'
import DocumentPreview from '../components/Preview/DocumentPreview'
import MeetingSchedulePreview from '../components/Preview/MeetingSchedulePreview'


const Routers: React.FC = (): JSX.Element => {

    return (
        <Router>
            <NavBar/>
            <Routes>
                <Route element={<PublicRoute/>}>
                    <Route path = '/signin' element={<Login/>}/>
                </Route>

                <Route element={<PrivateRoute/>}>
                    <Route path = '/' element={<HomePage/>}/>
                    <Route path = '/class' element={<ClassPreview/>}/>
                    <Route path = '/class/:id/project' element={<ProjectPreview/>}/>
                    <Route path = '/class/:id/document' element={<DocumentPreview/>}/>
                    <Route path = '/class/:id/meeting-schedule' element={<MeetingSchedulePreview/>}/>
                    <Route path = '/class/:id/score' element={<ProjectPreview/>}/>
                    <Route path = '/class/:id/committee' element={<ProjectPreview/>}/>
                    <Route path = '/project' element={<ProjectPreview/>}/>
                    <Route path = '/document' element={<DocumentPage/>}/>
                    <Route path = '/document/:id' element={<DocumentDetail/>}/>
                    <Route path = '/meeting-schedule' element={<MeetingSchedulePage/>}/>
                    <Route path = '/meeting-schedule/:id' element={<MeetingScheduleDetail isStudent={true}/>}/>
                    <Route path = '/score' element={<ScorePreview isStudent={true}/>}/>
                </Route>

            </Routes>
            
        </Router>
    )
}

export default Routers