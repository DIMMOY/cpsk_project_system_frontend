import React from 'react'
import applicationStore from '../../stores/applicationStore'
import ClassPreview from '../../components/Preview/ClassPreview'
import ProjectHomePreview from '../../components/Preview/ProjectHomePreview'

const HomePage = () => {
    const { currentRole, isAdmin, isAdvisor } = applicationStore
    if ((currentRole == 2 && isAdmin) || (currentRole == 1 && isAdvisor)) return <ClassPreview/>
    return <ProjectHomePreview isCommittee={false}></ProjectHomePreview>
}

export default HomePage