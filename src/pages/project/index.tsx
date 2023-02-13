import React from 'react'
import applicationStore from '../../stores/applicationStore'
import AdminProjectPreview from '../admin/AdminProjectPreview'
import ProjectPreview from './ProjectPreview'
import ProjectHomePreview from './ProjectHomePreview'

const ProjectPage = () => {
    const { currentRole, isAdmin, isAdvisor } = applicationStore
    if ((currentRole == 2 && isAdmin)) return <AdminProjectPreview/>
    else if ((currentRole == 1 && isAdvisor)) return <ProjectPreview/>
    return <ProjectHomePreview isStudent={true} isCommittee={false}/>
}

export default ProjectPage