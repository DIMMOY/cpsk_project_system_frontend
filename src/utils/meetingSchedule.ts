import axios from "axios"
import { responsePattern } from "../constants/responsePattern"

const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT}/meeting-schedule`

export const createMeetingSchedule = async (reqBody: any) => {
    try {
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

export const setDateMeetingSchedule = async (reqBody: any) => {
    try {
        const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT}/class/${reqBody.classId}/meeting-schedule`
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
            errorMsg: 'สร้างรายการส่ง meeting schedule ผิดพลาด กรุณาลองใหม่ในภายหลัง',
            error
        }
    }
}

export const listMeetingSchedule = async (reqQuery: any) => {
    try {
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
        const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT}/class/${classId}/meeting-schedule`
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

export const listSendMeetingScheduleInClass = async (reqQuery: any, classId: string, projectId: string) => {
    try {
        const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT}/class/${classId}/project/${projectId}/meeting-schedule`
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