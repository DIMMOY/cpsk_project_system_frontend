import { listAll, ref, uploadBytesResumable, getMetadata, StorageReference } from "firebase/storage"
import { firebaseStorage } from "../config/firebase"
import { v4 } from "uuid"


export const uploadDocumentFromStudent = async (file: File, projectId: string, documentId: string) => {
    try {
        const pathName = `projectDocument/${projectId}/${documentId}/${file.name}`
        const fileRef = ref(firebaseStorage, pathName)
        const metadata = { contentType: file.type }
        const uploadTask = await uploadBytesResumable(fileRef, file, metadata)
        if (uploadTask.state === 'success') return uploadTask.metadata.fullPath
        else return null
    } catch (error) {
        return null
    }
}

export const getDocumentFromStorage = async (projectId: string, documentId: string) => {
    try {
        const pathName = `projectDocument/${projectId}/${documentId}/`
        console.log(pathName)
        const fileRef = ref(firebaseStorage, pathName)
        const files = await listAll(fileRef) as any
        const newFiles: any[] = []
        return files.items
    } catch (error) {
        return []
    }
}