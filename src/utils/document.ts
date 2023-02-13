import axios from "axios"
import { responsePattern } from "../constants/responsePattern"
import { getToken } from "./auth"

const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT}/document`

export const createDocument = async (reqBody: any) => {
    try {
        await getToken()
        await axios.post(url, reqBody)
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
        await getToken()
        const { startDate, endDate } = reqBody
        const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT}/class/${reqBody.classId}/document/${reqBody.documentId}/date`
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
        await getToken()
        const resAxios = await axios.get(url, {params: reqQuery})
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
        await getToken()
        const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT}/class/${classId}/document`
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
        await getToken()
        const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT}/class/${classId}/project/${projectId}/document`
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
        await getToken()
        const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT}/class/${classId}/document/${documentId}/date/status`
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