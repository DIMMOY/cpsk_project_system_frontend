import React from 'react'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import PublicRoute from './PublicRoute'
import PrivateRoute from './PrivateRoute'

import { NavBar } from "../components/Navbar/Navbar"
import Login from '../pages/login'
import ProjectPreview from '../components/Preview/ProjectPreview'
import DocumentPreview from '../components/Preview/DocumentPreview'
import MeetingSchedulePreview from '../components/Preview/MeetingSchedulePreview'
import ScorePreview from '../components/Preview/ScorePreview'


const Routers: React.FC = (): JSX.Element => {
    return (
        <Router>
            <NavBar/>
            <Routes>
                <Route element={<PublicRoute/>}>
                    <Route path = '/signin' element={<Login/>}/>
                </Route>

                <Route element={<PrivateRoute/>}>
                    <Route path = '/' element={<ProjectPreview isCommittee={false}/>}/>
                    <Route path = '/home' element={<ProjectPreview isCommittee={false}/>}/>
                    <Route path = '/document' element={<DocumentPreview isStudent={true}/>}/>
                    <Route path = '/meetingschedule' element={<MeetingSchedulePreview isStudent={true}/>}/>
                    <Route path = '/score' element={<ScorePreview isStudent={true}/>}/>
                </Route>
                    
                { /* ========== ชั่วคราว ========== */ }
                {/* <PrivateRoute exact restricted={false} path={["/", "/home"]} component={ProjectPreview}/> */}
                {/* <PrivateRoute restricted={false} path="/document" component={DocumentPreview}/> */}
                {/* <PrivateRoute restricted={false} path="/meetingschedule" component={MeetingSchedulePreview}/> */}
                {/* <PrivateRoute restricted={false} path="/score" component={ScorePreview}/> */}
                { /* ============================ */ }

            </Routes>
            
        </Router>
    )
}

export default Routers