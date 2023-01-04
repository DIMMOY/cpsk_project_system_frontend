import React from 'react'
import applicationStore from '../../stores/applicationStore'
import AdminDocumentPreview from '../../components/Admin/AdminDocumentPreview'
import DocumentPreview from '../../components/Preview/DocumentHomePreview'

const DocumentPage = () => {
    const { currentRole, isAdmin, isAdvisor } = applicationStore
    if ((currentRole == 2 && isAdmin)) return <AdminDocumentPreview/>
    else if ((currentRole == 1 && isAdvisor)) return <DocumentPreview isStudent={false}/>
    return <DocumentPreview isStudent={true}/>
}

export default DocumentPage