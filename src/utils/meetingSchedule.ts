import axios from "axios"
import { responsePattern } from "../constants/responsePattern"
import { getToken } from "./auth"

const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT}/meeting-schedule`

export const createMeetingSchedule = async (reqBody: any) => {
    try {
        await getToken()
        await axios.post(url, reqBody)
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
        await getToken()
        const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT}/project/${projectId}/meeting-schedule/${mtId}`
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
        await getToken()
        const { startDate, endDate } = reqBody
        const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT}/class/${reqBody.classId}/meeting-schedule/${reqBody.meetingScheduleId}/date`
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
        await getToken()
        const resAxios = await axios.get(url, {params: reqQuery})
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
        await getToken()
        const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT}/class/${classId}/meeting-schedule`
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
        await getToken()
        const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT}/class/${classId}/project/${projectId}/meeting-schedule`
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
        await getToken()
        const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT}/class/${classId}/project/${projectId}/meeting-schedule/${mtId}/detail`
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
        await getToken()
        const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT}/project/${projectId}/meeting-schedule/${mtId}`
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
        await getToken()
        const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT}/class/${classId}/meeting-schedule/${mtId}/date/status`
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