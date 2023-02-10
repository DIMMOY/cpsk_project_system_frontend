import React from 'react'
import applicationStore from '../../stores/applicationStore'
import AdminAssessmentPreview from '../admin/AdminAssessmentPreview'
import AssessmentPreview from './AssessmentPreview'

const AssessmentPage = () => {
    const { currentRole, isAdmin, isAdvisor } = applicationStore
    if ((currentRole == 2 && isAdmin)) return <AdminAssessmentPreview/>
    else if ((currentRole == 1 && isAdvisor)) return <AssessmentPreview isStudent={false}/>
    return <AssessmentPreview isStudent={true}/>
}

export default AssessmentPage