import React from 'react'
import applicationStore from '../../stores/applicationStore'
import MeetingScheduleHomePreview from './MeetingScheduleHomePreview'
import AdminMeetingSchedulePreview from '../admin/AdminMeetingSchedulePreview'

const MeetingSchedulePage = () => {
    const { currentRole, isAdmin, isAdvisor } = applicationStore
    if ((currentRole == 2 && isAdmin)) return <AdminMeetingSchedulePreview/>
    else if ((currentRole == 1 && isAdvisor)) return <MeetingScheduleHomePreview isStudent={false}/>
    return <MeetingScheduleHomePreview isStudent={true}/>
}

export default MeetingSchedulePage