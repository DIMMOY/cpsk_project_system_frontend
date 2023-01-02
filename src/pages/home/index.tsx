import React from 'react'
import applicationStore from '../../stores/applicationStore'
import ClassPreview from '../../components/Preview/ClassPreview'
import ProjectHomePreview from '../../components/Preview/ProjectHomePreview'

const HomePage = () => {
    const { currentRole } = applicationStore
    if (currentRole == 2 || currentRole == 1) return <ClassPreview/>
    return <ProjectHomePreview isCommittee={false}></ProjectHomePreview>
}

export default HomePage