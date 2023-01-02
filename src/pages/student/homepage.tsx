import React, { Component } from 'react'
import { Box, Container } from '@mui/material'
import ProjectHomePreview from '../../components/Preview/ProjectHomePreview'

export default function StudentHomePage (props: {
  hasClassroom: boolean
  hasProject: boolean
}) {
  const { hasClassroom, hasProject } = props

  return (
    <Box>
      {hasClassroom
        ? (
        <h1 style={{ top: '0px' }}>ทดสอบ</h1>
          )
        : hasProject
          ? (
        <h1 style={{ top: '20vh', display: 'flex', position: 'fixed' }}>
          ทดสอบ
        </h1>
            )
          : (
        <ProjectHomePreview isCommittee={false}></ProjectHomePreview>
            )}
    </Box>
  )
}
