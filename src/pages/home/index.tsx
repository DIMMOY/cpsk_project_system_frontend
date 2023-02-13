import React from 'react'
import applicationStore from '../../stores/applicationStore'
import ClassPreview from '../class/ClassPreview'
import ProjectHomePreview from '../project/ProjectHomePreview'

const HomePage = () => {
    const { currentRole, isAdmin, isAdvisor } = applicationStore
    if ((currentRole == 2 && isAdmin) || (currentRole == 1 && isAdvisor)) return <ClassPreview/>
    return <ProjectHomePreview isStudent={true} isCommittee={false}></ProjectHomePreview>
}

export default HomePage