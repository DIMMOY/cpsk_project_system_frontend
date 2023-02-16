import axios from "axios"
import { responsePattern } from "../constants/responsePattern"
import { refreshToken } from "./auth"

export const createDocument = async (reqBody: any) => {
    try {
        await refreshToken()
        await axios.post(`${process.env.REACT_APP_API_BASE_URL_CLIENT as string}/document`, reqBody)
        return {
            statusCode: 201,
            message: 'Create document successful',
        };
    } catch (error) {
        console.error(error)
        return {
            statusCode: 400,
            message: 'Create document error',
            errorMsg: 'สร้างรายการส่งเอกสารผิดพลาด กรุณาลองใหม่ในภายหลัง',
            error
        }
    }
}

export const setDateDocument = async (reqBody: any) => {
    try {
        await refreshToken()
        const { startDate, endDate } = reqBody
        const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT as string}/class/${reqBody.classId}/document/${reqBody.documentId}/date`
        await axios.put(url, { startDate, endDate })
        return {
            statusCode: 200,
            message: 'Set document due date successful',
        };
    } catch (error) {
        console.error(error)
        return {
            statusCode: 400,
            message: 'Set document due date error',
            errorMsg: 'สร้างรายการส่งเอกสารผิดพลาด กรุณาลองใหม่ในภายหลัง',
            error
        }
    }
}

export const listDocument = async (reqQuery: any) => {
    try {
        await refreshToken()
        const resAxios = await axios.get(`${process.env.REACT_APP_API_BASE_URL_CLIENT as string}/document`, {params: reqQuery})
        return {
            data: resAxios.data.data
        }
    } catch (error) {
        console.error(error)
        return {
            statusCode: 400,
            message: 'List document error',
            errorMsg: 'ค้นหารายการเอกสารผิดพลาด กรุณาลองใหม่ในภายหลัง',
            error
        }
    }
}

export const listDocumentInClass = async (reqQuery: any, classId: string) => {
    try {
        await refreshToken()
        const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT as string}/class/${classId}/document`
        const resAxios = await axios.get(url, {params: reqQuery})
        return {
            data: resAxios.data.data
        }
    } catch (error) {
        console.error(error)
        return {
            statusCode: 400,
            message: 'List document error',
            errorMsg: 'ค้นหาเอกสารผิดพลาด กรุณาลองใหม่ในภายหลัง',
            error
        }
    }
}

export const listSendDocumentInClass = async (reqQuery: any, classId: string, projectId: string) => {
    try {
        await refreshToken()
        const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT as string}/class/${classId}/project/${projectId}/document`
        const resAxios = await axios.get(url, {params: reqQuery})
        return {
            data: resAxios.data.data
        }
    } catch (error) {
        console.error(error)
        return {
            statusCode: 400,
            message: 'List document error',
            errorMsg: 'ค้นหาเอกสารผิดพลาด กรุณาลองใหม่ในภายหลัง',
            error
        }
    } 
}

export const disabeDocumentInClass = async (classId: string, documentId: string) => {
    try {
        await refreshToken()
        const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT as string}/class/${classId}/document/${documentId}/date/status`
        await axios.patch(url, {status: false})
        return {
            statusCode: 200,
            message: 'Disable document in class successful',
        };
    } catch (error) {
        console.error(error)
        return {
            statusCode: 400,
            message: 'Disable document in class error',
            errorMsg: 'ยกเลิก document ในคลาสผิดพลาด กรุณาลองใหม่ในภายหลัง',
            error
        }
    }
}

export const updateDocument = async (documentId: string, reqBody: { name: string, description: string }) => {
    try {
        await refreshToken()
        const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT as string}/document/${documentId as string}`
        await axios.put(url, reqBody)
        return {
            statusCode: 200,
            message: 'Update document successful',
        };
    } catch (error) {
        console.error(error)
        return {
            statusCode: 400,
            message: 'Update document in class error',
            errorMsg: 'แก้ไข document ผิดพลาด กรุณาลองใหม่ในภายหลัง',
            error
    
        }
    }
}