import React from 'react'
import applicationStore from '../../stores/applicationStore'
import MeetingSchedulePreview from '../../components/Preview/MeetingSchedulePreview'
import AdminMeetingSchedulePreview from '../../components/Admin/AdminMeetingSchedulePreview'

const MeetingSchedulePage = () => {
    const { currentRole, isAdmin, isAdvisor } = applicationStore
    if ((currentRole == 2 && isAdmin)) return <AdminMeetingSchedulePreview/>
    else if ((currentRole == 1 && isAdvisor)) return <MeetingSchedulePreview isStudent={false}/>
    return <MeetingSchedulePreview isStudent={true}/>
}

export default MeetingSchedulePage