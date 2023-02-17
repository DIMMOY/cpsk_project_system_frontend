import axios from "axios"
import { responsePattern } from "../constants/responsePattern"
import { refreshToken } from "./auth"

export const createMeetingSchedule = async (reqBody: any) => {
    try {
        await refreshToken()
        await axios.post(`${process.env.REACT_APP_API_BASE_URL_CLIENT as string}/meeting-schedule`, reqBody)
        return {
            statusCode: 201,
            message: 'Create meeting schedule successful',
        };
    } catch (error) {
        console.error(error)
        return {
            statusCode: 400,
            message: 'Create meeting schedule error',
            errorMsg: 'สร้าง meeting schedule ผิดพลาด กรุณาลองใหม่ในภายหลัง',
            error
        }
    }
}

export const sendMeetingSchedule = async (reqBody: any, projectId: string, mtId: string) => {
    try {
        await refreshToken()
        const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT as string}/project/${projectId}/meeting-schedule/${mtId}`
        await axios.post(url, reqBody)
        return {
            statusCode: 200,
            message: 'Create send meeting schedule successful',
        };

    } catch (error) {
        console.error(error)
        return {
            statusCode: 400,
            message: 'Create send meeting schedule error',
            errorMsg: 'สร้างรายการส่ง meeting schedule ผิดพลาด กรุณาลองใหม่ในภายหลัง',
            error
        }
    }
}

export const setDateMeetingSchedule = async (reqBody: any) => {
    try {
        await refreshToken()
        const { startDate, endDate } = reqBody
        const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT as string}/class/${reqBody.classId  as string}/meeting-schedule/${reqBody.meetingScheduleId as string}/date`
        await axios.put(url, { startDate, endDate })
        return {
            statusCode: 200,
            message: 'Set meeting schedule due date successful',
        };
    } catch (error) {
        console.error(error)
        return {
            statusCode: 400,
            message: 'Set meeting schedule due date error',
            errorMsg: 'สร้างรายการส่ง meeting schedule ผิดพลาด กรุณาลองใหม่ในภายหลัง',
            error
        }
    }
}

export const listMeetingSchedule = async (reqQuery: any) => {
    try {
        await refreshToken()
        const resAxios = await axios.get(`${process.env.REACT_APP_API_BASE_URL_CLIENT as string}/meeting-schedule`, {params: reqQuery})
        return {
            data: resAxios.data.data
        }
    } catch (error) {
        console.error(error)
        return {
            statusCode: 400,
            message: 'List meeting schedule error',
            errorMsg: 'ค้นหา meeting schedule ผิดพลาด กรุณาลองใหม่ในภายหลัง',
            error
        }
    }
}

export const listMeetingScheduleInClass = async (reqQuery: any, classId: string) => {
    try {
        await refreshToken()
        const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT as string}/class/${classId}/meeting-schedule`
        const resAxios = await axios.get(url, {params: reqQuery})
        return {
            data: resAxios.data.data
        }
    } catch (error) {
        console.error(error)
        return {
            statusCode: 400,
            message: 'List meeting schedule in class error',
            errorMsg: 'ค้นหา meeting schedule ในคลาสผิดพลาด กรุณาลองใหม่ในภายหลัง',
            error
        }
    }
}

export const listSendMeetingScheduleInClass = async (reqQuery: any, classId: string, projectId: string) => {
    try {
        console.log("OLD: " + axios.defaults.headers.common['Authorization'])
        await refreshToken()
        console.log("NEW: " + axios.defaults.headers.common['Authorization'])
        const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT as string}/class/${classId}/project/${projectId}/meeting-schedule`
        const resAxios = await axios.get(url, {params: reqQuery})
        return {
            data: resAxios.data.data
        }
    } catch (error) {
        console.error(error)
        return {
            statusCode: 400,
            message: 'List send meeting schedule error',
            errorMsg: 'ค้นหา send meeting schedule ผิดพลาด กรุณาลองใหม่ในภายหลัง',
            error
        }
    } 
}

export const getSendMeetingScheduleInClass = async (classId: string, projectId: string, mtId: string) => {
    try {
        await refreshToken()
        const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT as string}/class/${classId}/project/${projectId}/meeting-schedule/${mtId}/detail`
        const resAxios = await axios.get(url)
        return {
            data: resAxios.data.data
        }
    } catch (error) {
        console.error(error)
        return {
            statusCode: 400,
            message: 'Find send meeting schedule error',
            errorMsg: 'ค้นหา send meeting schedule ผิดพลาด กรุณาลองใหม่ในภายหลัง',
            error
        }
    } 
}

export const cancelSendMeetingSchedule = async (projectId: string, mtId: string) => {
    try {
        await refreshToken()
        const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT as string}/project/${projectId}/meeting-schedule/${mtId}`
        await axios.delete(url)
        return {
            statusCode: 200,
            message: 'Delete send meeting schedule successful',
        };

    } catch (error) {
        console.error(error)
        return {
            statusCode: 400,
            message: 'Delete send meeting schedule error',
            errorMsg: 'ลบรายการส่ง meeting schedule ผิดพลาด กรุณาลองใหม่ในภายหลัง',
            error
        }
    }
}

export const disabeMeetingScheduleInClass = async (classId: string, mtId: string) => {
    try {
        await refreshToken()
        const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT as string}/class/${classId}/meeting-schedule/${mtId}/date/status`
        await axios.patch(url, {status: false})
        return {
            statusCode: 200,
            message: 'Disable meeting schedule in class successful',
        };
    } catch (error) {
        console.error(error)
        return {
            statusCode: 400,
            message: 'Disable meeting schedule in class error',
            errorMsg: 'ยกเลิก meeting schedule ในคลาสผิดพลาด กรุณาลองใหม่ในภายหลัง',
            error
        }
    }
}

export const updateMeetingSchedule = async (mtId: string, reqBody: { name: string }) => {
    try {
        await refreshToken()
        const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT as string}/meeting-schedule/${mtId as string}`
        await axios.put(url, reqBody)
        return {
            statusCode: 200,
            message: 'Update meeting schedule successful',
        };
    } catch (error) {
        console.error(error)
        return {
            statusCode: 400,
            message: 'Update meeting schedule in class error',
            errorMsg: 'แก้ไข meeting schedule ผิดพลาด กรุณาลองใหม่ในภายหลัง',
            error
    
        }
    }
}