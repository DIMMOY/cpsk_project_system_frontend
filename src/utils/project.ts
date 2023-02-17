import axios from "axios"
import { refreshToken } from "./auth"

export const listProjectInClass = async (reqQuery: any, classId: string) => {
    try {
        await refreshToken()
        const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT as string}/class/${classId}/project`
        const resAxios = await axios.get(url, {params: reqQuery})
        return {
            statusCode: resAxios.data.statusCode,
            message: resAxios.data.message,
            data: resAxios.data.data
        }
    } catch (error) {
        console.error(error)
        return {
            statusCode: 400,
            message: 'List project error',
            errorMsg: 'ค้นหา Project ผิดพลาด กรุณาลองใหม่ในภายหลัง',
            error
        }
    }
}

export const findProjectInClassForStudent = async (classId: string) => {
    try {
        await refreshToken()
        const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT as string}/class/${classId}/student/project`
        const resAxios = await axios.get(url)
        return {
            statusCode: resAxios.data.statusCode,
            message: resAxios.data.message,
            data: resAxios.data.data
        }
    } catch (error) {
        console.error(error)
        return {
            statusCode: 400,
            message: 'Find project error',
            errorMsg: 'ค้นหา Project ผิดพลาด กรุณาลองใหม่ในภายหลัง',
            error
        }
    }
}

export const findProjectInClass = async (classId: string, projectId: string) => {
    try {
        await refreshToken()
        const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT as string}/class/${classId}/project/${projectId}`
        const resAxios = await axios.get(url)
        return {
            statusCode: resAxios.data.statusCode,
            message: resAxios.data.message,
            data: resAxios.data.data
        }
    } catch (error) {
        console.error(error)
        return {
            statusCode: 400,
            message: 'Find project error',
            errorMsg: 'ค้นหา Project ผิดพลาด กรุณาลองใหม่ในภายหลัง',
            error
        }
    }
}

export const checkRoleInProject = async (classId: string, projectId: string) => {
    try {
        await refreshToken()
        const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT as string}/class/${classId}/project/${projectId}/role`
        const resAxios = await axios.get(url)
        return {
            statusCode: resAxios.data.statusCode,
            message: resAxios.data.message,
            data: resAxios.data.data
        }
    } catch (error) {
        console.error(error)
        return {
            statusCode: 400,
            message: 'Find role error',
            errorMsg: 'ค้นหา role ผิดพลาด กรุณาลองใหม่ในภายหลัง',
            error
        }
    }
}