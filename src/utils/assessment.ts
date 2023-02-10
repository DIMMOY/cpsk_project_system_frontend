import axios from "axios"
import { responsePattern } from "../constants/responsePattern"

const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT}/assessment`

export const createAssessment = async (reqBody: any) => {
    try {
        await axios.post(url, reqBody)
        return {
            statusCode: 201,
            message: 'Create assessment successful',
        };
    } catch (error) {
        console.error(error)
        return {
            statusCode: 400,
            message: 'Create assessment error',
            errorMsg: 'สร้าง Assessment ผิดพลาด กรุณาลองใหม่ในภายหลัง',
            error
        }
    }
}

export const listAssessment = async (reqQuery: any) => {
    try {
        const resAxios = await axios.get(url, {params: reqQuery})
        return {
            data: resAxios.data.data
        }
    } catch (error) {
        console.error(error)
        return {
            statusCode: 400,
            message: 'List assessment error',
            errorMsg: 'ค้นหา Assessment ผิดพลาด กรุณาลองใหม่ในภายหลัง',
            error
        }
    }
}

export const updateAssessment = async (id: string, reqBody: any) => {
    try {
        await axios.put(`${url}/${id}`, reqBody)
        return {
            statusCode: 201,
            message: 'Create assessment successful',
        };
    } catch (error) {
        console.error(error)
        return {
            statusCode: 400,
            message: 'Create assessment error',
            errorMsg: 'สร้าง Assessment ผิดพลาด กรุณาลองใหม่ในภายหลัง',
            error
        }
    }
}