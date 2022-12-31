import React, { Component } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import applicationStore from '../../stores/applicationStore'
import ClassPreview from '../../components/Preview/ClassPreview'
import ProjectPreview from '../../components/Preview/ProjectPreview'

const HomePage = () => {
    const { currentRole } = applicationStore
    if (currentRole == 2 || currentRole == 1) return <ClassPreview/>
    return <ProjectPreview isCommittee={false}></ProjectPreview>
}

export default HomePage