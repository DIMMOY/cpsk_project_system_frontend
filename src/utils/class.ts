import axios from "axios"
import { responsePattern } from "../constants/responsePattern"

const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT}/class`

export const createClass = async (reqBody: any) => {
    try {
        await axios.post(url, reqBody)
        return {
            statusCode: 201,
            message: 'Create class successful',
        };
    } catch (error) {
        console.error(error)
        return {
            statusCode: 400,
            message: 'Create class error',
            errorMsg: 'สร้าง Class ผิดพลาด กรุณาลองใหม่ในภายหลัง',
            error
        }
    }
}

export const listClass = async (reqQuery: any) => {
    try {
        const resAxios = await axios.get(url, {params: reqQuery})
        return {
            data: resAxios.data.data
        }
    } catch (error) {
        console.error(error)
        return {
            statusCode: 400,
            message: 'List class error',
            errorMsg: 'ค้นหา Class ผิดพลาด กรุณาลองใหม่ในภายหลัง',
            error
        }
    }
}